/* Mundo 1 — Taller de pintura: fundamentos de CSS (niveles 1–20) */
(function () {
  const L = d => CQ.LV(1, d);

  L({
    title: 'El botón perdido',
    brief: 'Bienvenido al taller. Cada regla CSS tiene un **selector** y, entre llaves, **propiedad: valor;**.\n\nEl botón de inicio perdió su pintura. Dale un fondo dorado con `background-color: gold;`',
    html: `<div class="escena"><button class="boton">Inicio</button></div>`,
    base: `:where(.escena){display:flex;align-items:center;justify-content:center}`,
    css: `.boton {\n  \n}`,
    cmds: ['background-color', 'color', 'border'],
    hint: 'Escribe la propiedad dentro de las llaves, en la línea vacía. No olvides los dos puntos y el punto y coma.',
    help: 'Una declaración CSS tiene la forma `propiedad: valor;`. La propiedad dice qué cambiar y el valor, cómo. `gold` es un nombre de color que el navegador entiende.',
    solution: `.boton {\n  background-color: gold;\n}`,
    why: 'El selector `.boton` elige el botón y `background-color: gold;` pinta su fondo.',
    success: '¡El botón brilla otra vez!',
    check: t => [t.color('.boton', 'background-color', 'gold', 'El botón tiene fondo dorado (gold)')]
  });

  L({
    title: 'Letras invisibles',
    brief: 'El cartel tiene el texto casi del mismo color que el fondo y no se lee. Cambia el **color del texto** a blanco.',
    html: `<div class="escena"><div class="cartel">ABIERTO</div></div>`,
    base: `:where(.escena){display:flex;align-items:center;justify-content:center}:where(.cartel){font-size:28px}`,
    css: `.cartel {\n  \n}`,
    cmds: ['color', 'background-color'],
    hint: '`color` no pinta el fondo: pinta las letras.',
    help: 'La propiedad `color` cambia el color del texto. Acepta nombres como `white`, `black` o `tomato`.',
    solution: `.cartel {\n  color: white;\n}`,
    why: '`color: white;` hace que las letras sean blancas y contrasten con el fondo oscuro.',
    success: 'Ahora todo el barrio sabe que el taller está abierto.',
    check: t => [t.color('.cartel', 'color', 'white', 'El texto del cartel es blanco')]
  });

  L({
    title: 'Tu primer selector',
    brief: 'Esta vez el editor está vacío. Escribe tú la regla completa: la puerta tiene la clase `puerta`. Píntala de color `tomato`.',
    html: `<div class="escena"><div class="caja puerta"></div></div>`,
    base: `:where(.escena){display:flex;align-items:flex-end;justify-content:center;padding-bottom:40px}:where(.puerta){width:90px;height:150px;border-radius:45px 45px 0 0}`,
    css: `/* Escribe aquí tu regla */\n`,
    cmds: ['.clase', 'background-color'],
    hint: 'Una clase se selecciona con un punto delante: `.puerta { … }`.',
    help: 'El selector de clase empieza con un punto y elige todos los elementos que tienen esa clase en su atributo `class`.',
    solution: `.puerta {\n  background-color: tomato;\n}`,
    why: '`.puerta` encuentra el elemento con `class="puerta"` y le pinta el fondo de tomate.',
    success: 'Una puerta roja: muy de taller.',
    check: t => [t.color('.puerta', 'background-color', 'tomato', 'La puerta tiene fondo tomato')]
  });

  L({
    title: 'Todas las notas',
    brief: 'En la pizarra hay tres notas escritas con la etiqueta `<p>`, sin clases. Usa un **selector de etiqueta** para que el texto de todas sea `navy`.',
    html: `<div class="escena pizarra"><p>Comprar pintura</p><p>Lijar la mesa</p><p>Barnizar la silla</p></div>`,
    base: `:where(.pizarra){background:#fdfbf4;border:8px solid #b07a46}:where(p){margin:0 0 10px;font-size:20px;color:#bbb}`,
    css: `/* Selecciona las etiquetas p */\n`,
    cmds: ['etiqueta', 'color'],
    hint: 'El selector de etiqueta es el nombre del elemento, sin punto ni almohadilla.',
    help: 'Un selector como `p` o `li` elige todos los elementos de ese tipo en la página.',
    solution: `p {\n  color: navy;\n}`,
    why: '`p` selecciona los tres párrafos a la vez.',
    success: 'Con una sola regla cambiaste tres elementos.',
    check: t => [t.color('p', 'color', 'navy', 'Las tres notas son de color navy')]
  });

  L({
    title: 'La caja del jefe',
    brief: 'Hay tres cajas con la clase `caja`, pero solo una tiene el **id** `jefe`. Pinta de `orchid` **solo** esa caja.',
    html: `<div class="escena fila"><div class="caja"></div><div class="caja" id="jefe"></div><div class="caja"></div></div>`,
    base: `:where(.fila){display:flex;gap:20px;align-items:center;justify-content:center}`,
    css: `/* Usa el id */\n`,
    cmds: ['#id', 'background-color'],
    hint: 'El id se selecciona con `#` delante del nombre.',
    help: 'Un id es único en la página. El selector `#jefe` solo puede encontrar un elemento.',
    solution: `#jefe {\n  background-color: orchid;\n}`,
    why: '`#jefe` elige solo la caja con `id="jefe"`; las otras conservan su color.',
    success: 'El jefe ya destaca.',
    check: t => [
      t.color('#jefe', 'background-color', 'orchid', 'La caja con id jefe es orchid'),
      t.color('.caja:not(#jefe)', 'background-color', '#d9d3c7', 'Las otras dos cajas no cambian')
    ]
  });

  L({
    title: 'Etiqueta de precio',
    brief: 'Una regla puede llevar varias declaraciones. La etiqueta necesita fondo `seagreen` y texto `white`.',
    html: `<div class="escena"><div class="cartel etiqueta">3,50 €</div></div>`,
    base: `:where(.escena){display:flex;align-items:center;justify-content:center}:where(.etiqueta){font-size:30px;background:#ccc;color:#999}`,
    css: `.etiqueta {\n  \n}`,
    cmds: ['background-color', 'color'],
    hint: 'Escribe cada declaración en su línea, terminada en `;`.',
    help: 'Dentro de las llaves puedes poner todas las declaraciones que quieras; el punto y coma separa una de otra.',
    solution: `.etiqueta {\n  background-color: seagreen;\n  color: white;\n}`,
    why: 'Dos declaraciones en la misma regla: una para el fondo y otra para el texto.',
    success: 'Precio listo para vender.',
    check: t => [
      t.color('.etiqueta', 'background-color', 'seagreen', 'El fondo es seagreen'),
      t.color('.etiqueta', 'color', 'white', 'El texto es blanco')
    ]
  });

  L({
    title: 'Código de color',
    brief: 'Los diseñadores usan colores **hexadecimales**. Pinta la lata con el azul exacto `#3a86ff`.',
    html: `<div class="escena"><div class="caja lata"></div></div>`,
    base: `:where(.escena){display:flex;align-items:center;justify-content:center}:where(.lata){width:90px;height:120px;border-radius:10px/18px}`,
    css: `.lata {\n  \n}`,
    cmds: ['background-color', '#rrggbb'],
    hint: 'El valor empieza por `#` y lleva seis caracteres.',
    help: 'En `#3a86ff`, los pares `3a`, `86` y `ff` son el rojo, el verde y el azul en hexadecimal (de 00 a ff).',
    solution: `.lata {\n  background-color: #3a86ff;\n}`,
    why: 'Un código hexadecimal describe un color exacto, sin depender de nombres.',
    success: 'Azul de catálogo, al milímetro.',
    check: t => [t.color('.lata', 'background-color', '#3a86ff', 'La lata es exactamente #3a86ff', 1)]
  });

  L({
    title: 'Mezcla de luz',
    brief: 'Con `rgb()` mezclas rojo, verde y azul de 0 a 255. El semáforo necesita el naranja `rgb(255, 140, 0)`.',
    html: `<div class="escena"><div class="caja semaforo"></div></div>`,
    base: `:where(.escena){display:flex;align-items:center;justify-content:center}:where(.semaforo){width:90px;height:90px;border-radius:50%;box-shadow:0 0 0 14px #333}`,
    css: `.semaforo {\n  background-color: rgb(0, 0, 0);\n}`,
    cmds: ['rgb()', 'background-color'],
    hint: 'Cambia los tres números: 255 de rojo, 140 de verde y 0 de azul.',
    help: '`rgb(rojo, verde, azul)`: cada canal va de 0 (nada) a 255 (máximo). Todo a 255 es blanco y todo a 0, negro.',
    solution: `.semaforo {\n  background-color: rgb(255, 140, 0);\n}`,
    why: 'Mucho rojo, algo de verde y nada de azul dan naranja.',
    success: 'Luz ámbar encendida.',
    check: t => [t.color('.semaforo', 'background-color', 'rgb(255, 140, 0)', 'El semáforo es rgb(255, 140, 0)', 2)]
  });

  L({
    title: 'Cristal azulado',
    brief: 'El escaparate debe dejar ver lo que hay detrás. Usa `rgba()` para darle un fondo **azul** (`0, 0, 255`) con una opacidad de `0.3`.',
    html: `<div class="escena"><div class="caja jarron">🏺</div><div class="caja cristal"></div></div>`,
    base: `:where(.escena){position:relative}:where(.jarron){position:absolute;left:150px;top:100px;background:transparent;font-size:46px}:where(.cristal){position:absolute;left:100px;top:60px;width:160px;height:140px;background:#d9d3c7;border:3px solid #9fb3c8}`,
    css: `.cristal {\n  \n}`,
    cmds: ['rgba()', 'background-color', 'opacity'],
    hint: 'El cuarto número de `rgba()` es la opacidad: 0 es invisible y 1, opaco.',
    help: '`rgba(r, g, b, a)` funciona como `rgb()` con un canal alfa extra. A diferencia de `opacity`, solo vuelve transparente el fondo, no el contenido.',
    solution: `.cristal {\n  background-color: rgba(0, 0, 255, 0.3);\n}`,
    why: 'El azul con alfa 0.3 deja pasar el 70% de lo que hay detrás.',
    success: 'Se ve el jarrón a través del cristal.',
    check: t => {
      const c = t.parseColor(t.v('.cristal', 'background-color')) || [0, 0, 0, 1];
      return [
        t.ok(c[2] > 200 && c[0] < 40 && c[1] < 40, 'El fondo del cristal es azul'),
        t.ok(Math.abs(c[3] - 0.3) < 0.03, 'El fondo tiene una opacidad de 0.3'),
        t.eq('.cristal', 'opacity', '1', 'El elemento en sí no usa opacity (solo el fondo es transparente)')
      ];
    }
  });

  L({
    title: 'Un marco para el cuadro',
    brief: 'El cuadro necesita un marco: un borde de `4px`, estilo `solid` y color `black`. Usa el atajo `border`.',
    html: `<div class="escena"><div class="caja cuadro">🌄</div></div>`,
    base: `:where(.escena){display:flex;align-items:center;justify-content:center}:where(.cuadro){width:150px;height:110px;font-size:54px;background:#fff}`,
    css: `.cuadro {\n  \n}`,
    cmds: ['border', 'border-width', 'border-style', 'border-color'],
    hint: 'El atajo admite los tres valores juntos, separados por espacios.',
    help: '`border: grosor estilo color;` define los cuatro lados a la vez. Sin estilo (`solid`, `dashed`…) el borde no se ve.',
    solution: `.cuadro {\n  border: 4px solid black;\n}`,
    why: '`4px` es el grosor, `solid` una línea continua y `black` el color.',
    success: 'Listo para colgar en la galería.',
    check: t => [
      t.px('.cuadro', 'border-top-width', 4, 'Los bordes miden 4px'), t.px('.cuadro', 'border-left-width', 4, 'También a los lados'),
      t.eq('.cuadro', 'border-top-style', 'solid', 'El estilo es solid'),
      t.color('.cuadro', 'border-left-color', 'black', 'El borde es negro')
    ]
  });

  L({
    title: 'Solo por abajo',
    brief: 'El estante solo necesita una línea gruesa en la parte inferior: `6px solid saddlebrown`.',
    html: `<div class="escena"><div class="caja estante">📚</div></div>`,
    base: `:where(.escena){display:flex;align-items:center;justify-content:center}:where(.estante){width:220px;height:70px;font-size:40px;background:transparent}`,
    css: `.estante {\n  \n}`,
    cmds: ['border-bottom', 'border-top', 'border'],
    hint: 'Hay una propiedad de borde para cada lado.',
    help: '`border-top`, `border-right`, `border-bottom` y `border-left` funcionan como `border`, pero solo en un lado.',
    solution: `.estante {\n  border-bottom: 6px solid saddlebrown;\n}`,
    why: '`border-bottom` dibuja solo la línea inferior.',
    success: 'Los libros ya tienen dónde apoyarse.',
    check: t => [
      t.px('.estante', 'border-bottom-width', 6, 'Hay un borde inferior de 6px'),
      t.color('.estante', 'border-bottom-color', 'saddlebrown', 'El borde inferior es saddlebrown'),
      t.px('.estante', 'border-top-width', 0, 'No hay borde arriba'),
      t.px('.estante', 'border-left-width', 0, 'No hay bordes laterales')
    ]
  });

  L({
    title: 'Esquinas suaves',
    brief: 'El botón tiene esquinas afiladas. Redondéalas con un radio de `12px`.',
    html: `<div class="escena"><button class="boton">Comprar</button></div>`,
    base: `:where(.escena){display:flex;align-items:center;justify-content:center}:where(.boton){background:#FF8A5B;color:#fff;font-size:20px;padding:14px 26px}`,
    css: `.boton {\n  \n}`,
    cmds: ['border-radius'],
    hint: 'Un solo valor redondea las cuatro esquinas por igual.',
    help: '`border-radius` define el radio de la curva de las esquinas. Funciona aunque el elemento no tenga borde.',
    solution: `.boton {\n  border-radius: 12px;\n}`,
    why: 'Con `12px` las cuatro esquinas se curvan con el mismo radio.',
    success: 'Mucho más amable al tacto.',
    check: t => ['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(c =>
      t.px('.boton', `border-${c}-radius`, 12, `La esquina ${c === 'top-left' ? 'superior izquierda' : c === 'top-right' ? 'superior derecha' : c === 'bottom-left' ? 'inferior izquierda' : 'inferior derecha'} tiene radio 12px`))
  });

  L({
    title: 'Ruedas redondas',
    brief: 'Las ruedas del carrito son cuadradas. Conviértelas en **círculos perfectos** sin cambiar su tamaño.',
    html: `<div class="escena"><div class="carro"><div class="caja rueda"></div><div class="caja rueda"></div></div></div>`,
    base: `:where(.escena){display:flex;align-items:center;justify-content:center}:where(.carro){width:220px;height:80px;background:#FF8A5B;border-radius:10px;position:relative}:where(.rueda){position:absolute;bottom:-30px;width:56px;height:56px;background:#333}:where(.rueda:first-child){left:20px}:where(.rueda:last-child){right:20px}`,
    css: `.rueda {\n  \n}`,
    cmds: ['border-radius', '%'],
    hint: 'Un radio igual a la mitad del lado convierte un cuadrado en círculo.',
    help: 'Con `border-radius: 50%` cada esquina se curva la mitad del ancho y del alto: en un cuadrado, eso es un círculo.',
    solution: `.rueda {\n  border-radius: 50%;\n}`,
    why: '`50%` funciona para cualquier tamaño de cuadrado, sin calcular píxeles.',
    success: '¡Ahora sí rueda!',
    check: t => {
      const r = t.rect('.rueda');
      const rad = (() => { const v = t.v('.rueda', 'border-top-left-radius'); return v.includes('%') ? parseFloat(v) / 100 * r.w : parseFloat(v); })();
      const all = ['top-right', 'bottom-left', 'bottom-right'].every(c => t.v('.rueda', `border-${c}-radius`) === t.v('.rueda', 'border-top-left-radius'));
      return [t.ok(rad >= r.w / 2 - 0.5 && all, 'Las ruedas son círculos'), t.size('.rueda', 56, 56, 'Las ruedas siguen midiendo 56 × 56 px')];
    }
  });

  L({
    title: 'Mesa a medida',
    brief: 'La mesa debe medir exactamente `200px` de ancho.',
    html: `<div class="escena"><div class="caja mesa">🪚</div></div>`,
    base: `:where(.escena){display:flex;flex-direction:column;align-items:center;justify-content:center}:where(.mesa){height:50px;background:#B97A44;font-size:28px}`,
    css: `.mesa {\n  \n}`,
    cmds: ['width', 'height'],
    hint: 'La propiedad para el ancho es `width`.',
    help: '`width` fija el ancho del contenido del elemento. Las medidas en `px` no cambian aunque cambie la pantalla.',
    solution: `.mesa {\n  width: 200px;\n}`,
    why: '`width: 200px` da a la mesa un ancho fijo de 200 píxeles.',
    success: 'Encaja justo en el hueco.',
    check: t => [t.size('.mesa', 200, null, 'La mesa mide 200px de ancho'), t.size('.mesa', null, 50, 'La altura no cambia (50px)')]
  });

  L({
    title: 'Columna alta',
    brief: 'La columna del taller es demasiado bajita. Hazla de `150px` de alto y `40px` de ancho.',
    html: `<div class="escena"><div class="caja columna"></div></div>`,
    base: `:where(.escena){display:flex;align-items:flex-end;justify-content:center}:where(.columna){width:80px;height:30px;background:repeating-linear-gradient(90deg,#c9b8a0 0 8px,#e2d5c1 8px 16px)}`,
    css: `.columna {\n  \n}`,
    cmds: ['width', 'height'],
    hint: 'Necesitas dos declaraciones: una para el alto y otra para el ancho.',
    help: '`height` fija la altura y `width` el ancho. Juntas definen el tamaño de la caja.',
    solution: `.columna {\n  width: 40px;\n  height: 150px;\n}`,
    why: 'Dos medidas fijas en píxeles dan la forma exacta.',
    success: 'Una columna esbelta y firme.',
    check: t => [t.size('.columna', null, 150, 'La columna mide 150px de alto'), t.size('.columna', 40, null, 'La columna mide 40px de ancho')]
  });

  L({
    title: 'Media barra',
    brief: 'La barra de carga debe ocupar **la mitad** de su contenedor, sea cual sea su tamaño. Usa un porcentaje.',
    html: `<div class="escena"><div class="pista"><div class="barra"></div></div></div>`,
    base: `:where(.escena){display:flex;align-items:center}:where(.pista){width:100%;height:30px;background:#e8dccb;border-radius:15px;overflow:hidden}:where(.barra){height:100%;width:30px;background:#FF8A5B}`,
    css: `.barra {\n  \n}`,
    cmds: ['width', '%'],
    rule: 'La comprobación cambia el tamaño de la escena: un ancho fijo en px no sirve.',
    hint: 'Un porcentaje se calcula sobre el ancho del contenedor.',
    help: '`width: 50%` hace que el elemento mida la mitad del ancho de su padre. Si el padre cambia, la barra se adapta.',
    solution: `.barra {\n  width: 50%;\n}`,
    why: 'El porcentaje es relativo, así que funciona en cualquier pantalla.',
    success: 'Carga al 50%, en cualquier tamaño.',
    check: t => [300, 360, 600].map(w => t.at(w, () => {
      const p = t.rect('.pista'), b = t.rect('.barra');
      return t.ok(t.near(b.w, p.w / 2, 1), `Mide la mitad de la pista con la escena a ${w}px`);
    }))
  });

  L({
    title: 'Aire por dentro',
    brief: 'El texto de la etiqueta está pegado al borde. Añade un **relleno** (`padding`) de `16px` por todos los lados.',
    html: `<div class="escena"><div class="cartel nota">¡Frágil!</div></div>`,
    base: `:where(.escena){display:flex;align-items:center;justify-content:center}:where(.nota){padding:0;font-size:24px;background:#FFE08A;color:#7a4b00;border:2px solid #d4a017}`,
    css: `.nota {\n  \n}`,
    cmds: ['padding', 'margin'],
    hint: '`padding` es el espacio dentro de la caja; `margin`, el de fuera.',
    help: 'El relleno separa el contenido del borde y forma parte del fondo de la caja.',
    solution: `.nota {\n  padding: 16px;\n}`,
    why: 'Con un único valor, el relleno es igual en los cuatro lados.',
    success: 'La etiqueta respira.',
    check: t => ['top', 'right', 'bottom', 'left'].map(s => t.px('.nota', 'padding-' + s, 16, `Relleno de 16px (${s === 'top' ? 'arriba' : s === 'right' ? 'derecha' : s === 'bottom' ? 'abajo' : 'izquierda'})`))
  });

  L({
    title: 'Separado de la pared',
    brief: 'El cuadro está pegado a la pared izquierda. Sepáralo `40px` con un **margen** izquierdo.',
    html: `<div class="escena pared"><div class="caja cuadro">🖼️</div></div>`,
    base: `:where(.pared){padding:20px 0;border-left:10px solid #b07a46}:where(.cuadro){width:100px;height:80px;background:#fff;font-size:40px}`,
    css: `.cuadro {\n  \n}`,
    cmds: ['margin-left', 'margin', 'padding-left'],
    hint: 'El margen es el espacio exterior: empuja la caja.',
    help: '`margin-left` añade espacio fuera de la caja, por su lado izquierdo, y la desplaza.',
    solution: `.cuadro {\n  margin-left: 40px;\n}`,
    why: 'El margen separa el cuadro de la pared sin cambiar su tamaño.',
    success: 'Colgado a la distancia justa.',
    check: t => {
      const p = t.innerRect('.pared'), c = t.rect('.cuadro');
      return [t.ok(t.near(c.x - p.x, 40, 1), 'El cuadro está a 40px de la pared'), t.size('.cuadro', 100, 80, 'El cuadro mantiene su tamaño')];
    }
  });

  L({
    title: 'Mismo trato',
    brief: 'El lápiz, la goma y la regla necesitan el mismo borde: `3px dashed #555`. Escribe **una sola regla** con los tres selectores separados por comas.',
    html: `<div class="escena fila"><div class="caja lapiz">✏️</div><div class="caja goma">🧽</div><div class="caja regla">📏</div></div>`,
    base: `:where(.fila){display:flex;gap:24px;align-items:center;justify-content:center}:where(.caja){background:#fff}`,
    css: `/* Una regla para los tres */\n`,
    cmds: ['a, b', 'border', '/* comentario */'],
    rule: 'Usa una lista de selectores separados por comas.',
    hint: 'Algo como `.a, .b, .c { … }` aplica las mismas declaraciones a los tres.',
    help: 'Agrupar selectores con comas evita repetir el mismo código varias veces.',
    solution: `.lapiz, .goma, .regla {\n  border: 3px dashed #555;\n}`,
    why: 'Una lista de selectores comparte un solo bloque de declaraciones.',
    success: 'Menos código, mismo resultado.',
    check: t => [
      ...['.lapiz', '.goma', '.regla'].map(s => t.eq(s, 'border-top-style', 'dashed', `${s} tiene borde discontinuo`)),
      t.px('.lapiz, .goma, .regla', 'border-top-width', 3, 'Los bordes miden 3px'),
      t.color('.lapiz, .goma, .regla', 'border-top-color', '#555', 'El color del borde es #555'),
      t.uses(/[^{}]+,[^{}]+\{/, 'Usas una lista de selectores con comas')
    ]
  });

  L({
    title: 'Ficha del taller',
    brief: 'Reto del mundo. Diseña la ficha: ancho `220px`, fondo `white`, texto `#333`, relleno `12px`, borde `2px solid #333` y esquinas de `8px`.',
    html: `<div class="escena"><div class="ficha"><b>Silla nº 7</b><br>Lijada y barnizada</div></div>`,
    base: `:where(.escena){display:flex;align-items:center;justify-content:center}:where(.ficha){background:#3b2f4a;color:#5d5170;font-size:16px}`,
    css: `.ficha {\n  \n}`,
    cmds: ['width', 'background-color', 'color', 'padding', 'border', 'border-radius'],
    hint: 'Son seis declaraciones. Ve una por una y comprueba en la escena.',
    help: 'Una tarjeta combina tamaño, colores, relleno y borde: lo aprendido en este mundo.',
    solution: `.ficha {\n  width: 220px;\n  background-color: white;\n  color: #333;\n  padding: 12px;\n  border: 2px solid #333;\n  border-radius: 8px;\n}`,
    why: 'Cada declaración controla un aspecto distinto de la caja.',
    success: '¡Mundo 1 completado! Ya dominas reglas, colores y medidas.',
    check: t => [
      t.px('.ficha', 'width', 220, 'El ancho es 220px'),
      t.color('.ficha', 'background-color', 'white', 'El fondo es blanco'),
      t.color('.ficha', 'color', '#333', 'El texto es #333'),
      t.px('.ficha', 'padding-left', 12, 'El relleno es 12px'), t.px('.ficha', 'padding-top', 12, 'También arriba y abajo'),
      t.px('.ficha', 'border-top-width', 2, 'El borde mide 2px'), t.eq('.ficha', 'border-top-style', 'solid', 'El borde es continuo'),
      t.color('.ficha', 'border-top-color', '#333', 'El borde es #333'),
      t.px('.ficha', 'border-top-left-radius', 8, 'Las esquinas tienen 8px de radio')
    ]
  });
})();
