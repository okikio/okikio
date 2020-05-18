const { navigator } = window;
if ('serviceWorker' in navigator) {
    if (navigator.serviceWorker.controller) {
        console.log("[PWA] active service worker found, no need to register");
    } else {
        // Register the service worker
        navigator.serviceWorker
            .register('/worker.js', {
                scope: "/"
            })
            .then(({ scope }) => {
                console.log(`[PWA] Service worker has been registered for scope: ${scope}`);
                return navigator.serviceWorker.ready;
            })
            .catch(err => {
                console.warn(`Error: ${err}, Service Worker registration failed. Something went wrong during registration. The worker.js file might be unavailable or contain a syntax error.`);
            });
    }

    // let sendMessage = message => {
    //     // This wraps the message posting/response in a promise, which will resolve if the response doesn't
    //     // contain an error, and reject with the error if it does. If you'd prefer, it's possible to call
    //     // controller.postMessage() and set up the onmessage handler independently of a promise, but this is
    //     // a convenient wrapper.
    //     return new Promise((resolve, reject) => {
    //         var messageChannel = new MessageChannel();
    //         messageChannel.port1.onmessage = event => {
    //             if (event.data.error) {
    //                 reject(event.data.error);
    //             } else {
    //                 resolve(event.data);
    //             }
    //         };

    //         // This sends the message data as well as transferring messageChannel.port2 to the service worker.
    //         // The service worker can then use the transferred port to reply via postMessage(), which
    //         // will in turn trigger the onmessage handler on messageChannel.port1.
    //         // See https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
    //         navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
    //     });
    // };

    // .then(() => {
    //     window.setTimeout(() => {
    //         sendMessage({ command: 'refresh' })
    //             .then(() => {
    //                 console.log("[PWA Client] Refreshed Cache");
    //             }).catch(console.error); // If the promise rejects, show the error.
    //     }, 1000 * 60 * 2);
    // })

    // Set up a listener for messages posted from the service worker.
    // The service worker is set to post a message to all its clients once it's run its activation
    // handler and taken control of the page, so you should see this message event fire once.
    // You can force it to fire again by visiting this page in an Incognito window.
    // navigator.serviceWorker.addEventListener('message', event => {
    //     console.log(event.data);
    // });
}