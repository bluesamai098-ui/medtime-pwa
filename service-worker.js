// Cache core assets for offline use (simple).
const CACHE_NAME = 'medtime-cache-v2';
const URLS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  const reqUrl = new URL(e.request.url);
  // Serve core assets from cache first
  if (URLS.includes(reqUrl.pathname) || URLS.includes(reqUrl.pathname + '/')) {
    e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
  } else {
    e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
  }
});
