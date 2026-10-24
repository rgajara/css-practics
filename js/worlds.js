/* CSS Quest — mundos, estilos base de los escenarios y registro de niveles.
   Los estilos base usan :where() para tener especificidad 0: cualquier
   regla que escriba el jugador gana siempre sobre ellos. */
window.CQ = window.CQ || {};
CQ.LEVELS = [];
CQ.STAGE = { w: 360, h: 270 };

/* Estilos comunes a todos los escenarios */
CQ.SCENE_BASE = `
:where(html){font-size:16px}
:where(html,body){margin:0;height:100%}
:where(body){font:15px/1.35 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#2b2540;overflow:hidden;-webkit-text-size-adjust:100%}
:where(.escena){position:relative;box-sizing:border-box;width:100%;height:100%;padding:16px}
:where(.cosa){display:flex;align-items:center;justify-content:center;width:56px;height:56px;font-size:30px;line-height:1;box-sizing:border-box}
:where(button){font:inherit}
`;

CQ.WORLDS = [
  { n: 1, name: 'Taller de pintura', topic: 'Fundamentos de CSS', hue: '#FF8A5B', emoji: '🎨',
    css: `:where(body){background:#FFF1DC}
:where(.escena){background:linear-gradient(#FFF1DC 0 70%,#E9C9A1 70% 100%)}
:where(.boton){display:inline-block;padding:10px 18px;border:0;border-radius:0;background:#d9d3c7;color:#2b2540;font-weight:600}
:where(.cartel){padding:12px 16px;background:#3b2f4a;color:#5d5170;font-weight:700}
:where(.caja){width:80px;height:60px;background:#d9d3c7}` },
  { n: 2, name: 'Almacén de cajas', topic: 'Modelo de caja', hue: '#F2C14E', emoji: '📦',
    css: `:where(body){background:#EEF1F6}
:where(.escena){background:repeating-linear-gradient(#EEF1F6 0 88px,#c9cfdb 88px 92px)}
:where(.caja){background:#E8B86B;border:0 solid #8a5a1c;color:#4a2f0c;font-weight:700;font-size:14px}
:where(.estante){background:#dfe4ed}` },
  { n: 3, name: 'Imprenta', topic: 'Tipografía y apariencia', hue: '#E76F8E', emoji: '🖋️',
    css: `:where(body){background:#FBF8F1}
:where(.escena){background:#FBF8F1;color:#2b2540}
:where(.hoja){background:#fff;padding:14px 16px;box-shadow:0 1px 0 #e6dfcf}
:where(h1,h2,p){margin:0 0 8px}
:where(h1){font-size:22px}` },
  { n: 4, name: 'Ciudad nocturna', topic: 'Posicionamiento', hue: '#8E7CFF', emoji: '🌃',
    css: `:where(body){background:#1F2547;color:#e8e6ff}
:where(.escena){background:linear-gradient(#1F2547 0 75%,#2c2f45 75%)}
:where(.cosa){border-radius:12px;background:rgba(255,255,255,.08)}
:where(.meta){position:absolute;width:56px;height:56px;box-sizing:border-box;border:2px dashed rgba(255,212,71,.8);border-radius:12px}` },
  { n: 5, name: 'Puerto', topic: 'Flexbox', hue: '#38B6D8', emoji: '⛵',
    css: `:where(body){background:#BFE6F2}
:where(.puerto){box-sizing:border-box;width:100%;height:100%;padding:8px;background:radial-gradient(circle at 20% 30%,rgba(255,255,255,.35) 0 2px,transparent 3px) 0 0/40px 34px,#BFE6F2}
:where(.barco){display:flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:14px;font-size:30px;box-sizing:border-box;border:3px solid currentColor}
:where(.rojo){color:#E5484D;background:#ffe3e1}
:where(.amarillo){color:#C79100;background:#fff3c4}
:where(.verde){color:#2F9E5B;background:#dcf7e6}
:where(.azul){color:#2B6CD9;background:#dde9ff}` },
  { n: 6, name: 'Huerto', topic: 'CSS Grid', hue: '#7BC96F', emoji: '🌱',
    css: `:where(body){background:#EDE3CC}
:where(.huerto){box-sizing:border-box;width:100%;height:100%;padding:10px;background:#EDE3CC}
:where(.parcela){display:flex;align-items:center;justify-content:center;min-height:40px;background:#8B6A47;border-radius:8px;color:#fff;font-size:24px;box-sizing:border-box;border:2px solid #6d5236}
:where(.parcela.v){background:#5fa052;border-color:#3f7a35}` },
  { n: 7, name: 'Laboratorio', topic: 'Diseño adaptable', hue: '#5B8CFF', emoji: '🧪',
    css: `:where(body){background:#EEF0FF}
:where(.escena){background:#EEF0FF}
:where(.panel){background:#fff;border:2px solid #c9cdf5;border-radius:10px;padding:10px;box-sizing:border-box}
:where(.tubo){background:#a6c1ff;border-radius:8px;min-height:30px;box-sizing:border-box}` },
  { n: 8, name: 'Galería de robots', topic: 'Selectores y pseudoclases', hue: '#B07CFF', emoji: '🤖',
    css: `:where(body){background:#F1F0F6}
:where(.escena){background:#F1F0F6}
:where(.robot){display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;margin:3px;border-radius:12px;background:#d6d3e3;color:#3b3552;font-size:26px;box-sizing:border-box}
:where(ul){list-style:none;margin:0;padding:0}` },
  { n: 9, name: 'Feria espacial', topic: 'Animaciones e interfaces', hue: '#FF6FB5', emoji: '🚀',
    css: `:where(body){background:#15193A;color:#f0eeff}
:where(.escena){background:radial-gradient(circle at 15% 20%,#fff 0 1px,transparent 2px) 0 0/60px 50px,radial-gradient(circle at 60% 70%,#c9c3ff 0 1px,transparent 2px) 0 0/90px 70px,#15193A}
:where(.cosa){border-radius:14px}` },
  { n: 10, name: 'Ciudadela final', topic: 'Retos avanzados', hue: '#FFD447', emoji: '🏰',
    css: `:where(body){background:#F6F7FB;color:#1f2433}
:where(.escena){background:#F6F7FB}
:where(a){color:inherit}
:where(img){display:block}` }
];

/* Registro de niveles: LV(mundo, datos) */
CQ.LV = function (world, data) {
  data.world = world;
  CQ.LEVELS.push(data);
};

/* Imagen SVG local (sin red) para los niveles que usan <img> */
CQ.IMG = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250">' +
  '<rect width="400" height="250" fill="#7cc4ff"/><circle cx="310" cy="70" r="36" fill="#ffd447"/>' +
  '<path d="M0 250 L120 110 L210 210 L270 150 L400 250Z" fill="#3c8d5a"/>' +
  '<path d="M0 250 L90 170 L180 250Z" fill="#2c6b44"/></svg>');
