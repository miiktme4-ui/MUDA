const CACHE_NAME = 'fuel-rationing-v1';
const SHELL = ['./fuel-rationing-system.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // Only serve the local app shell from cache; everything else (API calls) goes to the network.
  if (SHELL.some(f => url.pathname.endsWith(f.replace('./', '')))) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
  }
});
