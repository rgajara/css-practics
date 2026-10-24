/* CSS Quest — lógica del juego: niveles, progreso, interfaz y ayudas. */
(function () {
  'use strict';
  const CQ = window.CQ;
  const E = CQ.Engine;
  const LEVELS = CQ.LEVELS;
  const TOTAL = LEVELS.length;
  const KEY = 'cssquest:v1';
  const $ = id => document.getElementById(id);

  /* ---------- Estado guardado ---------- */
  const defaults = () => ({
    version: 1,
    current: 0,
    completed: {},            // { "12": true }
    code: {},                 // { "12": "css…" }
    unlockedWorlds: [1],
    stats: { checks: 0, wins: 0, hints: 0, concepts: 0, solutions: 0, started: Date.now() },
    help: {},                 // { "12": 2 } nivel de ayuda visto (1 pista, 2 concepto, 3 solución)
    prefs: { pip: true, collapsed: false, fontSize: 16 }
  });
  let S = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaults();
      const d = Object.assign(defaults(), JSON.parse(raw));
      d.stats = Object.assign(defaults().stats, d.stats);
      d.prefs = Object.assign(defaults().prefs, d.prefs);
      return d;
    } catch (e) { return defaults(); }
  }
  let saveTimer = null;
  function save(now) {
    const write = () => {
      try {
        S.unlockedWorlds = computeUnlockedWorlds();
        localStorage.setItem(KEY, JSON.stringify(S));
        flashSaved();
      } catch (e) { $('save-state').textContent = 'sin guardar'; }
    };
    clearTimeout(saveTimer);
    if (now) write(); else saveTimer = setTimeout(write, 350);
  }
  function flashSaved() {
    const el = $('save-state');
    el.textContent = 'guardado';
    el.classList.remove('pulse'); void el.offsetWidth; el.classList.add('pulse');
  }

  const idOf = i => String(i + 1);
  const isDone = i => !!S.completed[idOf(i)];
  const isUnlocked = i => i === 0 || isDone(i - 1);
  const doneCount = () => Object.keys(S.completed).filter(k => S.completed[k]).length;
  function computeUnlockedWorlds() {
    const out = [];
    for (let w = 1; w <= 10; w++) if (isUnlocked((w - 1) * 20)) out.push(w);
    return out;
  }
  function furthestUnlocked() {
    let i = 0;
    while (i + 1 < TOTAL && isUnlocked(i + 1)) i++;
    return i;
  }

  /* ---------- Texto con `código` ---------- */
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  function rich(s) {
    return esc(s || '').split(/\n{2,}/).map(p =>
      '<p>' + p.replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>') + '</p>').join('');
  }

  /* ---------- Elementos ---------- */
  const play = $('play'), goalview = $('goalview');
  const probeMine = $('probe-mine'), probeGoal = $('probe-goal');
  const boxMine = $('box-mine'), boxGoal = $('box-goal'), frames = $('frames');
  let cur = 0, level = null, stageW = CQ.STAGE.w, simOn = false, swapped = false, lastResult = null;

  const editor = new CQ.Editor($('editor'), {
    minLines: 8,
    onInput: v => { S.code[idOf(cur)] = v; save(); schedulePreview(); scheduleLint(); markStale(); },
    onSubmit: () => check(),
    onFocus: () => kbShow(true),
    onBlur: () => setTimeout(() => { if (document.activeElement !== editor.ta) kbShow(false); }, 120)
  });

  /* ---------- Vista previa en vivo ---------- */
  let prevTimer = null;
  function schedulePreview() {
    clearTimeout(prevTimer);
    prevTimer = setTimeout(() => { E.setCss(play, editor.value); drawGhosts(); applySim(); }, 120);
  }
  let lintTimer = null;
  function scheduleLint() {
    clearTimeout(lintTimer);
    $('lint').textContent = '';
    lintTimer = setTimeout(() => {
      const issues = E.analyze(editor.value);
      $('lint').textContent = issues.length ? `Línea ${issues[0].line}: ${issues[0].msg}` : '';
    }, 1100);
  }
  function markStale() {
    if (lastResult && !lastResult.pass) $('feedback').classList.add('stale');
  }

  /* ---------- Cargar nivel ---------- */
  function open(i, opts) {
    i = Math.max(0, Math.min(TOTAL - 1, i | 0));
    if (!isUnlocked(i)) { toast('Ese nivel todavía está bloqueado. Supera el anterior para abrirlo.'); return false; }
    cur = i; level = LEVELS[i];
    S.current = i; save();
    if (!(opts && opts.keepHash)) history.replaceState(null, '', '#nivel-' + (i + 1));
    const w = CQ.WORLDS[level.world - 1];
    document.documentElement.style.setProperty('--world', w.hue);
    $('lvl-num').textContent = `Nivel ${i + 1} de ${TOTAL}`;
    $('lvl-title').textContent = level.title;
    $('world-line').innerHTML = `<span class="world-dot"></span>Mundo ${w.n}: ${esc(w.name)} <span class="muted">· ${esc(w.topic)}</span>`;
    document.title = `${i + 1}. ${level.title} · CSS Quest`;
    $('brief').innerHTML = rich(level.brief) + (level.rule ? `<p class="rule"><strong>Condición:</strong> ${rich(level.rule).replace(/^<p>|<\/p>$/g, '')}</p>` : '');
    renderCommands();
    const saved = S.code[idOf(i)];
    editor.set(saved != null ? saved : level.css);
    $('lint').textContent = '';
    lastResult = null;
    $('feedback').hidden = true; $('feedback').className = 'feedback';
    $('stage').classList.remove('win');
    // Herramientas del escenario
    stageW = CQ.STAGE.w;
    $('width-ctl').hidden = !level.resizable;
    $('width-range').value = stageW; $('width-out').textContent = stageW;
    simOn = false;
    const sim = $('btn-sim');
    sim.hidden = !level.sim;
    if (level.sim) { sim.textContent = `Simular :${level.sim.state || 'hover'}`; sim.setAttribute('aria-pressed', 'false'); }
    // Escenas
    E.mount(play, level, editor.value);
    E.mount(goalview, level, level.solution);
    setSwapped(false);
    layoutStage();
    renderHelp();
    updateNav();
    renderProgress();
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    return true;
  }

  function renderCommands() {
    const ul = $('cmd-list');
    ul.innerHTML = '';
    (level.cmds || []).forEach(c => {
      const [name, own] = Array.isArray(c) ? c : [c, null];
      const text = own || CQ.CMD[name] || '';
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'cmd';
      b.innerHTML = `<code>${esc(name)}</code><span>${esc(text)}</span>`;
      b.setAttribute('aria-label', `Escribir ${name}: ${text}`);
      b.addEventListener('pointerdown', e => { if (document.activeElement === editor.ta) e.preventDefault(); });
      b.addEventListener('click', () => {
        // Los valores (como flex-end) se escriben tal cual en el cursor
        if (Array.isArray(c) && !CQ.CMD[name]) { editor.insert(name); return; }
        const ins = insertableFor(name);
        if (ins) editor.insertProperty(ins);
      });
      li.appendChild(b); ul.appendChild(li);
    });
  }
  // Qué se escribe al tocar un comando
  function insertableFor(name) {
    if (/^[a-z-]+$/.test(name) && name !== 'etiqueta' && name !== 'selector' && name !== 'especificidad') return name;
    if (/^display: (flex|grid)$/.test(name)) return name + ';';
    if (name === 'margin: auto') return 'margin: 0 auto;';
    if (name === '!important') return ' !important';
    if (/^:/.test(name) || /^::/.test(name)) return name.replace(/\(\)$/, '()');
    if (/\(\)$/.test(name)) return name.replace(/\(\)$/, '(');
    if (name === '@media') return '@media (min-width: 500px) {\n  \n}';
    if (name === '@keyframes') return '@keyframes nombre {\n  from {  }\n  to {  }\n}';
    if (name === '--variable') return '--';
    return null;
  }

  /* ---------- Escenario: escala, miniatura, contornos ---------- */
  function layoutStage() {
    const collapsed = S.prefs.collapsed;
    $('stage').classList.toggle('collapsed', collapsed);
    $('btn-collapse').textContent = collapsed ? 'Mostrar' : 'Contraer';
    $('btn-collapse').setAttribute('aria-expanded', String(!collapsed));
    $('btn-pip').setAttribute('aria-pressed', String(S.prefs.pip));
    frames.classList.toggle('no-pip', !S.prefs.pip);
    if (collapsed) return;
    const W = stageW, H = CQ.STAGE.h;
    const avail = frames.clientWidth || 340;
    const maxH = Math.max(160, (window.innerHeight || 700) * (window.innerWidth >= 760 ? 0.62 : 0.5));
    const k = Math.min(avail / W, maxH / H, 1.7);
    frames.style.height = Math.round(H * k) + 'px';
    const main = swapped ? boxGoal : boxMine, pip = swapped ? boxMine : boxGoal;
    sizeBox(main, W, H, k, Math.round(W * k));
    const pk = Math.min(k * 0.36, 130 / W * 1.4);
    sizeBox(pip, W, H, pk, Math.round(W * pk));
    [play, goalview].forEach(f => { f.style.width = W + 'px'; f.style.height = H + 'px'; });
    drawGhosts();
  }
  function sizeBox(box, W, H, k, outW) {
    const sc = box.querySelector('.scaler');
    sc.style.width = W + 'px'; sc.style.height = H + 'px';
    sc.style.transform = `scale(${k})`;
    box.style.width = outW + 'px';
    box.style.height = Math.round(H * k) + 'px';
  }
  function setSwapped(v) {
    swapped = v;
    boxMine.classList.toggle('is-main', !v); boxMine.classList.toggle('is-pip', v);
    boxGoal.classList.toggle('is-main', v); boxGoal.classList.toggle('is-pip', !v);
    $('tab-mine').setAttribute('aria-selected', String(!v));
    $('tab-goal').setAttribute('aria-selected', String(v));
    layoutStage();
  }
  function drawGhosts() {
    const g = $('ghosts');
    g.innerHTML = '';
    if (!level || !level.ghost) return;
    const doc = goalview.contentDocument;
    if (!doc) return;
    doc.querySelectorAll(level.ghost).forEach(el => {
      const r = el.getBoundingClientRect();
      if (!r.width && !r.height) return;
      const d = document.createElement('div');
      const col = doc.defaultView.getComputedStyle(el).color;
      d.style.cssText = `left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;--g:${col}`;
      g.appendChild(d);
    });
  }
  function applySim() {
    if (!level || !level.sim) return;
    const sel = level.sim.target, state = level.sim.state || 'hover';
    [play, goalview].forEach(f => {
      const d = f.contentDocument;
      if (!d) return;
      d.querySelectorAll(sel).forEach(el => {
        if (simOn) el.setAttribute('data-sim', state); else el.removeAttribute('data-sim');
      });
    });
  }

  /* ---------- Comprobar ---------- */
  function check() {
    if (!level) return;
    S.stats.checks++;
    let r;
    try { r = E.validate(level, editor.value, probeMine, probeGoal); }
    catch (e) { r = { pass: false, syntax: [], goals: [{ ok: false, label: 'No se pudo comprobar: ' + e.message }] }; }
    lastResult = r;
    const wasDone = isDone(cur);
    if (r.pass) {
      S.completed[idOf(cur)] = true;
      if (!wasDone) S.stats.wins++;
    }
    save(true);
    renderFeedback(r);
    updateNav();
    renderProgress();
    return r;
  }

  function renderFeedback(r) {
    const fb = $('feedback');
    fb.hidden = false;
    fb.className = 'feedback ' + (r.pass ? 'ok' : r.syntax.length ? 'syntax' : 'no');
    const stage = $('stage');
    stage.classList.remove('win');
    let html = '', kb = '';
    if (r.syntax.length) {
      html = `<h3>Revisa el código antes de comprobar</h3><ul class="issues">` +
        r.syntax.slice(0, 5).map(s => `<li><span class="ln">Línea ${s.line}</span> ${esc(s.msg)}</li>`).join('') + '</ul>' +
        `<p class="small">El código se mantiene tal como lo escribiste para que lo corrijas.</p>`;
      kb = `Línea ${r.syntax[0].line}: ${r.syntax[0].msg}`;
    } else if (r.pass) {
      void stage.offsetWidth; stage.classList.add('win');
      const last = cur === TOTAL - 1;
      html = `<h3>${last ? '¡Has completado CSS Quest!' : '¡Nivel superado!'}</h3><p>${esc(level.success || 'Objetivo cumplido.')}</p>` +
        goalsList(r.goals) +
        (last ? `<p>Los 200 niveles están resueltos. Puedes volver a cualquiera desde el mapa.</p>` :
          `<button class="btn next small" type="button" id="btn-next">Siguiente nivel <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`);
      kb = '✓ ¡Nivel superado!';
    } else {
      const miss = r.goals.filter(g => !g.ok).length;
      html = `<h3>${miss === 1 ? 'Te falta 1 objetivo' : `Te faltan ${miss} de ${r.goals.length} objetivos`}</h3>` + goalsList(r.goals) +
        `<p class="small">Compara tu escena con el objetivo y ajusta el código.</p>`;
      const first = r.goals.find(g => !g.ok);
      kb = `Falta: ${first.label}`;
    }
    fb.innerHTML = html;
    const nb = $('btn-next');
    if (nb) nb.addEventListener('click', () => { kbShow(false); editor.ta.blur(); open(cur + 1); });
    $('kb-status').textContent = kb;
    $('kb-status').className = 'kb-status ' + (r.pass ? 'ok' : 'no');
    if (!kbVisible()) fb.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  function goalsList(goals) {
    return '<ul class="goals">' + goals.map(g =>
      `<li class="${g.ok ? 'met' : 'unmet'}"><span class="mark" aria-hidden="true">${g.ok ? '✓' : '○'}</span><span class="sr">${g.ok ? 'Cumplido:' : 'Pendiente:'}</span> ${esc(g.label)}</li>`).join('') + '</ul>';
  }

  /* ---------- Navegación ---------- */
  function updateNav() {
    $('btn-prev').disabled = cur === 0;
    const canNext = cur < TOTAL - 1 && isDone(cur);
    $('btn-next-top').hidden = !canNext;
  }
  function renderProgress() {
    const done = doneCount();
    $('done-count').textContent = done;
    $('progress').setAttribute('aria-valuenow', done);
    const rb = $('ribbon');
    if (!rb.childElementCount) {
      CQ.WORLDS.forEach(w => {
        const s = document.createElement('span');
        s.style.setProperty('--c', w.hue);
        s.innerHTML = '<i></i>';
        rb.appendChild(s);
      });
    }
    Array.from(rb.children).forEach((s, k) => {
      let n = 0;
      for (let j = k * 20; j < k * 20 + 20; j++) if (isDone(j)) n++;
      s.firstChild.style.width = (n / 20 * 100) + '%';
      s.classList.toggle('here', LEVELS[cur] && LEVELS[cur].world === k + 1);
    });
  }

  /* ---------- Ayudas: pista → concepto → solución ---------- */
  function renderHelp() {
    const seen = S.help[idOf(cur)] || 0;
    $('btn-help').disabled = seen < 1;
    $('btn-sol').disabled = seen < 2;
    const out = $('help-out');
    let html = '';
    if (seen >= 1) html += `<div class="help-card"><h4>Pista</h4>${rich(level.hint)}</div>`;
    if (seen >= 2) html += `<div class="help-card"><h4>Concepto</h4>${rich(level.help)}</div>`;
    if (seen >= 3) html += `<div class="help-card sol"><h4>Solución</h4><pre class="sol-code"><code>${CQ.highlight(level.solution)}</code></pre>${rich(level.why)}` +
      `<button class="btn soft small" type="button" id="btn-use-sol">Copiar la solución al editor</button></div>`;
    out.innerHTML = html;
    const use = $('btn-use-sol');
    if (use) use.addEventListener('click', () => {
      editor.set(level.solution);
      S.code[idOf(cur)] = level.solution; save();
      E.setCss(play, level.solution); drawGhosts(); applySim();
      toast('Solución copiada. Pulsa «Comprobar» para validarla.');
    });
  }
  function bumpHelp(to) {
    const k = idOf(cur), seen = S.help[k] || 0;
    if (to <= seen) return;
    S.help[k] = to;
    if (to === 1) S.stats.hints++;
    if (to === 2) S.stats.concepts++;
    if (to === 3) S.stats.solutions++;
    save(); renderHelp();
    const cards = $('help-out').querySelectorAll('.help-card');
    if (cards.length) cards[cards.length - 1].scrollIntoView({ block: 'nearest' });
  }

  /* ---------- Modales ---------- */
  let lastFocus = null;
  function modal(title, bodyHtml, onReady) {
    lastFocus = document.activeElement;
    $('modal-title').textContent = title;
    $('modal-body').innerHTML = bodyHtml;
    $('modal').hidden = false;
    document.body.classList.add('modal-open');
    onReady && onReady($('modal-body'));
    $('modal-close').focus();
  }
  function closeModal() {
    $('modal').hidden = true;
    document.body.classList.remove('modal-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function confirmBox(title, text, okLabel, onOk) {
    modal(title, `<p>${esc(text)}</p><div class="row-btns"><button class="btn ghost" type="button" data-x="no">Cancelar</button><button class="btn danger" type="button" data-x="ok">${esc(okLabel)}</button></div>`, b => {
      b.querySelector('[data-x=no]').addEventListener('click', closeModal);
      b.querySelector('[data-x=ok]').addEventListener('click', () => { closeModal(); onOk(); });
    });
  }

  function openMap() {
    let html = '<div class="map">';
    CQ.WORLDS.forEach(w => {
      const first = (w.n - 1) * 20;
      const open = isUnlocked(first);
      let n = 0; for (let j = first; j < first + 20; j++) if (isDone(j)) n++;
      html += `<section class="map-world ${open ? '' : 'locked'}" style="--c:${w.hue}">
        <h3><span class="wnum">${w.n}</span>${esc(w.name)} <small>${esc(w.topic)} · ${n}/20</small></h3><div class="map-grid">`;
      for (let j = first; j < first + 20; j++) {
        const st = isDone(j) ? 'done' : isUnlocked(j) ? 'open' : 'lock';
        html += `<button type="button" class="map-lvl ${st} ${j === cur ? 'here' : ''}" data-i="${j}" ${st === 'lock' ? 'disabled aria-disabled="true"' : ''} title="${esc(LEVELS[j].title)}" aria-label="Nivel ${j + 1}: ${esc(LEVELS[j].title)}${st === 'done' ? ', superado' : st === 'lock' ? ', bloqueado' : ''}">${j + 1}</button>`;
      }
      html += '</div></section>';
    });
    html += '</div>';
    modal('Mapa de niveles', html, b => {
      b.querySelectorAll('.map-lvl:not([disabled])').forEach(btn =>
        btn.addEventListener('click', () => { closeModal(); open(+btn.dataset.i); }));
      const here = b.querySelector('.map-lvl.here');
      if (here) here.scrollIntoView({ block: 'center' });
    });
  }

  function openMenu() {
    const st = S.stats;
    const offline = navigator.serviceWorker && navigator.serviceWorker.controller ? 'Listo para jugar sin conexión.' : 'Disponible sin conexión cuando se abra desde un servidor (GitHub Pages o localhost).';
    modal('Opciones', `
      <div class="stats">
        <div><b>${doneCount()}</b><span>niveles superados</span></div>
        <div><b>${computeUnlockedWorlds().length}</b><span>mundos abiertos</span></div>
        <div><b>${st.checks}</b><span>comprobaciones</span></div>
        <div><b>${st.hints}</b><span>pistas usadas</span></div>
        <div><b>${st.solutions}</b><span>soluciones vistas</span></div>
      </div>
      <p class="small">El progreso se guarda automáticamente en este dispositivo. ${offline}</p>
      <div class="opt-row"><span>Tamaño del código</span>
        <div class="seg small"><button type="button" data-fs="16">A</button><button type="button" data-fs="18">A</button><button type="button" data-fs="20">A</button></div></div>
      <div class="opt-list">
        <button type="button" class="btn ghost" data-x="level">Reiniciar este nivel</button>
        <button type="button" class="btn danger-ghost" data-x="all">Borrar todo el progreso</button>
      </div>
      <p class="small muted">CSS Quest · 200 niveles · versión ${CQ.VERSION}</p>`, b => {
      b.querySelectorAll('[data-fs]').forEach(x => {
        x.setAttribute('aria-pressed', String(+x.dataset.fs === S.prefs.fontSize));
        x.addEventListener('click', () => { S.prefs.fontSize = +x.dataset.fs; applyPrefs(); save(); closeModal(); });
      });
      b.querySelector('[data-x=level]').addEventListener('click', () => {
        confirmBox('Reiniciar este nivel', 'Se borrará el código que escribiste en este nivel y volverá el código inicial. Tu progreso en los demás niveles no cambia.', 'Reiniciar nivel', resetLevel);
      });
      b.querySelector('[data-x=all]').addEventListener('click', () => {
        confirmBox('Borrar todo el progreso', 'Se borrarán los niveles superados, tu código y las estadísticas de este dispositivo. No se puede deshacer.', 'Borrar todo', () => {
          try { localStorage.removeItem(KEY); } catch (e) {}
          S = defaults(); save(true); open(0); toast('Progreso borrado. Empiezas desde el nivel 1.');
        });
      });
    });
  }
  function resetLevel() {
    delete S.code[idOf(cur)];
    delete S.help[idOf(cur)];
    save(true);
    open(cur);
    toast('Código del nivel reiniciado.');
  }
  function applyPrefs() {
    // 16px como mínimo: iOS amplía la página al escribir en campos más pequeños
    document.documentElement.style.setProperty('--code-size', Math.max(16, S.prefs.fontSize || 16) + 'px');
  }

  /* ---------- Aviso breve ---------- */
  let toastTimer = null;
  function toast(text, action) {
    const t = $('toast');
    t.innerHTML = `<span>${esc(text)}</span>` + (action ? `<button type="button" class="btn small">${esc(action.label)}</button>` : '');
    t.hidden = false;
    if (action) t.querySelector('button').addEventListener('click', action.run);
    clearTimeout(toastTimer);
    if (!action) toastTimer = setTimeout(() => { t.hidden = true; }, 3200);
  }

  /* ---------- Teclado virtual (iOS) ---------- */
  const coarse = window.matchMedia && matchMedia('(pointer: coarse)').matches;
  const KEYS = [['{', '{'], ['}', '}'], [':', ': '], [';', ';'], ['.', '.'], ['#', '#'], ['-', '-'], ['( )', '()', -1], ['%', '%'], ['px', 'px'], ['" "', '""', -1], ['>', ' > '], ['⇥', '  '], ['◀', null, 'L'], ['▶', null, 'R']];
  function buildKeys() {
    const box = $('kb-keys');
    KEYS.forEach(([label, text, extra]) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'kb-key'; b.textContent = label;
      b.setAttribute('aria-label', label === '⇥' ? 'Sangría' : label === '◀' ? 'Mover cursor a la izquierda' : label === '▶' ? 'Mover cursor a la derecha' : 'Escribir ' + label);
      b.addEventListener('pointerdown', e => e.preventDefault());
      b.addEventListener('mousedown', e => e.preventDefault());
      b.addEventListener('click', () => {
        const ta = editor.ta;
        if (extra === 'L' || extra === 'R') {
          const p = Math.max(0, Math.min(ta.value.length, ta.selectionStart + (extra === 'L' ? -1 : 1)));
          ta.setSelectionRange(p, p); return;
        }
        editor.insert(text, typeof extra === 'number' ? extra : 0);
      });
      box.appendChild(b);
    });
  }
  let kbOn = false;
  function kbVisible() { return kbOn; }
  function kbShow(on) {
    kbOn = on && coarse;
    $('kb-bar').hidden = !kbOn;
    document.body.classList.toggle('kb-open', kbOn);
    if (kbOn) positionKb();
  }
  function positionKb() {
    const vv = window.visualViewport;
    const bar = $('kb-bar');
    if (!vv) { bar.style.transform = ''; return; }
    const offset = window.innerHeight - (vv.height + vv.offsetTop);
    bar.style.transform = `translateY(${-Math.max(0, offset)}px)`;
  }
  if (window.visualViewport) {
    visualViewport.addEventListener('resize', () => { if (kbOn) positionKb(); });
    visualViewport.addEventListener('scroll', () => { if (kbOn) positionKb(); });
  }

  /* ---------- Eventos ---------- */
  function bind() {
    $('btn-check').addEventListener('click', check);
    $('kb-check').addEventListener('pointerdown', e => e.preventDefault());
    $('kb-check').addEventListener('click', check);
    $('kb-hide').addEventListener('click', () => { editor.ta.blur(); kbShow(false); });
    $('btn-reset').addEventListener('click', () =>
      confirmBox('Reiniciar código', '¿Vuelves al código inicial de este nivel? Se borrará lo que escribiste aquí.', 'Reiniciar', resetLevel));
    $('btn-prev').addEventListener('click', () => open(cur - 1));
    $('btn-next-top').addEventListener('click', () => open(cur + 1));
    $('btn-level').addEventListener('click', openMap);
    $('btn-map').addEventListener('click', openMap);
    $('btn-menu').addEventListener('click', openMenu);
    $('modal-close').addEventListener('click', closeModal);
    $('modal').addEventListener('click', e => { if (e.target === $('modal')) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('modal').hidden) closeModal(); });
    $('btn-hint').addEventListener('click', () => bumpHelp(1));
    $('btn-help').addEventListener('click', () => bumpHelp(2));
    $('btn-sol').addEventListener('click', () => {
      if ((S.help[idOf(cur)] || 0) >= 3) return;
      confirmBox('Ver la solución', 'Intenta resolverlo primero con la pista y el concepto. ¿Quieres ver la solución de todas formas?', 'Ver solución', () => bumpHelp(3));
    });
    $('tab-mine').addEventListener('click', () => setSwapped(false));
    $('tab-goal').addEventListener('click', () => setSwapped(true));
    boxGoal.querySelector('.pip-hit').addEventListener('click', () => setSwapped(true));
    boxMine.querySelector('.pip-hit').addEventListener('click', () => setSwapped(false));
    $('btn-pip').addEventListener('click', () => { S.prefs.pip = !S.prefs.pip; save(); layoutStage(); });
    $('btn-collapse').addEventListener('click', () => { S.prefs.collapsed = !S.prefs.collapsed; save(); layoutStage(); });
    $('btn-sim').addEventListener('click', () => {
      simOn = !simOn;
      $('btn-sim').setAttribute('aria-pressed', String(simOn));
      applySim();
    });
    $('width-range').addEventListener('input', e => {
      stageW = +e.target.value; $('width-out').textContent = stageW; layoutStage();
    });
    let rz = null;
    window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(layoutStage, 80); });
    if (window.ResizeObserver) new ResizeObserver(() => layoutStage()).observe(frames);
    window.addEventListener('hashchange', () => {
      const m = /nivel-(\d+)/.exec(location.hash);
      if (m && +m[1] - 1 !== cur) open(+m[1] - 1, { keepHash: true });
    });
  }

  /* ---------- Modo sin conexión ---------- */
  function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    const secure = location.protocol === 'https:' || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
    if (!secure) return;
    let refreshing = false, wanted = false;
    navigator.serviceWorker.register('service-worker.js', { updateViaCache: 'none' }).then(reg => {
      const offer = w => toast('Hay una versión nueva de CSS Quest.', { label: 'Actualizar', run: () => { wanted = true; w.postMessage({ type: 'SKIP_WAITING' }); } });
      if (reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
      reg.addEventListener('updatefound', () => {
        const w = reg.installing;
        w && w.addEventListener('statechange', () => {
          if (w.state === 'installed' && navigator.serviceWorker.controller) offer(w);
        });
      });
    }).catch(() => {});
    // Solo se recarga cuando el jugador pidió actualizar (no en la primera instalación)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing || !wanted) return;
      refreshing = true; save(true); location.reload();
    });
  }

  /* ---------- Inicio ---------- */
  CQ.VERSION = '1.0.1';
  function init() {
    applyPrefs();
    buildKeys();
    bind();
    let start = S.current || 0;
    const m = /nivel-(\d+)/.exec(location.hash);
    if (m && isUnlocked(+m[1] - 1)) start = +m[1] - 1;
    if (!isUnlocked(start)) start = furthestUnlocked();
    open(start);
    registerSW();
    document.documentElement.classList.add('ready');
  }

  /* Interfaz para pruebas automatizadas */
  CQ.test = {
    total: TOTAL,
    validate: (i, css) => E.validate(LEVELS[i], css, probeMine, probeGoal),
    open: i => open(i),
    current: () => cur,
    state: () => JSON.parse(JSON.stringify(S)),
    check: () => check()
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
