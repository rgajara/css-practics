/* CSS Quest — Service Worker para jugar sin conexión.
   Al publicar una versión nueva, cambia VERSION: el navegador detecta el
   cambio, descarga los archivos nuevos y el juego ofrece «Actualizar». */
const VERSION = 'cssquest-v1.1.0';

const ASSETS = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './js/commands.js',
  './js/worlds.js',
  './js/levels/w01.js',
  './js/levels/w02.js',
  './js/levels/w03.js',
  './js/levels/w04.js',
  './js/levels/w05.js',
  './js/levels/w06.js',
  './js/levels/w07.js',
  './js/levels/w08.js',
  './js/levels/w09.js',
  './js/levels/w10.js',
  './js/engine.js',
  './js/editor.js',
  './js/game.js',
  './assets/icon.svg',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  // cache: 'reload' evita guardar copias antiguas de la caché HTTP
  event.waitUntil(
    caches.open(VERSION).then(cache =>
      Promise.all(ASSETS.map(url => cache.add(new Request(url, { cache: 'reload' })))))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('cssquest-') && k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Páginas: red primero (para recibir cambios) y caché si no hay conexión
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put('./index.html', copy));
        return res;
      }).catch(() => caches.match('./index.html', { ignoreSearch: true }))
    );
    return;
  }

  // Recursos: caché primero; si faltan, red y se guardan
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
      if (res.ok && res.type === 'basic') {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(req, copy));
      }
      return res;
    }))
  );
});
