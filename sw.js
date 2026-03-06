const CACHE_NAME = 'landmark-safety-v1';
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './styles.css',
  './Icon.png',
  './manifest.json'
];

// Install — cache all app files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', event => {
  self.clients.claim();
});

// Fetch — network-first: always try server, fall back to cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Update the cache with the fresh response
        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
