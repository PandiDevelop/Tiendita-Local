const CACHE = 'mi-tiendita-v2';
const FILES = ['./','./index.html','./styles.css','./app.js','./fixes.js','./manifest.webmanifest','./store-icon.svg'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES))));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request))));
