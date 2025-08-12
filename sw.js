// Nombre de caché con versión
const CACHE_NAME = 'casa-colchones-v1.0.3';
const CACHE_DATA_NAME = 'casa-colchones-data-v1.0.3';

// Obtener la URL base (para GitHub Pages)
const getBasePath = () => {
  const path = self.location.pathname;
  if (path.includes('/casa-colchones/')) {
    return '/casa-colchones';
  }
  return '';
};

const BASE_PATH = getBasePath();

// Archivos estáticos para cachear
const STATIC_ASSETS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/favicon.ico`,
  `${BASE_PATH}/logo192.png`,
  `${BASE_PATH}/logo512.png`
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Instalando versión:', CACHE_NAME);
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Precacheando archivos estáticos');
      
      // Intentar cachear archivos, manejar errores individualmente
      return Promise.allSettled(
        STATIC_ASSETS.map(url => 
          cache.add(url).catch(err => {
            console.warn(`[ServiceWorker] No se pudo cachear ${url}:`, err);
            return null;
          })
        )
      );
    }).then(() => {
      // Forzar activación inmediata
      self.skipWaiting();
    }).catch(error => {
      console.error('[ServiceWorker] Error durante la instalación:', error);
    })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activando');
  
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== CACHE_DATA_NAME) {
            console.log('[ServiceWorker] Eliminando caché antigua:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
      .catch(() => {
        // Offline fallback
        return caches.match(`${BASE_PATH}/index.html`);
      })
  );
});

// Mensaje al cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[ServiceWorker] Versión:', CACHE_NAME, 'Base Path:', BASE_PATH);