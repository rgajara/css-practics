/* Mundo 2 — Almacén de cajas: modelo de caja (niveles 21–40) */
(function () {
  const L = d => CQ.LV(2, d);
  const sides = { top: 'arriba', right: 'derecha', bottom: 'abajo', left: 'izquierda' };

  L({
    title: 'Las capas de la caja',
    brief: 'Toda caja tiene contenido, relleno, borde y margen. Esta caja tiene `width: 100px` y un borde de `5px`. Añádele **relleno** para que, en total, mida `150px` de ancho sin cambiar su `width`.',
    html: `<div class="escena"><div class="caja paquete">📦</div></div>`,
    base: `:where(.escena){display:flex;align-items:center;justify-content:center}:where(.paquete){width:100px;height:60px;border-width:5px;font-size:28px}`,
    css: `.paquete {\n  /* width: 100px y borde de 5px ya están puestos */\n  \n}`,
    cmds: ['padding', 'width', 'border'],
    hint: 'Ancho total = width + relleno izquierdo + relleno derecho + bordes. Te faltan 40px en total.',
    help: 'Por defecto (`content-box`), el ancho visible suma el contenido, el relleno y el borde de cada lado.',
    solution: `.paquete {\n  padding: 20px;\n}`,
    why: '100 + 20 + 20 + 5 + 5 = 150px.',
    success: 'Has calculado tu primer modelo de caja.',
    check: t => [t.size('.paquete', 150, null, 'La caja mide 150px de ancho en total'), t.px('.paquete', 'width', 100, 'Su width sigue siendo 100px'), t.px('.paquete', 'border-left-width', 5, 'El borde sigue siendo de 5px')]
  });

  L({
    title: 'Medidas honestas',
    brief: 'Esta caja tiene `width: 150px`, relleno de `20px` y borde de `5px`, así que ocupa 200px. Haz que mida **exactamente 150px** sin tocar ninguno de esos valores.',
    html: `<div class="escena"><div class="estante hueco"><div class="caja paquete">📦</div></div></div>`,
    base: `:where(.escena){display:flex;align-items:center;justify-content:center}:where(.hueco){width:150px;padding:8px 0;outline:3px dashed #8a5a1c}:where(.paquete){width:150px;padding:20px;border-width:5px;font-size:28px;height:auto}`,
    css: `.paquete {\n  \n}`,
    cmds: ['box-sizing', 'width', 'padding'],
    hint: 'Hay una propiedad que hace que `width` incluya el relleno y el borde.',
    help: 'Con `box-sizing: border-box`, el `width` es el tamaño total de la caja: el relleno y el borde se restan hacia dentro.',
    solution: `.paquete {\n  box-sizing: border-box;\n}`,
    why: '`border-box` mete el relleno y el borde dentro de los 150px.',
    success: 'Encaja justo en el hueco del estante.',
    check: t => [
      t.size('.paquete', 150, null, 'La caja ocupa exactamente 150px'),
      t.px('.paquete', 'padding-left', 20, 'El relleno sigue siendo 20px'),
      t.px('.paquete', 'border-left-width', 5, 'El borde sigue siendo 5px'),
      t.eq('.paquete', 'box-sizing', 'border-box', 'Usas box-sizing: border-box')
    ]
  });

  L({
    title: 'Pila ordenada',
    brief: 'Las dos cajas están pegadas una encima de otra. Deja **30px** de separación vertical entre ellas.',
    html: `<div class="escena"><div class="caja a">A</div><div class="caja b">B</div></div>`,
    base: `:where(.caja){width:120px;height:60px;margin:0 auto}`,
    css: `/* Elige qué caja separar */\n`,
    cmds: ['margin-bottom', 'margin-top', 'margin'],
    hint: 'Un margen inferior en la caja A o uno superior en la B: cualquiera de los dos sirve.',
    help: 'El margen es espacio exterior transparente que separa una caja de sus vecinas.',
    solution: `.a {\n  margin-bottom: 30px;\n}`,
    why: 'El margen inferior de A empuja a B hacia abajo.',
    success: 'Cajas apiladas con espacio para las manos.',
    check: t => [t.ok(t.near(t.rect('.b').y - t.rect('.a').b, 30, 1), 'Hay 30px entre A y B'), t.size('.a', 120, 60, 'Las cajas no cambian de tamaño')]
  });

  L({
    title: 'Márgenes que se funden',
    brief: 'La caja A tiene `margin-bottom: 20px` y la B, `margin-top: 20px`. ¡Pero solo hay 20px entre ellas! Consigue **40px** de separación.',
    html: `<div class="escena"><div class="caja a">A</div><div class="caja b">B</div></div>`,
    base: `:where(.caja){width:120px;height:60px;margin-left:auto;margin-right:auto}:where(.a){margin-bottom:20px}:where(.b){margin-top:20px}`,
    css: `.a {\n  margin-bottom: 20px;\n}\n\n.b {\n  margin-top: 20px;\n}`,
    cmds: ['margin-top', 'margin-bottom'],
    hint: 'Los márgenes verticales vecinos no se suman: gana el mayor.',
    help: 'Esto se llama **colapso de márgenes**: entre dos bloques, el espacio vertical es el mayor de los dos márgenes, no la suma.',
    solution: `.a {\n  margin-bottom: 20px;\n}\n\n.b {\n  margin-top: 40px;\n}`,
    why: 'Como gana el mayor, basta con que uno de los márgenes sea de 40px.',
    success: 'Ahora entiendes uno de los misterios clásicos de CSS.',
    check: t => [t.ok(t.near(t.rect('.b').y - t.rect('.a').b, 40, 1), 'Hay 40px entre A y B')]
  });

  L({
    title: 'El palé centrado',
    brief: 'El palé de `200px` está pegado a la izquierda. Céntralo en horizontal usando márgenes automáticos.',
    html: `<div class="escena"><div class="caja pale">🟫🟫🟫</div></div>`,
    base: `:where(.pale){width:200px;height:50px;font-size:22px}`,
    css: `.pale {\n  \n}`,
    cmds: ['margin: auto', 'margin', 'width'],
    hint: 'Si los márgenes izquierdo y derecho son `auto`, se reparten el espacio libre.',
    help: 'Un bloque con ancho fijo y `margin-left: auto; margin-right: auto` queda centrado. El atajo es `margin: 0 auto`.',
    solution: `.pale {\n  margin: 0 auto;\n}`,
    why: '`auto` a ambos lados reparte el hueco a partes iguales.',
    success: 'Perfectamente centrado en el pasillo.',
    check: t => [t.centerX('.pale', '.escena', 'El palé está centrado en horizontal'), t.size('.pale', 200, null, 'El palé sigue midiendo 200px')]
  });

  L({
    title: 'Cuatro distancias',
    brief: 'Coloca la caja en su marca con un solo `margin` de **cuatro valores**: `10px` arriba, `20px` derecha, `30px` abajo y `40px` izquierda.',
    html: `<div class="escena"><div class="caja m">📦</div></div>`,
    base: `:where(.m){width:80px;height:60px;font-size:28px}`,
    css: `.m {\n  \n}`,
    cmds: ['margin'],
    hint: 'El orden es como las agujas del reloj, empezando arriba.',
    help: 'Con cuatro valores, `margin` sigue el orden **arriba, derecha, abajo, izquierda**.',
    solution: `.m {\n  margin: 10px 20px 30px 40px;\n}`,
    why: 'Cuatro valores en el sentido de las agujas del reloj.',
    success: 'Lo has colocado al píxel.',
    check: t => Object.entries({ top: 10, right: 20, bottom: 30, left: 40 }).map(([s, v]) => t.px('.m', 'margin-' + s, v, `Margen ${sides[s]}: ${v}px`))
  });

  L({
    title: 'Relleno en dos valores',
    brief: 'La etiqueta necesita `8px` de relleno arriba y abajo, y `24px` a los lados. Hazlo con **dos valores**.',
    html: `<div class="escena"><span class="caja etq">FRÁGIL</span></div>`,
    base: `:where(.escena){display:flex;align-items:center;justify-content:center}:where(.etq){width:auto;height:auto;display:inline-block;background:#E5484D;color:#fff;font-size:20px;letter-spacing:2px}`,
    css: `.etq {\n  \n}`,
    cmds: ['padding'],
    hint: 'El primer valor es vertical y el segundo, horizontal.',
    help: 'Con dos valores, `padding: A B` aplica A arriba y abajo, y B a izquierda y derecha. Lo mismo vale para `margin`.',
    solution: `.etq {\n  padding: 8px 24px;\n}`,
    why: 'Dos valores: vertical y horizontal.',
    success: 'Etiqueta lista para pegar.',
    check: t => [t.px('.etq', 'padding-top', 8, 'Relleno arriba de 8px'), t.px('.etq', 'padding-bottom', 8, 'Relleno abajo de 8px'), t.px('.etq', 'padding-left', 24, 'Relleno izquierdo de 24px'), t.px('.etq', 'padding-right', 24, 'Relleno derecho de 24px')]
  });

  L({
    title: 'Caja frágil',
    brief: 'Marca la caja frágil con un borde **discontinuo** naranja de `3px`. Esta vez usa las tres propiedades por separado: `border-style`, `border-width` y `border-color`.',
    html: `<div class="escena"><div class="caja fragil">🥚</div></div>`,
    base: `:where(.escena){display:flex;align-items:center;justify-content:center}:where(.fragil){width:110px;height:90px;font-size:40px}`,
    css: `.fragil {\n  \n}`,
    cmds: ['border-style', 'border-width', 'border-color'],
    rule: 'Usa las propiedades separadas, no el atajo border.',
    hint: 'El estilo discontinuo se llama `dashed`.',
    help: 'El atajo `border` reúne tres propiedades: `border-width`, `border-style` y `border-color`. A veces conviene cambiar solo una.',
    solution: `.fragil {\n  border-style: dashed;\n  border-width: 3px;\n  border-color: orange;\n}`,
    why: 'Cada propiedad controla una parte del borde.',
    success: 'Nadie la tirará sin cuidado.',
    check: t => [t.eq('.fragil', 'border-top-style', 'dashed', 'El borde es discontinuo (dashed)'), t.px('.fragil', 'border-top-width', 3, 'El borde mide 3px'), t.color('.fragil', 'border-top-color', 'orange', 'El borde es naranja'), t.uses(/border-style\s*:/, 'Usas border-style'), t.avoid(/border\s*:/, 'No usas el atajo border')]
  });

  L({
    title: 'Caja con tapa',
    brief: 'La caja necesita una tapa: borde superior de `10px solid #8a5a1c`. El resto de lados lleva `2px solid #8a5a1c`.',
    html: `<div class="escena"><div class="caja tapa">🧸</div></div>`,
    base: `:where(.escena){display:flex;align-items:center;justify-content:center}:where(.tapa){width:120px;height:90px;font-size:40px}`,
    css: `.tapa {\n  \n}`,
    cmds: ['border', 'border-top'],
    hint: 'Escribe primero el borde general y después sobrescribe solo el superior.',
    help: 'En CSS, la última declaración gana. Puedes poner `border` para todos los lados y luego `border-top` para cambiar uno.',
    solution: `.tapa {\n  border: 2px solid #8a5a1c;\n  border-top: 10px solid #8a5a1c;\n}`,
    why: '`border-top` va después y sobrescribe solo el lado superior.',
    success: 'Bien cerrada.',
    check: t => [t.px('.tapa', 'border-top-width', 10, 'La tapa (borde superior) mide 10px'), ...['right', 'bottom', 'left'].map(s => t.px('.tapa', `border-${s}-width`, 2, `El borde ${s === 'right' ? 'derecho' : s === 'bottom' ? 'inferior' : 'izquierdo'} mide 2px`)), t.color('.tapa', 'border-left-color', '#8a5a1c', 'Los bordes son #8a5a1c'), t.color('.tapa', 'border-top-color', '#8a5a1c', 'La tapa es #8a5a1c'), t.eq('.tapa', 'border-bottom-style', 'solid', 'Todos los bordes son continuos')]
  });

  L({
    title: 'Que no se salga',
    brief: 'El inventario no cabe en la caja y se derrama por fuera. Haz que lo que sobra quede **oculto**.',
    html: `<div class="escena"><div class="caja inv">🍎🍐🍊🍋🍌🍉🍇🍓🫐🍈🍒🍑🥭🍍🥥🥝</div></div>`,
    base: `:where(.escena){display:flex;align-items:center;justify-content:center}:where(.inv){display:block;width:160px;height:70px;font-size:28px;line-height:1.2;padding:4px;word-break:break-all;border-width:3px}`,
    css: `.inv {\n  \n}`,
    cmds: ['overflow'],
    hint: 'La propiedad `overflow` decide qué pasa con lo que no cabe.',
    help: '`overflow: hidden` recorta el contenido en el borde interior de la caja.',
    solution: `.inv {\n  overflow: hidden;\n}`,
    why: 'Lo que sobra se recorta y la caja mantiene su tamaño.',
    success: 'Almacén limpio.',
    check: t => [t.ok(['hidden', 'clip'].includes(t.v('.inv', 'overflow-y')), 'El contenido que sobra queda oculto'), t.px('.inv', 'width', 160, 'La caja conserva su ancho'), t.px('.inv', 'height', 70, 'La caja conserva su alto')]
  });

  L({
    title: 'Lista con desplazamiento',
    brief: 'La lista de pedidos es muy larga. En vez de ocultarla, permite **desplazarse** en vertical cuando no quepa.',
    html: `<div class="escena"><ul class="estante pedidos"><li>Pedido 101</li><li>Pedido 102</li><li>Pedido 103</li><li>Pedido 104</li><li>Pedido 105</li><li>Pedido 106</li><li>Pedido 107</li><li>Pedido 108</li><li>Pedido 109</li></ul></div>`,
    base: `:where(.pedidos){height:150px;margin:0;padding:8px 8px 8px 28px;overflow:visible;background:#fff;border:2px solid #c9cfdb}:where(li){padding:2px 0}`,
    css: `.pedidos {\n  \n}`,
    cmds: ['overflow-y', 'overflow'],
    hint: 'Hay dos valores que muestran una barra de desplazamiento: uno siempre y otro solo si hace falta.',
    help: '`overflow-y: auto` muestra la barra solo si el contenido no cabe; `scroll` la muestra siempre.',
    solution: `.pedidos {\n  overflow-y: auto;\n}`,
    why: 'La lista mantiene su altura y se puede desplazar.',
    success: 'Todos los pedidos, en poco espacio.',
    check: t => [t.ok(['auto', 'scroll'].includes(t.v('.pedidos', 'overflow-y')), 'La lista se desplaza en vertical'), t.px('.pedidos', 'height', 150, 'La lista mantiene 150px de alto')]
  });

  L({
    title: 'Ni un milímetro más',
    brief: 'El cartel ocupa todo el ancho. Haz que nunca supere `180px`, pero que pueda ser más estrecho si no hay espacio.',
    html: `<div class="escena"><div class="caja aviso">Zona de carga</div></div>`,
    base: `:where(.aviso){width:auto;height:50px;background:#F2C14E;font-size:18px}`,
    css: `.aviso {\n  \n}`,
    cmds: ['max-width', 'width', 'min-width'],
    rule: 'La comprobación prueba la escena con dos anchos distintos.',
    hint: 'No se trata de un ancho fijo, sino de un límite.',
    help: '`max-width` pone un techo: el elemento puede ser más pequeño, pero nunca más grande.',
    solution: `.aviso {\n  max-width: 180px;\n}`,
    why: 'Con espacio de sobra mide 180px; en una escena estrecha, se adapta.',
    success: 'Flexible y con límites.',
    check: t => [
      t.at(360, () => t.size('.aviso', 180, null, 'Con espacio de sobra mide 180px')),
      t.at(170, () => { const e = t.contentRect('.escena'); return t.ok(t.near(t.rect('.aviso').w, e.w, 1), 'En una escena estrecha ocupa el ancho disponible'); })
    ]
  });

  L({
    title: 'Altura mínima',
    brief: 'Las cajas tienen contenidos distintos y alturas desiguales. Haz que todas midan **al menos** `100px` de alto, aunque crezcan si su contenido lo necesita.',
    html: `<div class="escena fila"><div class="caja c">🔩</div><div class="caja c">🔩<br>🔩<br>🔩<br>🔩</div></div>`,
    base: `:where(.fila){display:flex;gap:30px;align-items:flex-start;justify-content:center}:where(.c){height:auto;width:90px;font-size:26px;line-height:1.15;padding:6px 0;flex-direction:column}`,
    css: `.c {\n  \n}`,
    cmds: ['min-height', 'height', 'max-height'],
    hint: 'Una altura fija recortaría la caja alta. Busca un mínimo.',
    help: '`min-height` asegura un alto mínimo sin impedir que la caja crezca.',
    solution: `.c {\n  min-height: 100px;\n}`,
    why: 'La caja pequeña sube a 100px y la grande conserva su altura natural.',
    success: 'Todas con una base firme.',
    check: t => {
      const [a, b] = t.qa('.c').map(e => parseFloat(t.win.getComputedStyle(e).height));
      return [t.ok(t.near(a, 100, 1), 'La caja pequeña mide 100px'), t.ok(b > 105, 'La caja grande sigue creciendo con su contenido'), t.px('.c', 'min-height', 100, 'Usas una altura mínima de 100px')];
    }
  });

  L({
    title: 'Una por línea',
    brief: 'Las etiquetas `span` van en línea, una detrás de otra. Haz que cada una ocupe **su propia línea** y todo el ancho.',
    html: `<div class="escena"><span class="lbl">Tornillos</span><span class="lbl">Tuercas</span><span class="lbl">Arandelas</span></div>`,
    base: `:where(.lbl){background:#E8B86B;padding:6px 10px;margin:4px 0;font-weight:700;color:#4a2f0c}`,
    css: `.lbl {\n  \n}`,
    cmds: ['display', 'width'],
    hint: 'Los elementos en línea se convierten en bloques con un valor de `display`.',
    help: '`display: block` hace que el elemento empiece en una línea nueva y ocupe todo el ancho disponible. `span` es `inline` por defecto.',
    solution: `.lbl {\n  display: block;\n}`,
    why: 'Como bloques, las etiquetas se apilan.',
    success: 'Estantería etiquetada.',
    check: t => {
      const r = t.qa('.lbl').map(e => e.getBoundingClientRect());
      const e = t.contentRect('.escena');
      return [t.ok(r[1].top >= r[0].bottom - 0.5 && r[2].top >= r[1].bottom - 0.5, 'Cada etiqueta está en su propia línea'), t.ok(r.every(x => t.near(x.width, e.w, 1)), 'Cada etiqueta ocupa todo el ancho')];
    }
  });

  L({
    title: 'Cajas en fila',
    brief: 'Las cajas de `80px` se apilan. Ponlas **una al lado de otra** manteniendo su ancho y alto.',
    html: `<div class="escena"><div class="caja f">1</div><div class="caja f">2</div><div class="caja f">3</div></div>`,
    base: `:where(.f){width:80px;height:60px;margin:4px;font-size:22px;display:block;line-height:60px;text-align:center}`,
    css: `.f {\n  \n}`,
    cmds: ['display', 'width', 'height'],
    hint: 'Hay un valor de `display` que va en línea pero respeta ancho y alto.',
    help: '`display: inline-block` coloca los elementos en línea como texto, pero acepta `width`, `height`, `padding` y `margin` como un bloque.',
    solution: `.f {\n  display: inline-block;\n}`,
    why: 'En línea, como el texto, y con tamaño propio.',
    success: 'Una fila perfecta.',
    check: t => {
      const r = t.qa('.f').map(e => e.getBoundingClientRect());
      return [t.ok(r.every(x => t.near(x.top, r[0].top, 1)), 'Las tres cajas están en la misma fila'), t.ok(r[1].left > r[0].right - 1, 'Están una al lado de otra'), t.size('.f', 80, 60, 'Cada caja mide 80 × 60 px')];
    }
  });

  L({
    title: 'Fuera de inventario',
    brief: 'La caja rota debe **desaparecer por completo**: que no se vea y que las demás ocupen su lugar.',
    html: `<div class="escena"><div class="caja s">Caja 1</div><div class="caja s rota">Rota 💥</div><div class="caja s">Caja 3</div></div>`,
    base: `:where(.s){width:140px;height:50px;margin:0 auto 8px}`,
    css: `.rota {\n  \n}`,
    cmds: ['display', 'visibility', 'opacity'],
    hint: 'Ocultar no basta: el hueco tampoco debe quedarse.',
    help: '`display: none` quita el elemento del diseño: no se ve y no ocupa espacio. `visibility: hidden` lo oculta, pero deja el hueco.',
    solution: `.rota {\n  display: none;\n}`,
    why: 'Sin caja en el diseño, la Caja 3 sube a su sitio.',
    success: 'Inventario actualizado.',
    check: t => {
      const s = t.qa('.s'), r0 = s[0].getBoundingClientRect(), r2 = s[2].getBoundingClientRect();
      return [t.ok(s[1].getBoundingClientRect().height === 0, 'La caja rota no ocupa espacio'), t.ok(t.near(r2.top - r0.bottom, 8, 1), 'La Caja 3 ocupa el lugar de la rota')];
    }
  });

  L({
    title: 'Hueco reservado',
    brief: 'Ahora al revés: la caja vendida debe hacerse **invisible pero conservar su hueco**, para que las demás no se muevan.',
    html: `<div class="escena"><div class="caja s">Caja 1</div><div class="caja s vendida">Vendida</div><div class="caja s">Caja 3</div></div>`,
    base: `:where(.s){width:140px;height:50px;margin:0 auto 8px}`,
    css: `.vendida {\n  \n}`,
    cmds: ['visibility', 'display', 'opacity'],
    hint: 'Necesitas la propiedad que oculta sin quitar del diseño.',
    help: '`visibility: hidden` vuelve invisible el elemento, que sigue ocupando su espacio.',
    solution: `.vendida {\n  visibility: hidden;\n}`,
    why: 'El hueco queda reservado y nada se desplaza.',
    success: 'Hueco listo para la próxima entrega.',
    check: t => {
      const s = t.qa('.s');
      return [t.eq('.vendida', 'visibility', 'hidden', 'La caja vendida no se ve'), t.ok(t.near(s[2].getBoundingClientRect().top - s[0].getBoundingClientRect().bottom, 8 + 50 + 8, 1), 'La Caja 3 no se mueve')];
    }
  });

  L({
    title: 'Estante bien espaciado',
    brief: 'Deja `20px` de **relleno** dentro del estante y `10px` de separación entre las cajas (con `margin-bottom` en las cajas).',
    html: `<div class="escena"><div class="estante est"><div class="caja s">A</div><div class="caja s">B</div><div class="caja s">C</div></div></div>`,
    base: `:where(.est){border:3px solid #9aa3b5;padding:0}:where(.s){width:auto;height:40px;margin:0}`,
    css: `.est {\n  \n}\n\n.s {\n  \n}`,
    cmds: ['padding', 'margin-bottom'],
    hint: 'El relleno va en el contenedor; el margen, en las cajas.',
    help: 'El relleno separa el contenido del borde del contenedor. El margen separa los hermanos entre sí.',
    solution: `.est {\n  padding: 20px;\n}\n\n.s {\n  margin-bottom: 10px;\n}`,
    why: 'Cada propiedad controla un tipo de espacio distinto.',
    success: 'Orden de almacén profesional.',
    check: t => {
      const e = t.innerRect('.est'), s = t.qa('.s').map(x => x.getBoundingClientRect());
      return [t.ok(t.near(s[0].top - e.y, 20, 1), 'Hay 20px de relleno arriba'), t.ok(t.near(s[0].left - e.x, 20, 1), 'Hay 20px de relleno a los lados'), t.ok(t.near(s[1].top - s[0].bottom, 10, 1) && t.near(s[2].top - s[1].bottom, 10, 1), 'Hay 10px entre cajas')];
    }
  });

  L({
    title: 'Ancho calculado',
    brief: 'La cinta transportadora debe medir **todo el ancho menos 40px**, en cualquier tamaño de escena. Usa `calc()`.',
    html: `<div class="escena"><div class="caja cinta">➡️➡️➡️</div></div>`,
    base: `:where(.cinta){width:100px;height:44px;background:#9aa3b5;border-radius:22px;font-size:20px}`,
    css: `.cinta {\n  \n}`,
    cmds: ['calc()', 'width', '%'],
    rule: 'Se comprueba con la escena a 300px y a 600px.',
    hint: 'Dentro de `calc()` puedes mezclar `%` y `px`. Deja espacios alrededor del signo menos.',
    help: '`calc(100% - 40px)` resta una cantidad fija a una relativa. Los espacios alrededor de `+` y `-` son obligatorios.',
    solution: `.cinta {\n  width: calc(100% - 40px);\n}`,
    why: 'Mide el ancho disponible menos 40px, sea cual sea la escena.',
    success: 'La cinta encaja en cualquier nave.',
    check: t => [300, 600].map(w => t.at(w, () => t.ok(t.near(t.rect('.cinta').w, t.contentRect('.escena').w - 40, 1), `Mide el ancho disponible menos 40px (escena de ${w}px)`)))
  });

  L({
    title: 'El contenedor maestro',
    brief: 'Reto del mundo. El contenedor debe medir `160px` en total (relleno de `12px` y borde de `4px solid #8a5a1c` incluidos), estar **centrado** en horizontal y **ocultar** lo que sobresalga.',
    html: `<div class="escena"><div class="caja maestro">🧸🪀🪁🎲🧩🪅🎈🎁🧸🪀🪁🎲🧩🪅</div></div>`,
    base: `:where(.maestro){display:block;height:110px;width:auto;font-size:30px;line-height:1.2;word-break:break-all}`,
    css: `.maestro {\n  \n}`,
    cmds: ['width', 'box-sizing', 'padding', 'border', 'margin: auto', 'overflow'],
    hint: 'Necesitas `box-sizing` para que el ancho incluya relleno y borde.',
    help: 'Este reto combina el modelo de caja completo: tamaño total, centrado y desbordamiento.',
    solution: `.maestro {\n  box-sizing: border-box;\n  width: 160px;\n  padding: 12px;\n  border: 4px solid #8a5a1c;\n  margin: 0 auto;\n  overflow: hidden;\n}`,
    why: 'border-box fija el total, margin auto centra y overflow recorta.',
    success: '¡Mundo 2 completado! Dominas el modelo de caja.',
    check: t => [
      t.size('.maestro', 160, null, 'Mide 160px en total'), t.px('.maestro', 'padding-left', 12, 'Tiene 12px de relleno'),
      t.px('.maestro', 'border-left-width', 4, 'El borde mide 4px'), t.color('.maestro', 'border-left-color', '#8a5a1c', 'El borde es #8a5a1c'),
      t.centerX('.maestro', '.escena', 'Está centrado'), t.ok(['hidden', 'clip'].includes(t.v('.maestro', 'overflow-y')), 'Oculta lo que sobresale')
    ]
  });
})();
