/* Mundo 8 — Galería de robots: selectores y pseudoclases (niveles 141–160)
   Los robots no tienen clases únicas: hay que elegirlos con selectores. */
(function () {
  const L = d => CQ.LV(8, d);
  const OFF = '#d6d3e3';
  const R = (e, attrs) => `<div class="robot"${attrs || ''}>${e || '🤖'}</div>`;
  const row = (k, e) => Array.from({ length: k }, () => R(e)).join('');
  // Comprueba que exactamente los robots indicados (por índice) tienen el color
  const pick = (t, sel, idx, color, label, prop) => {
    prop = prop || 'background-color';
    const all = t.qa(sel), want = t.norm(prop, color), off = t.norm(prop, OFF);
    const ok = all.every((el, i) => {
      const v = t.win.getComputedStyle(el).getPropertyValue(prop);
      return idx.includes(i) ? t.colorEq(v, want) : t.colorEq(v, off);
    });
    return t.ok(ok, label);
  };

  L({
    title: 'Solo los de la vitrina',
    brief: 'Ilumina en `gold` solo los robots que están **dentro de la vitrina**. Los de fuera no cambian.',
    html: `<div class="escena">${row(2)}<div class="vitrina">${row(3)}</div>${row(1)}</div>`,
    base: `:where(.vitrina){padding:8px;margin:8px 0;border:3px solid #B07CFF;border-radius:12px}`,
    css: `/* Selector descendiente */\n`,
    cmds: ['a b', 'background-color'],
    hint: 'Escribe el contenedor, un espacio y lo que buscas dentro.',
    help: 'Un espacio entre selectores (`.vitrina .robot`) significa «robot que esté en algún lugar dentro de la vitrina».',
    solution: `.vitrina .robot {\n  background-color: gold;\n}`,
    why: 'El selector descendiente solo encuentra robots dentro de `.vitrina`.',
    success: 'La vitrina brilla.',
    check: t => [pick(t, '.robot', [2, 3, 4], 'gold', 'Solo los tres robots de la vitrina son dorados')]
  });

  L({
    title: 'Hijos directos',
    brief: 'En la estantería hay robots sueltos y otros dentro de cajas. Pinta de `skyblue` solo los robots que son **hijos directos** de la estantería.',
    html: `<div class="escena"><div class="estante">${R('🤖')}<div class="caja">${R('📦')}${R('📦')}</div>${R('🤖')}</div></div>`,
    base: `:where(.estante){padding:8px;border-bottom:6px solid #8a7da8}:where(.caja){display:inline-block;padding:4px;margin:0 6px;background:#efe2c5;border-radius:10px;vertical-align:middle}`,
    css: `/* Selector de hijo */\n`,
    cmds: ['a > b', 'a b'],
    hint: 'El símbolo `>` limita la búsqueda a un nivel.',
    help: '`.estante > .robot` solo encuentra robots que estén inmediatamente dentro de `.estante`, no los nietos.',
    solution: `.estante > .robot {\n  background-color: skyblue;\n}`,
    why: 'Los robots dentro de `.caja` son nietos, no hijos.',
    success: 'Los sueltos, identificados.',
    check: t => [pick(t, '.robot', [0, 3], 'skyblue', 'Solo los dos robots sueltos son skyblue')]
  });

  L({
    title: 'Justo detrás del líder',
    brief: 'Pinta de `orange` solo el robot que va **inmediatamente después** del líder 👑.',
    html: `<div class="escena">${row(2)}<div class="robot lider">👑</div>${row(3)}</div>`,
    base: `:where(.lider){background:#B07CFF}`,
    css: `/* Selector de hermano adyacente */\n`,
    cmds: ['a + b'],
    hint: '`+` une dos hermanos seguidos.',
    help: '`.lider + .robot` elige el `.robot` que está justo después de `.lider`, al mismo nivel.',
    solution: `.lider + .robot {\n  background-color: orange;\n}`,
    why: 'Solo hay un hermano inmediatamente siguiente.',
    success: 'El escolta del líder.',
    check: t => [pick(t, '.robot:not(.lider)', [2], 'orange', 'Solo el robot de detrás del líder es naranja')]
  });

  L({
    title: 'Toda la cola',
    brief: 'Ahora pinta de `orange` **todos** los robots que van después del líder, pero no los de delante.',
    html: `<div class="escena">${row(2)}<div class="robot lider">👑</div>${row(3)}</div>`,
    base: `:where(.lider){background:#B07CFF}`,
    css: `/* Selector de hermanos generales */\n`,
    cmds: ['a ~ b', 'a + b'],
    hint: '`~` es como `+`, pero sin exigir que estén seguidos.',
    help: '`.lider ~ .robot` elige todos los hermanos `.robot` que aparecen después de `.lider`.',
    solution: `.lider ~ .robot {\n  background-color: orange;\n}`,
    why: 'Todos los hermanos siguientes, estén donde estén.',
    success: 'La cola entera, en formación.',
    check: t => [pick(t, '.robot:not(.lider)', [2, 3, 4], 'orange', 'Los tres robots tras el líder son naranjas; los dos primeros no')]
  });

  L({
    title: 'Robots voladores',
    brief: 'Cada robot tiene un atributo `data-tipo`. Pinta de `lightgreen` los que tienen `data-tipo="volador"`.',
    html: `<div class="escena">${R('🚁', ' data-tipo="volador"')}${R('🚜', ' data-tipo="terrestre"')}${R('🛸', ' data-tipo="volador"')}${R('🚤', ' data-tipo="acuatico"')}${R('🚀', ' data-tipo="volador"')}</div>`,
    css: `/* Selector de atributo */\n`,
    cmds: ['[atributo="valor"]'],
    hint: 'Los selectores de atributo van entre corchetes.',
    help: '`[data-tipo="volador"]` elige los elementos cuyo atributo `data-tipo` vale exactamente `volador`.',
    solution: `[data-tipo="volador"] {\n  background-color: lightgreen;\n}`,
    why: 'Se selecciona por un dato, no por una clase.',
    success: 'Escuadrilla aérea lista.',
    check: t => [pick(t, '.robot', [0, 2, 4], 'lightgreen', 'Los tres voladores son verdes y los demás no')]
  });

  L({
    title: 'Manuales en PDF',
    brief: 'Marca en rojo (`color: crimson`) los manuales cuyo archivo **termina** en `.pdf`.',
    html: `<div class="escena"><ul class="docs"><li data-archivo="motor.pdf">Motor</li><li data-archivo="brazo.txt">Brazo</li><li data-archivo="sensor.pdf">Sensor</li><li data-archivo="pdf-guia.doc">Guía</li><li data-archivo="bateria.pdf">Batería</li></ul></div>`,
    base: `:where(.docs li){padding:6px 10px;margin-bottom:4px;background:#fff;border-radius:8px;font-weight:700;color:#3b3552}`,
    css: `/* Atributo que termina en… */\n`,
    cmds: ['[atributo$="fin"]', '[atributo^="inicio"]', 'color'],
    hint: '`$=` significa «termina en».',
    help: 'Existen variantes: `^=` empieza por, `$=` termina en y `*=` contiene.',
    solution: `[data-archivo$=".pdf"] {\n  color: crimson;\n}`,
    why: '«pdf-guia.doc» contiene «pdf», pero no termina en «.pdf».',
    success: 'Documentación localizada.',
    check: t => { const li = t.qa('.docs li'), red = t.norm('color', 'crimson'); return [t.ok(li.every((el, i) => t.colorEq(t.win.getComputedStyle(el).color, red) === [0, 2, 4].includes(i)), 'Solo los .pdf están en crimson')]; }
  });

  L({
    title: 'Batalla de especificidad',
    brief: 'El robot estrella debería ser dorado, pero una regla fija de la galería (`#sala .robot`) le pone fondo gris y gana. Escribe un selector **más específico** para que el robot `.estrella` sea `gold`. No uses `!important`.',
    html: `<div class="escena" id="sala">${row(2)}<div class="robot estrella">⭐</div>${row(2)}</div>`,
    base: `#sala .robot{background-color:#999}`,
    css: `.estrella {\n  background-color: gold;\n}`,
    cmds: ['especificidad', '#id', '.clase'],
    rule: 'No uses !important.',
    hint: 'Copia el selector que gana y añádele algo más: por ejemplo, la clase `.estrella`.',
    help: 'La especificidad se cuenta en (ids, clases, etiquetas). `#sala .robot` es (1,1,0); `.estrella` solo (0,1,0). `#sala .estrella` empata y gana por ir después; `#sala .robot.estrella` es (1,2,0).',
    solution: `#sala .robot.estrella {\n  background-color: gold;\n}`,
    why: 'Con un id y dos clases, tu selector pesa más.',
    success: 'Ya sabes por qué a veces una regla «no funciona».',
    check: t => [t.color('.estrella', 'background-color', 'gold', 'El robot estrella es dorado'), t.color('.robot:not(.estrella)', 'background-color', '#999', 'Los demás siguen grises'), t.avoid(/!important/, 'No usas !important')]
  });

  L({
    title: 'Contra el estilo en línea',
    brief: 'La alarma tiene un estilo escrito **en el propio HTML** (`style="background-color: #999"`), y eso gana a cualquier selector. Haz que su fondo sea `red`.',
    html: `<div class="escena">${row(2)}<div class="robot alarma" style="background-color:#999">🚨</div>${row(2)}</div>`,
    css: `.alarma {\n  background-color: red;\n}`,
    cmds: ['!important', 'especificidad'],
    hint: 'Solo hay una forma de ganar a un estilo en línea desde una hoja de estilos.',
    help: '`!important` coloca una declaración por encima de las normales, incluidos los estilos en línea. Úsalo solo cuando no puedas cambiar el HTML.',
    solution: `.alarma {\n  background-color: red !important;\n}`,
    why: 'Las declaraciones importantes ganan a los estilos en línea normales.',
    success: 'Alarma activada. Y ahora sabes por qué conviene evitar `!important`.',
    check: t => [t.color('.alarma', 'background-color', 'red', 'La alarma es roja')]
  });

  L({
    title: 'El primero de la fila',
    brief: 'Pinta de `gold` el **primer** robot de la fila, sin usar clases.',
    html: `<div class="escena"><div class="fila">${row(5)}</div></div>`,
    css: `/* :first-child */\n`,
    cmds: [':first-child'],
    hint: 'Las pseudoclases se escriben con dos puntos pegados al selector.',
    help: '`.robot:first-child` elige el robot que es el primer hijo de su padre.',
    solution: `.robot:first-child {\n  background-color: gold;\n}`,
    why: 'Se elige por su posición, no por un nombre.',
    success: 'El pionero, distinguido.',
    check: t => [pick(t, '.robot', [0], 'gold', 'Solo el primer robot es dorado')]
  });

  L({
    title: 'El último de la fila',
    brief: 'Ahora el **último** robot de la fila debe ser `tomato`.',
    html: `<div class="escena"><div class="fila">${row(5)}</div></div>`,
    css: ``,
    cmds: [':last-child', ':first-child'],
    hint: 'Hay una pseudoclase gemela de `:first-child`.',
    help: '`:last-child` elige el último hijo de su padre. Si añadieras otro robot, el color pasaría al nuevo.',
    solution: `.robot:last-child {\n  background-color: tomato;\n}`,
    why: 'Funciona aunque cambie el número de robots.',
    success: 'Cierra la fila con estilo.',
    check: t => [pick(t, '.robot', [4], 'tomato', 'Solo el último robot es tomato')]
  });

  L({
    title: 'El segundo',
    brief: 'Pinta de `skyblue` el **segundo** robot con `:nth-child()`.',
    html: `<div class="escena"><div class="fila">${row(5)}</div></div>`,
    css: ``,
    cmds: [':nth-child()'],
    hint: 'Dentro del paréntesis va la posición, empezando en 1.',
    help: '`:nth-child(2)` elige el hijo que ocupa la posición 2.',
    solution: `.robot:nth-child(2) {\n  background-color: skyblue;\n}`,
    why: 'Las posiciones empiezan a contar en 1.',
    success: 'Puesto dos, localizado.',
    check: t => [pick(t, '.robot', [1], 'skyblue', 'Solo el segundo robot es skyblue')]
  });

  L({
    title: 'Fila de cebra',
    brief: 'Pinta de `plum` los robots en posición **impar** (1.º, 3.º, 5.º…).',
    html: `<div class="escena"><div class="fila">${row(8)}</div></div>`,
    css: ``,
    cmds: [':nth-child()'],
    hint: '`:nth-child()` acepta las palabras `odd` (impar) y `even` (par).',
    help: '`:nth-child(odd)` equivale a `:nth-child(2n + 1)`: posiciones 1, 3, 5…',
    solution: `.robot:nth-child(odd) {\n  background-color: plum;\n}`,
    why: 'Un patrón alterno sin añadir clases.',
    success: 'Rayado perfecto.',
    check: t => [pick(t, '.robot', [0, 2, 4, 6], 'plum', 'Los robots impares son plum y los pares no')]
  });

  L({
    title: 'Cada tres',
    brief: 'Pinta de `gold` un robot de **cada tres**: el 3.º, el 6.º y el 9.º.',
    html: `<div class="escena"><div class="fila">${row(10)}</div></div>`,
    css: ``,
    cmds: [':nth-child()'],
    hint: 'Usa una fórmula con `n`.',
    help: 'En `:nth-child(3n)`, `n` toma los valores 0, 1, 2… así que elige las posiciones 3, 6, 9…',
    solution: `.robot:nth-child(3n) {\n  background-color: gold;\n}`,
    why: '3 × 1, 3 × 2, 3 × 3…',
    success: 'Matemáticas al servicio del estilo.',
    check: t => [pick(t, '.robot', [2, 5, 8], 'gold', 'Los robots 3, 6 y 9 son dorados y el resto no')]
  });

  L({
    title: 'Todos menos los apagados',
    brief: 'Enciende en `lightgreen` todos los robots **excepto** los que tienen la clase `apagado`.',
    html: `<div class="escena"><div class="fila">${R()}${R('💤').replace('robot', 'robot apagado')}${R()}${R()}${R('💤').replace('robot', 'robot apagado')}${R()}</div></div>`,
    css: ``,
    cmds: [':not()'],
    hint: 'Dentro de `:not()` va el selector que quieres excluir.',
    help: '`.robot:not(.apagado)` elige los robots que **no** tienen la clase `apagado`.',
    solution: `.robot:not(.apagado) {\n  background-color: lightgreen;\n}`,
    why: 'Se excluyen los apagados sin tocar a los demás.',
    success: 'Galería en marcha.',
    check: t => [pick(t, '.robot', [0, 2, 3, 5], 'lightgreen', 'Los robots encendidos son verdes y los apagados no')]
  });

  L({
    title: 'Botón que reacciona',
    brief: 'Cuando el puntero pase por encima del botón, su fondo debe cambiar a `#B07CFF`. En el móvil, usa el botón **Simular :hover** del escenario para verlo.',
    html: `<div class="escena"><button class="boton">Activar robot</button></div>`,
    base: `:where(.boton){display:block;margin:80px auto 0;padding:14px 22px;border:0;border-radius:12px;background:#3b3552;color:#fff;font-weight:700;font-size:18px}`,
    sim: { target: '.boton', state: 'hover' },
    css: `.boton {\n  cursor: pointer;\n}\n`,
    cmds: [':hover', 'background-color', 'cursor'],
    hint: 'Crea una regla nueva con el selector `.boton:hover`.',
    help: '`:hover` se activa cuando el puntero está sobre el elemento. En pantallas táctiles suele activarse al tocar.',
    solution: `.boton {\n  cursor: pointer;\n}\n\n.boton:hover {\n  background-color: #B07CFF;\n}`,
    why: 'La regla solo se aplica mientras dura el estado.',
    success: 'Tu interfaz ya responde al usuario.',
    check: t => [t.color('.boton', 'background-color', '#3b3552', 'Sin hover, el botón sigue oscuro'), t.hover('.boton', () => t.color('.boton', 'background-color', '#B07CFF', 'Con hover, el fondo es #B07CFF'))]
  });

  L({
    title: 'Campo activo',
    brief: 'Cuando el campo de texto esté **activo** (con el foco), su borde debe ser `#B07CFF`. Pruébalo con **Simular :focus**.',
    html: `<div class="escena"><label class="lbl">Nombre del robot<input class="campo" type="text" placeholder="R2-D2"></label></div>`,
    base: `:where(.lbl){display:block;font-weight:700;margin-top:60px}:where(.campo){display:block;width:100%;box-sizing:border-box;margin-top:6px;padding:10px;font-size:16px;border:3px solid #c9c4dc;border-radius:10px;outline:none}`,
    sim: { target: '.campo', state: 'focus' },
    css: `.campo {\n  \n}\n`,
    cmds: [':focus', 'border-color', 'outline'],
    hint: 'La pseudoclase del foco es `:focus`.',
    help: '`:focus` se aplica al elemento que recibe el teclado. Un buen estilo de foco es clave para la accesibilidad.',
    solution: `.campo:focus {\n  border-color: #B07CFF;\n}`,
    why: 'El borde avisa de dónde se está escribiendo.',
    success: 'Foco visible: accesibilidad mejorada.',
    check: t => [t.color('.campo', 'border-top-color', '#c9c4dc', 'Sin foco, el borde no cambia'), t.focus('.campo', () => t.color('.campo', 'border-top-color', '#B07CFF', 'Con foco, el borde es #B07CFF'))]
  });

  L({
    title: 'Estrella delante',
    brief: 'Añade una estrella `★ ` **antes** del texto de cada título, sin tocar el HTML.',
    html: `<div class="escena"><h3 class="titulo">Robot del mes</h3><h3 class="titulo">Nuevo modelo</h3></div>`,
    base: `:where(.titulo){margin:10px 0;font-size:22px}`,
    css: `.titulo::before {\n  \n}`,
    cmds: ['::before', 'content', 'color'],
    hint: 'Los pseudoelementos `::before` y `::after` necesitan la propiedad `content`.',
    help: '`::before` crea un elemento falso al principio del contenido. Sin `content` no aparece. Úsalo para adornos, no para información importante.',
    solution: `.titulo::before {\n  content: "★ ";\n}`,
    why: 'El texto de `content` se dibuja, pero no forma parte del HTML.',
    success: 'Títulos con brillo.',
    check: t => [t.ok(/★/.test(t.v('.titulo', 'content', '::before')), 'Cada título empieza con ★')]
  });

  L({
    title: 'Etiqueta de nuevo',
    brief: 'Después del nombre del robot nuevo añade el texto `NUEVO` con `::after`, en color `crimson` y con `8px` de margen izquierdo.',
    html: `<div class="escena"><p class="nombre">Robot X-9</p></div>`,
    base: `:where(.nombre){font-size:24px;font-weight:800;margin-top:60px}`,
    css: `.nombre::after {\n  \n}`,
    cmds: ['::after', 'content', 'color', 'margin-left'],
    hint: 'Las demás propiedades se aplican al pseudoelemento como a cualquier elemento.',
    help: '`::after` se coloca al final del contenido. Puedes darle color, márgenes, fondo o tamaño.',
    solution: `.nombre::after {\n  content: "NUEVO";\n  color: crimson;\n  margin-left: 8px;\n}`,
    why: 'Un adorno completo sin añadir HTML.',
    success: 'Recién salido de fábrica.',
    check: t => [t.ok(/NUEVO/.test(t.v('.nombre', 'content', '::after')), 'Aparece el texto NUEVO al final'), t.ok(t.colorEq(t.v('.nombre', 'color', '::after'), t.norm('color', 'crimson')), 'NUEVO está en crimson'), t.ok(t.near(t.n('.nombre', 'margin-left', '::after'), 8), 'Tiene 8px de margen izquierdo')]
  });

  L({
    title: 'Letra capital',
    brief: 'Haz que la **primera letra** del párrafo mida `2em` y sea de color `#B07CFF`.',
    html: `<div class="escena"><p class="intro">Había una vez un robot que coleccionaba tornillos de todos los colores.</p></div>`,
    base: `:where(.intro){font-size:17px}`,
    css: ``,
    cmds: ['::first-letter', 'font-size', 'color'],
    hint: 'El pseudoelemento se llama `::first-letter`.',
    help: '`::first-letter` selecciona la primera letra de un bloque de texto. Se usa para letras capitales de estilo libro.',
    solution: `.intro::first-letter {\n  font-size: 2em;\n  color: #B07CFF;\n}`,
    why: '2em de 17px son 34px.',
    success: 'Un comienzo de cuento.',
    check: t => [t.ok(t.near(t.n('.intro', 'font-size', '::first-letter'), 34, 0.3), 'La primera letra mide 2em (34px)'), t.ok(t.colorEq(t.v('.intro', 'color', '::first-letter'), t.norm('color', '#B07CFF')), 'La primera letra es #B07CFF')]
  });

  L({
    title: 'Inspección final',
    brief: 'Reto del mundo. En la lista de robots: los **pares** con fondo `#ece8f7`; todos menos el último con `border-bottom: 1px solid #c9c4dc`; los que tienen `data-estado="error"` con texto `crimson`; y antes de cada nombre, el símbolo `› ` con `::before`.',
    html: `<div class="escena"><ul class="lista"><li>Atlas</li><li data-estado="error">Bolt</li><li>Cogs</li><li>Dyna</li><li data-estado="error">Echo</li><li>Flux</li></ul></div>`,
    base: `:where(.lista){background:#fff;border-radius:12px;overflow:hidden}:where(.lista li){padding:6px 12px;font-weight:700;color:#3b3552}`,
    css: ``,
    cmds: [':nth-child()', ':not()', ':last-child', '[atributo="valor"]', '::before', 'content'],
    hint: 'Necesitas cuatro reglas. Para el borde: `li:not(:last-child)`.',
    help: 'Este reto combina pseudoclases, atributos y pseudoelementos.',
    solution: `.lista li:nth-child(even) {\n  background-color: #ece8f7;\n}\n\n.lista li:not(:last-child) {\n  border-bottom: 1px solid #c9c4dc;\n}\n\n[data-estado="error"] {\n  color: crimson;\n}\n\n.lista li::before {\n  content: "› ";\n}`,
    why: 'Cuatro selectores distintos, sin una sola clase nueva.',
    success: '¡Mundo 8 completado! Ya eliges cualquier elemento con precisión.',
    check: t => {
      const li = t.qa('.lista li'), cs = el => t.win.getComputedStyle(el);
      const even = t.norm('background-color', '#ece8f7'), red = t.norm('color', 'crimson');
      return [
        t.ok(li.every((el, i) => t.colorEq(cs(el).backgroundColor, even) === (i % 2 === 1)), 'Los pares tienen fondo #ece8f7'),
        t.ok(li.every((el, i) => (parseFloat(cs(el).borderBottomWidth) === 1) === (i < li.length - 1)), 'Todos menos el último tienen borde inferior de 1px'),
        t.ok(li.every(el => t.colorEq(cs(el).color, red) === (el.getAttribute('data-estado') === 'error')), 'Los robots con error están en crimson'),
        t.ok(li.every(el => /›/.test(t.win.getComputedStyle(el, '::before').content)), 'Cada nombre empieza con ›')
      ];
    }
  });
})();
