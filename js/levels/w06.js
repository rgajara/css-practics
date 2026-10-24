/* Mundo 6 — Huerto: CSS Grid (niveles 101–120)
   Cada parcela debe ocupar su contorno discontinuo. */
(function () {
  const L = d => CQ.LV(6, d);
  const P = (e, c) => `<div class="parcela${c ? ' ' + c : ''}">${e}</div>`;
  const huerto = (items, cls) => `<div class="huerto${cls ? ' ' + cls : ''}">${items}</div>`;
  const n = (k, e) => Array.from({ length: k }, (_, i) => P((e || ['🌱', '🥕', '🌽', '🥬', '🍅', '🥔', '🧅', '🫑', '🍆'])[i % 9])).join('');
  const gridStart = `.huerto {\n  display: grid;\n  \n}`;

  L({
    title: 'Tres surcos',
    brief: 'Convierte el huerto en una **cuadrícula** de tres columnas de `100px`.',
    html: huerto(n(3)), css: `.huerto {\n  \n}`, ghost: '.parcela',
    cmds: ['display: grid', 'grid-template-columns'],
    hint: 'Necesitas `display: grid` y una lista de tres anchos en `grid-template-columns`.',
    help: '`grid-template-columns: 100px 100px 100px` crea tres columnas. Cada valor es el ancho de una columna.',
    solution: `.huerto {\n  display: grid;\n  grid-template-columns: 100px 100px 100px;\n}`,
    why: 'Tres valores, tres columnas.',
    success: 'Tu primera cuadrícula.',
    check: t => [t.same('.parcela', 'Cada parcela está en su sitio'), t.eq('.huerto', 'display', 'grid', 'El huerto es una cuadrícula')]
  });

  L({
    title: 'Fracciones de tierra',
    brief: 'Dos columnas: la segunda debe ser **el doble** de ancha que la primera, ocupando todo el huerto. Usa la unidad `fr`.',
    html: huerto(n(2)), css: gridStart, ghost: '.parcela',
    cmds: ['grid-template-columns', 'fr'],
    hint: '`1fr 2fr` divide el espacio en tres partes.',
    help: '`fr` es una fracción del espacio libre. `1fr 2fr` da una parte a la primera columna y dos a la segunda.',
    solution: `.huerto {\n  display: grid;\n  grid-template-columns: 1fr 2fr;\n}`,
    why: 'Las columnas se adaptan al ancho del huerto manteniendo la proporción.',
    success: 'Reparto proporcional.',
    check: t => [t.same('.parcela', 'Cada parcela está en su sitio')]
  });

  L({
    title: 'Repetir sin repetirse',
    brief: 'Ahora hacen falta **cuatro** columnas iguales. En lugar de escribir `1fr` cuatro veces, usa `repeat()`.',
    html: huerto(n(8)), css: gridStart, ghost: '.parcela',
    cmds: ['repeat()', 'fr'],
    rule: 'Usa repeat().',
    hint: '`repeat(veces, tamaño)`.',
    help: '`repeat(4, 1fr)` equivale a `1fr 1fr 1fr 1fr`. Es más corto y fácil de cambiar.',
    solution: `.huerto {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n}`,
    why: 'Cuatro columnas idénticas con una expresión corta.',
    success: 'Huerto en cuadrícula de cuatro.',
    check: t => [t.same('.parcela', 'Cada parcela está en su sitio'), t.uses(/repeat\(/, 'Usas repeat()')]
  });

  L({
    title: 'Filas a medida',
    brief: 'Además de las dos columnas iguales, define dos **filas**: la primera de `60px` y la segunda que ocupe el resto del alto.',
    html: huerto(n(4)), css: `.huerto {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  \n}`, ghost: '.parcela',
    cmds: ['grid-template-rows', 'fr'],
    hint: 'Funciona igual que las columnas, pero con alturas.',
    help: '`grid-template-rows` define el alto de cada fila. `1fr` toma el espacio vertical restante del contenedor.',
    solution: `.huerto {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  grid-template-rows: 60px 1fr;\n}`,
    why: 'La primera fila es fija y la segunda se estira.',
    success: 'Bancales a la medida.',
    check: t => [t.same('.parcela', 'Cada parcela está en su sitio')]
  });

  L({
    title: 'Senderos',
    brief: 'Deja senderos de `10px` entre todas las parcelas (filas y columnas).',
    html: huerto(n(6)), css: `.huerto {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  \n}`, ghost: '.parcela',
    cmds: ['gap'],
    hint: 'La misma propiedad que en flexbox.',
    help: '`gap` separa filas y columnas de la cuadrícula. Con un valor, ambos huecos son iguales.',
    solution: `.huerto {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 10px;\n}`,
    why: 'Los senderos se crean entre parcelas, no en los bordes.',
    success: 'Ya se puede pasear entre los cultivos.',
    check: t => [t.same('.parcela', 'Cada parcela está en su sitio')]
  });

  L({
    title: 'Senderos distintos',
    brief: 'Los senderos entre **filas** miden `20px` y los de entre **columnas**, `5px`.',
    html: huerto(n(6)), css: `.huerto {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  \n}`, ghost: '.parcela',
    cmds: ['row-gap', 'column-gap', 'gap'],
    hint: 'Usa dos propiedades, o `gap` con dos valores (primero filas, después columnas).',
    help: '`row-gap` separa filas y `column-gap` columnas. `gap: 20px 5px` hace lo mismo en una línea.',
    solution: `.huerto {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  row-gap: 20px;\n  column-gap: 5px;\n}`,
    why: 'Cada eje tiene su propio hueco.',
    success: 'Pasillos anchos y estrechos.',
    check: t => [t.same('.parcela', 'Cada parcela está en su sitio')]
  });

  L({
    title: 'La calabaza gigante',
    brief: 'La calabaza necesita **dos columnas** de ancho. Hazla ocupar dos con `span`.',
    html: huerto(P('🎃', 'calabaza v') + n(4)), css: `.huerto {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 8px;\n}\n\n.calabaza {\n  \n}`, ghost: '.parcela',
    cmds: ['grid-column', 'span'],
    hint: '`grid-column: span 2`.',
    help: '`span n` hace que un elemento ocupe n pistas desde su posición. Las demás parcelas se recolocan.',
    solution: `.huerto {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 8px;\n}\n\n.calabaza {\n  grid-column: span 2;\n}`,
    why: 'La calabaza abarca dos columnas y empuja a las demás.',
    success: 'Premio a la calabaza más grande.',
    check: t => [t.same('.parcela', 'Cada parcela está en su sitio')]
  });

  L({
    title: 'Entre líneas',
    brief: 'Las columnas están numeradas por **líneas**: la línea 1 es el borde izquierdo. Coloca la zanahoria desde la **línea 2 hasta la 4**.',
    html: huerto(P('🥕', 'zanahoria v') + n(3)), css: `.huerto {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 8px;\n}\n\n.zanahoria {\n  \n}`, ghost: '.parcela',
    cmds: ['grid-column'],
    hint: 'El formato es `grid-column: inicio / fin`.',
    help: 'Una cuadrícula de 3 columnas tiene 4 líneas verticales. `grid-column: 2 / 4` va de la línea 2 a la 4: ocupa las columnas 2 y 3.',
    solution: `.huerto {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 8px;\n}\n\n.zanahoria {\n  grid-column: 2 / 4;\n}`,
    why: 'Se cuentan líneas, no columnas.',
    success: 'Zanahorias bien alineadas.',
    check: t => [t.same('.parcela', 'Cada parcela está en su sitio')]
  });

  L({
    title: 'Girasol alto',
    brief: 'El girasol crece mucho: debe ocupar **dos filas**, de la línea 1 a la 3.',
    html: huerto(P('🌻', 'girasol v') + n(4)), css: `.huerto {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: repeat(2, 1fr);\n  gap: 8px;\n}\n\n.girasol {\n  \n}`, ghost: '.parcela',
    cmds: ['grid-row'],
    hint: 'Como `grid-column`, pero en vertical.',
    help: '`grid-row: 1 / 3` hace que el elemento ocupe de la línea horizontal 1 a la 3: dos filas.',
    solution: `.huerto {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: repeat(2, 1fr);\n  gap: 8px;\n}\n\n.girasol {\n  grid-row: 1 / 3;\n}`,
    why: 'El girasol abarca las dos filas de su columna.',
    success: '¡Qué altura!',
    check: t => [t.same('.parcela', 'Cada parcela está en su sitio')]
  });

  L({
    title: 'Plantar en su celda',
    brief: 'El tomate debe ir en la **columna 3, fila 2**, aunque esté primero en el HTML.',
    html: huerto(P('🍅', 'tomate v') + n(3)), css: `.huerto {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: repeat(2, 1fr);\n  gap: 8px;\n}\n\n.tomate {\n  \n}`, ghost: '.parcela',
    cmds: ['grid-column', 'grid-row'],
    hint: 'Con un solo número indicas la línea de inicio; ocupa una celda.',
    help: '`grid-column: 3` y `grid-row: 2` colocan el elemento en esa celda. Los demás rellenan los huecos libres en orden.',
    solution: `.huerto {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: repeat(2, 1fr);\n  gap: 8px;\n}\n\n.tomate {\n  grid-column: 3;\n  grid-row: 2;\n}`,
    why: 'Grid permite colocar elementos donde quieras, sin importar el orden del HTML.',
    success: 'Cada tomate en su sitio.',
    check: t => [t.same('.parcela', 'Cada parcela está en su sitio')]
  });

  L({
    title: 'Hilera completa',
    brief: 'La valla debe cruzar el huerto **de lado a lado**. Usa la línea `-1`, que siempre es la última.',
    html: huerto(n(3) + P('🪵', 'valla') + n(3)), css: `.huerto {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 8px;\n}\n\n.valla {\n  \n}`, ghost: '.parcela',
    cmds: ['grid-column'],
    hint: '`1 / -1` va de la primera a la última línea.',
    help: 'Los números negativos cuentan las líneas desde el final. `-1` es la última, así que `grid-column: 1 / -1` ocupa todas las columnas, sean cuantas sean.',
    solution: `.huerto {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 8px;\n}\n\n.valla {\n  grid-column: 1 / -1;\n}`,
    why: 'Funciona aunque cambie el número de columnas.',
    success: 'Valla instalada.',
    check: t => [t.same('.parcela', 'Cada parcela está en su sitio')]
  });

  L({
    title: 'Mapa con nombres',
    brief: 'Dibuja el plano del huerto con `grid-template-areas`: arriba un **invernadero** que ocupa dos columnas; abajo, el **pozo** y el **compost**. Asigna cada parcela a su zona con `grid-area`.',
    html: huerto(P('🏡', 'inv v') + P('🪣', 'pozo') + P('♻️', 'compost')),
    css: `.huerto {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 8px;\n  grid-template-areas:\n    "invernadero invernadero"\n    "pozo compost";\n}\n\n.inv {\n  \n}\n\n.pozo {\n  \n}\n\n.compost {\n  \n}`,
    ghost: '.parcela',
    cmds: ['grid-template-areas', 'grid-area'],
    hint: 'Cada parcela necesita `grid-area` con el nombre de su zona, sin comillas.',
    help: '`grid-template-areas` dibuja la cuadrícula con texto: cada cadena es una fila y cada palabra una celda. Repetir un nombre lo extiende.',
    solution: `.huerto {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 8px;\n  grid-template-areas:\n    "invernadero invernadero"\n    "pozo compost";\n}\n\n.inv {\n  grid-area: invernadero;\n}\n\n.pozo {\n  grid-area: pozo;\n}\n\n.compost {\n  grid-area: compost;\n}`,
    why: 'El plano en texto se parece al resultado visual.',
    success: 'Un plano que se lee de un vistazo.',
    check: t => [t.same('.parcela', 'Cada parcela está en su zona')]
  });

  L({
    title: 'Plantas centradas',
    brief: 'Las parcelas se estiran por toda la celda. Haz que queden **centradas en horizontal** dentro de su celda, con su ancho natural.',
    html: huerto(n(6)), base: `:where(.parcela){min-width:56px}`,
    css: `.huerto {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 8px;\n  \n}`, ghost: '.parcela',
    cmds: ['justify-items'],
    hint: '`justify-items` alinea el contenido de las celdas en horizontal.',
    help: 'En grid, `justify-items` alinea cada elemento dentro de su celda en el eje de las filas (horizontal). Por defecto es `stretch`.',
    solution: `.huerto {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 8px;\n  justify-items: center;\n}`,
    why: 'Cada parcela vuelve a su ancho natural y se centra en su celda.',
    success: 'Orden y simetría.',
    check: t => [t.same('.parcela', 'Cada parcela está en su sitio')]
  });

  L({
    title: 'Centrado en dos ejes',
    brief: 'Centra cada parcela **en horizontal y en vertical** dentro de su celda con una sola propiedad.',
    html: huerto(n(4)), base: `:where(.parcela){min-width:56px;min-height:56px}`,
    css: `.huerto {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  grid-template-rows: 1fr 1fr;\n  \n}`, ghost: '.parcela',
    cmds: ['place-items', 'align-items', 'justify-items'],
    hint: 'Hay un atajo que combina `align-items` y `justify-items`.',
    help: '`place-items: center` equivale a `align-items: center; justify-items: center;`.',
    solution: `.huerto {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  grid-template-rows: 1fr 1fr;\n  place-items: center;\n}`,
    why: 'Un atajo, dos alineaciones.',
    success: 'Cada planta en el corazón de su parcela.',
    check: t => [t.same('.parcela', 'Cada parcela está centrada en su celda')]
  });

  L({
    title: 'El espantapájaros',
    brief: 'Todas las parcelas llenan su celda, pero el espantapájaros debe quedarse en la esquina **inferior derecha** de la suya.',
    html: huerto(n(2) + P('🧑‍🌾', 'esp v') + n(1)), base: `:where(.parcela){min-width:56px;min-height:56px}`,
    css: `.huerto {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  grid-template-rows: 1fr 1fr;\n  gap: 8px;\n}\n\n.esp {\n  \n}`, ghost: '.parcela',
    cmds: ['justify-self', 'align-self'],
    hint: 'Las versiones «-self» alinean un solo elemento.',
    help: '`justify-self` alinea un elemento en horizontal dentro de su celda y `align-self`, en vertical.',
    solution: `.huerto {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  grid-template-rows: 1fr 1fr;\n  gap: 8px;\n}\n\n.esp {\n  justify-self: end;\n  align-self: end;\n}`,
    why: 'Solo el espantapájaros cambia; el resto sigue estirado.',
    success: 'Los cuervos ya no se acercan.',
    check: t => [t.same('.parcela', 'Cada parcela está en su sitio')]
  });

  L({
    title: 'Tantas como quepan',
    brief: 'Crea tantas columnas como quepan, cada una de **al menos `80px`**, que se estiren para llenar el ancho. Debe funcionar en cualquier tamaño.',
    html: huerto(n(9)), css: `.huerto {\n  display: grid;\n  gap: 8px;\n  \n}`, ghost: '.parcela',
    resizable: true,
    cmds: ['repeat()', 'auto-fill', 'minmax()'],
    rule: 'Se comprueba con la escena a 300px y a 600px. Mueve el control de ancho para verlo.',
    hint: '`repeat(auto-fill, minmax(80px, 1fr))`.',
    help: '`auto-fill` crea tantas columnas como quepan; `minmax(80px, 1fr)` hace que midan al menos 80px y se repartan el sobrante.',
    solution: `.huerto {\n  display: grid;\n  gap: 8px;\n  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));\n}`,
    why: 'Una cuadrícula adaptable sin media queries.',
    success: 'Un huerto que se adapta al terreno.',
    check: t => [300, 600].map(w => t.at(w, () => t.same('.parcela', `Las parcelas encajan con la escena a ${w}px`)))
  });

  L({
    title: 'Filas automáticas',
    brief: 'Solo hay columnas definidas; las filas se crean solas y miden lo que su contenido. Haz que todas las filas automáticas midan `60px`.',
    html: huerto(n(7)), css: `.huerto {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 6px;\n  \n}`, ghost: '.parcela',
    cmds: ['grid-auto-rows', 'grid-template-rows'],
    hint: 'Las filas que no defines son «automáticas».',
    help: '`grid-auto-rows` da tamaño a las filas que la cuadrícula crea por sí sola cuando hay más elementos que celdas definidas.',
    solution: `.huerto {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 6px;\n  grid-auto-rows: 60px;\n}`,
    why: 'Da igual cuántas filas haya: todas miden 60px.',
    success: 'Bancales regulares.',
    check: t => [t.same('.parcela', 'Cada parcela está en su sitio')]
  });

  L({
    title: 'Plantar por columnas',
    brief: 'El huerto tiene **tres filas** definidas. Haz que las parcelas se coloquen **columna a columna** (de arriba abajo) en lugar de fila a fila.',
    html: huerto(n(7)), css: `.huerto {\n  display: grid;\n  grid-template-rows: repeat(3, 1fr);\n  gap: 6px;\n  \n}`, ghost: '.parcela',
    cmds: ['grid-auto-flow', 'grid-auto-columns'],
    hint: 'La propiedad que decide el sentido de colocación es `grid-auto-flow`.',
    help: 'Con `grid-auto-flow: column`, los elementos llenan cada columna antes de pasar a la siguiente, creando columnas nuevas si hace falta.',
    solution: `.huerto {\n  display: grid;\n  grid-template-rows: repeat(3, 1fr);\n  gap: 6px;\n  grid-auto-flow: column;\n}`,
    why: 'El flujo automático ahora va por columnas.',
    success: 'Siembra vertical completada.',
    check: t => [t.same('.parcela', 'Cada parcela está en su sitio')]
  });

  L({
    title: 'Dos en una celda',
    brief: 'El cuervo debe posarse **sobre** el girasol: los dos en la celda de la **fila 1, columna 2**, con el cuervo delante.',
    html: huerto(n(3) + P('🌻', 'gira v') + P('🐦‍⬛', 'cuervo')), base: `:where(.cuervo){background:transparent;border-color:transparent;font-size:30px}`,
    css: `.huerto {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: 1fr 1fr;\n  gap: 8px;\n}\n\n.gira {\n  \n}\n\n.cuervo {\n  \n}`, ghost: '.parcela',
    cmds: ['grid-area', 'grid-row', 'grid-column', 'z-index'],
    hint: 'Pon a los dos en la misma celda. Los elementos de grid aceptan `z-index` sin necesidad de `position`.',
    help: 'Varios elementos pueden compartir celda en grid. Se solapan y `z-index` decide cuál queda delante.',
    solution: `.huerto {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: 1fr 1fr;\n  gap: 8px;\n}\n\n.gira {\n  grid-area: 1 / 2;\n}\n\n.cuervo {\n  grid-area: 1 / 2;\n  z-index: 1;\n}`,
    why: '`grid-area: 1 / 2` significa fila 1, columna 2.',
    success: 'Un cuervo con buenas vistas.',
    check: t => [t.same('.parcela', 'Cada parcela está en su sitio'), t.front('.cuervo', 'El cuervo está delante del girasol')]
  });

  L({
    title: 'El huerto comunitario',
    brief: 'Reto del mundo. Monta el plano: cabecera de lado a lado, a la izquierda una columna de herramientas de `80px` que ocupa dos filas, y a la derecha cuatro parcelas en dos columnas. Huecos de `8px`.',
    html: huerto(P('🏷️ Huerto vecinal', 'cab') + P('🧰', 'herr') + n(4)),
    base: `:where(.cab){font-size:16px;font-weight:800}`,
    css: `.huerto {\n  \n}\n\n.cab {\n  \n}\n\n.herr {\n  \n}`, ghost: '.parcela',
    cmds: ['display: grid', 'grid-template-columns', 'grid-template-rows', 'grid-column', 'grid-row', 'gap'],
    hint: 'Columnas `80px 1fr 1fr` y filas `50px 1fr 1fr`. La cabecera va de `1 / -1` y las herramientas ocupan dos filas.',
    help: 'Combina pistas fijas y flexibles, líneas negativas y `span`.',
    solution: `.huerto {\n  display: grid;\n  grid-template-columns: 80px 1fr 1fr;\n  grid-template-rows: 50px 1fr 1fr;\n  gap: 8px;\n}\n\n.cab {\n  grid-column: 1 / -1;\n}\n\n.herr {\n  grid-row: span 2;\n}`,
    why: 'Las parcelas restantes rellenan solas las celdas libres.',
    success: '¡Mundo 6 completado! Ya diseñas cuadrículas como un arquitecto.',
    check: t => [t.same('.cab', 'La cabecera cruza todo el huerto'), t.same('.herr', 'Las herramientas ocupan dos filas a la izquierda'), t.same('.parcela:not(.cab):not(.herr)', 'Las cuatro parcelas están en su sitio')]
  });
})();
