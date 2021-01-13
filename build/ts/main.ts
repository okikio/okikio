import { PJAX, App, TransitionManager, HistoryManager, PageManager, animate } from "@okikio/native";
import { toArr } from "./toArr";

import { IntroAnimation } from "./services/IntroAnimation";
import { Navbar } from "./services/Navbar";
import { Image } from "./services/Image";

import { Carousel } from "./services/Carousel";
import { Fade } from "./transitions/Fade";

let app: App = new App();
app
    .set("HistoryManager", new HistoryManager())
    .set("PageManager", new PageManager())
    .set("TransitionManager", new TransitionManager([
        [Fade.name, Fade]
    ]))
    .set("PJAX", new PJAX())
    .add(new IntroAnimation())
    .add(new Image())

    .set("Navbar", new Navbar())
    .add(new Carousel());

try {
    const navbar: HTMLElement = document.querySelector(".navbar");
    const navHeight = navbar.getBoundingClientRect().height;

    let layers: HTMLElement[];
    let layer: HTMLElement | null;
    let topOfLayer: number;

    let elToScrollTo: HTMLElement;
    let toTopEl: HTMLElement;
    let scrollDownEl: HTMLElement;
    let wait = false;

    const ScrollEventListener = () => {
        if (!wait) {
            wait = true;
            requestAnimationFrame(() => {
                let scrollTop = window.scrollY + navHeight;
                if (scrollTop >= topOfLayer) {
                    navbar.classList.add("focus");
                } else navbar.classList.remove("focus");
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


    const init = () => {
        layers = toArr(document.querySelectorAll(".layer"));
        layer = layers[0] || null;
        topOfLayer = layer ? layer.getBoundingClientRect().top + window.pageYOffset - navHeight / 4 : 0;

        // navbar.classList.remove("focus");
        navbar.classList.remove("active");
        ScrollEventListener();

        // On the index, and all service pages, use a light color scheme for text
        let { pathname } = window.location;
        if (/(index(.html)?|\/$)|(services\/+)/g.test(pathname))
            navbar.classList.add("light");
        else if (navbar.classList.contains("light")) navbar.classList.remove("light");


        // On the about, services, contact, and 404 pages use a dark color scheme for text
        if (/(about(.html)?)|(services(.html)?$)|(contact(.html)?)/g.test(pathname) ||
            document.title.includes("404"))
            navbar.classList.add("dark");
        else if (navbar.classList.contains("dark")) navbar.classList.remove("dark");


        toTopEl = document.querySelector(".back-to-top");
        if (toTopEl)
            toTopEl.addEventListener("click", ScrollToTopEventListener);

        scrollDownEl = document.querySelector(".scroll-btn");
        if (scrollDownEl) {
            elToScrollTo = document.querySelector(".scroll-point");
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

    let svgDownAnimation = animate({
        target: ".graphic path.animate",
        duration: 2500,
        easing: "linear",
        direction: "alternate",
        fillMode: "both",
        strokeDashoffset(index, len, el: SVGPathElement) {
            const pathLength = el.getTotalLength();
            el.setAttribute('stroke-dasharray', `` + pathLength / 2);
            return [pathLength / 2 + Math.abs(index) * 500, 0];
        },

        loop: true,
        autoplay: false
    });

    let options = {
        rootMargin: '0px',
        threshold: Array.from(Array(5), (_, i) => (i + 1) / 5)
    };

    let observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.intersectionRatio >= 0.25 && svgDownAnimation.play();
            } else {
                svgDownAnimation.pause();
            }
        });
    }, options);

    let svg = document.querySelector(".graphic");
    observer.observe(svg);

    // init();
    // window.addEventListener("scroll", ScrollEventListener, { passive: true });

    // app.on("CONTENT_REPLACED", init);
    // app.on("BEFORE_TRANSITION_OUT", destroy);

    // app.boot();
} catch (err) {
    console.warn("[App] boot failed,", err);
}
