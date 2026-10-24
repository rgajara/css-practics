"""CSS Quest — pruebas automatizadas de extremo a extremo.

Requisitos: Python 3 y Playwright (pip install playwright && playwright install chromium)
Uso:        python3 tests/run_tests.py
Variable opcional CHROME con la ruta a un Chromium ya instalado.

Sirve el proyecto desde su carpeta padre (como en GitHub Pages: /<repo>/)
y comprueba datos de los niveles, validación, progresión, guardado,
seguridad del editor, modo sin conexión y diseño en iPhone 15."""
import os, sys, json, traceback
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from levels_check import serve, ROOT, CHROME
from playwright.sync_api import sync_playwright

RESULTS = []

def test(name):
    def deco(fn):
        def run(*a):
            try:
                fn(*a)
                RESULTS.append((True, name, ''))
                print(f'  ✓ {name}')
            except Exception as e:
                RESULTS.append((False, name, str(e)))
                print(f'  ✗ {name}: {e}')
                if os.environ.get('VERBOSE'): traceback.print_exc()
        return run
    return deco

def launch(p):
    kw = {}
    if os.path.exists(CHROME): kw['executable_path'] = CHROME
    return p.chromium.launch(**kw)

def fresh(browser, url, **ctx):
    c = browser.new_context(**ctx)
    pg = c.new_page()
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(url)
    pg.wait_for_function('window.CQ && CQ.test')
    pg.errs = errs
    return c, pg

@test('Hay exactamente 200 niveles, 20 por mundo, con todos sus datos')
def t_data(pg):
    r = pg.evaluate('''() => {
      const req = ['title','brief','html','css','cmds','hint','help','solution','why','check'];
      const bad = [];
      CQ.LEVELS.forEach((L,i) => {
        req.forEach(k => { if (L[k] === undefined || L[k] === null || (typeof L[k]==='string' && k!=='css' && !L[k].trim())) bad.push(`${i+1}: falta ${k}`); });
        if (!Array.isArray(L.cmds) || !L.cmds.length) bad.push(`${i+1}: sin comandos`);
        (L.cmds||[]).forEach(c => { const [n,own] = Array.isArray(c)?c:[c,null]; if (!own && !CQ.CMD[n]) bad.push(`${i+1}: comando sin explicación ${n}`); });
        if (typeof L.check !== 'function') bad.push(`${i+1}: sin validación`);
      });
      const perWorld = [1,2,3,4,5,6,7,8,9,10].map(w => CQ.LEVELS.filter(L => L.world===w).length);
      const titles = new Set(CQ.LEVELS.map(L=>L.title)), sols = new Set(CQ.LEVELS.map(L=>L.solution.replace(/\\s+/g,' ')));
      return {n: CQ.LEVELS.length, perWorld, bad, uniqueTitles: titles.size, uniqueSolutions: sols.size, worlds: CQ.WORLDS.length};
    }''')
    assert r['n'] == 200, f"hay {r['n']} niveles"
    assert r['worlds'] == 10 and all(x == 20 for x in r['perWorld']), r['perWorld']
    assert not r['bad'], r['bad'][:5]
    assert r['uniqueTitles'] == 200, f"títulos únicos: {r['uniqueTitles']}"
    assert r['uniqueSolutions'] == 200, f"soluciones únicas: {r['uniqueSolutions']}"

@test('Cada solución supera su nivel y el código inicial no')
def t_levels(pg):
    r = pg.evaluate('''() => CQ.LEVELS.map((L,i) => {
      const a = CQ.test.validate(i, L.solution), b = CQ.test.validate(i, L.css);
      return {n:i+1, ok: a.pass && !b.pass, fail: a.pass ? null : a.syntax.concat(a.goals.filter(g=>!g.ok))};
    }).filter(x => !x.ok)''')
    assert not r, r[:3]

@test('Las comprobaciones explican qué falta (sin mensajes genéricos)')
def t_messages(pg):
    r = pg.evaluate('''() => CQ.LEVELS.map((L,i)=>{const v=CQ.test.validate(i,L.css); return v.syntax.concat(v.goals.filter(g=>!g.ok)).map(g=>g.label||g.msg);}).flat()''')
    assert all(m and len(m) > 10 and 'incorrecto' not in m.lower() for m in r)

@test('Se aceptan soluciones alternativas (validación por resultado)')
def t_alternatives(pg):
    alts = {
        25: '.pale { margin-left: auto; margin-right: auto; }',           # centrado con márgenes separados
        23: '.b { margin-top: 30px; }',                                 # margen en la otra caja
        87: '.puerto { display: grid; place-items: center; }',          # centrar con grid en lugar de flex
        62: '.taxi { position: relative; bottom: 30px; }',              # bottom en vez de top negativo
        121: '.izq { flex: 3; } .der { flex: 7; }',                     # proporciones con flex
    }
    bad = []
    for n, css in alts.items():
        if not pg.evaluate('([i,c]) => CQ.test.validate(i,c).pass', [n - 1, css]): bad.append(n)
    assert not bad, f'alternativas rechazadas en niveles {bad}'

@test('Escribir la propiedad no basta: se comprueba el resultado visual')
def t_visual_not_text(pg):
    # Nivel 87: centrar. Escribir justify-content: center sin align-items no centra en vertical
    assert not pg.evaluate('''() => CQ.test.validate(86, '.puerto { display: flex; justify-content: center; }').pass''')
    # Nivel 2: comentario con la respuesta no cuenta
    assert not pg.evaluate('''() => CQ.test.validate(1, '.cartel { /* color: white; */ }').pass''')

@test('El CSS con errores se informa por línea y no rompe el juego')
def t_syntax(pg):
    r = pg.evaluate('''() => CQ.test.validate(0, '.boton {\\n  background-colr: gold;\\n  color red;\\n')''')
    assert not r['pass'] and len(r['syntax']) >= 2, r
    assert any(s['line'] == 2 for s in r['syntax'])
    assert pg.evaluate('() => CQ.test.validate(0, "{{{{ ;;; }}}} @@@").pass') is False
    assert pg.evaluate('() => CQ.test.validate(0, CQ.LEVELS[0].solution).pass') is True

@test('El CSS del jugador no puede ejecutar JavaScript ni cargar recursos externos')
def t_security(pg):
    sb = pg.evaluate('''() => ['play','goalview','probe-mine','probe-goal'].map(id => document.getElementById(id).getAttribute('sandbox'))''')
    assert all(s == 'allow-same-origin' for s in sb), sb
    evil = '.boton{background:gold}</style><script>parent.HACKED=1</script><img src=x onerror="parent.HACKED=2"><style>'
    pg.evaluate('(c) => { CQ.test.validate(0, c); CQ.Engine.setCss(document.getElementById("play"), c); }', evil)
    pg.wait_for_timeout(300)
    assert pg.evaluate('window.HACKED') is None
    r = pg.evaluate('''() => CQ.test.validate(0, '@import url("https://ejemplo.com/x.css");\\n.boton { background: url(https://ejemplo.com/a.png); }')''')
    assert not r['pass'] and len(r['syntax']) >= 2, r
    clean = pg.evaluate('''() => CQ.Engine.sanitize('@import url(x.css); .a{background:url(http://x/y.png)}')''')
    assert '@import' not in clean and 'http' not in clean, clean
    # La app principal no se ve afectada por el CSS del jugador
    pg.evaluate('''() => CQ.Engine.setCss(document.getElementById('play'), 'body,html,*{display:none!important}')''')
    assert pg.is_visible('#btn-check')
    pg.evaluate('''() => CQ.Engine.setCss(document.getElementById('play'), '')''')

@test('Progresión: los niveles se desbloquean solo al superar el anterior')
def t_progress(browser, url):
    c, pg = fresh(browser, url)
    assert pg.evaluate('CQ.test.current()') == 0
    assert pg.evaluate('CQ.test.open(1)') is False, 'el nivel 2 no debería abrirse'
    assert pg.evaluate('CQ.test.open(150)') is False
    assert pg.is_hidden('#btn-next-top'), 'el botón siguiente no debe verse al empezar'
    # respuesta incorrecta
    pg.fill('#editor-ta', '.boton {\n  background-color: red;\n}')
    pg.click('#btn-check')
    assert pg.is_visible('#feedback.no'), 'debe mostrarse que falta un objetivo'
    assert pg.is_hidden('#btn-next-top') and not pg.query_selector('#btn-next')
    assert pg.evaluate('CQ.test.open(1)') is False
    assert 'background-color: red' in pg.input_value('#editor-ta'), 'el código debe conservarse'
    # respuesta correcta
    pg.fill('#editor-ta', '.boton {\n  background-color: gold;\n}')
    pg.click('#btn-check')
    assert pg.is_visible('#feedback.ok') and pg.is_visible('#btn-next') and pg.is_visible('#btn-next-top')
    pg.click('#btn-next')
    assert pg.evaluate('CQ.test.current()') == 1
    assert pg.is_hidden('#btn-next-top')
    # mapa: el nivel 3 está bloqueado, el 1 superado
    pg.click('#btn-map')
    assert pg.get_attribute('.map-lvl[data-i="2"]', 'disabled') is not None
    assert 'done' in pg.get_attribute('.map-lvl[data-i="0"]', 'class')
    pg.click('.map-lvl[data-i="0"]')
    assert pg.evaluate('CQ.test.current()') == 0, 'se puede volver a niveles superados'
    assert not pg.errs, pg.errs
    c.close()

@test('Guardado: progreso, nivel actual y código sobreviven al recargar')
def t_save(browser, url):
    c, pg = fresh(browser, url)
    pg.fill('#editor-ta', '.boton {\n  background-color: gold;\n}')
    pg.click('#btn-check')
    pg.click('#btn-next')
    pg.fill('#editor-ta', '.cartel {\n  color: whi\n}')
    pg.wait_for_timeout(600)
    pg.goto(url.split('#')[0])
    pg.wait_for_function('window.CQ && CQ.test')
    st = pg.evaluate('CQ.test.state()')
    assert st['completed'].get('1') is True, st['completed']
    assert pg.evaluate('CQ.test.current()') == 1, 'debe continuar en el nivel 2'
    assert 'color: whi' in pg.input_value('#editor-ta'), 'el código escrito debe conservarse'
    assert st['unlockedWorlds'] == [1]
    assert st['stats']['checks'] >= 1 and st['stats']['wins'] == 1
    # reiniciar nivel
    pg.click('#btn-reset'); pg.click('#modal [data-x=ok]')
    assert pg.input_value('#editor-ta') == pg.evaluate('CQ.LEVELS[1].css')
    # borrar todo con confirmación
    pg.click('#btn-menu'); pg.click('#modal [data-x=all]')
    assert pg.is_visible('#modal [data-x=ok]'), 'debe pedir confirmación'
    pg.click('#modal [data-x=ok]')
    assert pg.evaluate('Object.keys(CQ.test.state().completed).length') == 0
    assert pg.evaluate('CQ.test.current()') == 0
    c.close()

@test('Ayudas: pista, concepto y solución se desbloquean en orden')
def t_help(browser, url):
    c, pg = fresh(browser, url)
    assert pg.is_disabled('#btn-help') and pg.is_disabled('#btn-sol')
    pg.click('#btn-hint'); assert pg.is_enabled('#btn-help')
    pg.click('#btn-help'); assert pg.is_enabled('#btn-sol')
    pg.click('#btn-sol'); pg.click('#modal [data-x=ok]')
    assert pg.is_visible('.help-card.sol')
    pg.click('#btn-use-sol'); pg.click('#btn-check')
    assert pg.is_visible('#feedback.ok')
    c.close()

@test('Comandos: tocar uno lo escribe en el editor')
def t_cmds(browser, url):
    c, pg = fresh(browser, url)
    pg.click('#editor-ta'); pg.keyboard.press('Control+End')
    pg.click('.cmd >> nth=0')
    assert 'background-color:' in pg.input_value('#editor-ta')
    c.close()

@test('Sin conexión: tras la primera carga, el juego abre sin red')
def t_offline(browser, url):
    c, pg = fresh(browser, url)
    pg.wait_for_function('navigator.serviceWorker && navigator.serviceWorker.controller', timeout=15000)
    cached = pg.evaluate('''async () => { const keys = await caches.keys(); const c = await caches.open(keys[0]); return (await c.keys()).length; }''')
    assert cached >= 20, f'archivos en caché: {cached}'
    c.set_offline(True)
    pg.reload()
    pg.wait_for_function('window.CQ && CQ.test', timeout=10000)
    assert pg.evaluate('CQ.test.total') == 200
    assert pg.evaluate('CQ.test.validate(0, CQ.LEVELS[0].solution).pass')
    c.close()

@test('Rutas relativas: funciona bajo /<repositorio>/ como en GitHub Pages')
def t_paths(browser, url):
    assert '/' + os.path.basename(ROOT) + '/' in url
    c, pg = fresh(browser, url)
    bad = []
    pg.on('response', lambda r: bad.append(r.url) if r.status >= 400 else None)
    pg.reload(); pg.wait_for_function('window.CQ && CQ.test'); pg.wait_for_timeout(300)
    assert not bad, bad
    html = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
    assert 'href="/' not in html and 'src="/' not in html, 'hay rutas absolutas'
    c.close()

@test('iPhone 15: sin desplazamiento horizontal, controles táctiles y editor de 16px')
def t_iphone(browser, url):
    for vp in [{'width': 393, 'height': 852}, {'width': 852, 'height': 393}]:
        c = browser.new_context(viewport=vp, device_scale_factor=3, is_mobile=True, has_touch=True,
                                user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1')
        pg = c.new_page(); pg.goto(url); pg.wait_for_function('window.CQ && CQ.test')
        pg.evaluate('''() => { const s = CQ.test.state(); for (let i=1;i<200;i++) s.completed[i]=true; localStorage.setItem('cssquest:v1', JSON.stringify(s)); }''')
        for n in [1, 61, 100, 137, 200]:
            pg.goto(url.split('#')[0] + f'#nivel-{n}'); pg.reload(); pg.wait_for_function('window.CQ && CQ.test')
            ov = pg.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth')
            assert ov <= 0, f'desbordamiento horizontal de {ov}px en el nivel {n} ({vp})'
        small = pg.evaluate('''() => ['#btn-check','#btn-map','#btn-menu','#btn-prev','#btn-hint','.cmd'].map(s => { const r = document.querySelector(s).getBoundingClientRect(); return [s, r.width, r.height]; }).filter(x => x[2] < 44 || x[1] < 44)''')
        assert not small, f'controles pequeños: {small}'
        fs = pg.evaluate('parseFloat(getComputedStyle(document.getElementById("editor-ta")).fontSize)')
        assert fs >= 16, f'el editor mide {fs}px (iOS haría zoom)'
        c.close()

def main():
    srv = serve()
    url = f'http://127.0.0.1:{srv.server_address[1]}/{os.path.basename(ROOT)}/index.html'
    with sync_playwright() as p:
        br = launch(p)
        c, pg = fresh(br, url)
        print('Datos y validación')
        t_data(pg); t_levels(pg); t_messages(pg); t_alternatives(pg); t_visual_not_text(pg); t_syntax(pg); t_security(pg)
        assert not pg.errs, pg.errs
        c.close()
        print('Interfaz y progreso')
        t_progress(br, url); t_save(br, url); t_help(br, url); t_cmds(br, url)
        print('Publicación y móvil')
        t_offline(br, url); t_paths(br, url); t_iphone(br, url)
        br.close()
    ok = sum(1 for r in RESULTS if r[0])
    print(f'\n{ok}/{len(RESULTS)} pruebas superadas')
    sys.exit(0 if ok == len(RESULTS) else 1)

if __name__ == '__main__':
    main()
