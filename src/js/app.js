import Util from "./components/util";
import Page from './components/page';

let url = window.location.pathname;
let base = Page.create({
    name: "index",
    fn(...args) {
        Page.base.call(this, ...args);
    }
});

Util.pageSetup(url);
Page.init.call(base);

import './components/barba';
Page.ele("#yellow-banner.layer-max-height").each(el => {
    el.classList.remove("layer-max-height");
});