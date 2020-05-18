// This code gets installed in users browsers and runs code before the request is made.
const CACHE = "pwa-1.5";
const errPage = "/404.html"; // Offline page
const offlinePage = "/offline.html"; // Offline page
const offlineAssets = [
    errPage,
    offlinePage,
    "/js/modern.min.js",
    "/favicon/favicon.svg",
    "/fonts/roboto--regular_latin.woff2",
    "/fonts/montserrat--extrabold_latin.woff2",
    "/fonts/montserrat--bold_latin.woff2",
    "/fonts/frank-ruhl-libre--black_latin.woff2",
];

// Install stage sets up the offline page, and assets in the cache and opens a new cache
self.addEventListener("install", event => {
    console.log("[PWA] Install Event processing");

    // event.waitUntil(
    //     caches.open(CACHE).then(cache => {
    //         console.log('[PWA] Cached offline assets during install: ', offlineAssets);
    //         return cache.addAll(
    //             offlineAssets.map(url => new Request(url, { mode: 'no-cors' }) )
    //         ).then(() => {
    //             console.log('[PWA] All resources have been fetched and cached.');
    //             console.log("[PWA] Skip waiting on install");
    //             return self.skipWaiting();
    //         });
    //     })
    // );
});

// Check to see if you have it in the cache, return response
// If not in the cache, then reject promise
// let fromCache = request => {
//     return caches.open(CACHE).then(cache => {
//         return cache.match(request).then(matching => {
//             if (!matching || matching.status === 404) {
//                 return Promise.reject("[PWA] An error occured when fetching from cache.");
//             }

//             return matching;
//         });
//     }).catch(console.warn);
// };

// Allow service-worker.js to control of current page
self.addEventListener('activate', event => {
    console.log("[PWA] Service worker activated, claiming clients for current page");
    // event.waitUntil(self.clients.claim());
});

// If any fetch fails, it will show the offline page.
self.addEventListener("fetch", event => {
   /*
    let { request } = event;
    let url = new URL(request.url);

    // Ignore non-get request
    if (request.method !== 'GET') return;

    // Don't try to store resourses from external origins
    if (url.origin !== location.origin) return;

    try {
        // Is request already cached, if so then use that cached version and refresh the cache for the next time
        if (offlineAssets.includes(url.pathname)) {
            event.respondWith( fromCache(request) );

            // Only bother refreshing cache if you are sure there is a network connection
            if (navigator.onLine) {
                event.waitUntil(
                    fetch(request)
                        .then(response => {
                            // Check if we received a valid response
                            if (!response || response.status !== 200 ||
                                response.type !== 'basic' || !response.ok) return response;
                            caches.open(CACHE).then(cache => {
                                cache.put(request, response.clone());
                            });
                            return response;
                        }).catch(() => {
                            console.warn(`[PWA] Error refreshing cache. `);
                        })
                );
            }
        }

        // If network is offline serve the offline page
        else if (!navigator.onLine) {
            console.warn(`[PWA] No offline asset found, serving offline page. `);
            event.respondWith(
                fromCache(offlinePage)
            );
        }
    } catch (e) {
        // If a major error occurs serve the error page
        console.warn(`[PWA] An error occurred, serving error page. `, e);
        event.respondWith(
            fromCache(errPage)
        );
    }*/
});

/*
// This is a somewhat contrived example of using client.postMessage() to originate a message from
// the service worker to each client (i.e. controlled page).
// Here, we send a message when the service worker starts up, prior to when it's ready to start
// handling events.
// self.clients.matchAll().then(clients => {
//     clients.forEach(function (client) {
//         console.log(client);
//         client.postMessage('The service worker just started up.');
//     });
// });

// The index page key is a /, to a avoid bug change it to index.html
// let parseURL = (url, page = "index.html") => {
//     let newURL = new URL(url);
//     if ("/" === newURL.pathname.slice(-1))
//         newURL.pathname += page;
//     return newURL.toString();
// };

let updateCache = (request, response) => {
    return caches.open(CACHE).then(cache => {
        cache.put(request, response);
    });
};

// Allow service-worker.js to control of current page
self.addEventListener("activate", event => {
    console.log("[PWA] Claiming clients for current page");

    // event.waitUntil(
    //     caches.keys()
    //         .then(keys => {
    //             return Promise.all(
    //                 keys.map(key => caches.delete(key))
    //             );
    //         })
    //         .then(() => self.clients.claim() )
    // );
    event.waitUntil(self.clients.claim());
});

// This is an event that can be fired from your page to tell the Service Worker to update the offline page
self.addEventListener('refreshOffline', response => {
    console.log("[PWA] Offline page updated from refreshOffline event: ", response.url);
    return updateCache(offlinePage, response);
});

self.addEventListener('message', event => {
    console.log('Handling message event:', event);

    switch (event.data.command) {
        // This command returns a list of the URLs corresponding to the Request objects
        // that serve as keys for the current cache.
        case 'refresh':
            event.waitUntil(
                // eslint-disable-next-line no-unused-vars
                caches.open(CACHE).then(cache => {
                    return fetch(offlinePage).then(async response => {
                        const cache = await caches.open(CACHE);
                        console.log("[PWA] Cached offline page again");
                        cache.put(offlinePage, response.clone());
                        return response;
                    });
                })
            );
            break;

        default:
            // If the promise rejects, handle it by returning a standardized error message to the controlled page.
            console.error('Message handling failed, Unknown command: ', event.data.command);
            event.ports[0].postMessage({ error: 'Unknown command: ' + event.data.command });
            break;
    }
});*/