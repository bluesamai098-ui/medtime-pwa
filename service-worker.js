// Very small service worker to cache core assets for offline / "download" feel.
const CACHE_NAME = 'medtime-cache-v1';
const URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json'
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
  // Network-first for dynamic requests, cache-first for assets
  if (URLS.includes(new URL(e.request.url).pathname) ) {
    e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
  } else {
    e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
  }
});
