const CACHE_NAME = "pokedex-v2";
const ARCHIVOS = [
    "./",
    "./index.html",
    "./app.js",
    "./manifest.json",
    "./icons/pokedex.svg"
];

self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(ARCHIVOS);
        }).then(function() {
            return self.skipWaiting();
        })
    );
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(keys.map(function(key) {
                if (key !== CACHE_NAME) return caches.delete(key);
            }));
        }).then(function() {
            return self.clients.claim();
        })
    );
});
self.addEventListener("fetch", function(event) {
    if (event.request.method !== "GET") return;
    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) return;
    event.respondWith(
        caches.match(event.request).then(function(cached) {
            if (cached) return cached;
            return fetch(event.request).then(function(response) {
                if (response && response.ok) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(event.request, copy);
                    });
                }
                return response;
            }).catch(function() {
                if (event.request.mode === "navigate") return caches.match("./index.html");
            });
        })
    );
});
