/* Mundo 9 — Feria espacial: transiciones, transformaciones, animaciones,
   variables, degradados y efectos (niveles 161–180) */
(function () {
  const L = d => CQ.LV(9, d);
  const secs = v => v.split(',').map(x => parseFloat(x) * (/ms/.test(x) ? 0.001 : 1));

  L({
    title: 'Cambio suave',
    brief: 'El botón ya cambia de color al pasar por encima, pero de golpe. Haz que el cambio de `background-color` dure `0.3s`.',
    html: `<div class="escena"><button class="boton">Subir a la noria</button></div>`,
    base: `:where(.boton){display:block;margin:90px auto 0;padding:14px 22px;border:0;border-radius:12px;background:#3a3f78;color:#fff;font-weight:700;font-size:17px}:where(.boton:hover){background:#FF6FB5}`,
    sim: { target: '.boton' },
    css: `.boton {\n  \n}`,
    cmds: ['transition', 'transition-duration'],
    hint: 'La transición se declara en el estado normal, no en `:hover`.',
    help: '`transition: background-color 0.3s` anima los cambios de esa propiedad en 0,3 segundos, en ambos sentidos.',
    solution: `.boton {\n  transition: background-color 0.3s;\n}`,
    why: 'Así el cambio es gradual al entrar y al salir.',
    success: 'Mucho más agradable.',
    check: t => {
      const props = t.v('.boton', 'transition-property').split(',').map(s => s.trim()), d = secs(t.v('.boton', 'transition-duration'));
      const i = props.findIndex(p => p === 'background-color' || p === 'all' || p === 'background');
      return [t.ok(i >= 0, 'Hay una transición para el color de fondo'), t.ok(i >= 0 && t.near(d[i % d.length], 0.3, 0.01), 'La transición dura 0.3s'), t.hover('.boton', () => t.color('.boton', 'background-color', '#FF6FB5', 'Al pasar por encima termina en rosa'))];
    }
  });

  L({
    title: 'Curva de velocidad',
    brief: 'La barra de energía se alarga con hover. Añade una transición de `width` de `1s` que acelere y frene suavemente (`ease-in-out`).',
    html: `<div class="escena"><div class="pista"><div class="barra"></div></div></div>`,
    base: `:where(.pista){margin-top:110px;background:#2a2f5e;border-radius:20px;padding:6px}:where(.barra){height:28px;width:30%;border-radius:14px;background:#FF6FB5}:where(.barra:hover){width:100%}`,
    sim: { target: '.barra' },
    css: `.barra {\n  \n}`,
    cmds: ['transition', 'transition-timing-function'],
    hint: 'El orden habitual es `propiedad duración curva`.',
    help: 'La curva de tiempo (`ease`, `linear`, `ease-in`, `ease-out`, `ease-in-out`) controla cómo se reparte la velocidad durante la transición.',
    solution: `.barra {\n  transition: width 1s ease-in-out;\n}`,
    why: '`ease-in-out` empieza despacio, acelera y frena al final.',
    success: 'Energía al máximo.',
    check: t => {
      const props = t.v('.barra', 'transition-property').split(',').map(s => s.trim());
      const i = props.findIndex(p => p === 'width' || p === 'all');
      const d = secs(t.v('.barra', 'transition-duration')), f = t.v('.barra', 'transition-timing-function').split(/,(?![^(]*\))/).map(s => s.trim());
      return [t.ok(i >= 0, 'Se anima la propiedad width'), t.ok(i >= 0 && t.near(d[i % d.length], 1, 0.01), 'La transición dura 1s'), t.ok(i >= 0 && /ease-in-out|cubic-bezier\(0\.42, 0, 0\.58, 1\)/.test(f[i % f.length]), 'La curva es ease-in-out')];
    }
  });

  L({
    title: 'Despegue lateral',
    brief: 'Mueve el cohete `100px` a la derecha con `transform`, sin usar `position` ni márgenes.',
    html: `<div class="escena"><div class="cosa cohete">🚀</div></div>`,
    base: `:where(.cohete){margin:100px 0 0 20px;font-size:40px}`,
    css: `.cohete {\n  \n}`,
    ghost: '.cohete',
    cmds: ['transform', 'translate()'],
    rule: 'Usa transform.',
    hint: '`transform: translateX(100px)` o `translate(100px, 0)`.',
    help: '`transform` mueve el elemento visualmente sin afectar al diseño: los demás elementos no se enteran. Además, es más eficiente para animar.',
    solution: `.cohete {\n  transform: translateX(100px);\n}`,
    why: 'El hueco original no cambia; solo se dibuja desplazado.',
    success: 'Rumbo al este.',
    check: t => [t.same('.cohete', 'El cohete está en su contorno'), t.ok(t.v('.cohete', 'transform') !== 'none', 'Usas transform'), t.avoid(/position|margin/, 'No usas position ni margin')]
  });

  L({
    title: 'La brújula',
    brief: 'Gira la aguja de la brújula `45` grados en el sentido de las agujas del reloj.',
    html: `<div class="escena"><div class="brujula"><div class="aguja"></div></div></div>`,
    base: `:where(.brujula){width:150px;height:150px;margin:20px auto 0;border-radius:50%;background:#2a2f5e;border:6px solid #FF6FB5;display:flex;align-items:center;justify-content:center}:where(.aguja){width:12px;height:120px;border-radius:6px;background:linear-gradient(#ff5b5b 50%,#fff 50%)}`,
    css: `.aguja {\n  \n}`,
    cmds: ['transform', 'rotate()'],
    hint: 'Los grados se escriben con la unidad `deg`.',
    help: '`rotate(45deg)` gira el elemento sobre su centro. Los valores positivos giran en el sentido del reloj.',
    solution: `.aguja {\n  transform: rotate(45deg);\n}`,
    why: 'La aguja apunta al noreste.',
    success: 'Rumbo fijado.',
    check: t => [t.ok(t.near(t.angle('.aguja'), 45, 0.5), 'La aguja está girada 45°')]
  });

  L({
    title: 'Planeta gigante',
    brief: 'Haz el planeta **1.5 veces** más grande con `scale()`, sin cambiar su `width` ni su `height`.',
    html: `<div class="escena"><div class="cosa planeta">🪐</div></div>`,
    base: `:where(.planeta){margin:90px auto 0;font-size:40px;background:#3a3f78;border-radius:50%;width:70px;height:70px}`,
    css: `.planeta {\n  \n}`,
    ghost: '.planeta',
    cmds: ['transform', 'scale()'],
    hint: '`scale(1.5)`: 1 es el tamaño original.',
    help: '`scale()` agranda o reduce desde el centro. A diferencia de `width`, no empuja a los demás elementos.',
    solution: `.planeta {\n  transform: scale(1.5);\n}`,
    why: 'El planeta crece desde su centro.',
    success: 'Un gigante gaseoso.',
    check: t => [t.same('.planeta', 'El planeta ocupa su contorno'), t.px('.planeta', 'width', 70, 'Su width sigue siendo 70px')]
  });

  L({
    title: 'La puerta de la nave',
    brief: 'La escotilla ya gira `-35deg`, pero lo hace desde el centro y se desencaja. Haz que gire desde su **borde izquierdo**, como una bisagra.',
    html: `<div class="escena"><div class="marco"><div class="escotilla">🚪</div></div></div>`,
    base: `:where(.marco){width:100px;height:150px;margin:30px auto 0;background:#0c0f26;border:4px solid #6b70b5}:where(.escotilla){width:100%;height:100%;background:#FF6FB5;display:flex;align-items:center;justify-content:center;font-size:40px}`,
    css: `.escotilla {\n  transform: rotate(-35deg);\n  \n}`,
    ghost: '.escotilla',
    cmds: ['transform-origin', 'transform'],
    hint: '`transform-origin` acepta palabras como `left`, `center` o `top left`.',
    help: '`transform-origin` es el punto fijo de la transformación. Por defecto es el centro.',
    solution: `.escotilla {\n  transform: rotate(-35deg);\n  transform-origin: left;\n}`,
    why: 'El borde izquierdo queda fijo, como una bisagra.',
    success: 'Escotilla abierta.',
    check: t => [t.same('.escotilla', 'La escotilla gira desde su bisagra izquierda'), t.ok(t.near(t.angle('.escotilla'), -35, 0.5), 'Sigue girada -35°')]
  });

  L({
    title: 'El orden importa',
    brief: 'El vagón debe acabar **80px a la derecha y girado 90°**, como marca el contorno. Combina `translate()` y `rotate()` en un mismo `transform`; prueba en qué orden.',
    html: `<div class="escena"><div class="vagon">🚃 Vagón</div></div>`,
    base: `:where(.vagon){width:110px;height:50px;margin:110px 0 0 60px;background:#FF6FB5;color:#15193A;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:800}`,
    css: `.vagon {\n  \n}`,
    ghost: '.vagon',
    cmds: ['transform', 'translate()', 'rotate()'],
    hint: 'Las funciones se aplican en orden y cada una cambia los ejes de las siguientes.',
    help: 'Si giras primero, «derecha» pasa a ser «abajo». Por eso `translateX(80px) rotate(90deg)` no da lo mismo que `rotate(90deg) translateX(80px)`.',
    solution: `.vagon {\n  transform: translateX(80px) rotate(90deg);\n}`,
    why: 'Primero se desplaza a la derecha y después gira sobre sí mismo.',
    success: 'Vagón en vía.',
    check: t => [t.same('.vagon', 'El vagón está en su contorno')]
  });

  L({
    title: 'Diana centrada',
    brief: 'Centra la diana en la escena **sea cual sea su tamaño**: `position: absolute`, `top` y `left` al `50%` y un `translate()` que la mueva hacia atrás la mitad de su propio tamaño.',
    html: `<div class="escena campo"><div class="diana">🎯</div></div>`,
    base: `:where(.campo){position:relative}:where(.diana){width:90px;height:70px;background:#FF6FB5;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:40px}`,
    resizable: true,
    css: `.diana {\n  \n}`,
    cmds: ['position', 'top', 'left', 'translate()', '%'],
    rule: 'Se comprueba con dos tamaños de escena y de diana.',
    hint: 'En `translate()`, los porcentajes se refieren al tamaño del propio elemento: `translate(-50%, -50%)`.',
    help: '`top: 50%; left: 50%` coloca la esquina superior izquierda en el centro; `translate(-50%, -50%)` la retrocede medio ancho y medio alto.',
    solution: `.diana {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}`,
    why: 'Funciona sin conocer el tamaño de la diana.',
    success: '¡Diana!',
    check: t => [t.center('.diana', '.campo', 'La diana está centrada'), t.at(600, () => t.center('.diana', '.campo', 'Sigue centrada con la escena a 600px')), (() => { const d = t.q('.diana'); const o = d.style.cssText; d.style.width = '140px'; d.style.height = '40px'; const r = t.center('.diana', '.campo', 'Sigue centrada aunque cambie de tamaño'); d.style.cssText = o; return r; })()]
  });

  L({
    title: 'Corazón que late',
    brief: 'Crea la animación `latido` con `@keyframes` (de `scale(1)` a `scale(1.3)`) y aplícala al corazón: `1s`, repetición infinita y en dirección `alternate`.',
    html: `<div class="escena"><div class="cosa corazon">💖</div></div>`,
    base: `:where(.corazon){margin:90px auto 0;font-size:50px;width:70px;height:70px}`,
    css: `@keyframes latido {\n  from {  }\n  to {  }\n}\n\n.corazon {\n  \n}`,
    cmds: ['@keyframes', 'animation', 'animation-iteration-count', 'animation-direction'],
    hint: 'Dentro de `from` y `to` va `transform`. Después: `animation: latido 1s infinite alternate;`.',
    help: '`@keyframes` define los pasos de la animación; `animation` la aplica con su duración, repeticiones y dirección. `alternate` hace ida y vuelta.',
    solution: `@keyframes latido {\n  from { transform: scale(1); }\n  to { transform: scale(1.3); }\n}\n\n.corazon {\n  animation: latido 1s infinite alternate;\n}`,
    why: 'El corazón crece y vuelve a su tamaño sin parar.',
    success: 'Pum, pum.',
    check: t => [
      t.ok(!!t.kf('latido'), 'Existe @keyframes latido'), t.eq('.corazon', 'animation-name', 'latido', 'El corazón usa la animación latido'),
      t.ok(t.near(secs(t.v('.corazon', 'animation-duration'))[0], 1, 0.01), 'La animación dura 1s'), t.eq('.corazon', 'animation-iteration-count', 'infinite', 'Se repite sin fin'), t.eq('.corazon', 'animation-direction', 'alternate', 'Va y vuelve (alternate)'),
      t.frame('.corazon', 0.999, () => t.ok(t.near(t.rect('.corazon').w, 70 * 1.3, 1.5), 'Al final del ciclo mide 1.3 veces su tamaño'))
    ]
  });

  L({
    title: 'Noria sin fin',
    brief: 'Ya existe la animación `girar` (una vuelta completa). Aplícala a la noria: `4s`, velocidad **constante** (`linear`) e **infinita**.',
    html: `<div class="escena"><div class="cosa noria">🎡</div></div>`,
    base: `@keyframes girar{to{transform:rotate(360deg)}}:where(.noria){margin:70px auto 0;font-size:90px;width:120px;height:120px}`,
    css: `.noria {\n  \n}`,
    cmds: ['animation', 'animation-timing-function', 'animation-iteration-count'],
    hint: 'Una sola línea: `animation: nombre duración curva repeticiones;`.',
    help: 'Con `linear` la velocidad es constante, ideal para giros continuos. Con `ease` frenaría en cada vuelta.',
    solution: `.noria {\n  animation: girar 4s linear infinite;\n}`,
    why: 'Gira sin tirones y sin parar.',
    success: 'La noria no se detiene.',
    check: t => [t.eq('.noria', 'animation-name', 'girar', 'Usa la animación girar'), t.ok(t.near(secs(t.v('.noria', 'animation-duration'))[0], 4, 0.01), 'La animación dura 4s'), t.eq('.noria', 'animation-timing-function', 'linear', 'La velocidad es constante (linear)'), t.eq('.noria', 'animation-iteration-count', 'infinite', 'Se repite sin fin')]
  });

  L({
    title: 'Rebote',
    brief: 'Crea `@keyframes bote` con tres pasos: en `0%` y `100%` la pelota está en su sitio (`translateY(0)`), y en `50%` sube `60px` (`translateY(-60px)`). Aplícala con `1s` e infinita.',
    html: `<div class="escena"><div class="cosa pelota">⚽</div></div>`,
    base: `:where(.pelota){margin:150px auto 0;font-size:44px}`,
    css: `@keyframes bote {\n  \n}\n\n.pelota {\n  \n}`,
    ghost: '.pelota',
    cmds: ['@keyframes', 'animation', 'translate()'],
    hint: 'Los porcentajes marcan momentos del ciclo: `0%, 100% { … }` y `50% { … }`.',
    help: 'Con porcentajes puedes definir tantos pasos como quieras. Varios pasos pueden compartir bloque separándolos con comas.',
    solution: `@keyframes bote {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-60px); }\n}\n\n.pelota {\n  animation: bote 1s infinite;\n}`,
    why: 'Sube a mitad del ciclo y vuelve al final.',
    success: '¡Gol de animación!',
    check: t => [t.ok(!!t.kf('bote'), 'Existe @keyframes bote'), t.eq('.pelota', 'animation-iteration-count', 'infinite', 'Se repite sin fin'), t.frame('.pelota', 0.5, () => t.same('.pelota', 'A mitad del ciclo la pelota está 60px más arriba'), 'bote'), t.frame('.pelota', 0, () => t.same('.pelota', 'Al empezar está en su sitio'), 'bote')]
  });

  L({
    title: 'Aparición estelar',
    brief: 'La estrella empieza invisible. Aplica la animación `aparecer` (ya existe) con `1s` de duración, **esperando `0.5s`** antes de empezar, y que **se quede visible** al terminar.',
    html: `<div class="escena"><div class="cosa estrella">🌟</div></div>`,
    base: `@keyframes aparecer{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:scale(1)}}:where(.estrella){margin:90px auto 0;font-size:60px;opacity:0}`,
    css: `.estrella {\n  \n}`,
    cmds: ['animation', 'animation-delay', 'animation-fill-mode'],
    hint: 'En el atajo, el primer tiempo es la duración y el segundo, el retraso. El valor que conserva el final es `forwards`.',
    help: 'Sin `animation-fill-mode: forwards`, al terminar la animación el elemento vuelve a su estilo original (aquí, invisible).',
    solution: `.estrella {\n  animation: aparecer 1s 0.5s forwards;\n}`,
    why: 'Espera medio segundo, aparece en uno y se queda.',
    success: 'Una estrella ha nacido.',
    check: t => [t.eq('.estrella', 'animation-name', 'aparecer', 'Usa la animación aparecer'), t.ok(t.near(secs(t.v('.estrella', 'animation-duration'))[0], 1, 0.01), 'La animación dura 1s'), t.ok(t.near(secs(t.v('.estrella', 'animation-delay'))[0], 0.5, 0.01), 'Espera 0.5s'), t.ok(/forwards|both/.test(t.v('.estrella', 'animation-fill-mode')), 'Se queda visible al terminar'), t.frame('.estrella', 1.5, () => t.ok(+t.v('.estrella', 'opacity') > 0.99, 'Al terminar la opacidad es 1'))]
  });

  L({
    title: 'Color de marca',
    brief: 'Define la variable `--principal: #7b2ff7` en `:root` y úsala con `var()` para el fondo del cartel, el texto del título y el borde del botón.',
    html: `<div class="escena"><div class="cartel">Feria</div><h2 class="titulo">Atracciones</h2><button class="boton">Entradas</button></div>`,
    base: `:where(.cartel){padding:10px;color:#fff;font-weight:800;border-radius:10px;background:#555}:where(.titulo){color:#fff}:where(.boton){padding:10px 16px;background:transparent;color:#fff;border:3px solid #fff;border-radius:10px}`,
    css: `:root {\n  \n}\n\n.cartel {\n  \n}\n\n.titulo {\n  \n}\n\n.boton {\n  \n}`,
    cmds: ['--variable', 'var()'],
    rule: 'El color #7b2ff7 debe aparecer una sola vez en tu código.',
    hint: 'Primero `--principal: #7b2ff7;` dentro de `:root`. Después, `background-color: var(--principal);`.',
    help: 'Las variables CSS guardan un valor con nombre. Si un día cambia el color de marca, lo cambias en un solo sitio.',
    solution: `:root {\n  --principal: #7b2ff7;\n}\n\n.cartel {\n  background-color: var(--principal);\n}\n\n.titulo {\n  color: var(--principal);\n}\n\n.boton {\n  border-color: var(--principal);\n}`,
    why: 'Un único punto de cambio para todo el tema.',
    success: 'Marca coherente en toda la feria.',
    check: t => [t.color('.cartel', 'background-color', '#7b2ff7', 'El cartel es #7b2ff7'), t.color('.titulo', 'color', '#7b2ff7', 'El título es #7b2ff7'), t.color('.boton', 'border-top-color', '#7b2ff7', 'El borde del botón es #7b2ff7'), t.ok((t.css.match(/#7b2ff7/gi) || []).length === 1, 'El color aparece una sola vez'), t.ok((t.css.match(/var\(\s*--principal\s*\)/g) || []).length >= 3, 'Usas var(--principal) en los tres elementos')]
  });

  L({
    title: 'Modo nocturno',
    brief: 'Las tarjetas usan `var(--fondo)` y `var(--texto)`. Para la tarjeta `.oscura`, **cambia solo las variables**: `--fondo: #222` y `--texto: #fff`.',
    html: `<div class="escena"><div class="tarjeta">Montaña rusa</div><div class="tarjeta oscura">Tren fantasma</div></div>`,
    base: `:where(.tarjeta){--fondo:#ffffff;--texto:#222222;background:var(--fondo);color:var(--texto);padding:14px;border-radius:12px;margin-bottom:10px;font-weight:700}`,
    css: `.oscura {\n  \n}`,
    cmds: ['--variable', 'var()'],
    rule: 'No escribas background ni color: solo las variables.',
    hint: 'Las variables se heredan y se pueden redefinir en cualquier selector.',
    help: 'Una variable redefinida en un elemento afecta a él y a sus descendientes. Así se crean temas sin repetir reglas.',
    solution: `.oscura {\n  --fondo: #222;\n  --texto: #fff;\n}`,
    why: 'Las mismas reglas producen otro aspecto con otros valores.',
    success: 'Tren fantasma, ambientado.',
    check: t => [t.color('.oscura', 'background-color', '#222', 'La tarjeta oscura tiene fondo #222'), t.color('.oscura', 'color', '#fff', 'Su texto es blanco'), t.color('.tarjeta:not(.oscura)', 'background-color', '#fff', 'La otra tarjeta no cambia'), t.avoid(/(^|[;{\s])(background(-color)?|color)\s*:/, 'Solo cambias variables')]
  });

  L({
    title: 'Atardecer',
    brief: 'Pinta el cielo con un degradado **de izquierda a derecha** de `#ff7e5f` a `#feb47b`.',
    html: `<div class="escena"><div class="cielo"></div></div>`,
    base: `:where(.cielo){height:100%;border-radius:14px;background:#333}`,
    css: `.cielo {\n  \n}`,
    cmds: ['linear-gradient()', 'background'],
    hint: '`background: linear-gradient(to right, color1, color2);`.',
    help: 'Un degradado es una imagen generada por CSS: se pone en `background` o `background-image`. La dirección va primero.',
    solution: `.cielo {\n  background: linear-gradient(to right, #ff7e5f, #feb47b);\n}`,
    why: 'El color pasa poco a poco de uno a otro.',
    success: 'Qué atardecer.',
    check: t => { const v = t.v('.cielo', 'background-image'); return [t.ok(/linear-gradient/.test(v), 'El fondo es un degradado lineal'), t.ok(/to right|90deg/.test(v), 'Va de izquierda a derecha'), t.ok(/rgb\(255, 126, 95\)/.test(v) && /rgb\(254, 180, 123\)/.test(v), 'Usa #ff7e5f y #feb47b')]; }
  });

  L({
    title: 'Sol radiante',
    brief: 'Dibuja el sol con un degradado **circular**: amarillo (`yellow`) en el centro y naranja (`orange`) en el borde.',
    html: `<div class="escena"><div class="sol"></div></div>`,
    base: `:where(.sol){width:140px;height:140px;margin:30px auto 0;border-radius:50%;background:#444}`,
    css: `.sol {\n  \n}`,
    cmds: ['radial-gradient()', 'background'],
    hint: '`radial-gradient(circle, yellow, orange)`.',
    help: '`radial-gradient` crece desde el centro hacia fuera. `circle` lo hace redondo; sin él, es una elipse.',
    solution: `.sol {\n  background: radial-gradient(circle, yellow, orange);\n}`,
    why: 'El centro brilla más que el borde.',
    success: 'Sol de feria.',
    check: t => { const v = t.v('.sol', 'background-image'); return [t.ok(/radial-gradient/.test(v), 'El fondo es un degradado radial'), t.ok(/rgb\(255, 255, 0\)[^)]*rgb\(255, 165, 0\)/.test(v.replace(/\)\s*,/g, '),')), 'Va de amarillo en el centro a naranja')]; }
  });

  L({
    title: 'Diagonal neón',
    brief: 'El letrero necesita un degradado en diagonal de `135deg`, de `#00c6ff` a `#ff6fb5`.',
    html: `<div class="escena"><div class="neon">FERIA</div></div>`,
    base: `:where(.neon){margin:60px auto 0;width:220px;padding:30px 0;text-align:center;font:900 36px/1 sans-serif;color:#fff;border-radius:16px;background:#333}`,
    css: `.neon {\n  \n}`,
    cmds: ['linear-gradient()', 'background'],
    hint: 'La dirección puede ser un ángulo: `linear-gradient(135deg, …)`.',
    help: 'En los degradados, `0deg` apunta hacia arriba y los ángulos giran en el sentido del reloj: `90deg` es hacia la derecha y `135deg`, hacia abajo a la derecha.',
    solution: `.neon {\n  background: linear-gradient(135deg, #00c6ff, #ff6fb5);\n}`,
    why: 'El degradado cruza el letrero en diagonal.',
    success: 'Brilla en la noche.',
    check: t => { const v = t.v('.neon', 'background-image'); return [t.ok(/linear-gradient\(135deg/.test(v), 'El degradado va a 135deg'), t.ok(/rgb\(0, 198, 255\)/.test(v) && /rgb\(255, 111, 181\)/.test(v), 'Va de #00c6ff a #ff6fb5')]; }
  });

  L({
    title: 'Foto antigua',
    brief: 'Convierte la foto del recuerdo en **blanco y negro** con un filtro.',
    html: `<div class="escena"><div class="foto">🎠</div></div>`,
    base: `:where(.foto){width:150px;height:150px;margin:30px auto 0;border:8px solid #fff;font-size:90px;display:flex;align-items:center;justify-content:center;background:linear-gradient(#ff6fb5,#ffd447)}`,
    css: `.foto {\n  \n}`,
    cmds: ['filter'],
    hint: 'El filtro se llama `grayscale()`; `100%` (o `1`) es blanco y negro total.',
    help: '`filter` aplica efectos como `blur()`, `grayscale()`, `sepia()`, `brightness()` o `contrast()`. Se pueden combinar.',
    solution: `.foto {\n  filter: grayscale(100%);\n}`,
    why: 'Todo el elemento pierde el color.',
    success: 'Recuerdo para el álbum.',
    check: t => { const m = t.v('.foto', 'filter').match(/grayscale\(([\d.]+)(%?)\)/); return [t.ok(!!m && (m[2] ? +m[1] >= 100 : +m[1] >= 1), 'La foto está en blanco y negro')]; }
  });

  L({
    title: 'Tarjeta que se eleva',
    brief: 'Al pasar por encima, la tarjeta debe **subir `8px`** con `transform`, con una transición de `transform` de `0.2s`.',
    html: `<div class="escena"><div class="tarjeta">🎟️ Pase VIP</div></div>`,
    base: `:where(.tarjeta){margin:90px auto 0;width:200px;padding:20px;border-radius:14px;background:#fff;color:#15193A;font-weight:800;text-align:center;box-shadow:0 4px 0 #FF6FB5}`,
    sim: { target: '.tarjeta' },
    css: `.tarjeta {\n  \n}\n\n.tarjeta:hover {\n  \n}`,
    cmds: ['transition', 'transform', ':hover', 'translate()'],
    hint: 'La transición va en `.tarjeta` y el desplazamiento en `.tarjeta:hover`.',
    help: 'Animar `transform` y `opacity` es lo más fluido: el navegador no tiene que recalcular el diseño.',
    solution: `.tarjeta {\n  transition: transform 0.2s;\n}\n\n.tarjeta:hover {\n  transform: translateY(-8px);\n}`,
    why: 'Una microinteracción que invita a tocar.',
    success: 'Interfaz con vida.',
    check: t => {
      const y0 = t.rect('.tarjeta').y;
      const props = t.v('.tarjeta', 'transition-property').split(',').map(s => s.trim()), d = secs(t.v('.tarjeta', 'transition-duration'));
      const i = props.findIndex(p => p === 'transform' || p === 'all');
      return [t.ok(i >= 0 && t.near(d[i % d.length], 0.2, 0.01), 'Hay una transición de transform de 0.2s'), t.hover('.tarjeta', () => t.ok(t.near(t.rect('.tarjeta').y, y0 - 8, 0.5), 'Con hover, la tarjeta sube 8px'))];
    }
  });

  L({
    title: 'Lanzamiento',
    brief: 'Reto del mundo. Define `--brillo: #ffd447` y úsalo como color del rótulo. Pinta el cielo con un degradado lineal de arriba (`#15193A`) abajo (`#FF6FB5`). Crea `@keyframes despegue` que lleve el cohete de `translateY(0)` a `translateY(-120px)` y aplícalo con `2s`, `ease-in` e infinito.',
    html: `<div class="escena cielo"><p class="rotulo">Cuenta atrás</p><div class="cosa cohete">🚀</div></div>`,
    base: `:where(.cielo){background:#15193A}:where(.rotulo){margin:0;font-weight:900;font-size:20px;color:#fff}:where(.cohete){margin:120px auto 0;font-size:44px}`,
    css: `:root {\n  \n}\n`,
    ghost: '.cohete',
    cmds: ['--variable', 'var()', 'linear-gradient()', '@keyframes', 'animation', 'translate()'],
    hint: 'Son cuatro piezas independientes: variable, degradado, @keyframes y animation.',
    help: 'Este reto combina variables, degradados y animaciones con fotogramas.',
    solution: `:root {\n  --brillo: #ffd447;\n}\n\n.rotulo {\n  color: var(--brillo);\n}\n\n.cielo {\n  background: linear-gradient(#15193A, #FF6FB5);\n}\n\n@keyframes despegue {\n  from { transform: translateY(0); }\n  to { transform: translateY(-120px); }\n}\n\n.cohete {\n  animation: despegue 2s ease-in infinite;\n}`,
    why: 'Cada técnica aporta una capa: color, ambiente y movimiento.',
    success: '¡Mundo 9 completado! Tus interfaces ya tienen movimiento.',
    check: t => {
      const bg = t.v('.cielo', 'background-image');
      return [
        t.color('.rotulo', 'color', '#ffd447', 'El rótulo es #ffd447'), t.uses(/--brillo\s*:/, 'Defines --brillo'), t.uses(/var\(\s*--brillo\s*\)/, 'Usas var(--brillo)'),
        t.ok(/linear-gradient/.test(bg) && /rgb\(21, 25, 58\)[\s\S]*rgb\(255, 111, 181\)/.test(bg) && !/to right|deg/.test(bg.replace('180deg', '')), 'El cielo va de #15193A arriba a #FF6FB5 abajo'),
        t.ok(!!t.kf('despegue'), 'Existe @keyframes despegue'), t.eq('.cohete', 'animation-iteration-count', 'infinite', 'El despegue se repite sin fin'),
        t.eq('.cohete', 'animation-timing-function', 'ease-in', 'La curva es ease-in'), t.ok(t.near(secs(t.v('.cohete', 'animation-duration'))[0], 2, 0.01), 'La animación dura 2s'),
        t.frame('.cohete', 0.999, () => t.same('.cohete', 'Al final del ciclo el cohete ha subido 120px'), 'despegue')
      ];
    }
  });
})();
