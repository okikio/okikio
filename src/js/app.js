import Util from "./components/util";
import Page from './components/page';

const sw = '/sw.js';
const navigator = window.navigator;
let url = window.location.pathname;
let base = Page.create({
    name: "index",
    fn(...args) {
        Page.base.call(this, ...args);
    }
});

Util.pageSetup(url);
Page.base.call(base);

import './components/barba';
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register(sw).then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

window.setTimeout(() => {
    Page.ele("#yellow-banner.layer-max-height").each(el => {
        el.classList.remove("layer-max-height");
    });
}, 3000);
