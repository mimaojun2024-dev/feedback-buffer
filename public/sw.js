const CACHE_PREFIX = 'feedback-buffer-';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.indexOf(CACHE_PREFIX) === 0)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.registration.unregister())
  );
  self.clients.claim();
});
