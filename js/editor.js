/* CSS Quest — editor de código: textarea real con resaltado superpuesto,
   números de línea, sangría automática y barra de símbolos para móvil. */
(function () {
  'use strict';
  const CQ = window.CQ;

  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /* Resaltado sintáctico sencillo con estado: fuera/dentro de llaves */
  function highlight(src) {
    let out = '', i = 0, depthDecl = false, stack = [];
    const n = src.length;
    const span = (cls, txt) => `<span class="t-${cls}">${esc(txt)}</span>`;
    let expectValue = false;
    while (i < n) {
      const c = src[i];
      if (c === '/' && src[i + 1] === '*') {
        const end = src.indexOf('*/', i + 2);
        const j = end < 0 ? n : end + 2;
        out += span('com', src.slice(i, j)); i = j; continue;
      }
      if (c === '"' || c === "'") {
        let j = i + 1;
        while (j < n && src[j] !== c && src[j] !== '\n') { if (src[j] === '\\') j++; j++; }
        j = Math.min(n, j + 1);
        out += span('str', src.slice(i, j)); i = j; continue;
      }
      if (c === '{') { stack.push(depthDecl); depthDecl = true; expectValue = false; out += span('pun', c); i++; continue; }
      if (c === '}') { depthDecl = stack.length ? stack.pop() : false; expectValue = false; out += span('pun', c); i++; continue; }
      if (c === ';') { expectValue = false; out += span('pun', c); i++; continue; }
      if (c === '@') {
        const m = /^@[\w-]+/.exec(src.slice(i));
        out += span('at', m[0]); i += m[0].length;
        // Las reglas @ abren un bloque de reglas, no de declaraciones
        const rest = src.slice(i);
        const brace = rest.indexOf('{'), semi = rest.indexOf(';');
        if (brace >= 0 && (semi < 0 || brace < semi)) {
          const head = rest.slice(0, brace);
          out += esc(head).replace(/(-?\d*\.?\d+)(px|em|rem|%|vw|vh|deg|s|ms)?/g, '<span class="t-num">$1$2</span>');
          i += head.length;
          out += span('pun', '{'); i++;
          stack.push(depthDecl); depthDecl = false;
        }
        continue;
      }
      if (!depthDecl || (depthDecl && !expectValue && /[.#:&\[*>~+]/.test(c) && looksLikeNestedSelector(src, i))) {
        // Selector: hasta la llave
        let j = i;
        while (j < n && src[j] !== '{' && src[j] !== '}' && !(src[j] === '/' && src[j + 1] === '*')) j++;
        out += selectorHtml(src.slice(i, j)); i = j; continue;
      }
      if (!expectValue) {
        // Propiedad
        let j = i;
        while (j < n && !/[:;{}\n]/.test(src[j]) && !(src[j] === '/' && src[j + 1] === '*')) j++;
        const txt = src.slice(i, j);
        out += txt.trim() ? span('prop', txt) : esc(txt);
        i = j;
        if (src[i] === ':') { out += span('pun', ':'); i++; expectValue = true; }
        else if (src[i] === '\n') { out += '\n'; i++; }
        continue;
      }
      // Valor
      let j = i;
      while (j < n && !/[;{}]/.test(src[j]) && !(src[j] === '/' && src[j + 1] === '*') && src[j] !== '"' && src[j] !== "'") j++;
      out += valueHtml(src.slice(i, j));
      i = j;
    }
    return out;
  }
  function looksLikeNestedSelector(src, i) {
    const rest = src.slice(i);
    const b = rest.indexOf('{'), s = rest.indexOf(';'), e = rest.indexOf('}');
    return b >= 0 && (s < 0 || b < s) && (e < 0 || b < e);
  }
  function selectorHtml(s) {
    return esc(s).replace(/(::?[\w-]+(\([^)]*\))?)|([.#][\w-]+)|(\[[^\]]*\])/g, (m, ps, _a, cl, at) =>
      ps ? `<span class="t-pse">${ps}</span>` : cl ? `<span class="t-sel">${cl}</span>` : `<span class="t-attr">${at}</span>`)
      .replace(/^(\s*)([a-z][\w-]*)/gm, '$1<span class="t-tag">$2</span>');
  }
  function valueHtml(v) {
    return esc(v)
      .replace(/(#[0-9a-fA-F]{3,8})\b/g, '<span class="t-hex">$1</span>')
      .replace(/(^|[\s(,\/-])(-?\d*\.?\d+)(px|em|rem|%|vw|vh|vmin|vmax|deg|turn|s|ms|fr|ch|ex)?(?![\w#])/g,
        (m, p, num, u) => `${p}<span class="t-num">${num}${u || ''}</span>`)
      .replace(/(!important)/g, '<span class="t-imp">$1</span>');
  }

  /* ---------- Editor ---------- */
  function Editor(root, opts) {
    this.root = root;
    this.opts = opts || {};
    this.ta = root.querySelector('textarea');
    this.hl = root.querySelector('.hl code');
    this.gutter = root.querySelector('.gutter');
    this.escaped = false;
    const ta = this.ta;
    ta.addEventListener('input', () => { this.render(); this.opts.onInput && this.opts.onInput(this.value); });
    ta.addEventListener('scroll', () => this.syncScroll());
    ta.addEventListener('keydown', e => this.onKey(e));
    ta.addEventListener('focus', () => this.opts.onFocus && this.opts.onFocus());
    ta.addEventListener('blur', () => this.opts.onBlur && this.opts.onBlur());
    this.render();
  }
  Editor.prototype = {
    get value() { return this.ta.value; },
    set(value) { this.ta.value = value; this.render(); },
    render() {
      const v = this.ta.value;
      this.hl.innerHTML = highlight(v) + '\n';
      const lines = v.split('\n').length;
      const shown = Math.max(lines, this.opts.minLines || 8);
      if (this.gutter.childElementCount !== shown) {
        let g = '';
        for (let k = 1; k <= shown; k++) g += `<span>${k}</span>`;
        this.gutter.innerHTML = g;
      }
      this.root.style.setProperty('--lines', shown);
      this.syncScroll();
    },
    syncScroll() {
      this.hl.parentElement.scrollLeft = this.ta.scrollLeft;
      this.hl.parentElement.scrollTop = this.ta.scrollTop;
    },
    /* Inserta texto en el cursor conservando el deshacer cuando es posible */
    insert(text, caretOffset) {
      const ta = this.ta;
      ta.focus({ preventScroll: true });
      let ok = false;
      try { ok = document.execCommand && document.execCommand('insertText', false, text); } catch (e) { ok = false; }
      if (!ok) {
        const s = ta.selectionStart, en = ta.selectionEnd;
        ta.setRangeText(text, s, en, 'end');
        ta.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (caretOffset) {
        const p = ta.selectionStart + caretOffset;
        ta.setSelectionRange(p, p);
      }
    },
    /* Inserta «propiedad: » en una línea nueva dentro de la regla actual */
    insertProperty(prop) {
      const ta = this.ta, v = ta.value;
      let pos = ta.selectionStart;
      if (document.activeElement !== ta) {
        // Sin cursor: busca la primera línea vacía dentro de una regla
        const m = /\{\s*\n(\s*)\n/.exec(v);
        if (m) pos = m.index + m[0].length - 1;
        else pos = Math.max(0, v.lastIndexOf('}'));
        ta.focus({ preventScroll: true });
        ta.setSelectionRange(pos, pos);
      }
      const lineStart = v.lastIndexOf('\n', pos - 1) + 1;
      const before = v.slice(lineStart, pos);
      const text = prop.includes(':') || prop.startsWith('@') || /[.#\[]/.test(prop[0]) ? prop : prop + ': ';
      if (before.trim()) {
        const indent = (/^\s*/.exec(before)[0]) || '  ';
        this.insert('\n' + indent + text);
      } else this.insert(text);
    },
    onKey(e) {
      const ta = this.ta;
      if (e.key === 'Escape') { this.escaped = true; return; }
      if (e.key === 'Tab' && !e.shiftKey && !this.escaped && !e.metaKey && !e.ctrlKey) {
        e.preventDefault(); this.insert('  '); return;
      }
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault(); this.opts.onSubmit && this.opts.onSubmit(); return;
      }
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
        const v = ta.value, s = ta.selectionStart;
        if (s !== ta.selectionEnd) return;
        const lineStart = v.lastIndexOf('\n', s - 1) + 1;
        const indent = /^[ \t]*/.exec(v.slice(lineStart, s))[0];
        const prev = v.slice(0, s).trimEnd().slice(-1);
        const next = v.slice(s).match(/^[ \t]*(.)?/)[1];
        e.preventDefault();
        if (prev === '{' && next === '}') {
          this.insert('\n' + indent + '  \n' + indent, -(indent.length + 1));
        } else if (prev === '{') {
          this.insert('\n' + indent + '  ');
        } else {
          this.insert('\n' + indent);
        }
        return;
      }
      if (e.key === '}' ) {
        // Quita la sangría sobrante al cerrar una llave
        const v = ta.value, s = ta.selectionStart;
        const lineStart = v.lastIndexOf('\n', s - 1) + 1;
        const before = v.slice(lineStart, s);
        if (/^ {2,}$/.test(before) && s === ta.selectionEnd) {
          e.preventDefault();
          ta.setSelectionRange(s - 2, s);
          this.insert('}');
        }
      }
      this.escaped = false;
    },
    focus() { this.ta.focus(); }
  };

  CQ.Editor = Editor;
  CQ.highlight = highlight;
})();
