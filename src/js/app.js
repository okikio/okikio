// Imported external libraries
import swup from "swup";
import headPlugin from '@swup/head-plugin';
import scrollPlugin from "@swup/scroll-plugin";

// Internal use components
import { _constrain, _map, toFixed } from "./components/util";
import { on, off, toggleClass, each, find, get, addClass, removeClass, scrollTo, scrollTop, hasClass, height, style, width, offset, attr } from "./components/dom";

// Preload plugin dependencies
import delegate from 'delegate';
import { queryAll } from 'swup/lib/utils';
import { Link, getCurrentUrl, fetch } from 'swup/lib/helpers';

// Swups plugin class
class Plugin {
    constructor () {
        // this is here so we can tell if plugin was created by extending this class
        this.isSwupPlugin = true;
    }

    mount() {
        // this is mount method rewritten by class extending
        // and is executed when swup is enabled with plugin
    }

    unmount() {
        // this is unmount method rewritten by class extending
        // and is executed when swup with plugin is disabled
    }

    _beforeMount() {
        // here for any future hidden auto init
    }

    _afterUnmount() {
        // here for any future hidden auto-cleanup
    }
}

// Slight tweaks to the nature of the preload plugin class
class customPreload extends Plugin {
    constructor (...args) {
        super(...args);
        this.name = "PreloadPlugin";
    }

    mount() {
        const swup = this.swup;

        swup._handlers.pagePreloaded = [];
        swup._handlers.hoverLink = [];

        swup.preloadPage = this.preloadPage.bind(this);
        swup.preloadPages = this.preloadPages.bind(this);

        // register mouseover handler
        swup.delegatedListeners.mouseover = delegate(
            document.body,
            swup.options.linkSelector,
            'mouseover',
            this.onMouseover.bind(this)
        );

        // initial preload of page form links with [data-swup-preload]
        swup.preloadPages();

        // do the same on every content replace
        swup.on('contentReplaced', this.onContentReplaced.bind(this));
    }

    unmount() {
        const swup = this.swup;

        swup._handlers.pagePreloaded = null;
        swup._handlers.hoverLink = null;

        swup.preloadPage = null;
        swup.preloadPages = null;

        swup.delegatedListeners.mouseover.destroy();

        swup.off('contentReplaced', this.onContentReplaced.bind(this));
    }

    onContentReplaced () {
        this.swup.preloadPages();
    };

    onMouseover (event) {
        const swup = this.swup;
        swup.triggerEvent('hoverLink', event);

        const link = new Link(event.delegateTarget);
        if (
            link.getAddress() !== getCurrentUrl() &&
            !swup.cache.exists(link.getAddress()) &&
            swup.preloadPromise == null
        ) {
            swup.preloadPromise = swup.preloadPage.call(this, link.getAddress());
            swup.preloadPromise.route = link.getAddress();
            swup.preloadPromise
                .finally(() => {
                    swup.preloadPromise = null;
                });
        }
    }

    preloadPage (pathname) {
        const swup = this.swup;

        let link = new Link(pathname);
        return new Promise((resolve, reject) => {
            if (link.getAddress() != getCurrentUrl() && !swup.cache.exists(link.getAddress())) {
                fetch({ url: link.getAddress(), headers: swup.options.requestHeaders }, (response) => {
                    if (response.status === 500) {
                        swup.triggerEvent('serverError');
                        reject();
                    } else {
                        // get json data
                        let page = swup.getPageData(response);
                        if (page != null) {
                            page.url = link.getAddress();
                            swup.cache.cacheUrl(page, swup.options.debugMode);
                            swup.triggerEvent('pagePreloaded');
                        } else {
                            reject(link.getAddress());
                            return;
                        }
                        resolve(swup.cache.getPage(link.getAddress()));
                    }
                });
            } else {
                resolve(swup.cache.getPage(link.getAddress()));
            }
        });
    }

    preloadPages () {
        if (width(window) < 730) {
            queryAll('[data-swup-preload]').forEach((element) => {
                this.swup.preloadPage(element.href);
            });
        }
    }
}

const _layer = '.layer';
const _navbar = '.navbar';
const _hero = '.layer-hero';
const _menu = '.navbar-menu';
const _backUp = '.back-to-top';
const _skipMain = ".skip-main";
const _navLink = '.navbar-link';
const _layer_img = ".layer-image";
const _themeSwitcher = ".theme-switcher";
const _actioncenter = ".layer-action-center";
const _scrolldown = '.layer-hero-scroll-down';
const linkSelector = `a[href^="${window.location.origin}"]:not([data-no-pjax]), a[href^="/"]:not([data-no-pjax])`;

let onload = $load_img => function () {
    addClass($load_img, "core-img-show"); // Hide the image preview
};

// On navbar menu click (this will only occur on mobile; mouseup is a tiny bit more efficient), show navbar
on(_menu, "mouseup", () => {
    toggleClass(_navbar, "navbar-show");
});

try {
    //! This code comes from the theme.js file
    // Control localStorage storage of theme
    const { setTheme, getTheme, matchMedia } = window;
    const html = document.querySelector("html");
    // const meta = document.querySelector("meta[name=theme-color]");

    // Get theme from html tag, if it has a theme or get it from localStorage
    let themeGet = () => {
        let themeAttr = attr(html, "theme");
        if (themeAttr && themeAttr.length) {
            return themeAttr;
        }

        return getTheme();
    };

    // Set theme in localStorage, as well as in the html tag
    let themeSet = theme => {
        // let primaryColor = getComputedStyle(html).getPropertyValue('--primary');
        // meta.setAttribute("content", primaryColor);
        attr(html, "theme", theme);
        setTheme(theme);
    };

    // On theme switcher button click (mouseup is a tiny bit more efficient) toggle the theme between dark and light mode
    on(_themeSwitcher, "mouseup", () => {
        themeSet(themeGet() === "dark" ? "light" : "dark");
    });

    matchMedia('(prefers-color-scheme: dark)').addListener(e => {
        themeSet(e.matches ? "dark" : "light");
    });
} catch (e) {
    console.warn("Theme switcher button broke, :(.");
}

// On backup button click (mouseup is a tiny bit more efficient) animate back to the top
on(_backUp, "mouseup", () => {
    scrollTo("0px", "1400ms");
});

// On skip main button click animate to the main content
let heroHeight;
on(_skipMain, "click", () => {
    scrollTo(heroHeight, "1400ms");
});

// The focus pt., 10px past the height of the navbar
let _focusPt = height(_navbar) + 10;
let _images = new Set(), windowWid;
let resize, scroll;
on(window, {
    // On window resize make sure the scroll down hero button, is expanded and visible
    'resize': resize = () => {
        let srcset, src, _core_img, srcWid, load_img;
        windowWid = width(window);

        // Prevent layout-thrashing: [wilsonpage.co.uk/preventing-layout-thrashing/]
        requestAnimationFrame(() => {
            toggleClass(_scrolldown, "action-btn-expand", windowWid <= 650);

            // Only on modern browsers
            if (window.isModern) {
                // Find the layer-images in each layer
                each(_layer_img, $img => {
                    load_img = get(find($img, ".load-img"), 0);
                    srcWid = Math.round(width($img));

                    // Find the core-img in the layer-image container
                    _core_img = get(find(load_img, ".core-img"), 0);

                    // Make sure the image that is loaded is the same size as its container
                    srcset = attr(get(find(load_img, ".webp"), 0), "data-srcset");

                    // On larger screens load smaller images, for faster image load times
                    src = srcset.replace(/w_[\d]+/, `w_${srcWid > 550 ? srcWid - 200 : srcWid}`);

                    // Safari still doesn't support WebP
                    if (!window.WebpSupport) {
                        src = src.replace(".webp", ".jpg");
                        console.log("Using JPG instead, of WEBP");
                    }

                    // Ensure the image has loaded, then replace the small preview
                    attr(_core_img, "src", src);
                    on(_core_img, "load", onload(load_img));
                });
            }
        });
    },

    // On scroll accomplish a set of tasks
    'scroll': scroll = () => {
        let _isMobile = windowWid < 650;
        let _scrollTop = scrollTop(window);
        let isBanner = hasClass(_layer, "banner-mode");

        // Prevent layout-thrashing: [wilsonpage.co.uk/preventing-layout-thrashing/]
        requestAnimationFrame(() => {
            // If the current page uses a banner ensure the navbar is still visible
            toggleClass(_navbar, "navbar-focus", isBanner || _scrollTop >= 5);

            // On mobile if the window is scrolled remove main navbar menu from view
            hasClass(_navbar, "navbar-show") && removeClass(_navbar, "navbar-show");

            // Hide and show the action-center if the window has been scrolled 10px past the height of the navbar
            toggleClass(_actioncenter, "layer-action-center-show", _scrollTop > _focusPt * 4);
            toggleClass(_actioncenter, "layer-action-center-hide", _scrollTop <= _focusPt * 4);

            // If device width is greater than 700px
            if (!_isMobile && window.isModern) {
                let dist, value, maxMove, transform, opacity;
                _images.forEach(data => {
                    // On scroll turn on parallax effect for images with the class "effect-parallax"
                    if (hasClass(data.target, "effect-parallax")) {
                        let { clientRect, load_img, overlay, isHero, _isBanner, header, main } = data;
                        let { top, height } = clientRect;
                        dist = _scrollTop - top + _focusPt * 2;

                        // Some complex math, I can't explain it very well, but it works
                        if (dist >= -_focusPt && dist <= height - _focusPt / 2) {
                            value = _constrain(dist - _focusPt, 0, height);
                            if (isHero && !_isMobile) style(overlay, { opacity: toFixed(_map(value, 0, height * 0.75, 0.45, 0.7), _isMobile ? 1 : 4) });

                            // Ensure moblie devices can handle smooth animation, or else the parallax effect is pointless
                            // FPS Counter test: !(fpsCounter.fps < 24 && windowWid < 500)
                            if (!_isMobile) {
                                style(load_img, {
                                    transform: `translate3d(0, ${toFixed(_map(
                                        _constrain(value - (_isBanner ? _focusPt * 2 : 20), 0, height),
                                    0, height * 0.75, 0, height / 2), 2)}px, 0)`,
                                });
                            }

                            maxMove = _isBanner ? 6 : 5;
                            transform = `translate3d(0, ${toFixed(
                                _constrain(
                                    _map(value - (_isBanner ? _focusPt : 0), 0, height * 0.65, 0, height * maxMove / 16),
                                0, height * maxMove / 16),
                            _isMobile ? 1 : 2)}px, 0)`;
                            opacity = toFixed(
                                _constrain(
                                    _map(_constrain(value - (height * 0.15), 0, height), 0, height * 0.40, 1, 0),
                                0, 1),
                            _isMobile ? 1 : 4);

                            if (header) {
                                style(header, { transform });
                            }

                            if (main) {
                                style(main, { transform, opacity });
                            }
                        }
                    }
                });
            }
        });
    }
});

// Method to run on scroll down button click
let goDown = () => {
    scrollTo(heroHeight, "800ms");
};

// Initialize images
let init = () => {
    _images.clear();

    // On scroll down button click (mouseup is a tiny bit more efficient) animate scroll to the height of the hero layer
    on(_scrolldown, "mouseup", goDown);

    // Determine the height of the hero
    heroHeight = height(_hero);

    // Find the layer-images in each layer
    let layer_image, isHero, overlay, load_img, clientRect, header, main, _isbanner;
    each(_layer, $layer => {
        layer_image = find($layer, _layer_img);
        isHero = hasClass($layer, "layer-hero-id");

        if (isHero) {
            _isbanner = hasClass($layer, "banner-mode");
            header = get(find($layer, ".layer-header"), 0);
            main = get(find($layer, ".layer-main"), 0);
        }

        // In each layer-image find load-img image container and store all key info. important for creating a parallax effect
        each(layer_image, $img => {
            load_img = get(find($img, ".load-img"), 0);
            overlay = get(find($img, ".layer-image-overlay"), 0);
            clientRect = offset($img);

            _images.add({
                _isBanner: _isbanner,
                overlay, load_img,
                target: $img,
                clientRect,
                header,
                isHero,
                main
            });
        });
    });
};

// Run once each page, this is put into SWUP, so for every new page, all the images transition without having to maually rerun all the scripts on the page
init();
resize();
scroll();

on(document, "ready", () => {
    // SWUP library
    try {
        // To avoid bugs in older browser, SWUP can only run if the browser supports modern es6 features or supports webp (most browser that support webp can handle the history management SWUP does)
        if (window.isModern || window.WebpSupport) {
            console.log("%cDocument loaded, SWUP starting...", "color: #00c300");

            // Page transition manager SWUP for faster page loads
            const Swup = new swup({
                linkSelector,
                animateHistoryBrowsing: true,
                containers: ["[data-container]"],
                plugins: [
                    // Preload pages only on mobile
                    new customPreload(),
                    new headPlugin(), // Replace the contents of the head elements

                    // For every new page, scroll to the top smoothly
                    new scrollPlugin({
                        doScrollingRightAway: false,
                        animateScroll: false,
                        scrollFriction: 0.3,
                        scrollAcceleration: 0.04,
                    })
                ]
            });

            // Remove initial cache, the inital cache is always incomplete
            Swup.cache.remove(window.location.pathname);

            // This event runs for every page view after initial load
            Swup.on("clickLink", () => {
                // Remove click (mouseup is a tiny bit more efficient) event from scroll down button
                off(_scrolldown, "mouseup", goDown);

                if (windowWid <= 700) {
                    requestAnimationFrame(() => {
                        removeClass(_navbar, "navbar-show");
                    });
                }
            });
            Swup.on("samePage", () => {
                // If on the same page reinvigorate the scroll down button click event
                // On scroll down button click (mouseup is a tiny bit more efficient) animate scroll to the height of the hero layer
                on(_scrolldown, "mouseup", goDown);
            });
            Swup.on('contentReplaced', () => {
                init(); resize(); scroll();
            });
            Swup.on('willReplaceContent', () => {
                let href = window.location.href;

                requestAnimationFrame(() => {
                    removeClass(_navLink, "navbar-link-focus");
                    each(_navLink, _link => {
                        href == _link.href && addClass(_link, "navbar-link-focus");
                    });
                });
            });
        }
    } catch (e) {
        // Swup isn't very good at handling errors in page transitions, so to avoid errors blocking the site from working properly; if SWUP crashes it should fallback to normal page linking
        on(linkSelector, 'mouseup', e => {
            window.location.href = e.currentTarget.href;
        });

        console.error(`Swup Error: ${e.message}`);
    }
});
