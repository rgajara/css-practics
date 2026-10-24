"""Capturas de pantalla en tamaño iPhone 15 (vertical y horizontal) y escritorio.
Uso: python3 tests/shots.py [nivel] [carpeta]"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from levels_check import serve, ROOT, CHROME
from playwright.sync_api import sync_playwright

lvl = int(sys.argv[1]) if len(sys.argv) > 1 else 1
out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(__file__), 'capturas')
os.makedirs(out, exist_ok=True)
srv = serve()
url = f'http://127.0.0.1:{srv.server_address[1]}/{os.path.basename(ROOT)}/index.html'
with sync_playwright() as p:
    br = p.chromium.launch(executable_path=CHROME)
    for name, vp, mobile in [('iphone', {'width': 393, 'height': 852}, True), ('iphone-land', {'width': 852, 'height': 393}, True), ('desktop', {'width': 1280, 'height': 860}, False)]:
        ctx = br.new_context(viewport=vp, device_scale_factor=2, is_mobile=mobile, has_touch=mobile)
        pg = ctx.new_page()
        pg.goto(url)
        pg.wait_for_function('window.CQ && CQ.test')
        # desbloquea hasta el nivel pedido
        pg.evaluate('''n => { const s=CQ.test.state(); for(let i=1;i<n;i++) s.completed[i]=true; s.current=n-1; localStorage.setItem('cssquest:v1', JSON.stringify(s)); }''', lvl)
        pg.goto(url + f'#nivel-{lvl}'); pg.reload(); pg.wait_for_function('window.CQ && CQ.test')
        pg.wait_for_timeout(300)
        pg.screenshot(path=f'{out}/{name}-{lvl}.png', full_page=(name != 'iphone-land'))
        ov = pg.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth')
        print(name, 'overflow-x:', ov)
        ctx.close()
    br.close()
