const CACHE_NAME = 'shadow-cache-v2';
const URLS_TO_CACHE = [
  './',
  'index.html',
  'style.css'
];

self.addEventListener('install', function(event) {
  // Activate new SW immediately
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

self.addEventListener('activate', function(event) {
  // Remove old caches
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// Network-first for dynamic game files and data, cache-first fallback for others
self.addEventListener('fetch', function(event) {
  const reqUrl = new URL(event.request.url);

  // Prefer network for game assets and JSON data so updates propagate quickly
  if (reqUrl.pathname.endsWith('/game.js') || reqUrl.pathname.startsWith('/data') || reqUrl.pathname.endsWith('.json')) {
    event.respondWith(
      fetch(event.request).then(resp => {
        // update cache asynchronously
        const respClone = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, respClone));
        return resp;
      }).catch(() => caches.match(event.request).then(c => c || caches.match('index.html')))
    );
    return;
  }

  // For other requests, try cache then network then fallback to index
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(resp => {
        // cache non-opaque successful responses
        if (resp && resp.status === 200 && resp.type !== 'opaque') {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return resp;
      }).catch(() => caches.match('index.html'));
    })
  );
});
