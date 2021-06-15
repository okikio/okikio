import { PJAX, App, TransitionManager, HistoryManager, PageManager, animate, Animate } from "@okikio/native";

import { Perspective } from "./services/Perspective";
import { Navbar } from "./services/Navbar";
import { Image } from "./services/Image";
import { Fade } from "./transitions/Fade";

export let app: App = new App({
    ignoreHashAction: true,
    stickyScroll: false
});

app
    .set("HistoryManager", new HistoryManager())
    .set("PageManager", new PageManager())
    .set("TransitionManager", new TransitionManager([
        [Fade.name, Fade]
    ]))

    .set("PJAX", new PJAX())
    .add(new Image())
    .set("Navbar", new Navbar());

const nav: HTMLElement = document.querySelector("nav");
const navHeight = nav.getBoundingClientRect().height;

let layers: HTMLElement[];
let layer: HTMLElement | null;
let topOfLayer: number = 0;
let scrollOutline: HTMLElement;
let scrollOutlineAnimation: Animate;

let elToScrollTo: HTMLElement;
let toTopEl: HTMLElement;
let scrollDownEl: HTMLElement;
let wait = false;
let rafID: number;

const ScrollEventListener = () => {
    if (!wait) {
        wait = true;
        rafID = requestAnimationFrame(() => {
            cancelAnimationFrame(rafID);
            nav.classList.toggle("active", window.scrollY > navHeight);
            wait = false;
        });
    }
};

const ScrollToTopEventListener = () => {
    window.scroll({
        top: 0,
        behavior: "smooth",
    });
};

const ScrollDownEventListener = () => {
    if (elToScrollTo)
        elToScrollTo.scrollIntoView({ behavior: "smooth" });
};

let observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.intersectionRatio >= 0.1) scrollOutlineAnimation.play();
        } else scrollOutlineAnimation.pause();
    });
}, {
    threshold: Array.from(Array(99), (_, i) => (i + 1) / 100)
});

const init = () => {
    layers = Array.from(document.querySelectorAll("[data-layer]"));
    layer = layers[0] || null;
    topOfLayer = layer ? layer.getBoundingClientRect().top + window.pageYOffset - navHeight / 4 : 0;

    nav.classList.remove("show");
    ScrollEventListener();

    scrollOutlineAnimation = animate({
        target: ".scroll-outline",
        duration: 1600,
        easing: "ease",
        fillMode: "both",
        transform: [`scale(1)`, `scale(1.6)`],
        opacity: [1, 0],

        loop: true,
        autoplay: false
    });

    scrollOutline = document.querySelector(".scroll-outline");
    scrollOutline && observer.observe(scrollOutline);
    if (layer) {
        let layerColor = layer.getAttribute("data-layer");
        let initialColor = layer.getAttribute("initial-nav-color");
        
        nav.setAttribute("color-mode", layerColor ?? "");
        nav.setAttribute("initial-color", initialColor ?? "");
    }

    toTopEl = document.querySelector("#back-to-top");
    if (toTopEl)
        toTopEl.addEventListener("click", ScrollToTopEventListener);

    scrollDownEl = document.querySelector(".scroll-btn");
    if (scrollDownEl) {
        elToScrollTo = document.querySelector("#main");
        scrollDownEl.addEventListener("click", ScrollDownEventListener);
    }
};

const destroy = () => {
    if (toTopEl) {
        toTopEl.removeEventListener("click", ScrollToTopEventListener);
        toTopEl = undefined;
    }

    if (scrollDownEl) {
        scrollDownEl.removeEventListener("click", ScrollDownEventListener);

        scrollDownEl = undefined;
        elToScrollTo = undefined;
    }

    while (layers.length) layers.pop();
    layers = undefined;
    layer = undefined;
    wait = false;
};

init();
window.addEventListener("scroll", ScrollEventListener, { passive: true });

app.on("CONTENT_REPLACED", init);
app.on("BEFORE_TRANSITION_OUT", destroy);

app.boot();

