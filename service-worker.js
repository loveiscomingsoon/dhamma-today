const CACHE_NAME = "dhamma-today-v29-dhamma-today-icon";
const APP_ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=20260626-8",
  "./app.js?v=20260629-3",
  "./content/dhamma-library.js?v=20260620-22",
  "./books/dhamma-pocket-book.html",
  "./books/pocket-book.webmanifest?v=20260629-2",
  "./books/pocket-book.css?v=20260626-2",
  "./books/pocket-book.js?v=20260626-2",
  "./life/",
  "./life/index.html",
  "./life/life.webmanifest?v=20260629-2",
  "./life/life.css?v=20260629-1",
  "./life/life.js?v=20260629-1",
  "./manifest.webmanifest?v=20260629-3",
  "./assets/river-morning.jpg?v=20260618-2",
  "./assets/daily-art/dhamma-today-cover-single.png?v=20260626-2",
  "./assets/daily-art/dhamma-today-cover-motion.mp4?v=20260626-2",
  "./assets/daily-art/seasons-of-life-cover.png?v=20260628-5",
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
  "./assets/dhamma-today-qr.png?v=20260628-5",
  "./assets/dhamma-today-qr-poster-small.png?v=20260628-5",
  "./assets/dhamma-life-qr.png?v=20260628-5",
  "./assets/dhamma-life-qr-poster-small.png?v=20260628-5",
  "./assets/app-icon-192.png?v=20260629-3",
  "./assets/app-icon-512.png?v=20260629-3",
  "./assets/pocket-book-icon-192.png?v=20260629-2",
  "./assets/pocket-book-icon-512.png?v=20260629-2",
  "./assets/pocket-book-apple-touch-icon.png?v=20260629-2",
  "./assets/life-icon-192.png?v=20260629-2",
  "./assets/life-icon-512.png?v=20260629-2",
  "./assets/life-apple-touch-icon.png?v=20260629-2",
  "./assets/apple-touch-icon.png?v=20260629-3",
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

  if (event.request.mode === "navigate" || event.request.destination === "document") {
    event.respondWith(
      fetch(event.request).then((response) => {
        if (!response || response.status !== 200) return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      }).catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }

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
