const CACHE = 'mi-tiendita-1.10.13';
// Version que se muestra en la app (el pie del menu y Opciones): sale de la
// MISMA cadena de cache, asi el numero que ve el usuario es literalmente el
// que identifica el despliegue activo (ver react-app/src/lib/appVersion.ts).
const APP_VERSION = CACHE.replace('mi-tiendita-', '');
// Se cachean desde el install los recursos de los temas ocultos (logos y
// patron de Owen) para que salgan siempre, aunque no haya red o el primer
// uso sea offline. allSettled evita que una descarga puntual falle rompa la
// instalacion del service worker.
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => {
    const assets = ['./index.html', './logo-owen.png', './logo-crisdeku.png', './logo-pandi.png', './pattern-owen.jpg', './pattern-crisdeku.svg']
      .map(url => new Request(url, { cache: 'reload' }));
    return Promise.allSettled(assets.map(a => cache.add(a)));
  }));
});
self.addEventListener('activate', event => event.waitUntil(Promise.all([self.clients.claim(), caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))])));
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'MT_VERSION' && event.ports && event.ports[0]) {
    event.ports[0].postMessage(APP_VERSION);
  }
});
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

// Notificaciones push reales (FCM), con la app cerrada del todo: ver
// react-app/src/lib/push.ts y push-worker/ en la raiz del repo. Este
// manejador es el que de verdad hace aparecer el aviso del sistema - FCM
// solo entrega el mensaje al service worker, mostrarlo es cosa de aca (sin
// esto, un token registrado recibiria el push pero nada se veria).
self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) { data = {}; }
  const notif = data.notification || {};
  const title = notif.title || data.title || 'Mi Tiendita';
  const body = notif.body || data.body || '';
  const link = (data.fcmOptions && data.fcmOptions.link) || (data.data && data.data.link) || './index.html';
  event.waitUntil(self.registration.showNotification(title, {
    body,
    icon: './icon-192.png',
    badge: './icon-192.png',
    tag: 'mi-tiendita-notas',
    // requireInteraction: que se quede en pantalla (no se autoborre a los
    // pocos segundos como un aviso normal) hasta que la persona la toque o
    // la quite a mano - como las apps normales. renotify: aunque reuse el
    // mismo "tag" (para no amontonar un aviso por cada nota nueva, solo
    // actualiza el mas reciente), que SI vuelva a sonar/vibrar cada vez en
    // vez de actualizarse en silencio.
    requireInteraction: true,
    renotify: true,
    data: { link },
  }));
});

// Al tocar el aviso: si ya hay una pestaña de la app abierta, la enfoca en
// vez de abrir una nueva (evita duplicar pestañas cada vez que llega un
// aviso); y cuando el aviso llegó con un destino propio (p.ej. una nota,
// ?tab=notas&n=<id>), la pestaña abierta navega hacia esa URL para que la
// app abra la nota de ese hilo (ver lib/deepLink.ts).
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const link = (event.notification.data && event.notification.data.link) || './index.html';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if ('focus' in c) {
          if (link && link !== './index.html' && c.url !== link) {
            return c.navigate(link).then(() => c.focus()).catch(() => c.focus());
          }
          return c.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(link);
    })
  );
});