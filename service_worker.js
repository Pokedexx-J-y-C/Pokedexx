const VERSION = "pokedexx-v4";
const SHELL_CACHE = VERSION + "-shell";
const RUNTIME_CACHE = VERSION + "-runtime";

const ARCHIVOS_BASE = [
    "./",
    "./index.html",
    "./app.js",
    "./manifest.json",
    "./icons/pokedex.svg",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
    "./icons/maskable-512.png",
    "./icons/apple-touch-icon-180.png",
    "./assets/qr/pokemon-001.png",
    "./assets/qr/pokemon-004.png",
    "./assets/qr/pokemon-007.png",
    "./assets/qr/pokemon-025.png",
    "./assets/qr/pokemon-039.png",
    "./assets/qr/pokemon-052.png",
    "./assets/qr/pokemon-094.png",
    "./assets/qr/pokemon-133.png",
    "./assets/qr/pokemon-150.png",
    "./assets/qr/pokemon-151.png"
];

const LIBRERIAS_CDN = [
    "https://cdn.tailwindcss.com/3.4.17",
    "https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js"
];

const ORIGENES_API = [
    "pokeapi.co",
    "raw.githubusercontent.com"
];

self.addEventListener("install", function(event) {
    event.waitUntil((async function() {
        const cache = await caches.open(SHELL_CACHE);
        await Promise.allSettled(ARCHIVOS_BASE.map(function(url) {
            return cache.add(url);
        }));
        await Promise.allSettled(LIBRERIAS_CDN.map(async function(url) {
            const respuesta = await fetch(url, { mode: "no-cors", cache: "no-cache" });
            if (respuesta) await cache.put(url, respuesta);
        }));
        await self.skipWaiting();
    })());
});

self.addEventListener("activate", function(event) {
    event.waitUntil((async function() {
        const claves = await caches.keys();
        await Promise.all(claves.map(function(clave) {
            if (clave !== SHELL_CACHE && clave !== RUNTIME_CACHE) return caches.delete(clave);
            return undefined;
        }));
        await self.clients.claim();
    })());
});

self.addEventListener("message", function(event) {
    if (event.data === "SKIP_WAITING") self.skipWaiting();
});

function esOrigenApi(url) {
    return ORIGENES_API.some(function(origen) {
        return url.hostname === origen || url.hostname.endsWith("." + origen);
    });
}

function esCacheable(respuesta) {
    return respuesta && (respuesta.ok || respuesta.type === "opaque");
}

async function cachePrimero(request, nombreCache) {
    const cache = await caches.open(nombreCache);
    const cacheado = await cache.match(request, { ignoreVary: true });
    if (cacheado) return cacheado;
    const respuesta = await fetch(request);
    if (esCacheable(respuesta)) await cache.put(request, respuesta.clone());
    return respuesta;
}

async function revalidate(request, nombreCache) {
    const cache = await caches.open(nombreCache);
    const cacheado = await cache.match(request, { ignoreVary: true });
    const red = fetch(request).then(function(respuesta) {
        if (esCacheable(respuesta)) cache.put(request, respuesta.clone());
        return respuesta;
    }).catch(function() {
        return null;
    });
    return cacheado || (await red) || Response.error();
}

async function redPrimero(request, nombreCache) {
    const cache = await caches.open(nombreCache);
    try {
        const respuesta = await fetch(request);
        if (esCacheable(respuesta)) await cache.put(request, respuesta.clone());
        return respuesta;
    } catch (error) {
        const cacheado = await cache.match(request, { ignoreVary: true });
        if (cacheado) return cacheado;
        if (request.mode === "navigate") {
            const shell = await caches.match("./index.html", { ignoreVary: true });
            if (shell) return shell;
        }
        throw error;
    }
}

self.addEventListener("fetch", function(event) {
    const request = event.request;
    if (request.method !== "GET") return;

    const url = new URL(request.url);

    if (request.mode === "navigate") {
        event.respondWith((async function() {
            const cache = await caches.open(SHELL_CACHE);
            const cacheado = await cache.match("./index.html", { ignoreVary: true }) ||
                await cache.match(request, { ignoreVary: true });
            const red = fetch(request).then(function(respuesta) {
                if (esCacheable(respuesta)) cache.put("./index.html", respuesta.clone());
                return respuesta;
            }).catch(function() {
                return null;
            });
            return cacheado || (await red) || Response.error();
        })());
        return;
    }

    if (url.origin === self.location.origin) {
        event.respondWith(redPrimero(request, SHELL_CACHE).catch(function() {
            return revalidate(request, SHELL_CACHE);
        }));
        return;
    }

    if (esOrigenApi(url)) {
        event.respondWith(revalidate(request, RUNTIME_CACHE));
        return;
    }

    if (LIBRERIAS_CDN.indexOf(request.url) !== -1) {
        event.respondWith(cachePrimero(request, SHELL_CACHE).catch(function() {
            return fetch(request);
        }));
        return;
    }

    event.respondWith(revalidate(request, RUNTIME_CACHE));
});
