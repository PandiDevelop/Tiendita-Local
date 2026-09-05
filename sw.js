const CACHE = 'mi-tiendita-v19';
const FILES = ['./','./index.html','./styles.css','./app.js','./fixes.js','./sync.js','./firebase-config.js','./manifest.webmanifest','./store-icon.svg','./icon-192.png','./icon-512.png','./icon-180.png','./icon-32.png','./logo.svg'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES))));
self.addEventListener('activate', event => event.waitUntil(Promise.all([self.clients.claim(), caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))])));
self.addEventListener('fetch', event => event.respondWith(fetch(event.request).then(response => { const copy=response.clone(); caches.open(CACHE).then(cache => cache.put(event.request,copy)); return response; }).catch(() => caches.match(event.request))));
