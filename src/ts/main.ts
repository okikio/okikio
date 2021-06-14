import { PJAX, App, TransitionManager, HistoryManager, PageManager, animate, Animate } from "@okikio/native";

import { Navbar } from "./services/Navbar";
import { Image } from "./services/Image";
import { Fade } from "./transitions/Fade";

let app: App = new App();
app
    .set("HistoryManager", new HistoryManager())
    .set("PageManager", new PageManager())
    .set("TransitionManager", new TransitionManager([
        [Fade.name, Fade]
    ]))
    .set("PJAX", new PJAX())
    .add(new Image())

    .set("Navbar", new Navbar());

const navbar: HTMLElement = document.querySelector(".navbar.bottom");
const navHeight = navbar.getBoundingClientRect().height;

let layers: HTMLElement[];
let layer: HTMLElement | null;
let svg: HTMLElement;
let svgDownAnimation: Animate;
let topOfLayer: number;

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
            let scrollTop = window.scrollY;
            if (scrollTop > navHeight) {
                navbar.classList.replace("hide", "show");
            } else navbar.classList.replace("show", "hide");
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
            if (entry.intersectionRatio >= 0.1) svgDownAnimation.play();
        } else svgDownAnimation.pause();
    });
}, {
    threshold: Array.from(Array(99), (_, i) => (i + 1) / 100)
});

const init = () => {
    layers = Array.from(document.querySelectorAll(".layer"));
    layer = layers[0] || null;
    topOfLayer = layer ? layer.getBoundingClientRect().top + window.pageYOffset - navHeight / 4 : 0;

    // navbar.classList.remove("focus");
    navbar.classList.remove("active");
    ScrollEventListener();

    svgDownAnimation = animate({
        target: ".graphic path.animate",
        duration(index, len) {
            return 2500 * len;
        },
        easing: "linear",
        direction: "reverse", // "alternate",
        fillMode: "both",
        strokeDashoffset(index, len, el: SVGPathElement) {
            const pathLength = el.getTotalLength();
            el.setAttribute('stroke-dasharray', `` + pathLength);
            el.style["stroke-dashoffset"] = 0;
            return [0, pathLength * (2 + index)];
        },

        loop: true,
        autoplay: false
    });

    svg = document.querySelector(".graphic");
    svg && observer.observe(svg);

    // On the index, and all service pages, use a light color scheme for text
    // let { pathname } = window.location;
    // if (/(index(.html)?|\/$)|(services\/+)/g.test(pathname))
    //     navbar.classList.add("light");
    // else if (navbar.classList.contains("light")) navbar.classList.remove("light");


    // // On the about, services, contact, and 404 pages use a dark color scheme for text
    // if (/(about(.html)?)|(services(.html)?$)|(contact(.html)?)/g.test(pathname) ||
    //     document.title.includes("404"))
    //     navbar.classList.add("dark");
    // else if (navbar.classList.contains("dark")) navbar.classList.remove("dark");


    toTopEl = document.querySelector("#back-to-top");
    if (toTopEl)
        toTopEl.addEventListener("click", ScrollToTopEventListener);

    scrollDownEl = document.querySelector(".scroll-btn");
    if (scrollDownEl) {
        elToScrollTo = document.querySelector("#scroll-point");
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

    svgDownAnimation && svgDownAnimation.stop();
    svg && observer.unobserve(svg);

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
