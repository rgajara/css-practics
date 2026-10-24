/* Mundo 5 — Puerto: Flexbox (niveles 81–100)
   Cada barco debe llegar a su muelle (contorno discontinuo de su color). */
(function () {
  const L = d => CQ.LV(5, d);
  const B = (c, e) => `<div class="barco ${c}">${e || '⛵'}</div>`;
  const port = inner => `<div class="puerto">${inner}</div>`;
  const three = port(B('rojo') + B('amarillo') + B('verde'));
  const flexStart = `.puerto {\n  display: flex;\n  \n}`;

  L({
    title: 'Zarpar en fila',
    brief: 'Los barcos están apilados uno encima de otro. Convierte el puerto en un **contenedor flexible** para que se pongan en fila, cada uno en su muelle.',
    html: three, css: `.puerto {\n  \n}`, ghost: '.barco',
    cmds: ['display: flex', 'display'],
    hint: 'Una sola declaración en el contenedor: `display` con el valor adecuado.',
    help: 'Con `display: flex`, los hijos directos del contenedor se colocan en una fila (el **eje principal**) de izquierda a derecha.',
    solution: `.puerto {\n  display: flex;\n}`,
    why: 'El contenedor flexible coloca a sus hijos en fila.',
    success: '¡Tu primer contenedor flexible!',
    check: t => [t.same('.barco', 'Cada barco está en su muelle'), t.eq('.puerto', 'display', 'flex', 'El puerto es un contenedor flex')]
  });

  L({
    title: 'Hacia la derecha',
    brief: 'Lleva los barcos al final de la fila con `justify-content`.',
    html: three, css: flexStart, ghost: '.barco',
    cmds: ['justify-content', ['flex-end', 'coloca los elementos al final del eje principal.'], ['center', 'los centra en el eje principal.']],
    hint: 'El valor que manda los elementos al final es `flex-end`.',
    help: '`justify-content` reparte los elementos a lo largo del **eje principal** (en fila, de izquierda a derecha). Valores: `flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `space-evenly`.',
    solution: `.puerto {\n  display: flex;\n  justify-content: flex-end;\n}`,
    why: '`flex-end` agrupa los barcos al final del eje principal.',
    success: 'Atracados a estribor.',
    check: t => [t.same('.barco', 'Cada barco está en su muelle')]
  });

  L({
    title: 'Muelle central',
    brief: 'Ahora los muelles están en el **centro** del puerto.',
    html: three, css: flexStart, ghost: '.barco',
    cmds: ['justify-content'],
    hint: '¿Qué valor de `justify-content` centra?',
    help: '`justify-content: center` agrupa los elementos en el centro del eje principal.',
    solution: `.puerto {\n  display: flex;\n  justify-content: center;\n}`,
    why: 'El espacio libre se reparte por igual a ambos lados del grupo.',
    success: 'En pleno centro.',
    check: t => [t.same('.barco', 'Cada barco está en su muelle')]
  });

  L({
    title: 'De punta a punta',
    brief: 'Los muelles están en los extremos y en medio. Reparte los barcos con el **primero al principio y el último al final**.',
    html: three, css: flexStart, ghost: '.barco',
    cmds: ['justify-content', ['space-between', 'reparte el espacio entre elementos; los extremos tocan los bordes.']],
    hint: 'Busca el valor que pone espacio **entre** los elementos.',
    help: '`space-between` deja el primer elemento al inicio, el último al final y reparte el resto del espacio entre ellos.',
    solution: `.puerto {\n  display: flex;\n  justify-content: space-between;\n}`,
    why: 'Todo el espacio libre queda entre los barcos.',
    success: 'Puerto bien aprovechado.',
    check: t => [t.same('.barco', 'Cada barco está en su muelle')]
  });

  L({
    title: 'Huecos iguales',
    brief: 'Esta vez los huecos deben ser **todos iguales**, también los de los bordes.',
    html: three, css: flexStart, ghost: '.barco',
    cmds: ['justify-content', ['space-around', 'espacio igual alrededor de cada elemento (los bordes reciben la mitad).'], ['space-evenly', 'todos los huecos iguales, también en los bordes.']],
    hint: 'Hay dos valores parecidos. Fíjate en los huecos de los extremos.',
    help: '`space-around` da a cada elemento el mismo espacio a su alrededor, así que los bordes reciben la mitad. `space-evenly` iguala todos los huecos.',
    solution: `.puerto {\n  display: flex;\n  justify-content: space-evenly;\n}`,
    why: 'Con `space-evenly` hay cuatro huecos idénticos.',
    success: 'Simetría marinera.',
    check: t => [t.same('.barco', 'Cada barco está en su muelle')]
  });

  L({
    title: 'Al fondo del puerto',
    brief: 'Los muelles están en la parte **inferior**. Usa `align-items` para mover los barcos en el eje transversal.',
    html: three, css: flexStart, ghost: '.barco',
    cmds: ['align-items', ['flex-end', 'en align-items, al final del eje transversal (abajo en una fila).']],
    hint: 'En una fila, el eje transversal es el vertical.',
    help: '`align-items` alinea los elementos en el **eje transversal**, perpendicular al principal. Valores: `flex-start`, `flex-end`, `center`, `baseline`, `stretch`.',
    solution: `.puerto {\n  display: flex;\n  align-items: flex-end;\n}`,
    why: 'En fila, el eje transversal va de arriba abajo.',
    success: 'Anclados abajo.',
    check: t => [t.same('.barco', 'Cada barco está en su muelle')]
  });

  L({
    title: 'Centro perfecto',
    brief: 'El muelle está justo en el **centro** del puerto, en horizontal y en vertical.',
    html: port(B('azul', '🛳️')), css: flexStart, ghost: '.barco',
    cmds: ['justify-content', 'align-items'],
    hint: 'Combina las dos propiedades de alineación con el mismo valor.',
    help: '`justify-content: center` centra en el eje principal y `align-items: center`, en el transversal. Juntas centran en los dos ejes.',
    solution: `.puerto {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}`,
    why: 'Es la forma más usada de centrar algo en CSS.',
    success: 'La receta más famosa de CSS, dominada.',
    check: t => [t.same('.barco', 'El barco está en su muelle'), t.center('.barco', '.puerto', 'Está centrado en ambos ejes')]
  });

  L({
    title: 'Convoy en columna',
    brief: 'Los muelles están uno debajo de otro. Cambia la **dirección** del eje principal.',
    html: three, css: flexStart, ghost: '.barco',
    cmds: ['flex-direction', ['column', 'el eje principal va de arriba abajo.']],
    hint: '`flex-direction` acepta `row`, `row-reverse`, `column` y `column-reverse`.',
    help: 'Con `flex-direction: column` el eje principal pasa a ser vertical: los elementos se apilan y `justify-content` actúa en vertical.',
    solution: `.puerto {\n  display: flex;\n  flex-direction: column;\n}`,
    why: 'El eje principal ahora va hacia abajo.',
    success: 'Convoy ordenado.',
    check: t => [t.same('.barco', 'Cada barco está en su muelle')]
  });

  L({
    title: 'Al revés',
    brief: 'Los colores de los muelles están en **orden inverso** y pegados a la derecha. No cambies el HTML: invierte la dirección de la fila.',
    html: three, css: flexStart, ghost: '.barco',
    cmds: ['flex-direction', ['row-reverse', 'fila de derecha a izquierda.']],
    hint: 'Hay una dirección que es una fila pero empieza por el otro lado.',
    help: '`row-reverse` invierte el eje principal: el primer elemento queda a la derecha y `flex-start` pasa a ser el borde derecho.',
    solution: `.puerto {\n  display: flex;\n  flex-direction: row-reverse;\n}`,
    why: 'El inicio del eje está ahora a la derecha.',
    success: 'Marcha atrás perfecta.',
    check: t => [t.same('.barco', 'Cada barco está en el muelle de su color')]
  });

  L({
    title: 'Columna al fondo',
    brief: 'Los barcos van en columna y pegados **abajo**. Con columna, ¿qué propiedad mueve en vertical?',
    html: three, css: `.puerto {\n  display: flex;\n  flex-direction: column;\n  \n}`, ghost: '.barco',
    cmds: ['flex-direction', 'justify-content', 'align-items'],
    hint: 'Al cambiar la dirección, `justify-content` pasa a trabajar en vertical.',
    help: 'Los ejes giran con `flex-direction`: en columna, `justify-content` es vertical y `align-items` es horizontal.',
    solution: `.puerto {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-end;\n}`,
    why: 'En columna, el eje principal es vertical: `flex-end` está abajo.',
    success: 'Ya piensas en ejes, no en direcciones.',
    check: t => [t.same('.barco', 'Cada barco está en su muelle'), t.eq('.puerto', 'flex-direction', 'column', 'El puerto sigue en columna')]
  });

  L({
    title: 'El último en llegar',
    brief: 'El barco rojo tiene que ir al **final** de la fila. Cámbialo de orden sin tocar los otros barcos ni el HTML.',
    html: three, css: `.puerto {\n  display: flex;\n}\n\n.rojo {\n  \n}`, ghost: '.barco',
    cmds: ['order'],
    hint: 'Todos los elementos tienen `order: 0` por defecto. Un número mayor va después.',
    help: '`order` cambia el orden visual de un elemento flexible. Los elementos se ordenan de menor a mayor valor.',
    solution: `.puerto {\n  display: flex;\n}\n\n.rojo {\n  order: 1;\n}`,
    why: 'El rojo, con order 1, va detrás de los que tienen 0.',
    success: 'Turno de atraque actualizado.',
    check: t => [t.same('.barco', 'Cada barco está en el muelle de su color')]
  });

  L({
    title: 'Por libre',
    brief: 'Los barcos están arriba, pero el amarillo tiene su muelle **abajo**. Alinea solo ese barco.',
    html: three, css: `.puerto {\n  display: flex;\n  justify-content: center;\n}\n\n.amarillo {\n  \n}`, ghost: '.barco',
    cmds: ['align-self'],
    hint: '`align-self` acepta los mismos valores que `align-items`, pero solo para un elemento.',
    help: '`align-self` sobrescribe la alineación transversal de un único elemento.',
    solution: `.puerto {\n  display: flex;\n  justify-content: center;\n}\n\n.amarillo {\n  align-self: flex-end;\n}`,
    why: 'Solo el amarillo cambia de alineación.',
    success: 'Independiente, pero ordenado.',
    check: t => [t.same('.barco', 'Cada barco está en su muelle')]
  });

  L({
    title: 'Flota completa',
    brief: 'Llegan diez barcos y no caben en una fila: se estrujan. Deja que **salten a una nueva línea**.',
    html: port(['rojo', 'amarillo', 'verde', 'azul', 'rojo', 'amarillo', 'verde', 'azul', 'rojo', 'amarillo'].map(c => B(c)).join('')),
    base: `:where(.barco){flex-shrink:1}`,
    css: flexStart, ghost: '.barco',
    cmds: ['flex-wrap', ['wrap', 'los elementos pasan a otra línea si no caben.']],
    hint: 'Por defecto `flex-wrap` es `nowrap`.',
    help: '`flex-wrap: wrap` permite que los elementos que no caben bajen a la siguiente línea en lugar de encogerse.',
    solution: `.puerto {\n  display: flex;\n  flex-wrap: wrap;\n}`,
    why: 'Los barcos mantienen su tamaño y forman dos filas.',
    success: 'Toda la flota a salvo.',
    check: t => [t.same('.barco', 'Cada barco está en su muelle'), t.size('.barco', 56, 56, 'Los barcos no se deforman')]
  });

  L({
    title: 'Distancia de seguridad',
    brief: 'Los barcos están pegados. Deja `16px` de separación entre ellos, sin márgenes: con la propiedad del contenedor que crea huecos.',
    html: port(B('rojo') + B('amarillo') + B('verde') + B('azul')), css: flexStart, ghost: '.barco',
    cmds: ['gap', 'margin'],
    rule: 'No uses margin en los barcos.',
    hint: 'La propiedad se escribe en el contenedor, no en los barcos.',
    help: '`gap` añade espacio solo **entre** elementos (no en los bordes). Funciona en flex y en grid.',
    solution: `.puerto {\n  display: flex;\n  gap: 16px;\n}`,
    why: 'El hueco se aplica entre cada par de barcos.',
    success: 'Navegación segura.',
    check: t => [t.same('.barco', 'Cada barco está en su muelle'), t.avoid(/margin/, 'No usas margin'), t.px('.puerto', 'column-gap', 16, 'Hay un gap de 16px')]
  });

  L({
    title: 'El buque crece',
    brief: 'El portacontenedores debe **crecer** para ocupar todo el espacio libre de la fila.',
    html: port(B('rojo', '🚤') + `<div class="barco azul largo">🚢</div>` + B('verde', '🚤')), css: `.puerto {\n  display: flex;\n}\n\n.largo {\n  \n}`, ghost: '.barco',
    cmds: ['flex-grow'],
    hint: 'Con `flex-grow: 1` el elemento toma el espacio sobrante.',
    help: '`flex-grow` indica qué parte del espacio libre recibe cada elemento. Por defecto es 0: no crece.',
    solution: `.puerto {\n  display: flex;\n}\n\n.largo {\n  flex-grow: 1;\n}`,
    why: 'Es el único que puede crecer, así que se queda todo el espacio libre.',
    success: 'Un buque a la medida del muelle.',
    check: t => [t.same('.barco', 'Cada barco ocupa su muelle')]
  });

  L({
    title: 'Reparto desigual',
    brief: 'Dos barcos crecen, pero el azul debe recibir **el doble** de espacio libre que el verde.',
    html: port(`<div class="barco verde g1">🚤</div><div class="barco azul g2">🚢</div>`), css: `.puerto {\n  display: flex;\n}\n`, ghost: '.barco',
    cmds: ['flex-grow'],
    hint: 'Los valores de `flex-grow` son proporciones.',
    help: 'Si uno tiene `flex-grow: 1` y otro `flex-grow: 2`, el espacio libre se reparte en tres partes: una para el primero y dos para el segundo.',
    solution: `.puerto {\n  display: flex;\n}\n\n.g1 {\n  flex-grow: 1;\n}\n\n.g2 {\n  flex-grow: 2;\n}`,
    why: '1 parte frente a 2 partes del espacio libre.',
    success: 'Reparto justo… según la proporción.',
    check: t => [t.same('.barco', 'Cada barco ocupa su muelle')]
  });

  L({
    title: 'No me encojas',
    brief: 'Tres barcos de `150px` no caben y todos encogen. El amarillo transporta cristal: **no debe encoger**.',
    html: port(B('rojo') + `<div class="barco amarillo firme">🍷</div>` + B('verde')),
    base: `:where(.barco){width:150px;flex-shrink:1}`,
    css: `.puerto {\n  display: flex;\n}\n\n.firme {\n  \n}`, ghost: '.barco',
    cmds: ['flex-shrink'],
    hint: 'El valor 0 impide encoger.',
    help: '`flex-shrink` controla cuánto encoge un elemento cuando falta espacio. Con `0` conserva su tamaño y los demás encogen más.',
    solution: `.puerto {\n  display: flex;\n}\n\n.firme {\n  flex-shrink: 0;\n}`,
    why: 'El amarillo mantiene sus 150px; los otros absorben la falta de espacio.',
    success: 'El cristal llegó entero.',
    check: t => [t.same('.barco', 'Cada barco ocupa su muelle'), t.size('.firme', 150, null, 'El barco amarillo mide 150px')]
  });

  L({
    title: 'Muelles idénticos',
    brief: 'Los tres barcos tienen nombres de distinta longitud. Haz que los tres midan **exactamente lo mismo** y llenen la fila.',
    html: port(`<div class="barco rojo n">Sol</div><div class="barco amarillo n">Gaviota</div><div class="barco verde n">Estrella de mar</div>`),
    base: `:where(.n){width:auto;font-size:14px;font-weight:700;padding:0 8px}`,
    css: `.puerto {\n  display: flex;\n}\n\n.n {\n  \n}`, ghost: '.barco',
    cmds: ['flex', 'flex-grow', 'flex-basis'],
    hint: '`flex-grow: 1` no basta: reparte el espacio libre, pero cada barco parte de su contenido. Pon también la base a 0.',
    help: '`flex: 1` equivale a `flex-grow: 1; flex-shrink: 1; flex-basis: 0`. Con base 0, todo el ancho se reparte por igual.',
    solution: `.puerto {\n  display: flex;\n}\n\n.n {\n  flex: 1;\n}`,
    why: 'Con base 0, el reparto no depende del texto.',
    success: 'Tres muelles iguales.',
    check: t => [t.same('.barco', 'Cada barco ocupa su muelle')]
  });

  L({
    title: 'Dos filas repartidas',
    brief: 'Hay dos filas de barcos. Haz que la primera fila quede **arriba** y la segunda **abajo**, con el espacio entre ellas.',
    html: port(['rojo', 'amarillo', 'verde', 'azul', 'rojo', 'amarillo', 'verde', 'azul'].map(c => B(c)).join('')),
    css: `.puerto {\n  display: flex;\n  flex-wrap: wrap;\n  \n}`, ghost: '.barco',
    cmds: ['align-content', 'align-items'],
    hint: 'Con varias líneas, la propiedad que reparte las líneas es `align-content`.',
    help: '`align-content` reparte el espacio entre **líneas** en el eje transversal (solo hace efecto con `flex-wrap`). `align-items` alinea dentro de cada línea.',
    solution: `.puerto {\n  display: flex;\n  flex-wrap: wrap;\n  align-content: space-between;\n}`,
    why: 'Las dos líneas se separan al máximo.',
    success: 'Puerto de dos niveles.',
    check: t => [t.same('.barco', 'Cada barco está en su muelle')]
  });

  L({
    title: 'La barra del puerto',
    brief: 'Reto del mundo. Monta la barra de navegación: el logo a la **izquierda**, los enlaces a la **derecha**, todo **centrado en vertical**, y los enlaces en fila con `12px` de separación.',
    html: `<nav class="barra"><div class="logo">⚓ Puerto</div><div class="enlaces"><a class="enlace">Rutas</a><a class="enlace">Horarios</a><a class="enlace">Contacto</a></div></nav>`,
    base: `:where(.barra){height:70px;padding:0 14px;background:#0e4d6a;color:#fff;margin-top:90px}:where(.logo){font-weight:800;font-size:18px}:where(.enlace){display:block;background:rgba(255,255,255,.15);padding:6px 8px;border-radius:8px;font-size:14px}`,
    css: `.barra {\n  \n}\n\n.enlaces {\n  \n}`,
    ghost: '.logo, .enlace',
    cmds: ['display: flex', 'justify-content', 'align-items', 'gap'],
    hint: 'Hay dos contenedores flexibles: la barra y el grupo de enlaces.',
    help: 'Los contenedores flex se pueden anidar: un elemento flexible también puede ser un contenedor para sus propios hijos.',
    solution: `.barra {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.enlaces {\n  display: flex;\n  gap: 12px;\n}`,
    why: 'La barra separa logo y enlaces; el grupo interior los alinea en fila.',
    success: '¡Mundo 5 completado! Flexbox ya no tiene secretos para ti.',
    check: t => [t.same('.logo', 'El logo está a la izquierda y centrado en vertical'), t.same('.enlace', 'Los enlaces están a la derecha, en fila y con 12px de separación')]
  });
})();
