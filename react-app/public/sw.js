const CACHE = 'mi-tiendita-1.6.2';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(Promise.all([self.clients.claim(), caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))])));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    // cache:'no-store' evita que el navegador sirva el index.html viejo que
    // GitHub Pages dejó en su caché; así el equipo siempre carga la versión
    // nueva. La caché del service worker sigue guardando copias para ofrecer
    // la app aunque no haya internet.
    fetch(event.request, { cache: 'no-store' })
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});