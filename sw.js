/**
 * SkyWorld v2.0 - Service Worker
 * @author MiniMax Agent
 * 
 * PWA (Progressive Web App) desteği için Service Worker
 * Cache yönetimi ve offline çalışma desteği sağlar
 */

const CACHE_NAME = 'skyworld-v2.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/styles.css',
  '/src/core/gameEngine.js',
  '/src/systems/blockSystem.js',
  '/src/systems/physicsSystem.js',
  '/src/systems/audioSystem.js',
  '/src/systems/inventorySystem.js',
  '/src/systems/dayNightSystem.js',
  '/src/components/MobileControls.js',
  '/src/ui/UIManager.js',
  '/src/constants/blocks.js',
  '/src/constants/audio.js',
  '/src/constants/physics.js',
  '/src/constants/colors.js',
  '/src/constants/world.js',
  '/docs/README.md',
  '/docs/FEATURES.md',
  '/docs/ARCHITECTURE.md',
  '/docs/API.md',
  'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js'
];

// Install event - Cache files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Service Worker: Cache install failed', error);
      })
  );
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Ensure the new service worker takes control immediately
  self.clients.claim();
});

// Fetch event - Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

// Background sync for saving game data
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync');
    event.waitUntil(doBackgroundSync());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'SkyWorld güncellemesi mevcut!',
    icon: '/assets/icons/android-chrome-192x192.png',
    badge: '/assets/icons/android-chrome-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 'skyworld-notification'
    },
    actions: [
      {
        action: 'explore',
        title: 'Oyunu Aç',
        icon: '/assets/icons/android-chrome-192x192.png'
      },
      {
        action: 'close',
        title: 'Kapat'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('SkyWorld', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync function
function doBackgroundSync() {
  return new Promise((resolve) => {
    // Save game data to IndexedDB or localStorage
    console.log('Service Worker: Syncing game data');
    resolve();
  });
}

// Handle game updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_GAME_DATA') {
    caches.open(CACHE_NAME).then((cache) => {
      cache.put('/game-data', new Response(JSON.stringify(event.data.payload)));
    });
  }
});

console.log('Service Worker: SkyWorld v2.0 loaded');