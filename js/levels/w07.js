/* Mundo 7 — Laboratorio: diseño adaptable (niveles 121–140)
   En estos niveles puedes cambiar el ancho del escenario con el control deslizante. */
(function () {
  const L = d => CQ.LV(7, d);
  const vw = t => t.win.innerWidth;

  L({
    title: 'Mesa de dos tercios',
    brief: 'La mesa del laboratorio tiene dos zonas en fila. Haz que la izquierda ocupe el `30%` y la derecha el `70%` del ancho, en cualquier tamaño.',
    html: `<div class="escena"><div class="banco"><div class="tubo izq">A</div><div class="tubo der">B</div></div></div>`,
    base: `:where(.banco){display:flex}:where(.tubo){width:60px;height:80px;display:flex;align-items:center;justify-content:center;font-weight:800;color:#1f2b5a}:where(.der){background:#c9d6ff}`,
    css: `.izq {\n  \n}\n\n.der {\n  \n}`,
    resizable: true, ghost: '.tubo',
    cmds: ['width', '%'],
    rule: 'Se comprueba con la escena a 300px y a 600px.',
    hint: 'Los porcentajes se calculan sobre el ancho de la mesa.',
    help: 'Los porcentajes son la unidad adaptable más sencilla: se recalculan cuando cambia el contenedor.',
    solution: `.izq {\n  width: 30%;\n}\n\n.der {\n  width: 70%;\n}`,
    why: '30% + 70% = 100% del contenedor, sea cual sea su tamaño.',
    success: 'Proporciones que nunca fallan.',
    check: t => [300, 600].map(w => t.at(w, () => t.same('.tubo', `Las zonas encajan con la escena a ${w}px`)))
  });

  L({
    title: 'Medida raíz',
    brief: 'El rótulo debe medir `1.5rem`: una vez y media el tamaño de letra de la raíz (`html`), que ahora es `16px`.',
    html: `<div class="escena"><div class="panel"><p class="rotulo">Muestra 42-B</p></div></div>`,
    base: `:where(.panel){font-size:30px}:where(.rotulo){margin:0;font-weight:800}`,
    css: `.rotulo {\n  \n}`,
    cmds: ['rem', 'font-size', 'em'],
    rule: 'Se comprueba también cambiando el tamaño raíz a 20px.',
    hint: '`rem` no depende del padre (el panel tiene 30px), solo de `html`.',
    help: '`1rem` es el `font-size` del elemento `html`. Si el usuario agranda el texto del navegador, todo lo medido en `rem` crece con él.',
    solution: `.rotulo {\n  font-size: 1.5rem;\n}`,
    why: '16 × 1.5 = 24px; con raíz de 20px, 30px.',
    success: 'Tamaño accesible y predecible.',
    check: t => [t.px('.rotulo', 'font-size', 24, 'Mide 24px con raíz de 16px', 0.2), t.root(20, () => t.px('.rotulo', 'font-size', 30, 'Mide 30px con raíz de 20px', 0.2))]
  });

  L({
    title: 'Botones proporcionales',
    brief: 'Hay un botón pequeño y uno grande. Dales un relleno que **escale con su texto**: `0.5em` arriba y abajo, `1em` a los lados.',
    html: `<div class="escena"><button class="boton peq">Analizar</button> <button class="boton gra">Analizar</button></div>`,
    base: `:where(.boton){border:0;border-radius:8px;background:#5B8CFF;color:#fff;font-weight:700;padding:4px}:where(.peq){font-size:14px}:where(.gra){font-size:24px}`,
    css: `.boton {\n  \n}`,
    cmds: ['em', 'padding'],
    hint: 'En `padding`, `em` se refiere al tamaño de letra del propio botón.',
    help: 'Fuera de `font-size`, `1em` es el tamaño de letra del elemento. Así el relleno crece y encoge con el texto.',
    solution: `.boton {\n  padding: 0.5em 1em;\n}`,
    why: 'El botón grande recibe más relleno automáticamente.',
    success: 'Dos tamaños, una sola regla.',
    check: t => [t.px('.peq', 'padding-top', 7, 'Botón pequeño: 7px arriba (0.5em)', 0.2), t.px('.peq', 'padding-left', 14, 'Botón pequeño: 14px a los lados (1em)', 0.2), t.px('.gra', 'padding-top', 12, 'Botón grande: 12px arriba (0.5em)', 0.2), t.px('.gra', 'padding-left', 24, 'Botón grande: 24px a los lados (1em)', 0.2)]
  });

  L({
    title: 'Media ventana',
    brief: 'La banda debe medir **la mitad del ancho de la ventana**, no del contenedor (que tiene relleno). Usa `vw`.',
    html: `<div class="escena"><div class="tubo banda"></div></div>`,
    css: `.banda {\n  \n}`,
    resizable: true,
    cmds: ['vw', '%', 'width'],
    rule: 'Se comprueba con la ventana a 300px y a 600px.',
    hint: '`50%` sería la mitad del contenedor. Busca la unidad de la ventana.',
    help: '`1vw` es el 1% del ancho de la ventana (el *viewport*). `50vw` es siempre la mitad, sin importar los contenedores.',
    solution: `.banda {\n  width: 50vw;\n}`,
    why: 'El viewport es la referencia, no el padre.',
    success: 'Medida de ventana.',
    check: t => [300, 600].map(w => t.at(w, () => t.ok(t.near(t.rect('.banda').w, vw(t) / 2, 1), `Mide la mitad de la ventana a ${w}px`)))
  });

  L({
    title: 'Media altura',
    brief: 'La portada debe ocupar **la mitad del alto** de la ventana, sea cual sea su altura.',
    html: `<div class="escena"><div class="tubo portada">🧪</div></div>`,
    base: `:where(.portada){height:40px;display:flex;align-items:center;justify-content:center;font-size:30px}`,
    css: `.portada {\n  \n}`,
    cmds: ['vh', 'height', '%'],
    rule: 'Se comprueba con ventanas de 200px y 300px de alto.',
    hint: 'Hay una unidad para el alto de la ventana.',
    help: '`1vh` es el 1% del alto de la ventana. En móviles, `dvh` tiene en cuenta las barras del navegador que aparecen y desaparecen.',
    solution: `.portada {\n  height: 50vh;\n}`,
    why: 'Siempre la mitad de la altura visible.',
    success: 'Pantalla partida.',
    check: t => [200, 300].map(h => t.at(360, () => t.ok(t.near(t.rect('.portada').h, t.win.innerHeight / 2, 1), `Mide la mitad del alto con una ventana de ${h}px`), h))
  });

  L({
    title: 'Columna legible',
    brief: 'El artículo ocupa todo el ancho y las líneas son demasiado largas. Limítalo a `240px` como máximo y **céntralo**. En pantallas estrechas debe ocupar el ancho disponible.',
    html: `<div class="escena"><div class="panel articulo">Los experimentos fiables se repiten muchas veces y se anotan con cuidado.</div></div>`,
    resizable: true, ghost: '.articulo',
    css: `.articulo {\n  \n}`,
    cmds: ['max-width', 'margin: auto'],
    rule: 'Se comprueba a 220px y a 500px.',
    hint: '`max-width` y `margin: 0 auto` forman la pareja clásica.',
    help: 'Con `max-width` el bloque nunca supera ese ancho, pero puede encoger. `margin: 0 auto` lo centra cuando sobra espacio.',
    solution: `.articulo {\n  max-width: 240px;\n  margin: 0 auto;\n}`,
    why: 'Líneas de longitud cómoda en pantallas grandes y ancho completo en las pequeñas.',
    success: 'Lectura cómoda en cualquier pantalla.',
    check: t => [220, 500].map(w => t.at(w, () => t.same('.articulo', `El artículo encaja con la escena a ${w}px`)))
  });

  L({
    title: 'El menor de dos',
    brief: 'Consigue lo mismo que con `max-width`, pero con una sola declaración: el ancho debe ser el **menor** entre `100%` y `250px`. Usa `min()`.',
    html: `<div class="escena"><div class="panel ficha">Ficha de muestra</div></div>`,
    resizable: true, ghost: '.ficha',
    css: `.ficha {\n  \n}`,
    cmds: ['min()', 'width'],
    rule: 'Usa min() y se comprueba a 220px y a 500px.',
    hint: '`width: min(100%, 250px)`.',
    help: '`min()` devuelve el valor más pequeño de la lista. En una escena ancha, 250px es menor que 100%; en una estrecha, al revés.',
    solution: `.ficha {\n  width: min(100%, 250px);\n}`,
    why: 'El navegador elige el menor en cada tamaño.',
    success: 'Una función, dos comportamientos.',
    check: t => [...[220, 500].map(w => t.at(w, () => t.same('.ficha', `La ficha encaja con la escena a ${w}px`))), t.uses(/min\(/, 'Usas la función min()')]
  });

  L({
    title: 'Nunca demasiado pequeño',
    brief: 'El título usa `5vw`, pero en pantallas estrechas queda diminuto. Haz que mida el **mayor** entre `16px` y `5vw`.',
    html: `<div class="escena"><h2 class="titulo">Resultados</h2></div>`,
    resizable: true,
    base: `:where(.titulo){margin:0}`,
    css: `.titulo {\n  font-size: 5vw;\n}`,
    cmds: ['max()', 'vw', 'font-size'],
    rule: 'Usa max(). Se comprueba a 200px y a 600px.',
    hint: '`max(16px, 5vw)`.',
    help: '`max()` devuelve el mayor de sus valores: sirve para poner un **mínimo** a una medida fluida.',
    solution: `.titulo {\n  font-size: max(16px, 5vw);\n}`,
    why: 'A 200px, 5vw serían 10px: se usa 16px. A 600px, 5vw son 30px.',
    success: 'Legible en todos los tamaños.',
    check: t => [t.at(200, () => t.px('.titulo', 'font-size', 16, 'A 200px mide 16px', 0.3)), t.at(600, () => t.px('.titulo', 'font-size', 30, 'A 600px mide 30px (5vw)', 0.3)), t.uses(/max\(/, 'Usas la función max()')]
  });

  L({
    title: 'Tipografía fluida',
    brief: 'El titular debe crecer con la ventana (`6vw`), pero nunca bajar de `16px` ni pasar de `32px`. Hazlo con `clamp()`.',
    html: `<div class="escena"><h2 class="titulo">Laboratorio abierto</h2></div>`,
    resizable: true,
    base: `:where(.titulo){margin:0}`,
    css: `.titulo {\n  \n}`,
    cmds: ['clamp()', 'vw', 'font-size'],
    rule: 'Se comprueba a 200px, 400px y 700px.',
    hint: 'El orden es `clamp(mínimo, ideal, máximo)`.',
    help: '`clamp(16px, 6vw, 32px)` usa 6vw mientras esté entre 16 y 32px; si no, se queda en el límite.',
    solution: `.titulo {\n  font-size: clamp(16px, 6vw, 32px);\n}`,
    why: 'Mínimo, valor ideal y máximo en una sola función.',
    success: 'Texto que fluye con la pantalla.',
    check: t => [t.at(200, () => t.px('.titulo', 'font-size', 16, 'A 200px mide 16px (mínimo)', 0.3)), t.at(400, () => t.px('.titulo', 'font-size', 24, 'A 400px mide 24px (6vw)', 0.3)), t.at(700, () => t.px('.titulo', 'font-size', 32, 'A 700px mide 32px (máximo)', 0.3))]
  });

  L({
    title: 'Imagen elástica',
    brief: 'La imagen mide 400px y se sale de la escena en pantallas estrechas. Haz que **nunca supere el ancho** de su contenedor y que conserve su **proporción**.',
    html: `<div class="escena"><img class="foto" data-src="cq" width="400" height="250" alt="Paisaje"></div>`,
    base: `:where(.foto){display:block}`,
    resizable: true, ghost: '.foto',
    css: `.foto {\n  \n}`,
    cmds: ['max-width', 'height', '%'],
    rule: 'Se comprueba a 300px y a 600px.',
    hint: 'Ancho máximo del 100% y altura automática.',
    help: '`max-width: 100%` impide que la imagen se salga; `height: auto` recalcula el alto para no deformarla.',
    solution: `.foto {\n  max-width: 100%;\n  height: auto;\n}`,
    why: 'La imagen encoge si hace falta, pero nunca crece más que su tamaño real.',
    success: 'Imágenes adaptables, la base de cualquier web.',
    check: t => [300, 600].map(w => t.at(w, () => { const r = t.rect('.foto'); return [t.same('.foto', `La imagen encaja con la escena a ${w}px`), t.ok(t.near(r.w / r.h, 1.6, 0.03), `La imagen no se deforma a ${w}px`)]; }))
  });

  L({
    title: 'Pantalla panorámica',
    brief: 'El visor de vídeo ocupa todo el ancho. Mantén siempre la proporción **16:9** sin calcular la altura a mano.',
    html: `<div class="escena"><div class="tubo visor">▶️</div></div>`,
    base: `:where(.visor){display:flex;align-items:center;justify-content:center;font-size:30px;background:#1f2b5a;height:60px}`,
    resizable: true,
    css: `.visor {\n  height: auto;\n  \n}`,
    cmds: ['aspect-ratio', 'width'],
    rule: 'Se comprueba a 300px y a 600px.',
    hint: 'Hay una propiedad para la proporción: `aspect-ratio: 16 / 9`.',
    help: '`aspect-ratio` mantiene la relación entre ancho y alto. Si el ancho cambia, el alto se ajusta solo.',
    solution: `.visor {\n  height: auto;\n  aspect-ratio: 16 / 9;\n}`,
    why: 'Alto = ancho × 9 / 16, siempre.',
    success: 'Cine en cualquier pantalla.',
    check: t => [300, 600].map(w => t.at(w, () => { const r = t.rect('.visor'); return t.ok(t.near(r.h, r.w * 9 / 16, 1), `Proporción 16:9 con la escena a ${w}px`); }))
  });

  L({
    title: 'Tu primera media query',
    brief: 'Cuando la ventana mida **500px o más**, el panel debe tener fondo `#5B8CFF`. En ventanas más estrechas, debe quedarse blanco.',
    html: `<div class="escena"><div class="panel p">Modo escritorio</div></div>`,
    base: `:where(.p){font-weight:700;background:#fff}`,
    resizable: true,
    css: `/* Escribe aquí tu @media */\n`,
    cmds: ['@media', 'min-width (media)'],
    rule: 'Se comprueba a 400px y a 600px.',
    hint: '`@media (min-width: 500px) { .p { … } }`. Las reglas van dentro de las llaves de @media.',
    help: 'Una media query aplica su bloque de reglas solo si se cumple la condición. `min-width: 500px` significa «a partir de 500px».',
    solution: `@media (min-width: 500px) {\n  .p {\n    background-color: #5B8CFF;\n  }\n}`,
    why: 'Por debajo de 500px la regla no se aplica.',
    success: 'Tu diseño ya reacciona a la pantalla.',
    check: t => [t.at(400, () => t.color('.p', 'background-color', '#fff', 'A 400px el panel es blanco')), t.at(600, () => t.color('.p', 'background-color', '#5B8CFF', 'A 600px el panel es #5B8CFF'))]
  });

  L({
    title: 'Apilar en el móvil',
    brief: 'Las dos columnas están en fila. Cuando la ventana mida **menos de 480px**, deben apilarse una encima de otra.',
    html: `<div class="escena"><div class="cols"><div class="panel c">Datos</div><div class="panel c">Gráfica</div></div></div>`,
    base: `:where(.c){flex:1;height:70px}`,
    resizable: true, ghost: '.c',
    css: `.cols {\n  display: flex;\n  gap: 10px;\n}\n`,
    cmds: ['@media', 'max-width (media)', 'flex-direction'],
    rule: 'Se comprueba a 400px y a 600px.',
    hint: 'Usa `@media (max-width: 479px)` y cambia la dirección del contenedor.',
    help: 'Con `max-width` en una media query aplicas estilos **hasta** cierto ancho. Cambiar `flex-direction` a `column` apila los elementos.',
    solution: `.cols {\n  display: flex;\n  gap: 10px;\n}\n\n@media (max-width: 479px) {\n  .cols {\n    flex-direction: column;\n  }\n}`,
    why: 'En pantallas estrechas el contenedor pasa a columna.',
    success: 'Diseño apilado para móvil.',
    check: t => [400, 600].map(w => t.at(w, () => t.same('.c', `Las columnas encajan con la escena a ${w}px`)))
  });

  L({
    title: 'Menú hamburguesa',
    brief: 'En ventanas de **menos de 420px**, oculta el menú largo y muestra el botón de hamburguesa. En ventanas más anchas, al revés.',
    html: `<div class="escena"><nav class="panel nav"><span class="marca">🧪 Lab</span><span class="menu-largo">Inicio · Pruebas · Equipo</span><button class="hamburguesa">☰</button></nav></div>`,
    base: `:where(.nav){display:flex;justify-content:space-between;align-items:center}:where(.marca){font-weight:800}:where(.hamburguesa){display:none;border:0;background:#5B8CFF;color:#fff;border-radius:8px;width:40px;height:36px;font-size:20px}`,
    resizable: true,
    css: `@media (max-width: 419px) {\n  \n}`,
    cmds: ['@media', 'display'],
    rule: 'Se comprueba a 360px y a 600px.',
    hint: 'Dentro de la media query: `.menu-largo` con `display: none` y `.hamburguesa` con `display: block`.',
    help: 'Las media queries pueden cambiar cualquier propiedad, también `display`, para mostrar u ocultar partes de la interfaz.',
    solution: `@media (max-width: 419px) {\n  .menu-largo {\n    display: none;\n  }\n\n  .hamburguesa {\n    display: block;\n  }\n}`,
    why: 'Cada tamaño de pantalla muestra el menú que mejor cabe.',
    success: 'Navegación adaptable.',
    check: t => [
      t.at(360, () => [t.eq('.menu-largo', 'display', 'none', 'A 360px el menú largo está oculto'), t.ok(t.v('.hamburguesa', 'display') !== 'none', 'A 360px se ve la hamburguesa')]),
      t.at(600, () => [t.ok(t.v('.menu-largo', 'display') !== 'none', 'A 600px se ve el menú largo'), t.eq('.hamburguesa', 'display', 'none', 'A 600px la hamburguesa está oculta')])
    ]
  });

  L({
    title: 'Cuadrícula adaptable',
    brief: 'La galería de muestras tiene **una columna**. A partir de `560px` de ventana, debe tener **tres columnas** iguales.',
    html: `<div class="escena"><div class="galeria">${'<div class="tubo m"></div>'.repeat(6)}</div></div>`,
    base: `:where(.m){height:30px}`,
    resizable: true, ghost: '.m',
    css: `.galeria {\n  display: grid;\n  gap: 8px;\n}\n`,
    cmds: ['@media', 'grid-template-columns', 'repeat()'],
    rule: 'Se comprueba a 400px y a 700px.',
    hint: 'La regla base deja una columna; la media query añade las tres.',
    help: 'Escribir primero el diseño móvil y añadir cambios para pantallas grandes con `min-width` se llama enfoque **mobile-first**.',
    solution: `.galeria {\n  display: grid;\n  gap: 8px;\n}\n\n@media (min-width: 560px) {\n  .galeria {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}`,
    why: 'Primero el móvil; después, más columnas cuando hay espacio.',
    success: 'Mobile-first dominado.',
    check: t => [400, 700].map(w => t.at(w, () => t.same('.m', `Las muestras encajan con la escena a ${w}px`)))
  });

  L({
    title: 'Encuadre perfecto',
    brief: 'La foto está forzada a un cuadrado y se ve **aplastada**. Haz que llene el cuadrado **recortando** lo que sobre, sin deformarse.',
    html: `<div class="escena"><div class="marco"><img class="foto" data-src="cq" alt="Paisaje"></div></div>`,
    base: `:where(.marco){width:150px;height:150px;margin:0 auto;border-radius:16px;overflow:hidden;border:4px solid #fff}:where(.foto){width:100%;height:100%;display:block}`,
    css: `.foto {\n  \n}`,
    cmds: ['object-fit'],
    hint: 'Hay un valor que cubre toda la caja recortando.',
    help: '`object-fit: cover` escala la imagen para cubrir su caja manteniendo la proporción y recorta lo que sobra. `contain` la muestra entera.',
    solution: `.foto {\n  object-fit: cover;\n}`,
    why: 'La imagen conserva su proporción y llena el marco.',
    success: 'Foto de perfil impecable.',
    check: t => [t.eq('.foto', 'object-fit', 'cover', 'La foto cubre el marco recortando'), t.size('.foto', 150, 150, 'La foto sigue llenando el marco de 150px')]
  });

  L({
    title: 'Consulta al contenedor',
    brief: 'Las dos tarjetas son iguales, pero una está en una columna estrecha y otra en una ancha. Los contenedores ya tienen `container-type: inline-size`. Haz que la tarjeta se ponga **en fila** solo cuando su contenedor mida **300px o más**.',
    html: `<div class="escena"><div class="cont estrecha"><div class="tarjeta"><div class="tubo ico">🧬</div><div class="tubo txt">ADN</div></div></div><div class="cont ancha"><div class="tarjeta"><div class="tubo ico">🧬</div><div class="tubo txt">ADN</div></div></div></div>`,
    base: `:where(.cont){container-type:inline-size;margin-bottom:10px}:where(.estrecha){width:180px}:where(.ancha){width:320px}:where(.tarjeta){display:grid;gap:6px;background:#fff;border-radius:10px;padding:6px}:where(.ico){height:40px;width:60px}:where(.txt){height:40px;flex:1;display:flex;align-items:center;padding:0 8px}`,
    css: `/* Escribe aquí tu @container */\n`,
    ghost: '.tubo',
    cmds: ['@container', 'container-type', 'display: flex'],
    hint: '`@container (min-width: 300px) { .tarjeta { display: flex; } }`.',
    help: 'Las consultas de contenedor (`@container`) preguntan por el tamaño del contenedor y no de la ventana: un mismo componente se adapta al hueco donde lo pongas.',
    solution: `@container (min-width: 300px) {\n  .tarjeta {\n    display: flex;\n  }\n}`,
    why: 'Solo la tarjeta del contenedor ancho cumple la condición.',
    success: 'Componentes que se adaptan a su hueco.',
    check: t => [t.same('.estrecha .tubo', 'La tarjeta estrecha sigue apilada'), t.same('.ancha .tubo', 'La tarjeta ancha se pone en fila'), t.uses(/@container/, 'Usas @container')]
  });

  L({
    title: 'Tarjetas que se recolocan',
    brief: 'Sin media queries: haz que cada tarjeta parta de `140px`, crezca para llenar la fila y salte de línea cuando no quepa.',
    html: `<div class="escena"><div class="mesa">${['🔬', '🧫', '🧪', '⚗️'].map(e => `<div class="panel tj">${e}</div>`).join('')}</div></div>`,
    base: `:where(.tj){height:50px;font-size:24px;text-align:center;width:100px}`,
    resizable: true, ghost: '.tj',
    css: `.mesa {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n\n.tj {\n  \n}`,
    cmds: ['flex', 'flex-basis', 'flex-grow'],
    rule: 'Se comprueba a 300px y a 640px.',
    hint: '`flex: 1 1 140px`: crece, encoge y parte de 140px.',
    help: 'Combinando `flex-wrap` con una base y `flex-grow`, los elementos se reorganizan solos según el espacio: diseño intrínseco.',
    solution: `.mesa {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n\n.tj {\n  flex: 1 1 140px;\n}`,
    why: 'Caben tantas como permitan sus 140px; después crecen para llenar la fila.',
    success: 'Adaptable sin una sola media query.',
    check: t => [300, 640].map(w => t.at(w, () => t.same('.tj', `Las tarjetas encajan con la escena a ${w}px`)))
  });

  L({
    title: 'Relleno fluido',
    brief: 'El panel necesita un relleno que crezca con la ventana (`4vw`), con un mínimo de `8px` y un máximo de `24px`.',
    html: `<div class="escena"><div class="panel caja">Relleno fluido</div></div>`,
    base: `:where(.caja){padding:2px}`,
    resizable: true,
    css: `.caja {\n  \n}`,
    cmds: ['clamp()', 'padding', 'vw'],
    rule: 'Se comprueba a 150px, 400px y 700px.',
    hint: 'La misma fórmula que con la tipografía, pero en `padding`.',
    help: '`clamp()` funciona en cualquier medida: rellenos, márgenes, anchos o huecos.',
    solution: `.caja {\n  padding: clamp(8px, 4vw, 24px);\n}`,
    why: 'Mínimo de 8px, 4vw en el medio y máximo de 24px.',
    success: 'Espaciado proporcionado en cualquier pantalla.',
    check: t => [t.at(150, () => t.px('.caja', 'padding-left', 8, 'A 150px el relleno es 8px', 0.3)), t.at(400, () => t.px('.caja', 'padding-left', 16, 'A 400px el relleno es 16px (4vw)', 0.3)), t.at(700, () => t.px('.caja', 'padding-left', 24, 'A 700px el relleno es 24px', 0.3))]
  });

  L({
    title: 'El laboratorio responde',
    brief: 'Reto del mundo. Por defecto (móvil), cabecera, menú y contenido van **apilados** con huecos de `8px`. A partir de `560px`, el menú pasa a una **columna izquierda de `120px`** junto al contenido, y la cabecera ocupa todo el ancho. El título usa `clamp(18px, 5vw, 28px)`.',
    html: `<div class="escena"><div class="app"><header class="panel cab"><h2 class="titulo">Lab</h2></header><nav class="panel menu">Menú</nav><main class="panel cont">Contenido</main></div></div>`,
    base: `:where(.titulo){margin:0}:where(.menu),:where(.cont){min-height:40px}`,
    resizable: true, ghost: '.panel',
    css: `.app {\n  display: grid;\n  gap: 8px;\n}\n`,
    cmds: ['@media', 'grid-template-columns', 'grid-column', 'clamp()'],
    rule: 'Se comprueba a 360px y a 700px.',
    hint: 'En la media query: dos columnas `120px 1fr` y la cabecera con `grid-column: 1 / -1`.',
    help: 'Este reto combina mobile-first, grid y tipografía fluida.',
    solution: `.app {\n  display: grid;\n  gap: 8px;\n}\n\n.titulo {\n  font-size: clamp(18px, 5vw, 28px);\n}\n\n@media (min-width: 560px) {\n  .app {\n    grid-template-columns: 120px 1fr;\n  }\n\n  .cab {\n    grid-column: 1 / -1;\n  }\n}`,
    why: 'Una sola estructura HTML, dos distribuciones.',
    success: '¡Mundo 7 completado! Tus diseños se adaptan a cualquier pantalla.',
    check: t => [
      t.at(360, () => [t.same('.panel', 'A 360px todo está apilado'), t.px('.titulo', 'font-size', 18, 'A 360px el título mide 18px', 0.3)]),
      t.at(700, () => [t.same('.panel', 'A 700px el menú está a la izquierda'), t.px('.titulo', 'font-size', 28, 'A 700px el título mide 28px', 0.3)])
    ]
  });
})();
