/* Mundo 4 — Ciudad nocturna: posicionamiento (niveles 61–80)
   Los contornos discontinuos (ghost) muestran dónde debe acabar cada elemento. */
(function () {
  const L = d => CQ.LV(4, d);

  L({
    title: 'El globo se desplaza',
    brief: 'Con `position: relative` puedes mover un elemento desde su sitio original. Lleva el globo al contorno discontinuo: `20px` hacia abajo y `30px` hacia la derecha.',
    html: `<div class="escena"><div class="cosa globo">🎈</div></div>`,
    css: `.globo {\n  position: relative;\n  \n}`,
    ghost: '.globo',
    cmds: ['position', 'top', 'left'],
    hint: '`top: 20px` empuja desde arriba (hacia abajo) y `left: 30px` empuja desde la izquierda (hacia la derecha).',
    help: 'Con `position: relative`, `top`, `right`, `bottom` y `left` desplazan el elemento respecto a donde estaría normalmente.',
    solution: `.globo {\n  position: relative;\n  top: 20px;\n  left: 30px;\n}`,
    why: 'El globo se mueve sin que nada más cambie de sitio.',
    success: 'El globo flota justo donde querías.',
    check: t => [t.same('.globo', 'El globo está en el contorno'), t.eq('.globo', 'position', 'relative', 'Usas position: relative')]
  });

  L({
    title: 'Sin molestar a nadie',
    brief: 'El taxi del medio debe subir `30px`. Usa posicionamiento relativo: los otros dos coches **no deben moverse**.',
    html: `<div class="escena calle"><div class="cosa coche">🚗</div><div class="cosa coche taxi">🚕</div><div class="cosa coche">🚙</div></div>`,
    base: `:where(.calle){display:flex;gap:30px;align-items:flex-end;justify-content:center;padding-bottom:40px}`,
    css: `.taxi {\n  \n}`,
    ghost: '.coche',
    cmds: ['position', 'top', 'bottom'],
    hint: 'Para subir, usa un valor negativo en `top` o uno positivo en `bottom`.',
    help: 'El desplazamiento relativo no afecta a los vecinos: el hueco original del elemento se conserva.',
    solution: `.taxi {\n  position: relative;\n  top: -30px;\n}`,
    why: '`top: -30px` (o `bottom: 30px`) sube el taxi y los demás se quedan quietos.',
    success: 'El taxi saluda desde arriba.',
    check: t => [t.same('.coche', 'Los tres coches están en su contorno'), t.eq('.taxi', 'position', 'relative', 'El taxi usa posicionamiento relativo')]
  });

  L({
    title: 'Luna en la esquina',
    brief: 'El cielo tiene `position: relative`. Coloca la luna con `position: absolute` a `10px` de su borde **superior** y `10px` de su borde **derecho**.',
    html: `<div class="escena"><div class="cielo"><div class="cosa luna">🌙</div></div></div>`,
    base: `:where(.cielo){position:relative;height:100%;border:2px dashed rgba(255,255,255,.15);border-radius:12px;box-sizing:border-box}`,
    css: `.luna {\n  \n}`,
    ghost: '.luna',
    cmds: ['position', 'top', 'right'],
    hint: 'Con `absolute`, `right: 10px` mide desde el borde derecho del cielo.',
    help: '`position: absolute` saca el elemento del flujo y lo coloca respecto a su antecesor posicionado más cercano.',
    solution: `.luna {\n  position: absolute;\n  top: 10px;\n  right: 10px;\n}`,
    why: 'El cielo es la referencia porque tiene `position: relative`.',
    success: 'Buenas noches, ciudad.',
    check: t => [t.same('.luna', 'La luna está en su contorno'), t.eq('.luna', 'position', 'absolute', 'La luna usa position: absolute')]
  });

  L({
    title: 'La ventana escapada',
    brief: 'La ventana tiene `position: absolute; bottom: 10px; left: 10px;`, pero aparece en la esquina de la escena. Haz que se coloque respecto al **edificio**, sin tocar la ventana.',
    html: `<div class="escena"><div class="edificio"><div class="cosa ventana">🪟</div></div></div>`,
    base: `:where(.edificio){width:150px;height:200px;margin:20px 0 0 110px;background:#3a4170;border-radius:8px 8px 0 0}:where(.ventana){position:absolute;bottom:10px;left:10px;background:#ffd447;width:44px;height:44px;font-size:24px}`,
    css: `.edificio {\n  \n}`,
    ghost: '.ventana',
    cmds: ['position', 'bottom', 'left'],
    rule: 'Escribe solo en la regla del edificio.',
    hint: 'Un elemento absoluto busca el antecesor más cercano que no sea `static`.',
    help: 'Dar `position: relative` a un contenedor lo convierte en la referencia (bloque contenedor) de sus hijos absolutos, sin moverlo.',
    solution: `.edificio {\n  position: relative;\n}`,
    why: 'Ahora `bottom` y `left` se miden desde el edificio.',
    success: 'La luz vuelve a la ventana correcta.',
    check: t => [t.same('.ventana', 'La ventana está dentro del edificio, en su contorno'), t.inside('.ventana', '.edificio', 'La ventana queda dentro del edificio'), t.avoid(/\.ventana\s*\{/, 'No modificas la regla de la ventana')]
  });

  L({
    title: 'Aparcado al fondo',
    brief: 'Aparca el coche en la esquina **inferior derecha** del garaje, pegado a los bordes.',
    html: `<div class="escena"><div class="garaje"><div class="cosa coche">🚙</div></div></div>`,
    base: `:where(.garaje){position:relative;height:100%;background:repeating-linear-gradient(90deg,#2c2f45 0 60px,#353a57 60px 62px);border-radius:10px}`,
    css: `.coche {\n  \n}`,
    ghost: '.coche',
    cmds: ['position', 'bottom', 'right'],
    hint: '`bottom: 0` y `right: 0` pegan el elemento a esos bordes.',
    help: 'Con `absolute`, `bottom` y `right` miden desde los bordes inferior y derecho de la referencia.',
    solution: `.coche {\n  position: absolute;\n  bottom: 0;\n  right: 0;\n}`,
    why: 'Distancia cero a los bordes inferior y derecho.',
    success: 'Bien aparcado.',
    check: t => [t.same('.coche', 'El coche está en la esquina inferior derecha')]
  });

  L({
    title: 'Farola en el centro',
    brief: 'Centra la farola de `56px` dentro de la plaza usando `position: absolute`, `inset: 0` y márgenes automáticos.',
    html: `<div class="escena plaza"><div class="cosa farola">🏮</div></div>`,
    base: `:where(.plaza){position:relative}`,
    css: `.farola {\n  \n}`,
    ghost: '.farola',
    cmds: ['position', 'inset', 'margin: auto'],
    hint: 'Si estiras el elemento hacia los cuatro lados pero tiene un tamaño fijo, `margin: auto` reparte el espacio sobrante.',
    help: '`inset: 0` equivale a `top: 0; right: 0; bottom: 0; left: 0`. Con ancho y alto fijos, `margin: auto` lo centra en ambos ejes.',
    solution: `.farola {\n  position: absolute;\n  inset: 0;\n  margin: auto;\n}`,
    why: 'Los márgenes automáticos reparten el espacio por igual en vertical y horizontal.',
    success: 'La plaza ya tiene luz.',
    check: t => [t.center('.farola', '.plaza', 'La farola está centrada en la plaza'), t.size('.farola', 56, 56, 'La farola mantiene su tamaño')]
  });

  L({
    title: 'Lluvia sobre la ciudad',
    brief: 'La capa de lluvia debe **cubrir por completo** la ventana de la escena, de borde a borde.',
    html: `<div class="escena ciudad"><div class="cosa edif">🏙️</div><div class="lluvia"></div></div>`,
    base: `:where(.ciudad){position:relative;display:flex;align-items:flex-end;justify-content:center}:where(.edif){font-size:80px;width:120px;height:120px;background:none}:where(.lluvia){width:60px;height:60px;background:repeating-linear-gradient(105deg,transparent 0 10px,rgba(160,190,255,.45) 10px 11px);border:1px solid rgba(160,190,255,.4)}`,
    css: `.lluvia {\n  \n}`,
    cmds: ['position', 'inset', 'top', 'left', 'width', 'height'],
    hint: 'Un elemento absoluto con distancia 0 a los cuatro lados se estira hasta llenar su referencia.',
    help: 'Con `position: absolute; inset: 0;` el elemento ocupa todo su bloque contenedor, aunque no tenga `width` ni `height`.',
    solution: `.lluvia {\n  position: absolute;\n  inset: 0;\n  width: auto;\n  height: auto;\n}`,
    why: 'Las cuatro distancias a cero estiran la capa a todo el tamaño.',
    success: 'Llueve sobre toda la ciudad.',
    check: t => { const a = t.rect('.lluvia'), b = t.rect('.ciudad'); return [t.ok(t.near(a.x, b.x) && t.near(a.y, b.y) && t.near(a.w, b.w) && t.near(a.h, b.h), 'La lluvia cubre toda la escena')]; }
  });

  L({
    title: 'Gato curioso',
    brief: 'El gato está escondido detrás del cartel. Ambos tienen `position: absolute`. Haz que el gato quede **delante**.',
    html: `<div class="escena tejado"><div class="cosa gato">🐈‍⬛</div><div class="cosa cartel">HOTEL</div></div>`,
    base: `:where(.tejado){position:relative}:where(.gato){position:absolute;left:150px;top:90px;background:#ffd447;font-size:34px}:where(.cartel){position:absolute;left:110px;top:100px;width:140px;height:60px;background:#E5484D;color:#fff;font-size:22px;font-weight:800}`,
    css: `.gato {\n  \n}`,
    cmds: ['z-index'],
    hint: 'El elemento con el `z-index` más alto se dibuja encima.',
    help: '`z-index` ordena en profundidad los elementos posicionados. Sin él, el que aparece después en el HTML queda delante.',
    solution: `.gato {\n  z-index: 1;\n}`,
    why: 'El gato pasa a una capa superior a la del cartel (z-index automático).',
    success: '¡Miau!',
    check: t => [t.front('.gato', 'El gato se ve delante del cartel')]
  });

  L({
    title: 'z-index sin efecto',
    brief: 'Ahora el gato tiene `z-index: 5`, pero sigue detrás del cartel. Averigua por qué y arréglalo sin moverlo de su sitio.',
    html: `<div class="escena tejado"><div class="cartel">HOTEL</div><div class="cosa gato">🐈</div></div>`,
    base: `:where(.cartel){position:relative;width:180px;height:70px;margin:50px auto 0;background:#E5484D;color:#fff;font-size:26px;font-weight:800;display:flex;align-items:center;justify-content:center}:where(.gato){margin:-40px auto 0;background:#ffd447}`,
    css: `.gato {\n  z-index: 5;\n}`,
    ghost: '.gato',
    cmds: ['z-index', 'position'],
    hint: '`z-index` solo funciona en elementos posicionados.',
    help: 'Un elemento con `position: static` (el valor por defecto) ignora `z-index`. Con `position: relative` empieza a funcionar sin moverse.',
    solution: `.gato {\n  position: relative;\n  z-index: 5;\n}`,
    why: '`relative` sin desplazamientos no mueve el gato, pero activa su `z-index`.',
    success: 'El gato vuelve a ser el protagonista.',
    check: t => [t.front('.gato', 'El gato se ve delante del cartel'), t.same('.gato', 'El gato no se ha movido')]
  });

  L({
    title: 'Capas de carteles',
    brief: 'Tres carteles se solapan. Ordénalos de **atrás a delante**: azul, verde, rojo.',
    html: `<div class="escena capas"><div class="cosa c rojo">R</div><div class="cosa c verde">V</div><div class="cosa c azul">A</div></div>`,
    base: `:where(.capas){position:relative}:where(.c){position:absolute;width:110px;height:80px;font-size:26px;font-weight:800;color:#fff}:where(.rojo){background:#E5484D;left:60px;top:40px}:where(.verde){background:#2F9E5B;left:110px;top:80px}:where(.azul){background:#2B6CD9;left:160px;top:120px}`,
    css: `.rojo {\n  \n}\n\n.verde {\n  \n}\n\n.azul {\n  \n}`,
    cmds: ['z-index'],
    hint: 'Da un número a cada uno: el que debe quedar delante, el mayor.',
    help: 'Entre elementos posicionados del mismo contexto, se pinta encima el de mayor `z-index`.',
    solution: `.rojo {\n  z-index: 3;\n}\n\n.verde {\n  z-index: 2;\n}\n\n.azul {\n  z-index: 1;\n}`,
    why: 'Rojo (3) delante de verde (2), y este delante de azul (1).',
    success: 'Capas en orden.',
    check: t => {
      const r = t.rect('.rojo'), v = t.rect('.verde'), a = t.rect('.azul');
      const rv = [(Math.max(r.x, v.x) + Math.min(r.r, v.r)) / 2, (Math.max(r.y, v.y) + Math.min(r.b, v.b)) / 2];
      const va = [(Math.max(v.x, a.x) + Math.min(v.r, a.r)) / 2, (Math.max(v.y, a.y) + Math.min(v.b, a.b)) / 2];
      return [t.ok(t.topAt('.rojo', rv[0], rv[1]), 'El rojo está delante del verde'), t.ok(t.topAt('.verde', va[0], va[1]), 'El verde está delante del azul')];
    }
  });

  L({
    title: 'Aviso pegado a la pantalla',
    brief: 'El aviso de tráfico está dentro de una caja con `position: relative`. Haz que se pegue al **borde inferior de la ventana** y ocupe todo su ancho, sin importar esa caja.',
    html: `<div class="escena"><div class="caja-ref">Centro de control<div class="aviso">⚠️ Corte en la avenida</div></div></div>`,
    base: `:where(.caja-ref){position:relative;margin:20px;padding:10px;height:90px;border:2px dashed rgba(255,255,255,.3);border-radius:10px}:where(.aviso){background:#ffd447;color:#2b2200;font-weight:700;padding:10px 14px}`,
    css: `.aviso {\n  \n}`,
    cmds: ['position', 'bottom', 'left', 'right'],
    hint: '`absolute` usaría la caja como referencia. Hay otro valor que usa siempre la ventana.',
    help: '`position: fixed` coloca el elemento respecto a la ventana del navegador; no se mueve al desplazar la página.',
    solution: `.aviso {\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  right: 0;\n}`,
    why: 'La referencia es la ventana, así que `bottom: 0` lo pega abajo del todo.',
    success: 'Todos verán el aviso.',
    check: t => { const r = t.rect('.aviso'), H = t.win.innerHeight, W = t.win.innerWidth; return [t.ok(t.near(r.b, H, 1), 'El aviso está pegado al borde inferior de la ventana'), t.ok(t.near(r.x, 0, 1) && t.near(r.w, W, 1), 'Ocupa todo el ancho de la ventana'), t.eq('.aviso', 'position', 'fixed', 'Usas position: fixed')]; }
  });

  L({
    title: 'Cabecera pegajosa',
    brief: 'La lista de calles se desplaza. Haz que su cabecera se quede **pegada arriba** de la lista al desplazarla.',
    html: `<div class="escena"><div class="lista"><div class="cab">Calles del centro</div><p>Av. Larco</p><p>Jr. de la Unión</p><p>Av. Arequipa</p><p>Calle Berlín</p><p>Av. Pardo</p><p>Calle Schell</p><p>Av. Benavides</p><p>Calle Alcanfores</p></div></div>`,
    base: `:where(.lista){height:220px;overflow-y:auto;background:#262b52;border-radius:12px}:where(.cab){background:#8E7CFF;color:#1F2547;font-weight:800;padding:10px 12px}:where(.lista p){margin:0;padding:10px 12px;border-bottom:1px solid #353a63}`,
    css: `.cab {\n  \n}`,
    cmds: ['position', 'top'],
    rule: 'Se comprueba desplazando la lista hacia abajo.',
    hint: 'Hay un valor de `position` que mezcla `relative` y `fixed`.',
    help: '`position: sticky` se comporta como relativo hasta que, al desplazar, llega a la distancia indicada (`top: 0`) y se queda pegado.',
    solution: `.cab {\n  position: sticky;\n  top: 0;\n}`,
    why: 'Al desplazar la lista, la cabecera se detiene en `top: 0`.',
    success: 'Nunca perderás de vista el título.',
    check: t => {
      const l = t.q('.lista'), prev = l.scrollTop;
      l.scrollTop = 120;
      const ok = t.near(t.rect('.cab').y, t.rect('.lista').y, 1);
      l.scrollTop = prev;
      return [t.ok(ok, 'Al desplazar, la cabecera sigue arriba de la lista'), t.eq('.cab', 'position', 'sticky', 'Usas position: sticky')];
    }
  });

  L({
    title: 'Se asoma el pez',
    brief: 'El pez está dentro de la fuente (que tiene `position: relative`). Haz que **asome por encima** del borde: colócalo con `position: absolute`, `20px` por encima del borde superior y a `60px` de la izquierda.',
    html: `<div class="escena"><div class="fuente"><div class="cosa pez">🐟</div></div></div>`,
    base: `:where(.fuente){position:relative;margin:90px auto 0;width:220px;height:110px;background:#2a6fb0;border-radius:0 0 60px 60px;border-top:6px solid #8bb6e0}`,
    css: `.pez {\n  \n}`,
    ghost: '.pez',
    cmds: ['position', 'top', 'left'],
    hint: 'Los valores negativos sacan el elemento fuera de su referencia.',
    help: 'Con `top: -20px` el pez queda 20px por encima del borde superior interior de la fuente.',
    solution: `.pez {\n  position: absolute;\n  top: -20px;\n  left: 60px;\n}`,
    why: 'El valor negativo lo saca por arriba.',
    success: '¡Glup!',
    check: t => [t.same('.pez', 'El pez se asoma en su contorno')]
  });

  L({
    title: 'Constelación',
    brief: 'Coloca las tres estrellas en sus contornos. Todas tienen `position: absolute`; tú decides `top` y `left` de cada una: la primera en (20, 30), la segunda en (150, 90) y la tercera en (260, 40).',
    html: `<div class="escena cielo"><div class="cosa estrella e1">⭐</div><div class="cosa estrella e2">🌟</div><div class="cosa estrella e3">✨</div></div>`,
    base: `:where(.cielo){position:relative}:where(.estrella){position:absolute;top:180px;left:0;background:none}:where(.e2){left:70px}:where(.e3){left:140px}`,
    css: `.e1 {\n  \n}\n\n.e2 {\n  \n}\n\n.e3 {\n  \n}`,
    ghost: '.estrella',
    cmds: ['top', 'left'],
    hint: 'El primer número es `left` y el segundo `top`: (20, 30) significa `left: 20px; top: 30px`.',
    help: 'Con varios elementos absolutos, cada uno necesita sus propias coordenadas.',
    solution: `.e1 {\n  left: 20px;\n  top: 30px;\n}\n\n.e2 {\n  left: 150px;\n  top: 90px;\n}\n\n.e3 {\n  left: 260px;\n  top: 40px;\n}`,
    why: 'Cada estrella recibe sus coordenadas desde la esquina del cielo.',
    success: 'Has dibujado una constelación.',
    check: t => [t.same('.e1', 'La primera estrella está en su sitio'), t.same('.e2', 'La segunda estrella está en su sitio'), t.same('.e3', 'La tercera estrella está en su sitio')]
  });

  L({
    title: 'Cuatro esquinas',
    brief: 'Pon cada señal en una esquina del cruce: `.no` arriba a la izquierda, `.ne` arriba a la derecha, `.so` abajo a la izquierda y `.se` abajo a la derecha. Todas pegadas a los bordes.',
    html: `<div class="escena cruce"><div class="cosa s no">↖️</div><div class="cosa s ne">↗️</div><div class="cosa s so">↙️</div><div class="cosa s se">↘️</div></div>`,
    base: `:where(.cruce){position:relative}:where(.s){position:absolute;left:150px;top:100px}`,
    css: `.no {\n  \n}\n`,
    ghost: '.s',
    cmds: ['top', 'right', 'bottom', 'left'],
    hint: 'Ojo: las señales ya tienen `top` y `left`. Para las esquinas derechas o inferiores, anula el valor que sobra con `auto`.',
    help: 'Si un elemento tiene `left` y `right` a la vez con tamaño fijo, gana `left`. Usa `left: auto` para que `right` funcione.',
    solution: `.no {\n  top: 0;\n  left: 0;\n}\n\n.ne {\n  top: 0;\n  left: auto;\n  right: 0;\n}\n\n.so {\n  top: auto;\n  bottom: 0;\n  left: 0;\n}\n\n.se {\n  top: auto;\n  left: auto;\n  bottom: 0;\n  right: 0;\n}`,
    why: 'Para usar `right` o `bottom`, primero se anula `left` o `top` con `auto`.',
    success: 'Cruce bien señalizado.',
    check: t => ['.no', '.ne', '.so', '.se'].map(s => t.same(s, `La señal ${s} está en su esquina`))
  });

  L({
    title: 'Notificación',
    brief: 'Coloca la insignia roja sobre la esquina **superior derecha** del avatar, sobresaliendo `6px` por arriba y por la derecha. El avatar necesita ser la referencia.',
    html: `<div class="escena"><div class="cosa avatar">🧑‍🚀<span class="insignia">3</span></div></div>`,
    base: `:where(.avatar){width:80px;height:80px;margin:60px auto 0;font-size:44px;background:#3a4170;border-radius:50%}:where(.insignia){width:24px;height:24px;border-radius:50%;background:#E5484D;color:#fff;font:700 13px/24px sans-serif;text-align:center}`,
    css: `.avatar {\n  \n}\n\n.insignia {\n  \n}`,
    ghost: '.insignia',
    cmds: ['position', 'top', 'right'],
    hint: 'Avatar `relative`, insignia `absolute` con valores negativos.',
    help: 'Este patrón (padre relativo e hijo absoluto) es la base de insignias, etiquetas y botones flotantes.',
    solution: `.avatar {\n  position: relative;\n}\n\n.insignia {\n  position: absolute;\n  top: -6px;\n  right: -6px;\n}`,
    why: 'La insignia se mide desde la esquina del avatar.',
    success: 'Tienes 3 mensajes nuevos.',
    check: t => [t.same('.insignia', 'La insignia está en la esquina del avatar'), t.same('.avatar', 'El avatar no se mueve')]
  });

  L({
    title: 'Bocadillo de ayuda',
    brief: 'El bocadillo debe quedar **justo encima** del botón, alineado a su izquierda. El botón ya tiene `position: relative`.',
    html: `<div class="escena"><button class="btn">Parada<span class="tip">Línea 7</span></button></div>`,
    base: `:where(.btn){position:relative;margin:120px 0 0 110px;padding:12px 18px;border:0;border-radius:10px;background:#8E7CFF;color:#1F2547;font-weight:800}:where(.tip){white-space:nowrap;background:#fff;color:#1F2547;padding:6px 10px;border-radius:8px;font-size:14px;margin-left:8px}`,
    css: `.tip {\n  \n}`,
    ghost: '.tip',
    cmds: ['position', 'bottom', 'left', '%'],
    hint: '`bottom: 100%` coloca el borde inferior del bocadillo en el borde superior del botón.',
    help: 'En `top`/`bottom`, los porcentajes se calculan sobre la altura de la referencia. `bottom: 100%` lo sube toda la altura del botón.',
    solution: `.tip {\n  position: absolute;\n  bottom: 100%;\n  left: 0;\n  margin-left: 0;\n}`,
    why: 'El bocadillo se apoya sobre el botón, sea cual sea su altura.',
    success: 'Ayuda en el sitio justo.',
    check: t => [t.ok(t.near(t.rect('.tip').b, t.rect('.btn').y, 1), 'El bocadillo queda justo encima del botón'), t.ok(t.near(t.rect('.tip').x, t.rect('.btn').x, 1), 'Está alineado a la izquierda del botón')]
  });

  L({
    title: 'Contextos de apilamiento',
    brief: 'El avión tiene `z-index: 999` y aun así queda detrás de la nube. Está dentro de `.capa-a` (`z-index: 1`) y la nube en `.capa-b` (`z-index: 2`). Haz que el avión se vea delante.',
    html: `<div class="escena cielo"><div class="capa-a"><div class="cosa avion">✈️</div></div><div class="capa-b"><div class="cosa nube">☁️</div></div></div>`,
    base: `:where(.cielo){position:relative}:where(.capa-a){position:relative;z-index:1;height:100px}:where(.capa-b){position:relative;z-index:2;height:100px}:where(.avion){position:absolute;z-index:999;left:120px;top:60px;background:#ffd447;font-size:30px}:where(.nube){position:absolute;left:100px;top:-30px;width:110px;height:80px;font-size:70px;background:#dfe6ff;border-radius:40px}`,
    css: `.avion {\n  z-index: 9999;\n}`,
    cmds: ['z-index', 'position'],
    hint: 'El `z-index` del avión solo compite dentro de su capa. Lo que compite con la nube es `.capa-a`.',
    help: 'Un elemento posicionado con `z-index` crea un **contexto de apilamiento**: sus hijos no pueden salir de él, por grande que sea su número.',
    solution: `.capa-a {\n  z-index: 3;\n}`,
    why: 'Al subir la capa A por encima de la B, todo lo que contiene pasa delante.',
    success: 'Has entendido uno de los conceptos más difíciles de CSS.',
    check: t => [t.front('.avion', 'El avión se ve delante de la nube')]
  });

  L({
    title: 'Texto alrededor',
    brief: 'Haz que la foto **flote a la izquierda** y que el texto la rodee. Deja `12px` de margen a su derecha.',
    html: `<div class="escena"><div class="nota"><div class="cosa foto">🌆</div><p>La ciudad de noche se transforma: los letreros se encienden, las avenidas brillan y cada ventana cuenta una historia distinta mientras el tráfico fluye sin descanso.</p></div></div>`,
    base: `:where(.nota){background:#262b52;padding:12px;border-radius:12px}:where(.foto){width:80px;height:80px;font-size:50px;background:#3a4170}:where(.nota p){margin:0;font-size:15px}`,
    css: `.foto {\n  \n}`,
    cmds: ['float', 'margin-right'],
    hint: '`float: left` saca la caja a la izquierda y el texto fluye a su lado.',
    help: '`float` se usaba para maquetar páginas enteras; hoy se usa sobre todo para que el texto rodee imágenes.',
    solution: `.foto {\n  float: left;\n  margin-right: 12px;\n}`,
    why: 'El texto se reparte en el espacio que deja la foto flotante.',
    success: 'Como una revista.',
    check: t => {
      const f = t.rect('.foto'), p = t.q('.nota p');
      const rg = t.doc.createRange(); rg.setStart(p.firstChild, 0); rg.setEnd(p.firstChild, 2);
      const first = rg.getBoundingClientRect();
      return [t.eq('.foto', 'float', 'left', 'La foto flota a la izquierda'), t.ok(t.near(first.left - f.r, 12, 1.5) && first.top < f.b, 'El texto empieza a la derecha de la foto, a 12px'), t.px('.foto', 'margin-right', 12, 'Margen derecho de 12px')];
    }
  });

  L({
    title: 'Postal nocturna',
    brief: 'Reto del mundo. Monta la postal: la **luna** absoluta a `12px` de arriba y de la derecha del cielo; la **ventana** absoluta en la parte inferior izquierda del edificio (a `10px` de cada borde), y el **gato** delante del edificio.',
    html: `<div class="escena cielo"><div class="cosa luna">🌕</div><div class="edificio"><div class="cosa ventana">💡</div></div><div class="cosa gato">🐈‍⬛</div></div>`,
    base: `:where(.edificio){width:140px;height:170px;background:#3a4170;margin:50px 0 0 90px;border-radius:6px 6px 0 0}:where(.ventana){width:40px;height:40px;background:#ffd447;font-size:22px}:where(.gato){margin:-70px 0 0 200px;background:#E76F8E}`,
    css: `/* Cielo, luna, edificio, ventana y gato */\n`,
    ghost: '.luna, .ventana, .gato',
    cmds: ['position', 'top', 'right', 'bottom', 'left', 'z-index'],
    hint: 'Necesitas dos referencias (cielo y edificio) y un elemento posicionado con `z-index` (el gato).',
    help: 'Repasa: relativo como referencia, absoluto para colocar y z-index (solo en posicionados) para el orden.',
    solution: `.cielo {\n  position: relative;\n}\n\n.luna {\n  position: absolute;\n  top: 12px;\n  right: 12px;\n}\n\n.edificio {\n  position: relative;\n}\n\n.ventana {\n  position: absolute;\n  bottom: 10px;\n  left: 10px;\n}\n\n.gato {\n  position: relative;\n  z-index: 1;\n}`,
    why: 'Cada elemento usa la referencia adecuada y el gato se activa con `relative` para usar `z-index`.',
    success: '¡Mundo 4 completado! La ciudad está en su sitio.',
    check: t => [t.same('.luna', 'La luna está en la esquina del cielo'), t.same('.ventana', 'La ventana está abajo a la izquierda del edificio'), t.same('.gato', 'El gato no se mueve de su sitio'), t.front('.gato', 'El gato está delante del edificio')]
  });
})();
