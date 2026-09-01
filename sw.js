/* ===============================
   CACHE NAME (change version to force update)
   =============================== */
const cacheName = 'ichraf-v0007';

/* ===============================
   FILES TO CACHE FOR OFFLINE USE
   Use RELATIVE paths for safety
   =============================== */
const assets = [
    './index.html',        // Main page
    './cards.html',         // Ahzab page
   './group.html',

    './css/main.css',     // Styles for Ahzab
    './css/cards.css',     // Global styles
   './css/home.css',

    './js/main.js',       // Ahzab logic
    './js/cards.js',        // Main app logic
   './js/home.js',

    './images/admin512.png',     // UI icon
    './images/admin192.png',  // App icon

    './manifest.json'      // PWA manifest
];

/* ===============================
   INSTALL EVENT
   - Runs once when SW is installed
   - Caches all required assets
   =============================== */
self.addEventListener('install', event => {

    // Tell browser to wait until caching is finished
    event.waitUntil(

        // Open (or create) the cache
        caches.open(cacheName).then(cache => {

            // Add all assets to cache (IMPORTANT: return promise)
            return cache.addAll(assets);
        })
    );
});

/* ===============================
   ACTIVATE EVENT
   - Runs when new SW activates
   - Cleans old cache versions
   =============================== */
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            // Delete all caches that are NOT the current one
            return Promise.all(
                keys.map(key => {
                    if (key !== cacheName) {
                        console.log('Deleting old cache:', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

/* ===============================
   FETCH EVENT
   - Intercepts network requests
   - Serves cached files first
   =============================== */
self.addEventListener('fetch', event => {

    event.respondWith(

        // Check if request exists in cache
        caches.match(event.request).then(response => {

            // If cached → return it
            // Else → fetch from network
            return response || fetch(event.request);
        })
    );
});
