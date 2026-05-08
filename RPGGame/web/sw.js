const CACHE_NAME = 'shadow-cache-v1';
const URLS_TO_CACHE = [
  './',
  'index.html',
  'style.css',
  'game.js',
  'player.js',
  'enemy.js',
  'ui.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request).catch(() => caches.match('index.html'));
    })
  );
});
