/* CSS Quest — motor: análisis del CSS, escenario aislado y validación.
   El CSS del jugador solo se aplica dentro de iframes con sandbox
   (sin allow-scripts), así que no puede ejecutar JavaScript ni tocar la app. */
(function () {
  'use strict';
  const CQ = window.CQ;
  const MAX_CSS = 20000;

  /* ---------- Utilidades de texto ---------- */
  function stripComments(css) {
    // Sustituye comentarios por espacios conservando los saltos de línea
    return css.replace(/\/\*[\s\S]*?(\*\/|$)/g, m => m.replace(/[^\n]/g, ' '));
  }
  function lineAt(src, idx) {
    let n = 1;
    for (let i = 0; i < idx && i < src.length; i++) if (src.charCodeAt(i) === 10) n++;
    return n;
  }

  /* ---------- Seguridad: construcciones no permitidas ---------- */
  function securityIssues(css) {
    const clean = stripComments(css);
    const out = [];
    const rx = [
      [/@import/i, 'No se permite @import: el juego funciona sin conexión y sin archivos externos.'],
      [/url\(\s*(['"]?)(?!data:)(?!\s*\1\s*\))/i, 'Solo se permiten url() con datos locales (data:). No cargues recursos externos.'],
      [/expression\s*\(|-moz-binding|behavior\s*:/i, 'Esa construcción no está permitida.'],
      [/<\/?\s*(script|style|iframe)/i, 'El editor acepta CSS, no etiquetas HTML.']
    ];
    for (const [r, msg] of rx) {
      const m = r.exec(clean);
      if (m) out.push({ line: lineAt(clean, m.index), msg });
    }
    if (css.length > MAX_CSS) out.push({ line: 1, msg: 'El código es demasiado largo (máximo 20 000 caracteres).' });
    return out;
  }
  function sanitize(css) {
    return stripComments(css)
      .slice(0, MAX_CSS)
      .replace(/@import[^;]*;?/gi, '')
      .replace(/url\(\s*(['"]?)(?!data:)[^)]*\)/gi, 'none')
      .replace(/expression\s*\(|-moz-binding|behavior\s*:/gi, '')
      .replace(/<\/?\s*(script|style|iframe)/gi, '');
  }

  /* Estados simulados: :hover, :focus y :active también se activan con
     el atributo data-sim, para poder comprobarlos y probarlos en móvil. */
  function withStates(css) {
    return css.replace(/:(hover|focus-visible|focus|active)(?![\w-])/g,
      (m, s) => `:is(:${s},[data-sim~="${s === 'focus-visible' ? 'focus' : s}"])`);
  }

  /* ---------- Analizador / linter de CSS ---------- */
  const NESTED_AT = /^@(media|supports|container|layer|document|scope)\b/i;
  const DECL_AT = /^@(font-face|page|property|counter-style)\b/i;

  function lint(source) {
    const errors = [];
    const css = stripComments(source);
    const err = (idx, msg) => errors.push({ line: lineAt(css, idx), msg });
    if (/\/\*(?![\s\S]*?\*\/)/.test(source)) {
      const i = source.lastIndexOf('/*');
      err(i, 'Hay un comentario /* sin cerrar con */.');
    }
    let i = 0;
    const len = css.length;

    function skipWs() { while (i < len && /\s/.test(css[i])) i++; }

    // Lee hasta encontrar uno de los caracteres de parada a profundidad 0
    function readUntil(stops) {
      const start = i;
      let depth = 0, q = null;
      while (i < len) {
        const c = css[i];
        if (q) { if (c === '\\') i++; else if (c === q) q = null; }
        else if (c === '"' || c === "'") q = c;
        else if (c === '(' || c === '[') depth++;
        else if (c === ')' || c === ']') depth = Math.max(0, depth - 1);
        else if (depth === 0 && stops.includes(c)) break;
        i++;
      }
      return { text: css.slice(start, i), start };
    }

    function checkSelector(sel, at) {
      const s = sel.trim();
      if (!s) { err(at, 'Falta el selector antes de «{».'); return; }
      if (/[;:]\s*$/.test(s) && !/::?[\w-]+\s*$/.test(s)) {
        err(at, `El selector «${s}» termina de forma extraña. ¿Falta una llave «}» antes?`);
        return;
      }
      if (window.CSS && CSS.supports && supportsSelectorFn()) {
        for (const part of splitTop(s, ',')) {
          const one = part.trim();
          if (!one) { err(at, `En «${s}» sobra una coma o falta un selector.`); return; }
          const testSel = one.replace(/&/g, ':root');
          if (!CSS.supports(`selector(${testSel})`)) {
            // Algunos navegadores no aceptan pseudoelementos en selector(); los toleramos
            const noPseudo = testSel.replace(/::?(before|after|first-letter|first-line|placeholder|marker|selection|backdrop)\b/g, '').trim();
            if (!noPseudo || !CSS.supports(`selector(${noPseudo})`)) {
              if (noPseudo) { err(at, `El selector «${one}» no es válido.`); return; }
            }
          }
        }
      }
    }

    function checkDeclaration(decl, at, inKeyframes) {
      const raw = decl.trim();
      if (!raw) return;
      const c = raw.indexOf(':');
      if (c < 0) {
        err(at, `«${raw.slice(0, 40)}» no es una declaración: falta «:» entre la propiedad y el valor (o falta «;» en la línea anterior).`);
        return;
      }
      const prop = raw.slice(0, c).trim();
      let value = raw.slice(c + 1).trim();
      if (!prop) { err(at, 'Falta el nombre de la propiedad antes de «:».'); return; }
      if (/\s/.test(prop)) { err(at, `«${prop}» no es una propiedad válida: ¿falta un «;» en la línea anterior?`); return; }
      if (!value) { err(at, `La propiedad «${prop}» no tiene valor.`); return; }
      if (/\n\s*-?[a-z][\w-]*\s*:/i.test(value)) {
        err(at, `Falta «;» al final de la declaración «${prop}: ${value.split('\n')[0].trim()}».`);
        return;
      }
      if (prop.startsWith('--')) return; // variables: cualquier valor
      value = value.replace(/!\s*important\s*$/i, '').trim();
      if (!value) { err(at, `«${prop}» solo tiene !important, falta el valor.`); return; }
      if (/^-(webkit|moz|ms|o)-/i.test(prop)) return; // prefijos: no bloquean
      if (!window.CSS || !CSS.supports) return;
      if (!CSS.supports(prop, 'inherit')) {
        err(at, `«${prop}» no es una propiedad CSS conocida. Revisa cómo está escrita.`);
        return;
      }
      if (/var\(|env\(|attr\(/i.test(value)) return; // se resuelve al aplicar
      if (!CSS.supports(prop, value)) {
        err(at, `El valor «${value.replace(/\s+/g, ' ')}» no es válido para «${prop}».`);
      }
    }

    function parseDeclBlock(inKeyframes) {
      // Estamos justo después de «{». Lee declaraciones y reglas anidadas hasta «}».
      while (i < len) {
        skipWs();
        if (i >= len) return false;
        if (css[i] === '}') { i++; return true; }
        if (css[i] === ';') { i++; continue; }
        const chunk = readUntil([';', '{', '}']);
        if (i >= len) { checkDeclaration(chunk.text, chunk.start, inKeyframes); return false; }
        if (css[i] === '{') {
          // Regla anidada (anidamiento CSS moderno)
          const t = chunk.text.trim();
          if (inKeyframes) { err(chunk.start, 'Dentro de un fotograma no puede haber otra llave «{».'); }
          else if (NESTED_AT.test(t)) { /* @media anidado */ }
          else checkSelector(t, chunk.start);
          i++;
          if (!parseDeclBlock(false)) return false;
          continue;
        }
        checkDeclaration(chunk.text, chunk.start, inKeyframes);
        if (css[i] === ';') i++;
      }
      return false;
    }

    function parseKeyframesBody() {
      while (i < len) {
        skipWs();
        if (i >= len) return false;
        if (css[i] === '}') { i++; return true; }
        const chunk = readUntil(['{', '}', ';']);
        if (css[i] !== '{') {
          err(chunk.start, `En @keyframes se esperaba un paso como «from», «to» o «50%» seguido de «{». Encontré «${chunk.text.trim().slice(0, 30)}».`);
          if (css[i] === ';') { i++; continue; }
          continue;
        }
        const sel = chunk.text.trim();
        if (!/^((from|to|\d+(\.\d+)?%)\s*,?\s*)+$/i.test(sel)) {
          err(chunk.start, `«${sel}» no es un paso válido de @keyframes (usa from, to o porcentajes).`);
        }
        i++;
        if (!parseDeclBlock(true)) return false;
      }
      return false;
    }

    function parseRules(nested) {
      while (i < len) {
        skipWs();
        if (i >= len) return !nested;
        if (css[i] === '}') {
          if (nested) { i++; return true; }
          err(i, 'Sobra una llave de cierre «}».');
          i++; continue;
        }
        const pre = readUntil(['{', ';', '}']);
        const t = pre.text.trim();
        if (i >= len) {
          if (t) err(pre.start, `«${t.slice(0, 40)}» está incompleto: falta «{ … }».`);
          return !nested;
        }
        if (css[i] === ';') {
          if (/^@(charset|namespace|layer)\b/i.test(t)) { i++; continue; }
          if (t.includes(':')) err(pre.start, `La declaración «${t.slice(0, 40)}» está fuera de una regla. Escríbela dentro de «selector { … }».`);
          else err(pre.start, `«${t.slice(0, 40)}» no se entiende aquí.`);
          i++; continue;
        }
        if (css[i] === '}') {
          if (t) err(pre.start, `«${t.slice(0, 40)}» está fuera de lugar. ¿Falta una llave «{»?`);
          continue;
        }
        // css[i] === '{'
        const openAt = i;
        i++;
        let ok;
        if (/^@(-webkit-)?keyframes\b/i.test(t)) {
          if (!/^@(-webkit-)?keyframes\s+[\w-]+$/i.test(t)) err(pre.start, '@keyframes necesita un nombre, por ejemplo: @keyframes latido { … }');
          ok = parseKeyframesBody();
        } else if (NESTED_AT.test(t)) {
          if (/^@media\b/i.test(t) && window.matchMedia) {
            const q = t.replace(/^@media/i, '').trim();
            if (!q) err(pre.start, '@media necesita una condición, por ejemplo: @media (min-width: 500px)');
          }
          ok = parseRules(true);
        } else if (DECL_AT.test(t)) {
          ok = parseDeclBlock(false);
        } else if (t.startsWith('@')) {
          err(pre.start, `La regla «${t.split(/\s/)[0]}» no se reconoce.`);
          ok = parseDeclBlock(false);
        } else {
          checkSelector(t, pre.start);
          ok = parseDeclBlock(false);
        }
        if (!ok) { err(openAt, 'Falta cerrar una llave «}».'); return false; }
      }
      if (nested) return false;
      return true;
    }

    parseRules(false);
    // Elimina duplicados por línea y mensaje
    const seen = new Set();
    return errors.filter(e => { const k = e.line + e.msg; if (seen.has(k)) return false; seen.add(k); return true; })
      .sort((a, b) => a.line - b.line);
  }

  function splitTop(str, ch) {
    const out = []; let depth = 0, q = null, start = 0;
    for (let k = 0; k < str.length; k++) {
      const c = str[k];
      if (q) { if (c === q) q = null; continue; }
      if (c === '"' || c === "'") q = c;
      else if (c === '(' || c === '[') depth++;
      else if (c === ')' || c === ']') depth--;
      else if (c === ch && depth === 0) { out.push(str.slice(start, k)); start = k + 1; }
    }
    out.push(str.slice(start));
    return out;
  }

  let _supSel = null;
  function supportsSelectorFn() {
    if (_supSel === null) {
      try { _supSel = CSS.supports('selector(a)'); } catch (e) { _supSel = false; }
    }
    return _supSel;
  }

  function analyze(css) {
    return securityIssues(css).concat(lint(css));
  }

  /* ---------- Escenario: documento dentro del iframe ---------- */
  function sceneCss(level) {
    const w = CQ.WORLDS[level.world - 1];
    return CQ.SCENE_BASE + '\n' + (w ? w.css : '') + '\n' + (level.base || '');
  }

  function prepare(iframe) {
    const doc = iframe.contentDocument;
    if (!doc.getElementById('cq-player')) {
      doc.open();
      doc.write('<!doctype html><html lang="es"><head><meta charset="utf-8">' +
        '<meta name="viewport" content="width=device-width,initial-scale=1">' +
        '<style id="cq-base"></style><style id="cq-player"></style></head><body></body></html>');
      doc.close();
    }
    return doc;
  }

  function mount(iframe, level, css) {
    const doc = prepare(iframe);
    doc.getElementById('cq-base').textContent = withStates(sceneCss(level));
    doc.body.innerHTML = level.html;
    // Los niveles con <img> usan la imagen local
    doc.querySelectorAll('img[data-src="cq"]').forEach(img => { img.src = CQ.IMG; });
    setCss(iframe, css);
    return doc;
  }

  function setCss(iframe, css) {
    const doc = iframe.contentDocument;
    const st = doc && doc.getElementById('cq-player');
    if (st) st.textContent = withStates(sanitize(css || ''));
  }

  /* ---------- API de comprobación (t) ---------- */
  function makeApi(mine, goal, level, css) {
    const doc = mine.contentDocument, win = mine.contentWindow;
    const gdoc = goal.contentDocument;
    const cleanCss = stripComments(css);

    function q(sel, d) {
      const el = (d || doc).querySelector(sel);
      if (!el) throw new Error(`No se encuentra «${sel}» en el escenario.`);
      return el;
    }
    function qa(sel, d) { return Array.from((d || doc).querySelectorAll(sel)); }
    function cs(el, pseudo) { return el.ownerDocument.defaultView.getComputedStyle(el, pseudo || null); }
    function rect(el) {
      const r = el.getBoundingClientRect();
      return { x: r.left, y: r.top, w: r.width, h: r.height, r: r.right, b: r.bottom, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
    }
    const res = (ok, label) => ({ ok: !!ok, label });

    // Normaliza un valor con el propio navegador (p. ej. «gold» → rgb(255, 215, 0))
    let probeEl = null;
    function norm(prop, value, tag) {
      const host = doc.createElement(tag || 'div');
      host.style.cssText = 'visibility:hidden;';
      host.style.setProperty(prop, value);
      doc.body.appendChild(host);
      const v = cs(host).getPropertyValue(prop);
      host.remove();
      return v;
    }
    function parseColor(str) {
      const m = String(str).match(/rgba?\(([^)]+)\)/);
      if (!m) {
        if (str === 'transparent') return [0, 0, 0, 0];
        return null;
      }
      const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(parseFloat);
      return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
    }
    function colorEq(a, b, tol) {
      const A = parseColor(a), B = parseColor(b);
      if (!A || !B) return a === b;
      tol = tol == null ? 3 : tol;
      return Math.abs(A[0] - B[0]) <= tol && Math.abs(A[1] - B[1]) <= tol && Math.abs(A[2] - B[2]) <= tol && Math.abs(A[3] - B[3]) <= 0.03;
    }
    function px(v) { return parseFloat(v) || 0; }
    function near(a, b, tol) { return Math.abs(a - b) <= (tol == null ? 1.5 : tol); }

    /* Tras cambiar el tamaño del iframe, fuerza que el documento interno
       recalcule su viewport (unidades vw/vh y media queries) */
    function flushViewport() {
      [mine, goal].forEach(f => {
        const w = f.contentWindow, d = f.contentDocument;
        void w.innerWidth; void w.innerHeight;
        void d.documentElement.getBoundingClientRect();
        void w.getComputedStyle(d.documentElement).fontSize;
      });
    }

    function finishTransitions(root) {
      try {
        const list = root.getAnimations ? root.getAnimations({ subtree: true }) : [];
        list.forEach(a => { if (a.transitionProperty !== undefined) { try { a.finish(); } catch (e) {} } });
      } catch (e) {}
    }

    function setSim(targets, state, on) {
      targets.forEach(el => {
        const cur = (el.getAttribute('data-sim') || '').split(' ').filter(Boolean);
        const next = on ? cur.concat(state) : cur.filter(s => s !== state);
        if (next.length) el.setAttribute('data-sim', next.join(' ')); else el.removeAttribute('data-sim');
      });
    }

    const t = {
      doc, win, gdoc, css: cleanCss,
      q, qa, rect: sel => rect(q(sel)), goalRect: sel => rect(q(sel, gdoc)),
      v: (sel, prop, pseudo) => cs(q(sel), pseudo).getPropertyValue(prop),
      n: (sel, prop, pseudo) => px(cs(q(sel), pseudo).getPropertyValue(prop)),
      norm, near, colorEq, parseColor,

      ok: (cond, label) => res(cond, label),

      /* Color calculado igual al esperado */
      color(sel, prop, expected, label, tol) {
        const els = qa(sel);
        if (!els.length) return res(false, label);
        const want = norm(prop, expected);
        return res(els.every(el => colorEq(cs(el).getPropertyValue(prop), want, tol)), label);
      },
      /* Valor calculado igual al que produce «expected» */
      eq(sel, prop, expected, label) {
        const els = qa(sel);
        if (!els.length) return res(false, label);
        const want = norm(prop, expected, els[0].tagName.toLowerCase());
        return res(els.every(el => cs(el).getPropertyValue(prop).trim() === want.trim()), label);
      },
      /* El valor calculado contiene un texto */
      has(sel, prop, text, label, pseudo) {
        const v = cs(q(sel), pseudo).getPropertyValue(prop);
        const list = Array.isArray(text) ? text : [text];
        return res(list.every(x => x instanceof RegExp ? x.test(v) : v.includes(x)), label);
      },
      /* Medida numérica en px */
      px(sel, prop, value, label, tol) {
        const els = qa(sel);
        if (!els.length) return res(false, label);
        return res(els.every(el => near(px(cs(el).getPropertyValue(prop)), value, tol)), label);
      },
      /* Tamaño renderizado (incluye relleno y borde) */
      size(sel, w, h, label, tol) {
        const els = qa(sel);
        if (!els.length) return res(false, label);
        return res(els.every(el => { const r = rect(el); return (w == null || near(r.w, w, tol)) && (h == null || near(r.h, h, tol)); }), label);
      },
      /* Mismas posiciones y tamaños que en la escena objetivo */
      same(sel, label, tol) {
        tol = tol == null ? 2.5 : tol;
        const a = qa(sel), b = qa(sel, gdoc);
        if (!a.length || a.length !== b.length) return res(false, label);
        return res(a.every((el, k) => {
          const r1 = rect(el), r2 = rect(b[k]);
          return near(r1.x, r2.x, tol) && near(r1.y, r2.y, tol) && near(r1.w, r2.w, tol) && near(r1.h, r2.h, tol);
        }), label);
      },
      /* Mismo valor calculado que en la escena objetivo */
      sameStyle(sel, props, label, pseudo) {
        const a = qa(sel), b = qa(sel, gdoc);
        if (!a.length || a.length !== b.length) return res(false, label);
        const list = Array.isArray(props) ? props : [props];
        return res(a.every((el, k) => list.every(p => {
          const v1 = cs(el, pseudo).getPropertyValue(p), v2 = cs(b[k], pseudo).getPropertyValue(p);
          if (/color/.test(p) && /rgb/.test(v1 + v2)) return colorEq(v1, v2);
          if (/^-?[\d.]+px$/.test(v1.trim()) && /^-?[\d.]+px$/.test(v2.trim())) return near(px(v1), px(v2), 0.6);
          return v1.trim() === v2.trim();
        })), label);
      },
      /* Centrado de a dentro de b */
      centerX(a, b, label, tol) { const r1 = rect(q(a)), r2 = innerRect(q(b)); return res(near(r1.cx, r2.cx, tol || 1.5), label); },
      centerY(a, b, label, tol) { const r1 = rect(q(a)), r2 = innerRect(q(b)); return res(near(r1.cy, r2.cy, tol || 1.5), label); },
      center(a, b, label, tol) { const r1 = rect(q(a)), r2 = innerRect(q(b)); return res(near(r1.cx, r2.cx, tol || 1.5) && near(r1.cy, r2.cy, tol || 1.5), label); },
      /* El centro de a coincide con el de b */
      on(a, b, label, tol) { const r1 = rect(q(a)), r2 = rect(q(b)); return res(near(r1.cx, r2.cx, tol || 4) && near(r1.cy, r2.cy, tol || 4), label); },
      inside(a, b, label, tol) {
        tol = tol || 0.5;
        const r1 = rect(q(a)), r2 = rect(q(b));
        return res(r1.x >= r2.x - tol && r1.y >= r2.y - tol && r1.r <= r2.r + tol && r1.b <= r2.b + tol, label);
      },
      /* Elemento visible en un punto (para z-index) */
      topAt(sel, x, y) {
        const el = doc.elementFromPoint(x, y);
        const target = q(sel);
        return !!el && (el === target || target.contains(el));
      },
      front(sel, label) {
        const r = rect(q(sel));
        return res(t.topAt(sel, r.cx, r.cy), label);
      },
      /* Restricciones sobre el código escrito */
      uses(re, label) { return res(re.test(cleanCss), label); },
      avoid(re, label) { return res(!re.test(cleanCss), label); },
      /* Estados simulados */
      state(sel, state, fn) {
        const els = qa(sel);
        els.forEach(el => cs(el).getPropertyValue('color'));
        setSim(els, state, true);
        els.forEach(el => cs(el).getPropertyValue('color'));
        finishTransitions(doc);
        const gels = qa(sel, gdoc);
        setSim(gels, state, true); finishTransitions(gdoc);
        try { return fn(); }
        finally {
          setSim(els, state, false); setSim(gels, state, false);
          els.forEach(el => cs(el).getPropertyValue('color'));
          finishTransitions(doc); finishTransitions(gdoc);
        }
      },
      hover(sel, fn) { return t.state(sel, 'hover', fn); },
      focus(sel, fn) { return t.state(sel, 'focus', fn); },
      /* Cambia el ancho (y alto) de la ventana del escenario */
      at(width, fn, height) {
        const ow = mine.style.width, oh = mine.style.height, gw = goal.style.width, gh = goal.style.height;
        mine.style.width = goal.style.width = width + 'px';
        if (height) mine.style.height = goal.style.height = height + 'px';
        flushViewport();
        try { return fn(); }
        finally { mine.style.width = ow; mine.style.height = oh; goal.style.width = gw; goal.style.height = gh; flushViewport(); }
      },
      /* Tamaño de letra de la raíz */
      root(size, fn) {
        const a = doc.documentElement, b = gdoc.documentElement;
        const oa = a.style.fontSize, ob = b.style.fontSize;
        a.style.fontSize = b.style.fontSize = size + 'px';
        try { return fn(); } finally { a.style.fontSize = oa; b.style.fontSize = ob; }
      },
      /* Animaciones */
      kf(name) {
        const found = [];
        const walk = rules => Array.from(rules || []).forEach(r => {
          if (r.type === 7 && r.name === name) found.push(r);
          else if (r.cssRules) walk(r.cssRules);
        });
        Array.from(doc.styleSheets).forEach(s => { try { walk(s.cssRules); } catch (e) {} });
        return found[found.length - 1] || null;
      },
      anims(sel) {
        const el = q(sel);
        return (el.getAnimations ? el.getAnimations() : []).filter(a => a.animationName !== undefined);
      },
      /* Muestra el estado de la animación en una fracción (0–1) de su primer ciclo */
      frame(sel, fraction, fn, which) {
        const run = d => {
          const el = q(sel, d);
          const list = (el.getAnimations ? el.getAnimations() : []).filter(a => a.animationName !== undefined);
          const a = which ? list.find(x => x.animationName === which) : list[0];
          if (!a) return null;
          const tm = a.effect.getComputedTiming();
          const dur = typeof tm.duration === 'number' ? tm.duration : 0;
          const prev = a.currentTime;
          a.pause();
          a.currentTime = (tm.delay || 0) + dur * fraction;
          return () => { a.currentTime = prev; a.play(); };
        };
        const r1 = run(doc), r2 = run(gdoc);
        if (!r1) return res(false, 'La animación está aplicada al elemento');
        try { return fn(); } finally { r1 && r1(); r2 && r2(); }
      },
      /* Ángulo de rotación de transform */
      angle(sel) {
        const m = cs(q(sel)).transform;
        if (!m || m === 'none') return 0;
        const v = m.match(/matrix\(([^)]+)\)/);
        if (!v) return NaN;
        const [a, b] = v[1].split(',').map(parseFloat);
        return Math.round(Math.atan2(b, a) * 180 / Math.PI * 10) / 10;
      },
      contrast(sel) {
        const el = q(sel);
        const fg = parseColor(cs(el).color);
        let bg = null, node = el;
        while (node && node.nodeType === 1) {
          const c = parseColor(cs(node).backgroundColor);
          if (c && c[3] > 0.95) { bg = c; break; }
          node = node.parentElement;
        }
        bg = bg || [255, 255, 255, 1];
        const L = c => { const s = c.slice(0, 3).map(x => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }); return 0.2126 * s[0] + 0.7152 * s[1] + 0.0722 * s[2]; };
        const l1 = L(fg), l2 = L(bg);
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      }
    };

    function innerRect(el) {
      // Caja de contenido + relleno (área donde se colocan los hijos)
      const r = el.getBoundingClientRect(), s = cs(el);
      const x = r.left + px(s.borderLeftWidth), y = r.top + px(s.borderTopWidth);
      const w = r.width - px(s.borderLeftWidth) - px(s.borderRightWidth);
      const h = r.height - px(s.borderTopWidth) - px(s.borderBottomWidth);
      return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
    }
    t.innerRect = sel => innerRect(q(sel));
    /* Caja de contenido (sin relleno ni borde) */
    t.contentRect = sel => {
      const el = q(sel), r = innerRect(el), st = cs(el);
      const x = r.x + px(st.paddingLeft), y = r.y + px(st.paddingTop);
      const w = r.w - px(st.paddingLeft) - px(st.paddingRight), h = r.h - px(st.paddingTop) - px(st.paddingBottom);
      return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
    };
    return t;
  }

  function flatten(list, out) {
    out = out || [];
    (Array.isArray(list) ? list : [list]).forEach(x => {
      if (Array.isArray(x)) flatten(x, out);
      else if (x && typeof x === 'object' && 'ok' in x) out.push(x);
    });
    return out;
  }

  /* Validación completa: análisis + resultado visual.
     mine y goal son iframes de prueba (ocultos) del mismo tamaño. */
  function validate(level, css, mine, goal) {
    const issues = analyze(css);
    if (issues.length) return { pass: false, syntax: issues, goals: [] };
    const size = CQ.STAGE;
    [mine, goal].forEach(f => { f.style.width = size.w + 'px'; f.style.height = size.h + 'px'; });
    mount(mine, level, css);
    mount(goal, level, level.solution);
    let goals;
    try {
      const t = makeApi(mine, goal, level, css);
      goals = flatten(level.check(t));
      if (!goals.length) goals = [{ ok: false, label: 'Este nivel no tiene objetivos definidos.' }];
    } catch (e) {
      goals = [{ ok: false, label: e && e.message ? e.message : 'No se pudo comprobar el resultado.' }];
    }
    return { pass: goals.every(g => g.ok), syntax: [], goals };
  }

  CQ.Engine = { analyze, lint, sanitize, withStates, mount, setCss, validate, stripComments, sceneCss };
})();
