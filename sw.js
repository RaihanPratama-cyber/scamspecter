/* ScamSpecter service worker — caches the app shell so the check works
   offline after the first visit. Only active when served over http(s). */
const CACHE = 'scamspecter-v1';
const FILES = ['index.html', 'styles.css', 'app.js', 'scoring.js', 'manifest.webmanifest'];

self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(CACHE).then(function (cache) { return cache.addAll(FILES); }));
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (hit) {
      return hit || fetch(event.request);
    })
  );
});
