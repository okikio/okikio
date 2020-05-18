const { Symbol, navigator } = window;
const { userAgent } = navigator;

// Check if the browser supports modern ecmascript standards
export let isModern = () => {
    "use strict";
    if (typeof Symbol == "undefined") return false;

    // 'unsafe-eval';
    try {
        new Function("class Foo {}")();
        new Function("let bar = x => x+1;")();
        new Function("let bez = { a: 'b' }; let box = { b: 'a', ...bez };")();
    } catch (e) { return false; }
    return true;
};

window.debugCheck = isModern;
window.isModern = isModern();

// Add scripts to be reqested to the head tag
export let _require = (src, fn) => {
    let head = document.getElementsByTagName('head')[0];
    let script = document.createElement('script');
    // script.setAttribute("async", "");
    script.setAttribute("crossorigin", "");
    script.type = 'text/javascript';
    script.onload = fn;
    script.onreadystatechange = function () {
        if (this.readyState === 'complete') { fn(); }
    };
    script.src = src;
    head.appendChild(script);
};

// Quick test for webp support
try {
    window.WebpSupport = document.createElement('canvas')
                                 .toDataURL('image/webp')
                                 .indexOf('data:image/webp') == 0;
} catch (e) {
    window.WebpSupport = false;
}

if (!window.WebpSupport) {
    // Long Test for webp support
    (() => {
        // If the browser doesn't has the method createImageBitmap, you can't display webp format
        if (!window.createImageBitmap) {
            window.WebpSupport = false;
            return;
        }

        // Base64 representation of a white point image
        let webpdata = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAEAAQAcJaQAA3AA/v3AgAA=';

        // Retrieve the Image in Blob Format
        fetch(webpdata)
            .then(response => response.blob())
            .then(blob => {
                // If the createImageBitmap method succeeds, return true, otherwise false
                createImageBitmap(blob)
                    .then(() => { window.WebpSupport = true; })
                    .catch(() => { window.WebpSupport = false;  });
            });
    }) ();
}


// Test for IE and older versions of Edge
if (/msie|trident|edge/g.test(userAgent.toLowerCase()) || !window.isModern) {
    // _require("https://cdnjs.cloudflare.com/ajax/libs/nwmatcher/1.4.2/nwmatcher.min.js");
    // _require("https://cdnjs.cloudflare.com/ajax/libs/json2/20160511/json2.min.js");
    // _require("https://cdnjs.cloudflare.com/ajax/libs/selectivizr/1.0.2/selectivizr-min.js");
    // _require("https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js");
    // _require("https://cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js");
    // _require("https://cdnjs.cloudflare.com/ajax/libs/es5-shim/4.5.13/es5-shim.min.js");

    _require("https://polyfill.io/v3/polyfill.min.js?flags=gated&features=default%2Ces7%2CHTMLPictureElement%2CObject.values%2Cfetch%2CgetComputedStyle%2CrequestAnimationFrame%2Cdocument.getElementsByClassName%2Cperformance.now%2CString.prototype.includes%2CSymbol");
    _require("https://res.cloudinary.com/okikio-assets/raw/upload/polyfill.min.js");
    // _require("https://cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js");

    // _require("https://cdnjs.cloudflare.com/ajax/libs/picturefill/3.0.3/picturefill.min.js");
    // _require("https://cdnjs.cloudflare.com/ajax/libs/html5-history-api/4.2.10/history.min.js");
    // _require("https://cdnjs.cloudflare.com/ajax/libs/html5-history-api/4.2.10/history.ielte7.min.js");
}
