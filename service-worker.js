const CACHE_NAME = "dhamma-today-v25-pocket-art";
const APP_ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=20260625-4",
  "./app.js?v=20260625-4",
  "./content/dhamma-library.js?v=20260620-22",
  "./books/dhamma-pocket-book.html",
  "./books/pocket-book.css?v=20260625-6",
  "./books/pocket-book.js?v=20260625-6",
  "./manifest.webmanifest?v=20260625-2",
  "./assets/river-morning.jpg?v=20260618-2",
  "./assets/daily-art/daily-cover-01.jpg?v=20260625-1",
  "./assets/daily-art/daily-illustration-01.jpg?v=20260625-1",
  "./assets/daily-art/daily-illustration-02.jpg?v=20260625-1",
  "./assets/daily-art/daily-illustration-03.jpg?v=20260625-1",
  "./assets/daily-art/daily-illustration-04.jpg?v=20260625-1",
  "./assets/daily-art/daily-illustration-05.jpg?v=20260625-1",
  "./assets/daily-art/daily-illustration-06.jpg?v=20260625-1",
  "./assets/daily-art/daily-illustration-07.jpg?v=20260625-1",
  "./assets/daily-art/daily-illustration-08.jpg?v=20260625-1",
  "./assets/daily-art/daily-illustration-09.jpg?v=20260625-1",
  "./assets/daily-art/daily-illustration-10.jpg?v=20260625-1",
  "./assets/lucide.min.js?v=20260618-2",
  "./assets/crane-monkey-mark.png?v=20260619-1",
  "./assets/dhamma-today-qr.png?v=20260625-3",
  "./assets/dhamma-today-qr-poster.png?v=20260625-3",
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
