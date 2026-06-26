// sw.js – Service Worker for Campus Food Voice
const CACHE_NAME = 'campus-food-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/complaint.html',
  '/about.html',
  '/Rules.html',
  '/privacy.html',
  '/pwa.js',
  '/Images/favicon.ico',
  '/Images/icon-192.png',
  '/Images/icon-512.png',
  '/Images/apple-touch-icon.png',
  '/Images/site.webmanifest',
  // External assets (CDN)
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js'
];

// Install event – cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Caching assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event – clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
    .then(() => self.clients.claim())
  );
});

// Fetch event – serve cached content, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if available
        if (cachedResponse) {
          return cachedResponse;
        }
        // Otherwise fetch from network
        return fetch(event.request)
          .then(response => {
            // Cache the new response for future (optional)
            // Only cache successful responses
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, clone);
              });
            }
            return response;
          })
          .catch(() => {
            // Offline fallback – return a basic response
            return new Response('Offline – please check your internet connection.', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});