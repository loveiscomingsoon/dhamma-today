const CACHE_NAME = "dhamma-today-v22";
const APP_ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=20260620-22",
  "./app.js?v=20260620-22",
  "./content/dhamma-library.js?v=20260620-22",
  "./books/dhamma-pocket-book.html",
  "./books/pocket-book.css?v=20260620-22",
  "./books/pocket-book.js?v=20260620-22",
  "./manifest.webmanifest?v=20260620-22",
  "./assets/river-morning.jpg?v=20260618-2",
  "./assets/lucide.min.js?v=20260618-2",
  "./assets/crane-monkey-mark.png?v=20260619-1",
  "./assets/dhamma-today-qr.png",
  "./assets/dhamma-today-qr-poster.png",
  "./assets/app-icon-192.png",
  "./assets/app-icon-512.png",
  "./assets/apple-touch-icon.png",
  "./assets/favicon-32.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type === "opaque") return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
