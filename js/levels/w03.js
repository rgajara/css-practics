/* Mundo 3 — Imprenta: tipografía y apariencia (niveles 41–60) */
(function () {
  const L = d => CQ.LV(3, d);
  const fw = (t, sel) => parseInt(t.v(sel, 'font-weight'), 10);

  L({
    title: 'Titular grande',
    brief: 'El titular del periódico es diminuto. Ponle un tamaño de letra de `32px`.',
    html: `<div class="escena"><div class="hoja"><h1 class="titulo">Extra, extra</h1><p>La imprenta abre sus puertas.</p></div></div>`,
    base: `:where(.titulo){font-size:12px}`,
    css: `.titulo {\n  \n}`,
    cmds: ['font-size'],
    hint: 'La propiedad que controla el tamaño del texto es `font-size`.',
    help: '`font-size` fija el tamaño de las letras. En píxeles, el tamaño es fijo.',
    solution: `.titulo {\n  font-size: 32px;\n}`,
    why: '`32px` da un titular que se ve desde lejos.',
    success: 'Primera plana.',
    check: t => [t.px('.titulo', 'font-size', 32, 'El titular mide 32px')]
  });

  L({
    title: 'Tinta gruesa',
    brief: 'Las palabras clave deben ir en **negrita**. Usa un grosor de `700`.',
    html: `<div class="escena"><div class="hoja"><p>Hoy en la imprenta: <span class="clave">tipos móviles</span>, <span class="clave">tinta</span> y <span class="clave">papel</span>.</p></div></div>`,
    base: `:where(p){font-size:20px}`,
    css: `.clave {\n  \n}`,
    cmds: ['font-weight'],
    hint: '`font-weight` acepta números de 100 a 900, o `bold`.',
    help: '`font-weight: 700` es negrita; `400` es el peso normal. `bold` equivale a 700.',
    solution: `.clave {\n  font-weight: 700;\n}`,
    why: 'El peso 700 resalta las palabras clave.',
    success: 'Lo importante destaca.',
    check: t => [t.ok(t.qa('.clave').every(e => parseInt(t.win.getComputedStyle(e).fontWeight, 10) >= 700), 'Las palabras clave están en negrita (700)')]
  });

  L({
    title: 'Una cita inclinada',
    brief: 'Los títulos de libros se escriben en **cursiva**. Inclina el texto de `.libro`.',
    html: `<div class="escena"><div class="hoja"><p>Mi libro favorito es <span class="libro">Cien años de soledad</span>.</p></div></div>`,
    base: `:where(p){font-size:20px}`,
    css: `.libro {\n  \n}`,
    cmds: ['font-style', 'font-weight'],
    hint: 'La propiedad es `font-style`.',
    help: '`font-style: italic` usa la versión cursiva de la fuente.',
    solution: `.libro {\n  font-style: italic;\n}`,
    why: 'La cursiva distingue los títulos de obras.',
    success: 'Toda una cita de estilo.',
    check: t => [t.ok(/italic|oblique/.test(t.v('.libro', 'font-style')), 'El título va en cursiva')]
  });

  L({
    title: 'Letra de máquina',
    brief: 'El bloque de código debe usar una fuente de **ancho fijo**. Usa la familia genérica `monospace`.',
    html: `<div class="escena"><div class="hoja"><p>Instrucción:</p><p class="codigo">imprimir(hoja)</p></div></div>`,
    base: `:where(.codigo){font-size:20px;background:#f1ece0;padding:8px}`,
    css: `.codigo {\n  \n}`,
    cmds: ['font-family'],
    hint: 'Las familias genéricas son `serif`, `sans-serif` y `monospace`.',
    help: '`font-family` admite una lista de fuentes separadas por comas; la última debería ser una familia genérica por si las otras no existen.',
    solution: `.codigo {\n  font-family: monospace;\n}`,
    why: 'En una fuente monoespaciada todas las letras ocupan lo mismo.',
    success: 'Clac, clac, clac.',
    check: t => [t.has('.codigo', 'font-family', /monospace|courier|menlo|mono/i, 'La fuente es monoespaciada')]
  });

  L({
    title: 'Al centro',
    brief: 'Centra el texto del titular dentro de la hoja.',
    html: `<div class="escena"><div class="hoja"><h1 class="titulo">Gran inauguración</h1><p>Desde las 9 de la mañana.</p></div></div>`,
    css: `.titulo {\n  \n}`,
    cmds: ['text-align'],
    hint: '`text-align` controla la alineación horizontal del texto.',
    help: '`text-align: center` centra las líneas de texto dentro de su caja. No centra la caja: centra su contenido.',
    solution: `.titulo {\n  text-align: center;\n}`,
    why: 'Las líneas del titular se reparten a partes iguales a cada lado.',
    success: 'Equilibrio clásico.',
    check: t => [t.eq('.titulo', 'text-align', 'center', 'El titular está centrado'), t.ok(t.v('p', 'text-align') !== 'center', 'El párrafo no cambia')]
  });

  L({
    title: 'Bordes rectos',
    brief: 'Las columnas de periódico tienen los bordes rectos a ambos lados. **Justifica** el párrafo.',
    html: `<div class="escena"><div class="hoja col"><p class="parrafo">La imprenta de tipos móviles permitió copiar libros con rapidez y cambió para siempre la forma de compartir ideas y noticias.</p></div></div>`,
    base: `:where(.col){width:200px;margin:0 auto}:where(.parrafo){font-size:15px}`,
    css: `.parrafo {\n  \n}`,
    cmds: ['text-align'],
    hint: 'Hay un valor de `text-align` que estira las líneas.',
    help: '`text-align: justify` ajusta el espacio entre palabras para que cada línea llegue a los dos bordes.',
    solution: `.parrafo {\n  text-align: justify;\n}`,
    why: 'Las líneas completas tocan ambos márgenes.',
    success: 'Una columna de diario de verdad.',
    check: t => [t.eq('.parrafo', 'text-align', 'justify', 'El párrafo está justificado')]
  });

  L({
    title: 'Respira entre líneas',
    brief: 'El párrafo está muy apretado. Dale una **altura de línea** de `1.6` (sin unidades).',
    html: `<div class="escena"><div class="hoja"><p class="parrafo">Un texto con buen interlineado se lee mejor, cansa menos la vista y parece más ordenado en la página.</p></div></div>`,
    base: `:where(.parrafo){font-size:16px;line-height:1}`,
    css: `.parrafo {\n  \n}`,
    cmds: ['line-height', 'font-size'],
    hint: 'Un número sin unidad multiplica el tamaño de la letra.',
    help: '`line-height: 1.6` hace que cada línea mida 1,6 veces el tamaño de la letra. Sin unidades, se adapta si cambias `font-size`.',
    solution: `.parrafo {\n  line-height: 1.6;\n}`,
    why: '16px × 1.6 = 25,6px por línea.',
    success: 'Mucho más legible.',
    check: t => [t.px('.parrafo', 'line-height', 25.6, 'Cada línea mide 1.6 veces la letra (25,6px)', 0.3)]
  });

  L({
    title: 'Logotipo espaciado',
    brief: 'El logotipo de la imprenta necesita `4px` de espacio **entre letras**.',
    html: `<div class="escena"><div class="hoja"><h1 class="logo">TIPOGRAFÍA</h1></div></div>`,
    css: `.logo {\n  \n}`,
    cmds: ['letter-spacing', 'word-spacing'],
    hint: 'Busca la propiedad cuyo nombre habla de letras.',
    help: '`letter-spacing` añade (o quita, con valores negativos) espacio entre cada letra.',
    solution: `.logo {\n  letter-spacing: 4px;\n}`,
    why: 'El espaciado le da aire de marca.',
    success: 'Elegante.',
    check: t => [t.px('.logo', 'letter-spacing', 4, 'Hay 4px entre letras')]
  });

  L({
    title: 'Grita sin teclado',
    brief: 'El aviso debe verse en **mayúsculas**, pero no cambies el texto: hazlo con CSS.',
    html: `<div class="escena"><div class="hoja"><p class="aviso">cerrado por inventario</p></div></div>`,
    base: `:where(.aviso){font-size:22px;font-weight:700;color:#b42318}`,
    css: `.aviso {\n  \n}`,
    cmds: ['text-transform'],
    hint: '`text-transform` tiene un valor para mayúsculas.',
    help: '`text-transform: uppercase` muestra el texto en mayúsculas; `lowercase`, en minúsculas; `capitalize`, con inicial mayúscula.',
    solution: `.aviso {\n  text-transform: uppercase;\n}`,
    why: 'El HTML sigue en minúsculas; solo cambia cómo se ve.',
    success: 'Mensaje recibido.',
    check: t => [t.eq('.aviso', 'text-transform', 'uppercase', 'El aviso se ve en mayúsculas')]
  });

  L({
    title: 'Precio rebajado',
    brief: 'El precio antiguo debe aparecer **tachado** con una línea.',
    html: `<div class="escena"><div class="hoja"><p>Libro: <span class="viejo">24 €</span> <span class="nuevo">18 €</span></p></div></div>`,
    base: `:where(p){font-size:24px}:where(.nuevo){color:#b42318;font-weight:700}`,
    css: `.viejo {\n  \n}`,
    cmds: ['text-decoration'],
    hint: 'El valor que cruza el texto es `line-through`.',
    help: '`text-decoration` dibuja líneas sobre el texto: `underline` (debajo), `overline` (encima) y `line-through` (tachado).',
    solution: `.viejo {\n  text-decoration: line-through;\n}`,
    why: 'El tachado indica que ese precio ya no vale.',
    success: '¡Oferta!',
    check: t => [t.has('.viejo', 'text-decoration-line', 'line-through', 'El precio antiguo está tachado')]
  });

  L({
    title: 'Sombra de imprenta',
    brief: 'Dale al titular una sombra dura: `2px` a la derecha, `2px` hacia abajo, sin desenfoque y de color `#e76f8e`.',
    html: `<div class="escena"><div class="hoja"><h1 class="titulo">Sale caliente</h1></div></div>`,
    base: `:where(.titulo){font-size:34px}`,
    css: `.titulo {\n  \n}`,
    cmds: ['text-shadow'],
    hint: 'El orden es: desplazamiento x, desplazamiento y, desenfoque, color.',
    help: '`text-shadow: 2px 2px 0 #e76f8e` dibuja una copia del texto desplazada. El tercer valor es el desenfoque.',
    solution: `.titulo {\n  text-shadow: 2px 2px 0 #e76f8e;\n}`,
    why: 'Sin desenfoque la sombra queda nítida, como tinta desplazada.',
    success: 'Efecto retro conseguido.',
    check: t => {
      const v = t.v('.titulo', 'text-shadow');
      const m = v.match(/(rgba?\([^)]+\))\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px/);
      return [t.ok(!!m && +m[2] === 2 && +m[3] === 2, 'La sombra se desplaza 2px a la derecha y 2px abajo'), t.ok(!!m && +m[4] === 0, 'La sombra no tiene desenfoque'), t.ok(!!m && t.colorEq(m[1], t.norm('color', '#e76f8e')), 'La sombra es #e76f8e')];
    }
  });

  L({
    title: 'Tarjeta flotante',
    brief: 'La tarjeta debe parecer que flota: añade una **sombra de caja** que caiga hacia abajo (desplazamiento vertical positivo) y con desenfoque.',
    html: `<div class="escena"><div class="hoja tarjeta"><h2>Pedido listo</h2><p>Recoger en el mostrador.</p></div></div>`,
    base: `:where(.tarjeta){box-shadow:none;width:220px;margin:30px auto;border-radius:12px}`,
    css: `.tarjeta {\n  \n}`,
    cmds: ['box-shadow', 'rgba()'],
    hint: 'Prueba con algo como `0 8px 20px rgba(0, 0, 0, 0.25)`.',
    help: '`box-shadow: x y desenfoque color` dibuja una sombra detrás de la caja. Un color semitransparente queda más natural.',
    solution: `.tarjeta {\n  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);\n}`,
    why: 'La sombra hacia abajo simula luz desde arriba.',
    success: 'Parece que se puede tocar.',
    check: t => {
      const v = t.v('.tarjeta', 'box-shadow');
      const m = v.match(/\)\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px/) || v.match(/^(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px/);
      return [t.ok(v !== 'none' && !/inset/.test(v), 'La tarjeta tiene sombra exterior'), t.ok(!!m && +m[2] > 0, 'La sombra cae hacia abajo'), t.ok(!!m && +m[3] > 0, 'La sombra está desenfocada')];
    }
  });

  L({
    title: 'Marca de agua',
    brief: 'El sello de «COPIA» debe verse tenue: deja su **opacidad** en `0.3`.',
    html: `<div class="escena"><div class="hoja doc"><p>Contrato de impresión nº 42</p><div class="sello">COPIA</div></div></div>`,
    base: `:where(.doc){position:relative;height:200px}:where(.sello){position:absolute;left:50px;top:70px;font:900 50px/1 sans-serif;color:#b42318;border:5px solid #b42318;padding:6px 12px;transform:rotate(-12deg)}`,
    css: `.sello {\n  \n}`,
    cmds: ['opacity', 'rgba()'],
    hint: 'La opacidad va de 0 (invisible) a 1 (opaco).',
    help: '`opacity` afecta a todo el elemento: texto, borde y fondo a la vez.',
    solution: `.sello {\n  opacity: 0.3;\n}`,
    why: 'El sello sigue ahí, pero deja leer lo de abajo.',
    success: 'Discreto pero presente.',
    check: t => [t.ok(t.near(+t.v('.sello', 'opacity'), 0.3, 0.02), 'La opacidad del sello es 0.3')]
  });

  L({
    title: 'Nota a pie',
    brief: 'La nota debe medir `0.75em`: tres cuartos del texto que la rodea. El párrafo tiene letra de `20px`.',
    html: `<div class="escena"><div class="hoja"><p class="cuerpo">Edición especial<span class="nota">*</span> de otoño. <span class="nota">*Tirada limitada</span></p></div></div>`,
    base: `:where(.cuerpo){font-size:20px}:where(.nota){color:#7a6c5d}`,
    css: `.nota {\n  \n}`,
    cmds: ['em', 'font-size'],
    rule: 'Usa la unidad em.',
    hint: '`1em` es el tamaño de letra del padre cuando se usa en `font-size`.',
    help: 'En `font-size`, `em` es relativo al tamaño de letra del padre: `0.75em` de 20px son 15px. Si el párrafo cambia, la nota cambia con él.',
    solution: `.nota {\n  font-size: 0.75em;\n}`,
    why: '20px × 0.75 = 15px.',
    success: 'Pequeña y proporcionada.',
    check: t => [t.px('.nota', 'font-size', 15, 'La nota mide 15px (0.75 del párrafo)', 0.2), t.uses(/font-size\s*:\s*[\d.]+em/, 'Usas la unidad em')]
  });

  L({
    title: 'Sangría clásica',
    brief: 'Los libros antiguos sangraban la **primera línea** de cada párrafo. Añade una sangría de `2em`.',
    html: `<div class="escena"><div class="hoja"><p class="parrafo">Érase una vez una imprenta que nunca dormía. Sus máquinas giraban día y noche para que todo el pueblo tuviera noticias frescas.</p></div></div>`,
    base: `:where(.parrafo){font-size:16px}`,
    css: `.parrafo {\n  \n}`,
    cmds: ['text-indent', 'padding-left'],
    hint: '`padding-left` movería todas las líneas. Busca otra propiedad.',
    help: '`text-indent` desplaza solo la primera línea del bloque.',
    solution: `.parrafo {\n  text-indent: 2em;\n}`,
    why: '2em de 16px son 32px de sangría en la primera línea.',
    success: 'Como un libro de verdad.',
    check: t => [t.px('.parrafo', 'text-indent', 32, 'La primera línea tiene 2em (32px) de sangría'), t.px('.parrafo', 'padding-left', 0, 'Las demás líneas no se mueven')]
  });

  L({
    title: 'Titular recortado',
    brief: 'El titular no cabe. Mantenlo **en una sola línea**, recorta lo que sobre y añade **puntos suspensivos** al final.',
    html: `<div class="escena"><div class="hoja"><p class="titular">Descubren en la imprenta una caja de tipos perdidos desde hace cien años</p></div></div>`,
    base: `:where(.titular){font-size:20px;font-weight:700}`,
    css: `.titular {\n  \n}`,
    cmds: ['white-space', 'overflow', 'text-overflow'],
    hint: 'Necesitas tres propiedades que trabajan juntas.',
    help: '`white-space: nowrap` evita el salto de línea, `overflow: hidden` recorta y `text-overflow: ellipsis` añade «…».',
    solution: `.titular {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}`,
    why: 'Las tres son necesarias: sin recorte, no hay puntos suspensivos.',
    success: '…y el lector querrá saber más.',
    check: t => [t.eq('.titular', 'white-space', 'nowrap', 'El texto no salta de línea'), t.ok(t.v('.titular', 'overflow-x') !== 'visible', 'Lo que sobra se recorta'), t.eq('.titular', 'text-overflow', 'ellipsis', 'Aparecen puntos suspensivos')]
  });

  L({
    title: 'Versalitas',
    brief: 'El nombre del autor se compone en **versalitas** (mayúsculas pequeñas).',
    html: `<div class="escena"><div class="hoja"><p>Por <span class="autor">Gabriela Mistral</span></p></div></div>`,
    base: `:where(p){font-size:22px}`,
    css: `.autor {\n  \n}`,
    cmds: ['font-variant', 'text-transform'],
    hint: 'No es `text-transform`. Busca una variante de la fuente.',
    help: '`font-variant: small-caps` muestra las minúsculas como mayúsculas de menor tamaño.',
    solution: `.autor {\n  font-variant: small-caps;\n}`,
    why: 'Las versalitas dan un toque editorial.',
    success: 'Firma con clase.',
    check: t => [t.has('.autor', 'font-variant-caps', 'small-caps', 'El autor está en versalitas')]
  });

  L({
    title: 'Cita destacada',
    brief: 'Dale formato a la cita: borde izquierdo `4px solid #e76f8e`, relleno izquierdo de `12px` y texto en cursiva.',
    html: `<div class="escena"><div class="hoja"><p class="cita">Leer es soñar con los ojos abiertos.</p></div></div>`,
    base: `:where(.cita){font-size:20px}`,
    css: `.cita {\n  \n}`,
    cmds: ['border-left', 'padding-left', 'font-style'],
    hint: 'Son tres declaraciones de mundos distintos.',
    help: 'Una cita destacada combina borde, relleno y estilo de texto.',
    solution: `.cita {\n  border-left: 4px solid #e76f8e;\n  padding-left: 12px;\n  font-style: italic;\n}`,
    why: 'El borde marca la cita y el relleno la separa de él.',
    success: 'Cita lista para enmarcar.',
    check: t => [t.px('.cita', 'border-left-width', 4, 'Borde izquierdo de 4px'), t.color('.cita', 'border-left-color', '#e76f8e', 'El borde es #e76f8e'), t.eq('.cita', 'border-left-style', 'solid', 'El borde es continuo'), t.px('.cita', 'padding-left', 12, 'Relleno izquierdo de 12px'), t.ok(/italic/.test(t.v('.cita', 'font-style')), 'El texto va en cursiva')]
  });

  L({
    title: 'Que se lea bien',
    brief: 'La etiqueta tiene texto gris claro sobre fondo blanco. Elige tú los colores, pero consigue un **contraste de al menos 4,5:1** entre texto y fondo (el mínimo recomendado).',
    html: `<div class="escena"><div class="hoja"><p class="etiqueta">Horario: de 9 a 18 h</p></div></div>`,
    base: `:where(.etiqueta){font-size:20px;padding:10px;color:#c8c8c8;background:#fff}`,
    css: `.etiqueta {\n  \n}`,
    cmds: ['color', 'background-color'],
    hint: 'Un texto oscuro sobre fondo claro (o al revés) suele dar buen contraste.',
    help: 'El contraste compara la luminosidad del texto y del fondo. Por debajo de 4,5:1, mucha gente lee con dificultad.',
    solution: `.etiqueta {\n  color: #1f2433;\n  background-color: #fff3c4;\n}`,
    why: 'Texto casi negro sobre amarillo claro: más de 14:1.',
    success: 'Accesible para todo el mundo.',
    check: t => { const c = t.contrast('.etiqueta'); return [t.ok(c >= 4.5, `El contraste es al menos 4,5:1 (ahora ${c.toFixed(1)}:1)`)]; }
  });

  L({
    title: 'La portada',
    brief: 'Reto del mundo. Compón la portada: el título con `28px`, peso `800`, mayúsculas, `2px` entre letras y centrado; el subtítulo con interlineado `1.5` y en cursiva.',
    html: `<div class="escena"><div class="hoja"><h1 class="titulo">la gaceta</h1><p class="sub">Noticias del barrio impresas con cariño desde 1902</p></div></div>`,
    css: `.titulo {\n  \n}\n\n.sub {\n  \n}`,
    cmds: ['font-size', 'font-weight', 'text-transform', 'letter-spacing', 'text-align', 'line-height', 'font-style'],
    hint: 'Ve propiedad por propiedad; la lista de objetivos te dirá qué falta.',
    help: 'Una buena portada combina jerarquía (tamaño y peso) con ritmo (espaciado e interlineado).',
    solution: `.titulo {\n  font-size: 28px;\n  font-weight: 800;\n  text-transform: uppercase;\n  letter-spacing: 2px;\n  text-align: center;\n}\n\n.sub {\n  line-height: 1.5;\n  font-style: italic;\n}`,
    why: 'Tamaño, peso y espaciado dan carácter; el interlineado da lectura cómoda.',
    success: '¡Mundo 3 completado! Ya sabes componer texto como en una imprenta.',
    check: t => [
      t.px('.titulo', 'font-size', 28, 'Título de 28px'), t.ok(fw(t, '.titulo') >= 800, 'Título con peso 800'),
      t.eq('.titulo', 'text-transform', 'uppercase', 'Título en mayúsculas'), t.px('.titulo', 'letter-spacing', 2, '2px entre letras'),
      t.eq('.titulo', 'text-align', 'center', 'Título centrado'),
      t.ok(t.near(t.n('.sub', 'line-height'), t.n('.sub', 'font-size') * 1.5, 0.3), 'Subtítulo con interlineado 1.5'),
      t.ok(/italic/.test(t.v('.sub', 'font-style')), 'Subtítulo en cursiva')
    ]
  });
})();
