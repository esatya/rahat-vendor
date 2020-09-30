/// //////////////////////////////////////////////////////////////////////////
// You can find dozens of practical, detailed, and working examples of
// service worker usage on https://github.com/mozilla/serviceworker-cookbook
/// //////////////////////////////////////////////////////////////////////////

// Cache name
const CACHE_NAME = 'cache-version-1';

// Files required to make this app work offline
const REQUIRED_FILES = [
  '/',
  '/js/app/home.js',
  '/transfer',
  '/js/app/transfer.js',
  '/js/app/vendors.js',
  'https://fonts.googleapis.com/css?family=Inter:400,500,700&display=swap',
  'https://unpkg.com/ionicons@5.0.0/dist/ionicons.js',
  'https://cdnjs.cloudflare.com/ajax/libs/web3/1.2.9/web3.min.js',
  'https://blog.minhazav.dev/assets/research/html5qrcode/html5-qrcode.min.js',
  '/js/lib/jquery-3.4.1.min.js',
  '/js/lib/popper.min.js',
  '/js/lib/bootstrap.min.js',
  '/js/plugins/owl-carousel/owl.carousel.min.js',
  '/js/base.js',
  '/css/inc/owl-carousel/owl.carousel.min.css',
  '/css/inc/owl-carousel/owl.theme.default.css',
  '/css/inc/bootstrap/bootstrap.min.css',
  '/css/style.css',
];

self.addEventListener('install', (event) => {
  // Perform install step:  loading each required file into cache
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) =>
        // Add all offline dependencies to the cache
        cache.addAll(REQUIRED_FILES))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return the response from the cached version
        if (response) {
          return response;
        }
        // Not in cache - return the result from the live server
        // `fetch` is essentially a "fallback"
        return fetch(event.request);
      }),
  );
});

self.addEventListener('activate', (event) => {
  // Calling claim() to force a "controllerchange" event on navigator.serviceWorker
  event.waitUntil(self.clients.claim());
});
