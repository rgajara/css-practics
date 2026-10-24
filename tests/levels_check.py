"""Comprobación rápida de niveles: la solución debe pasar y el código inicial fallar.
Uso: python3 tests/levels_check.py [desde] [hasta]"""
import sys, os, threading, functools, http.server, json
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME = os.environ.get('CHROME', '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome')

def serve():
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    h = functools.partial(Q, directory=os.path.dirname(ROOT))
    s = http.server.ThreadingHTTPServer(('127.0.0.1', 0), h)
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s

if __name__ == '__main__':
    a = int(sys.argv[1]) if len(sys.argv) > 1 else 1
    b = int(sys.argv[2]) if len(sys.argv) > 2 else 200
    srv = serve()
    url = f'http://127.0.0.1:{srv.server_address[1]}/{os.path.basename(ROOT)}/index.html'
    with sync_playwright() as p:
        br = p.chromium.launch(executable_path=CHROME)
        pg = br.new_page()
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(url)
        pg.wait_for_function('window.CQ && CQ.test')
        res = pg.evaluate('''([a,b]) => {
          const out=[];
          for (let i=a-1;i<Math.min(b,CQ.test.total);i++){
            const L=CQ.LEVELS[i];
            const sol=CQ.test.validate(i,L.solution);
            const st=CQ.test.validate(i,L.css);
            out.push({n:i+1,title:L.title,solPass:sol.pass,solBad:sol.syntax.concat(sol.goals.filter(g=>!g.ok)),stPass:st.pass,stSyntax:st.syntax.length});
          }
          return out;}''', [a, b])
        bad = 0
        for r in res:
            if not r['solPass'] or r['stPass']:
                bad += 1
                print(f"✗ {r['n']} {r['title']}: sol={'ok' if r['solPass'] else r['solBad']} starterPasa={r['stPass']}")
        print(f'{len(res)} niveles revisados, {bad} con problemas; total={pg.evaluate("CQ.test.total")}')
        if errs: print('Errores JS:', errs)
        br.close()
