/**
 * Golden Wallet Elite — Service Worker v1.0
 * Estrategia: Cache-First para el shell de la app, Network-First para datos.
 * Esto permite que Chrome/Safari detecten la app como instalable (PWA).
 */

const CACHE_NAME = 'golden-wallet-v1';

// Recursos del shell que se cachean al instalar
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/fenix.PNG',
  '/Aguila.jfif'
];

// ─── INSTALL: cachear el shell ────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(SHELL_ASSETS).catch((err) => {
        console.warn('[SW] Algunos recursos no se pudieron cachear:', err);
      });
    })
  );
  // Activar inmediatamente sin esperar a que cierren pestañas anteriores
  self.skipWaiting();
});

// ─── ACTIVATE: limpiar caches antiguas ───────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  // Tomar control de todas las pestañas abiertas
  self.clients.claim();
});

// ─── FETCH: Cache-First para assets, Network-First para GAS/APIs ─────────────
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Peticiones a Google Apps Script: siempre red (nunca cachear)
  if (url.hostname.includes('script.google.com') || url.hostname.includes('google.com')) {
    return; // Deja que el browser maneje normalmente
  }

  // Peticiones de navegación (HTML): Network-First con fallback a cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match('/index.html')
      )
    );
    return;
  }

  // Assets estáticos (JS, CSS, imágenes): Cache-First
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Cachear solo respuestas válidas de nuestro propio origen
        if (response.ok && url.origin === self.location.origin) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
