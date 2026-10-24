/* Mundo 10 — Ciudadela final: retos que combinan todo lo aprendido,
   depuración y optimización (niveles 181–200) */
(function () {
  const L = d => CQ.LV(10, d);
  const secs = v => v.split(',').map(x => parseFloat(x) * (/ms/.test(x) ? 0.001 : 1));

  L({
    title: 'Depurar: erratas',
    brief: 'Este código tiene **tres errores**: dos palabras mal escritas y un punto y coma que falta. Corrígelos para que los iconos queden centrados en fila con `12px` de separación.',
    html: `<div class="escena"><div class="galeria"><div class="item">🛡️</div><div class="item">⚔️</div><div class="item">👑</div></div></div>`,
    base: `:where(.galeria){height:100%}:where(.item){width:56px;height:56px;background:#fff;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:28px;box-shadow:0 2px 0 #d6dae6}`,
    css: `.galeria {\n  display: flx;\n  justify-contnt: center;\n  gap: 12px\n  align-items: center;\n}`,
    ghost: '.item',
    cmds: ['display: flex', 'justify-content', 'gap', 'align-items'],
    hint: 'Pulsa «Comprobar»: el analizador te dirá en qué líneas están los problemas.',
    help: 'Un valor mal escrito invalida solo esa declaración. Un `;` que falta une dos declaraciones en una, y las dos dejan de funcionar.',
    solution: `.galeria {\n  display: flex;\n  justify-content: center;\n  gap: 12px;\n  align-items: center;\n}`,
    why: 'Tres correcciones pequeñas devuelven todo el diseño.',
    success: 'Depurar también es programar.',
    check: t => [t.same('.item', 'Los iconos están centrados en fila')]
  });

  L({
    title: 'Depurar: llaves perdidas',
    brief: 'Falta una llave y hay una declaración **fuera de su regla**. Arréglalo: la tarjeta debe tener fondo blanco, `16px` de relleno y esquinas de `12px`; el título, color `#1f2433`.',
    html: `<div class="escena"><div class="tarjeta"><h3 class="titulo">Torre norte</h3><p>Abierta al público.</p></div></div>`,
    base: `:where(.tarjeta){background:#d6dae6}:where(.titulo){margin:0 0 4px;color:#9aa0b3}:where(.tarjeta p){margin:0}`,
    css: `.tarjeta {\n  padding: 16px;\n  border-radius: 12px;\n\n.titulo {\n  color: #1f2433;\n}\nbackground-color: white;`,
    cmds: ['background-color', 'padding', 'border-radius', 'color'],
    hint: 'Cada `{` necesita su `}`. Mueve `background-color` dentro de la regla de la tarjeta.',
    help: 'Una llave sin cerrar hace que el navegador interprete lo siguiente como parte de la regla anterior. Las declaraciones sueltas fuera de una regla se ignoran.',
    solution: `.tarjeta {\n  padding: 16px;\n  border-radius: 12px;\n  background-color: white;\n}\n\n.titulo {\n  color: #1f2433;\n}`,
    why: 'Cada declaración vuelve a su regla.',
    success: 'Estructura reparada.',
    check: t => [t.color('.tarjeta', 'background-color', 'white', 'La tarjeta tiene fondo blanco'), t.px('.tarjeta', 'padding-top', 16, 'Tiene 16px de relleno'), t.px('.tarjeta', 'border-top-left-radius', 12, 'Tiene esquinas de 12px'), t.color('.titulo', 'color', '#1f2433', 'El título es #1f2433')]
  });

  L({
    title: 'Depurar: la regla que no gana',
    brief: 'El enlace activo debería ser rojo (`#e63946`) y en negrita, pero sigue gris. Ninguna palabra está mal: es un problema de **especificidad**. Corrige el selector de `.activo`.',
    html: `<div class="escena"><nav class="menu"><a>Inicio</a><a class="activo">Mapa</a><a>Tienda</a></nav></div>`,
    base: `:where(.menu){display:flex;gap:16px;background:#fff;padding:14px;border-radius:12px;font-size:18px}`,
    css: `.menu a {\n  color: #555;\n}\n\n.activo {\n  color: #e63946;\n  font-weight: 700;\n}`,
    cmds: ['especificidad', 'a b'],
    rule: 'No uses !important.',
    hint: '`.menu a` tiene una clase y una etiqueta; `.activo` solo una clase.',
    help: 'Cuando una regla «no funciona» sin errores, casi siempre otra más específica la está tapando. Igualar o superar su especificidad lo resuelve.',
    solution: `.menu a {\n  color: #555;\n}\n\n.menu .activo {\n  color: #e63946;\n  font-weight: 700;\n}`,
    why: '`.menu .activo` (dos clases) supera a `.menu a` (clase + etiqueta).',
    success: 'Detective de la cascada.',
    check: t => [t.color('.activo', 'color', '#e63946', 'El enlace activo es rojo'), t.ok(parseInt(t.v('.activo', 'font-weight'), 10) >= 700, 'El enlace activo está en negrita'), t.color('.menu a:not(.activo)', 'color', '#555', 'Los demás siguen grises'), t.avoid(/!important/, 'No usas !important')]
  });

  L({
    title: 'Optimizar: no te repitas',
    brief: 'El color `#e63946` está escrito cuatro veces. Refactoriza: guárdalo en una variable `--marca` en `:root` y úsala. El resultado visual debe ser **idéntico**.',
    html: `<div class="escena"><h2 class="titulo">Ofertas</h2><p class="precio">12 €</p><button class="boton">Comprar</button><div class="linea"></div></div>`,
    base: `:where(.titulo,.precio){margin:0 0 8px}:where(.boton){border:0;padding:10px 16px;border-radius:10px;color:#fff;font-weight:700}:where(.linea){height:4px;margin-top:12px}`,
    css: `.titulo {\n  color: #e63946;\n}\n\n.precio {\n  color: #e63946;\n  font-weight: 700;\n}\n\n.boton {\n  background-color: #e63946;\n}\n\n.linea {\n  background-color: #e63946;\n}`,
    cmds: ['--variable', 'var()'],
    rule: '#e63946 debe aparecer una sola vez.',
    hint: 'Define la variable una vez y sustituye las cuatro apariciones por `var(--marca)`.',
    help: 'Optimizar el CSS no siempre es hacerlo más corto: es hacerlo más fácil de mantener. Con una variable, cambiar el color de marca es cambiar una línea.',
    solution: `:root {\n  --marca: #e63946;\n}\n\n.titulo {\n  color: var(--marca);\n}\n\n.precio {\n  color: var(--marca);\n  font-weight: 700;\n}\n\n.boton {\n  background-color: var(--marca);\n}\n\n.linea {\n  background-color: var(--marca);\n}`,
    why: 'Mismo resultado, un único punto de cambio.',
    success: 'Código limpio y mantenible.',
    check: t => [t.color('.titulo', 'color', '#e63946', 'El título sigue rojo'), t.color('.precio', 'color', '#e63946', 'El precio sigue rojo'), t.color('.boton', 'background-color', '#e63946', 'El botón sigue rojo'), t.color('.linea', 'background-color', '#e63946', 'La línea sigue roja'), t.ok((t.css.match(/#e63946/gi) || []).length === 1, '#e63946 aparece una sola vez'), t.uses(/var\(\s*--marca\s*\)/, 'Usas var(--marca)')]
  });

  L({
    title: 'Tarjeta de producto',
    brief: 'Monta la tarjeta: imagen de ancho completo con proporción `4 / 3` y recorte `cover`; debajo, nombre y precio en una fila con el precio a la **derecha**; y un botón que ocupe **todo el ancho**.',
    html: `<div class="escena"><article class="prod"><img class="foto" data-src="cq" alt="Escudo"><div class="info"><span class="nombre">Escudo</span><span class="precio">30 €</span></div><button class="comprar">Añadir</button></article></div>`,
    base: `:where(.prod){width:180px;margin:0 auto;background:#fff;border-radius:14px;padding:10px;box-shadow:0 2px 0 #d6dae6}:where(.foto){width:60px;height:60px;border-radius:10px}:where(.info){margin:8px 0;font-weight:700}:where(.comprar){border:0;border-radius:10px;padding:8px 12px;background:#1f2433;color:#fff;font-weight:700}`,
    css: `.foto {\n  \n}\n\n.info {\n  \n}\n\n.comprar {\n  \n}`,
    ghost: '.foto, .nombre, .precio, .comprar',
    cmds: ['width', 'aspect-ratio', 'object-fit', 'display: flex', 'justify-content'],
    hint: '`.foto`: `width: 100%`, `height: auto`, `aspect-ratio` y `object-fit`. `.info`: flex con `space-between`. `.comprar`: `width: 100%`.',
    help: 'Los componentes reales combinan varias técnicas pequeñas. Ve pieza a pieza.',
    solution: `.foto {\n  width: 100%;\n  height: auto;\n  aspect-ratio: 4 / 3;\n  object-fit: cover;\n}\n\n.info {\n  display: flex;\n  justify-content: space-between;\n}\n\n.comprar {\n  width: 100%;\n}`,
    why: 'Proporción fija, fila repartida y botón a lo ancho.',
    success: 'Lista para la tienda.',
    check: t => [t.same('.foto', 'La imagen ocupa el ancho con proporción 4:3'), t.eq('.foto', 'object-fit', 'cover', 'La imagen recorta con cover'), t.same('.nombre', 'El nombre está a la izquierda'), t.same('.precio', 'El precio está a la derecha'), t.same('.comprar', 'El botón ocupa todo el ancho')]
  });

  L({
    title: 'Navegación adaptable',
    brief: 'En pantallas anchas, el logo va a la izquierda y los enlaces a la derecha, en fila. Por **debajo de `480px`**, todo se apila y se **centra**.',
    html: `<div class="escena"><nav class="nav"><a class="logo">🏰 Ciudadela</a><div class="links"><a class="lk">Mapa</a><a class="lk">Torres</a><a class="lk">Tienda</a></div></nav></div>`,
    base: `:where(.nav){background:#1f2433;color:#fff;padding:12px;border-radius:12px;font-weight:700}:where(.logo){font-size:18px}:where(.lk){background:rgba(255,255,255,.12);padding:4px 8px;border-radius:8px;font-size:14px}`,
    resizable: true,
    css: `.nav {\n  \n}\n\n.links {\n  display: flex;\n  gap: 8px;\n}\n`,
    ghost: '.logo, .lk',
    cmds: ['display: flex', 'justify-content', 'align-items', 'flex-direction', '@media'],
    rule: 'Se comprueba a 360px y a 600px.',
    hint: 'Base: flex con `space-between`. En `@media (max-width: 479px)`: columna, `align-items: center` y algo de `gap`.',
    help: 'Las mismas propiedades de flex, con otros valores según el ancho, crean distribuciones muy distintas.',
    solution: `.nav {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.links {\n  display: flex;\n  gap: 8px;\n}\n\n@media (max-width: 479px) {\n  .nav {\n    flex-direction: column;\n    gap: 8px;\n  }\n}`,
    why: 'En columna, `align-items: center` centra en horizontal.',
    success: 'Navegación para todas las pantallas.',
    check: t => [360, 600].map(w => t.at(w, () => [t.same('.logo', `El logo está en su sitio a ${w}px`), t.same('.lk', `Los enlaces están en su sitio a ${w}px`)]))
  });

  L({
    title: 'Galería con zoom',
    brief: 'Crea una galería con tantas columnas de **al menos `90px`** como quepan y `8px` de hueco. Al pasar por encima de una foto, debe **crecer un 10%** con una transición de `transform`.',
    html: `<div class="escena"><div class="gal">${['🗡️', '🛡️', '🏹', '🪓', '🔱', '🪄'].map(e => `<div class="ft">${e}</div>`).join('')}</div></div>`,
    base: `:where(.ft){height:60px;background:#fff;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:30px}`,
    resizable: true, sim: { target: '.ft' },
    css: `.gal {\n  \n}\n\n.ft {\n  \n}\n`,
    ghost: '.ft',
    cmds: ['display: grid', 'repeat()', 'auto-fill', 'minmax()', 'transition', ':hover', 'scale()'],
    rule: 'Se comprueba a 300px y a 600px.',
    hint: 'Grid con `repeat(auto-fill, minmax(90px, 1fr))`. Para el zoom: `.ft:hover { transform: scale(1.1); }`.',
    help: 'Grid automático para la distribución y transformaciones para la interacción: una galería completa en pocas líneas.',
    solution: `.gal {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));\n  gap: 8px;\n}\n\n.ft {\n  transition: transform 0.2s;\n}\n\n.ft:hover {\n  transform: scale(1.1);\n}`,
    why: 'La rejilla se adapta y cada foto responde al usuario.',
    success: 'Exposición inaugurada.',
    check: t => {
      const props = t.v('.ft', 'transition-property'), d = secs(t.v('.ft', 'transition-duration'));
      return [...[300, 600].map(w => t.at(w, () => t.same('.ft', `Las fotos encajan con la escena a ${w}px`))), t.ok(/transform|all/.test(props) && d[0] > 0, 'Hay una transición de transform'), t.hover('.ft', () => t.ok(t.qa('.ft').every(el => /matrix\(1\.1, 0, 0, 1\.1/.test(t.win.getComputedStyle(el).transform)), 'Con hover, las fotos crecen un 10%'))];
    }
  });

  L({
    title: 'Formulario de acceso',
    brief: 'Cada etiqueta va **encima** de su campo. Los campos ocupan **todo el ancho** (incluidos relleno y borde) con `8px` de margen inferior. Al recibir el foco, su borde es `#5B8CFF`. El botón ocupa todo el ancho.',
    html: `<div class="escena"><form class="form"><label class="lb">Usuario</label><input class="in" type="text"><label class="lb">Clave</label><input class="in" type="password"><button class="bt" type="button">Entrar</button></form></div>`,
    base: `:where(.form){background:#fff;padding:12px;border-radius:12px}:where(.lb){font-size:13px;font-weight:700;margin-bottom:2px}:where(.in){padding:8px;border:2px solid #c9cdd8;border-radius:8px;font-size:16px;width:120px;outline:none}:where(.bt){border:0;border-radius:8px;padding:10px;background:#1f2433;color:#fff;font-weight:700}`,
    sim: { target: '.in', state: 'focus' },
    css: `.lb {\n  \n}\n\n.in {\n  \n}\n\n.bt {\n  \n}\n`,
    ghost: '.lb, .in, .bt',
    cmds: ['display', 'width', 'box-sizing', 'margin-bottom', ':focus', 'border-color'],
    hint: 'Las etiquetas con `display: block`. Los campos con `width: 100%` y `box-sizing: border-box`.',
    help: 'Sin `box-sizing: border-box`, un campo con `width: 100%` más relleno y borde se sale del formulario.',
    solution: `.lb {\n  display: block;\n}\n\n.in {\n  display: block;\n  width: 100%;\n  box-sizing: border-box;\n  margin-bottom: 8px;\n}\n\n.in:focus {\n  border-color: #5B8CFF;\n}\n\n.bt {\n  width: 100%;\n}`,
    why: 'Una columna limpia, con foco visible.',
    success: 'Acceso concedido.',
    check: t => [t.same('.lb', 'Las etiquetas están encima de los campos'), t.same('.in', 'Los campos ocupan todo el ancho'), t.same('.bt', 'El botón ocupa todo el ancho'), t.focus('.in', () => t.color('.in', 'border-top-color', '#5B8CFF', 'Con foco, el borde es #5B8CFF'))]
  });

  L({
    title: 'Ventana emergente',
    brief: 'La capa `.fondo` debe cubrir **toda la ventana** con `rgba(0, 0, 0, 0.6)` y centrar el diálogo en ambos ejes. El diálogo mide `240px` de ancho.',
    html: `<div class="escena"><p>Contenido de la página…</p><div class="fondo"><div class="dialogo"><b>¿Guardar partida?</b><br>Se sobrescribirá la anterior.</div></div></div>`,
    base: `:where(.dialogo){background:#fff;padding:16px;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.3)}:where(.fondo){background:#ccc}`,
    css: `.fondo {\n  \n}\n\n.dialogo {\n  \n}`,
    ghost: '.dialogo',
    cmds: ['position', 'inset', 'rgba()', 'display: flex', 'justify-content', 'align-items', 'width'],
    hint: '`.fondo`: `position: fixed; inset: 0;` más flex para centrar.',
    help: 'Un modal combina una capa fija que cubre la ventana con un contenedor flexible que centra su contenido.',
    solution: `.fondo {\n  position: fixed;\n  inset: 0;\n  background-color: rgba(0, 0, 0, 0.6);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.dialogo {\n  width: 240px;\n}`,
    why: 'La capa fija cubre todo y el flex centra el diálogo.',
    success: 'Partida guardada.',
    check: t => { const f = t.rect('.fondo'); const c = t.parseColor(t.v('.fondo', 'background-color')) || [0, 0, 0, 1]; return [t.ok(t.near(f.x, 0) && t.near(f.y, 0) && t.near(f.w, t.win.innerWidth) && t.near(f.h, t.win.innerHeight), 'La capa cubre toda la ventana'), t.ok(c[0] < 5 && c[1] < 5 && c[2] < 5 && t.near(c[3], 0.6, 0.03), 'La capa es negra al 60%'), t.same('.dialogo', 'El diálogo está centrado y mide 240px')]; }
  });

  L({
    title: 'El diseño clásico',
    brief: 'Monta la página con `grid-template-areas`: cabecera arriba de lado a lado; debajo, menú (`80px`), contenido (el resto) y lateral (`70px`); pie abajo de lado a lado. Filas: `40px 1fr 30px`. Huecos de `6px` y alto completo.',
    html: `<div class="pagina"><header class="z cab">Cabecera</header><nav class="z men">Menú</nav><main class="z con">Contenido</main><aside class="z lat">Lateral</aside><footer class="z pie">Pie</footer></div>`,
    base: `:where(.pagina){padding:8px;box-sizing:border-box}:where(.z){background:#fff;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;border:2px solid #d6dae6}`,
    css: `.pagina {\n  \n}\n`,
    ghost: '.z',
    cmds: ['display: grid', 'grid-template-areas', 'grid-template-columns', 'grid-template-rows', 'grid-area', 'height'],
    hint: 'Áreas: `"cab cab cab" "men con lat" "pie pie pie"`. Cada zona necesita su `grid-area`. Para el alto: `height: 100%`.',
    help: 'Es el diseño conocido como «santo grial»: durante años fue difícil de hacer y con grid son pocas líneas.',
    solution: `.pagina {\n  display: grid;\n  height: 100%;\n  gap: 6px;\n  grid-template-columns: 80px 1fr 70px;\n  grid-template-rows: 40px 1fr 30px;\n  grid-template-areas:\n    "cab cab cab"\n    "men con lat"\n    "pie pie pie";\n}\n\n.cab { grid-area: cab; }\n.men { grid-area: men; }\n.con { grid-area: con; }\n.lat { grid-area: lat; }\n.pie { grid-area: pie; }`,
    why: 'El plano en texto describe la página entera.',
    success: 'El santo grial del maquetado, conseguido.',
    check: t => ['.cab', '.men', '.con', '.lat', '.pie'].map(s => t.same(s, `La zona ${s.slice(1)} está en su sitio`))
  });

  L({
    title: 'Tabla de récords',
    brief: 'Da forma a la tabla: bordes unidos (`border-collapse`), celdas con `6px 10px` de relleno y borde `1px solid #d6dae6`, cabecera con fondo `#1f2433` y texto blanco, y filas **pares** del cuerpo con fondo `#eef1f7`.',
    html: `<div class="escena"><table class="tabla"><thead><tr><th>Jugador</th><th>Nivel</th></tr></thead><tbody><tr><td>Ana</td><td>200</td></tr><tr><td>Luis</td><td>187</td></tr><tr><td>Mía</td><td>152</td></tr><tr><td>Teo</td><td>96</td></tr></tbody></table></div>`,
    base: `:where(.tabla){width:100%;background:#fff;font-size:14px;text-align:left}`,
    css: `.tabla {\n  \n}\n`,
    cmds: ['border-collapse', 'padding', 'border', ':nth-child()', 'background-color'],
    hint: 'Selectores útiles: `th, td`, `th` y `tbody tr:nth-child(even)`.',
    help: 'Por defecto, cada celda tiene su propio borde separado. `border-collapse: collapse` los une en una sola línea.',
    solution: `.tabla {\n  border-collapse: collapse;\n}\n\nth, td {\n  padding: 6px 10px;\n  border: 1px solid #d6dae6;\n}\n\nth {\n  background-color: #1f2433;\n  color: white;\n}\n\ntbody tr:nth-child(even) {\n  background-color: #eef1f7;\n}`,
    why: 'Una tabla legible y ordenada.',
    success: 'Récords a la vista.',
    check: t => {
      const rows = t.qa('tbody tr'), g = t.norm('background-color', '#eef1f7');
      return [t.eq('.tabla', 'border-collapse', 'collapse', 'Los bordes están unidos'), t.px('td', 'padding-left', 10, 'Las celdas tienen 10px de relleno lateral'), t.px('td', 'padding-top', 6, 'Y 6px vertical'), t.px('td', 'border-top-width', 1, 'Las celdas tienen borde de 1px'), t.color('td', 'border-top-color', '#d6dae6', 'El borde es #d6dae6'), t.color('th', 'background-color', '#1f2433', 'La cabecera es #1f2433'), t.color('th', 'color', 'white', 'El texto de la cabecera es blanco'), t.ok(rows.every((r, i) => t.colorEq(t.win.getComputedStyle(r).backgroundColor, g) === (i % 2 === 1)), 'Las filas pares tienen fondo #eef1f7')];
    }
  });

  L({
    title: 'Tabla de precios',
    brief: 'Tres planes en fila con `10px` de hueco y alturas iguales. El plan `.destacado` se **agranda un 8%** con `transform`, queda **por delante** de los demás y tiene borde `#FFD447`.',
    html: `<div class="escena"><div class="planes"><div class="plan">Básico<br><b>0 €</b></div><div class="plan destacado">Héroe<br><b>5 €</b></div><div class="plan">Leyenda<br><b>9 €</b></div></div></div>`,
    base: `:where(.planes){padding-top:40px}:where(.plan){background:#fff;border:3px solid #d6dae6;border-radius:12px;padding:14px 8px;text-align:center;font-weight:700}`,
    css: `.planes {\n  \n}\n\n.plan {\n  \n}\n\n.destacado {\n  \n}`,
    ghost: '.plan',
    cmds: ['display: flex', 'gap', 'flex', 'transform', 'scale()', 'position', 'z-index', 'border-color'],
    hint: 'Cada plan con `flex: 1`. El destacado necesita `position: relative` para que funcione `z-index`.',
    help: 'Un `transform` no cambia el espacio que ocupa el elemento: el plan crece hacia fuera y se solapa con sus vecinos. Por eso necesita estar delante.',
    solution: `.planes {\n  display: flex;\n  gap: 10px;\n}\n\n.plan {\n  flex: 1;\n}\n\n.destacado {\n  transform: scale(1.08);\n  position: relative;\n  z-index: 1;\n  border-color: #FFD447;\n}`,
    why: 'El plan central sobresale y se dibuja encima.',
    success: 'El plan Héroe se vende solo.',
    check: t => { const d = t.rect('.destacado'), p = t.qa('.plan')[2].getBoundingClientRect(); return [t.same('.plan', 'Los planes están en su sitio'), t.color('.destacado', 'border-top-color', '#FFD447', 'El destacado tiene borde #FFD447'), t.ok(t.topAt('.destacado', d.r - 2, d.cy), 'El destacado queda por delante de sus vecinos')]; }
  });

  L({
    title: 'Menú desplegable',
    brief: 'El submenú debe estar **oculto** y aparecer **justo debajo** de «Tienda», alineado a su izquierda, al pasar por encima de `.menu`. No debe empujar a nada. Pruébalo con **Simular :hover**.',
    html: `<div class="escena"><nav class="barra"><div class="menu">Tienda ▾<ul class="sub"><li>Armas</li><li>Pociones</li><li>Mapas</li></ul></div><div class="otro">Foro</div></nav></div>`,
    base: `:where(.barra){display:flex;gap:20px;background:#1f2433;color:#fff;padding:12px;border-radius:12px;font-weight:700}:where(.menu){cursor:pointer}:where(.sub){list-style:none;margin:0;padding:6px;background:#fff;color:#1f2433;border-radius:10px;width:120px;box-shadow:0 8px 20px rgba(0,0,0,.2)}:where(.sub li){padding:4px 6px}`,
    sim: { target: '.menu' },
    css: `.menu {\n  \n}\n\n.sub {\n  \n}\n\n.menu:hover .sub {\n  \n}`,
    cmds: ['position', 'top', 'left', 'display', ':hover', 'a b'],
    hint: '`.menu` relativo; `.sub` absoluto con `top: 100%` y oculto; con hover, visible.',
    help: 'El selector `.menu:hover .sub` cambia un hijo cuando el padre está en hover. Con posición absoluta, el submenú flota sin mover el resto.',
    solution: `.menu {\n  position: relative;\n}\n\n.sub {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  display: none;\n}\n\n.menu:hover .sub {\n  display: block;\n}`,
    why: 'Se muestra al pasar por encima y flota bajo su menú.',
    success: 'Menú desplegado.',
    check: t => {
      const h0 = t.rect('.barra').h;
      return [t.eq('.sub', 'display', 'none', 'Sin hover, el submenú está oculto'), t.hover('.menu', () => { const s = t.rect('.sub'), m = t.rect('.menu'); return [t.ok(t.v('.sub', 'display') !== 'none', 'Con hover, el submenú se ve'), t.ok(t.near(s.y, m.b, 1) && t.near(s.x, m.x, 1), 'Aparece justo debajo de Tienda'), t.ok(t.near(t.rect('.barra').h, h0, 0.5), 'No empuja a la barra')]; })];
    }
  });

  L({
    title: 'Notificación con pulso',
    brief: 'Coloca la insignia en la esquina **superior derecha** de la campana (sobresaliendo `6px`), y haz que **lata** con la animación `pulso` (ya existe): `1.5s`, infinita.',
    html: `<div class="escena"><div class="campana">🔔<span class="badge">5</span></div></div>`,
    base: `@keyframes pulso{0%,100%{transform:scale(1)}50%{transform:scale(1.25)}}:where(.campana){width:70px;height:70px;margin:80px auto 0;background:#fff;border-radius:18px;font-size:38px;display:flex;align-items:center;justify-content:center}:where(.badge){width:24px;height:24px;border-radius:50%;background:#e63946;color:#fff;font:700 13px/24px sans-serif;text-align:center}`,
    css: `.campana {\n  \n}\n\n.badge {\n  \n}`,
    ghost: '.badge',
    cmds: ['position', 'top', 'right', 'animation'],
    hint: 'Padre relativo, hijo absoluto con valores negativos, y `animation: pulso 1.5s infinite`.',
    help: 'La animación usa `transform`, así que no altera la posición calculada: la insignia late en su sitio.',
    solution: `.campana {\n  position: relative;\n}\n\n.badge {\n  position: absolute;\n  top: -6px;\n  right: -6px;\n  animation: pulso 1.5s infinite;\n}`,
    why: 'Posicionamiento y animación trabajando juntos.',
    success: 'Imposible no verla.',
    check: t => [t.frame('.badge', 0, () => t.same('.badge', 'La insignia está en la esquina de la campana'), 'pulso'), t.eq('.badge', 'animation-name', 'pulso', 'Usa la animación pulso'), t.ok(t.near(secs(t.v('.badge', 'animation-duration'))[0], 1.5, 0.01), 'La animación dura 1.5s'), t.eq('.badge', 'animation-iteration-count', 'infinite', 'Se repite sin fin')]
  });

  L({
    title: 'Indicador de carga',
    brief: 'Crea un indicador de carga: un círculo de borde `6px solid #d6dae6` con el borde **superior** de color `#5B8CFF`, que **gire** sin parar (una vuelta por segundo, velocidad constante). Escribe tú los `@keyframes giro`.',
    html: `<div class="escena"><div class="loader"></div></div>`,
    base: `:where(.loader){width:60px;height:60px;margin:90px auto 0;box-sizing:border-box;background:#fff}`,
    css: `.loader {\n  \n}\n`,
    cmds: ['border', 'border-color', 'border-radius', '@keyframes', 'animation', 'rotate()'],
    hint: '`border-top-color` cambia solo el lado superior. Los fotogramas: `to { transform: rotate(360deg); }`.',
    help: 'Un borde de un color con un lado distinto y una rotación continua: así funcionan muchos indicadores de carga.',
    solution: `.loader {\n  border: 6px solid #d6dae6;\n  border-top-color: #5B8CFF;\n  border-radius: 50%;\n  background: transparent;\n  animation: giro 1s linear infinite;\n}\n\n@keyframes giro {\n  to { transform: rotate(360deg); }\n}`,
    why: 'Solo gira el arco azul a la vista.',
    success: 'Cargando… ¡listo!',
    check: t => {
      const r = t.v('.loader', 'border-top-left-radius'), w = t.rect('.loader').w;
      const rad = r.includes('%') ? parseFloat(r) / 100 * w : parseFloat(r);
      return [t.px('.loader', 'border-left-width', 6, 'El borde mide 6px'), t.color('.loader', 'border-left-color', '#d6dae6', 'El borde es #d6dae6'), t.color('.loader', 'border-top-color', '#5B8CFF', 'El borde superior es #5B8CFF'), t.ok(rad >= w / 2 - 0.5, 'Es un círculo'), t.ok(!!t.kf('giro'), 'Existe @keyframes giro'), t.ok(t.near(secs(t.v('.loader', 'animation-duration'))[0], 1, 0.01), 'Una vuelta por segundo'), t.eq('.loader', 'animation-timing-function', 'linear', 'Velocidad constante'), t.eq('.loader', 'animation-iteration-count', 'infinite', 'Gira sin parar'), t.frame('.loader', 0.25, () => t.ok(t.near(Math.abs(t.angle('.loader')), 90, 2), 'A un cuarto de vuelta está girado 90°'), 'giro')];
    }
  });

  L({
    title: 'Interruptor',
    brief: 'Cuando la casilla está marcada (`:checked`), la pista que va **justo después** debe ponerse verde (`#3DDC97`) y su bola desplazarse `24px` a la derecha con `transform`. El segundo interruptor ya está marcado.',
    html: `<div class="escena"><label class="sw"><input type="checkbox" class="chk"><span class="pista"><span class="bola"></span></span> Música</label><label class="sw"><input type="checkbox" class="chk" checked><span class="pista"><span class="bola"></span></span> Efectos</label></div>`,
    base: `:where(.sw){display:flex;align-items:center;gap:10px;margin:20px 0;font-weight:700;font-size:18px}:where(.chk){position:absolute;opacity:0}:where(.pista){width:52px;height:28px;border-radius:14px;background:#c9cdd8;padding:2px;box-sizing:border-box}:where(.bola){display:block;width:24px;height:24px;border-radius:50%;background:#fff}`,
    css: `/* input:checked + .pista … */\n`,
    cmds: [':checked', 'a + b', 'background-color', 'transform', 'translate()'],
    hint: '`.chk:checked + .pista` para la pista y `.chk:checked + .pista .bola` para la bola.',
    help: 'Este truco permite crear interruptores solo con CSS: el estado lo guarda la casilla (invisible) y los selectores de hermano lo reflejan.',
    solution: `.chk:checked + .pista {\n  background-color: #3DDC97;\n}\n\n.chk:checked + .pista .bola {\n  transform: translateX(24px);\n}`,
    why: 'El selector combina un estado con un hermano adyacente.',
    success: 'Música apagada, efectos encendidos.',
    check: t => { const p = t.qa('.pista'), b = t.qa('.bola'), cs = e => t.win.getComputedStyle(e), green = t.norm('background-color', '#3DDC97'); return [t.ok(!t.colorEq(cs(p[0]).backgroundColor, green) && /none|matrix\(1, 0, 0, 1, 0, 0\)/.test(cs(b[0]).transform), 'El interruptor sin marcar sigue gris'), t.ok(t.colorEq(cs(p[1]).backgroundColor, green), 'El marcado tiene la pista verde'), t.ok(t.near(b[1].getBoundingClientRect().left - p[1].getBoundingClientRect().left, 26, 1), 'Su bola se ha desplazado 24px')]; }
  });

  L({
    title: 'Panel de control',
    brief: 'Crea un panel con columnas automáticas de **al menos `140px`** que **se estiren** (`auto-fit`), filas de `60px` y `8px` de hueco. El widget `.grande` ocupa **dos columnas**.',
    html: `<div class="escena"><div class="dash"><div class="w grande">📈 Ventas</div><div class="w">👥 12</div><div class="w">⭐ 4,8</div><div class="w">🏆 3</div></div></div>`,
    base: `:where(.w){background:#fff;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:700;border:2px solid #d6dae6}`,
    resizable: true,
    css: `.dash {\n  \n}\n\n.grande {\n  \n}`,
    ghost: '.w',
    cmds: ['display: grid', 'repeat()', ['auto-fit', 'como auto-fill, pero estira las columnas si sobran huecos.'], 'minmax()', 'grid-auto-rows', 'grid-column', 'span'],
    rule: 'Se comprueba a 360px y a 640px.',
    hint: '`repeat(auto-fit, minmax(140px, 1fr))` y `grid-column: span 2`.',
    help: 'Con `auto-fit` las columnas vacías se pliegan y las existentes se reparten el espacio; con `auto-fill` las vacías se conservan.',
    solution: `.dash {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));\n  grid-auto-rows: 60px;\n  gap: 8px;\n}\n\n.grande {\n  grid-column: span 2;\n}`,
    why: 'El panel se reorganiza solo según el ancho.',
    success: 'Todo bajo control.',
    check: t => [360, 640].map(w => t.at(w, () => t.same('.w', `Los widgets encajan con la escena a ${w}px`)))
  });

  L({
    title: 'Portada épica',
    brief: 'Diseña la portada: fondo con degradado lineal de `#1f2433` a `#5B8CFF` (de arriba abajo), contenido **centrado** en ambos ejes y en columna, texto centrado y blanco, y un título fluido `clamp(20px, 8vw, 44px)`.',
    html: `<section class="hero"><h1 class="t">La Ciudadela</h1><p class="s">200 niveles. Un solo lenguaje.</p></section>`,
    base: `:where(.hero){height:100%;padding:16px;box-sizing:border-box;background:#ccc;color:#333}:where(.t){margin:0}:where(.s){margin:6px 0 0}`,
    resizable: true,
    css: `.hero {\n  \n}\n\n.t {\n  \n}`,
    ghost: '.t, .s',
    cmds: ['linear-gradient()', 'display: flex', 'flex-direction', 'justify-content', 'align-items', 'text-align', 'clamp()'],
    rule: 'Se comprueba a 240px y a 640px.',
    hint: 'Flex en columna con `justify-content: center` y `align-items: center`.',
    help: 'Las portadas suelen combinar degradado, centrado con flex y tipografía fluida.',
    solution: `.hero {\n  background: linear-gradient(#1f2433, #5B8CFF);\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  text-align: center;\n  color: white;\n}\n\n.t {\n  font-size: clamp(20px, 8vw, 44px);\n}`,
    why: 'Impacto visual con pocas propiedades.',
    success: 'Una entrada a la altura.',
    check: t => { const bg = t.v('.hero', 'background-image'); return [t.ok(/linear-gradient/.test(bg) && /rgb\(31, 36, 51\)[\s\S]*rgb\(91, 140, 255\)/.test(bg), 'El fondo es un degradado de #1f2433 a #5B8CFF'), t.color('.hero', 'color', 'white', 'El texto es blanco'), ...[240, 640].map(w => t.at(w, () => [t.same('.t', `El título encaja a ${w}px`), t.same('.s', `El subtítulo encaja a ${w}px`)])), t.at(240, () => t.px('.t', 'font-size', 20, 'A 240px el título mide 20px', 0.3)), t.at(640, () => t.px('.t', 'font-size', 44, 'A 640px el título mide 44px', 0.3))]; }
  });

  L({
    title: 'Pensar en todos',
    brief: 'Dos detalles de accesibilidad: los botones deben mostrar un contorno `3px solid #5B8CFF` con `2px` de separación cuando reciben el foco del teclado (`:focus-visible`); y, si el usuario prefiere **menos movimiento**, el indicador `.giro` no debe animarse.',
    html: `<div class="escena"><button class="boton">Jugar</button> <button class="boton">Opciones</button><div class="giro">⚙️</div></div>`,
    base: `@keyframes vuelta{to{transform:rotate(360deg)}}:where(.boton){border:0;border-radius:10px;padding:10px 16px;background:#1f2433;color:#fff;font-weight:700;margin:10px 4px;outline:none}:where(.giro){width:50px;height:50px;font-size:40px;margin:20px auto;animation:vuelta 2s linear infinite}`,
    sim: { target: '.boton', state: 'focus' },
    css: `.boton:focus-visible {\n  \n}\n\n@media (prefers-reduced-motion: reduce) {\n  \n}`,
    cmds: [':focus', 'outline', ['outline-offset', 'separación entre el contorno y el borde.'], '@media', 'animation'],
    hint: 'Dentro de la media query: `.giro { animation: none; }`.',
    help: '`:focus-visible` muestra el foco cuando se navega con teclado. `prefers-reduced-motion` respeta a quienes se marean con las animaciones.',
    solution: `.boton:focus-visible {\n  outline: 3px solid #5B8CFF;\n  outline-offset: 2px;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .giro {\n    animation: none;\n  }\n}`,
    why: 'Pequeños cambios que hacen el juego usable para más personas.',
    success: 'Accesibilidad: el mejor poder de CSS.',
    check: t => {
      let reduced = false;
      Array.from(t.doc.styleSheets).forEach(s => { try { Array.from(s.cssRules).forEach(r => { if (r.media && /prefers-reduced-motion:\s*reduce/.test(r.media.mediaText)) Array.from(r.cssRules).forEach(x => { if (x.selectorText && x.selectorText.includes('.giro') && /^(none|)$/.test(x.style.animationName || (x.style.animation === 'none' ? 'none' : 'x'))) reduced = true; }); }); } catch (e) {} });
      return [t.focus('.boton', () => [t.eq('.boton', 'outline-style', 'solid', 'Con foco, el contorno es continuo'), t.px('.boton', 'outline-width', 3, 'Con foco, el contorno mide 3px'), t.color('.boton', 'outline-color', '#5B8CFF', 'El contorno es #5B8CFF'), t.px('.boton', 'outline-offset', 2, 'Hay 2px de separación')]), t.ok(reduced, 'Con movimiento reducido, .giro no se anima')];
    }
  });

  L({
    title: 'La gran ciudadela',
    brief: 'Último reto. Monta la página: cabecera **pegajosa** arriba (`position: sticky`, `top: 0`, `z-index: 1`) con logo a la izquierda y botón a la derecha centrados en vertical; una rejilla de cartas con columnas de **al menos `100px`** (`auto-fill`) y `8px` de hueco; y cada carta con esquinas de `12px`. La página se desplaza dentro de `.web`.',
    html: `<div class="web"><header class="cab"><span class="logo">🏰 Ciudadela</span><button class="btn">Entrar</button></header><main class="rejilla">${['🐉', '🧙', '🗝️', '🛡️', '👑', '🏹', '🔮', '🗺️', '⚗️'].map(e => `<div class="carta">${e}</div>`).join('')}</main></div>`,
    base: `:where(.web){height:100%;overflow-y:auto;background:#F6F7FB}:where(.cab){background:#1f2433;color:#fff;padding:10px 12px;font-weight:800}:where(.btn){border:0;border-radius:8px;padding:6px 12px;background:#FFD447;font-weight:800}:where(.rejilla){padding:10px}:where(.carta){height:70px;background:#fff;border:2px solid #d6dae6;display:flex;align-items:center;justify-content:center;font-size:30px}`,
    resizable: true,
    css: `.cab {\n  \n}\n\n.rejilla {\n  \n}\n\n.carta {\n  \n}`,
    ghost: '.logo, .btn, .carta',
    cmds: ['position', 'top', 'z-index', 'display: flex', 'justify-content', 'align-items', 'display: grid', 'repeat()', 'auto-fill', 'minmax()', 'gap', 'border-radius'],
    rule: 'Se comprueba a 360px y a 600px, y desplazando la página.',
    hint: 'Tres reglas: la cabecera (sticky + flex), la rejilla (grid) y la carta (radio).',
    help: 'Este reto reúne posicionamiento, flexbox, grid y medidas adaptables: casi todo lo que has aprendido.',
    solution: `.cab {\n  position: sticky;\n  top: 0;\n  z-index: 1;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.rejilla {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));\n  gap: 8px;\n}\n\n.carta {\n  border-radius: 12px;\n}`,
    why: 'Una página real, construida con lo aprendido en los diez mundos.',
    success: '¡Has completado CSS Quest! Ya sabes construir interfaces reales con CSS.',
    check: t => {
      const sticky = (() => { const w = t.q('.web'), p = w.scrollTop; w.scrollTop = 80; const ok = t.near(t.rect('.cab').y, t.rect('.web').y, 1); w.scrollTop = p; return ok; })();
      return [...[360, 600].map(w => t.at(w, () => [t.same('.logo', `El logo está en su sitio a ${w}px`), t.same('.btn', `El botón está en su sitio a ${w}px`), t.same('.carta', `Las cartas encajan a ${w}px`)])), t.ok(sticky, 'Al desplazar, la cabecera sigue arriba'), t.ok(+t.v('.cab', 'z-index') >= 1, 'La cabecera tiene z-index 1 o más'), t.px('.carta', 'border-top-left-radius', 12, 'Las cartas tienen esquinas de 12px')];
    }
  });
})();
