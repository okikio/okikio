import Perspective from "./perspective";
import Registry from "./registry";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import View from "./view";
import Ele from "./ele";
import Img from "./img";

const doc = window.document;
class Page {
    constructor(opt = {}) {
        this.opt = opt; // Options
        this.name = this.opt.name; // Page Name
        this.fn = this.opt.fn.bind(this);

        this.img = this.opt.img;
        this.view = this.opt.view;
        this.navbar = this.opt.navbar;
        this.sidebar = this.opt.sidebar;
        this.perspective = this.opt.perspective;
        Registry.register("page-list", this);
    }

    static base() {}
    static get registry() { return Registry; }
    static axis(...args) { return Perspective.axis(...args); }
    static ele(sel, opt) { return new Ele(sel, opt); }
    static img(sel, opt) { return new Img(sel, opt); }
    static view(sel, opt) { return new View(sel, opt); }
    static navbar(sel, opt) { return new Navbar(sel, opt); }
    static sidebar(sel, opt) { return new Sidebar(sel, opt); }
    static perspective(sel, opt) { return new Perspective(sel, opt); }

    static init(...args) {
        (this.fn || Page.base).call(this, ...args);
        return this;
    }
    
    static create(opt) {
        return new Page(opt);
    }
    
    static all(fn = () => {}) {
        Page.base = fn;
    }
}

Page.all(function () {
    let $this = this;
    let axis = Page.axis;
    this.layers = Page.ele(".header, .navbar-menu, .social-sidebar li, .copyright-bar");
    this.scrollSnap = Page.ele(".scroll-snap");
    this.downBtn = Page.ele(".next-layer");
    this.upBtn = Page.ele(".top-layer");
    this.navbar = Page.navbar(".header", {
        toggleClass: "mobile-on",
        focus: ".navbar-select",
        link: ".navbar-link",
        foot: ".navbar-foot",
        container: "header"
    });

    this.socialSidebar = Page.sidebar(".social-sidebar", {
        list: "li",
        link: "a"
    });

    this.img = Page.img("load-img");
    this.view = Page.view(doc.scrollingElement || doc.body || doc.documentElement, {
        " < 650": function () {
            $this.socialSidebar.mobile();
            Page.perspective(".perspec-head, .perspec-sidebar, .perspec-img", {
                viewport: {
                    x: axis(() => `0px`),
                    y: axis(() => `0px`)
                },
                view: this.sel
            }).init();
        },
        " >= 650": function () {
            $this.navbar.select(40);
            $this.socialSidebar.init();
            Page.perspective(".perspec-head", {
                viewport: {
                    x: axis("max", "x", 20, -20),
                    y: axis(e => {
                        return `${-e.clientY / 20}px`;
                    })
                },
                view: this.sel
            }).init();
            
           Page.perspective(".perspec-sidebar", {
                viewport: {
                    x: axis("min", "x", 10, -10),
                    y: axis("min", "y", -20, 10)
                },
                view: this.sel
            }).init();

            Page.perspective(".perspec-img", {
                viewport: {
                    x: axis("min", "x", 13, 20),
                    y: axis((...args) => {
                        let val = axis("max", "y", 12, 0)(...args);
                        return `calc(-50% + ${val})`;
                    })
                },
                view: this.sel
            }).init();
        }
    });

    this.navbar.toggle(this.navbar.toggleClass);
    this.view.resize()
        .scroll(e => {
            this.navbar.container.each(el => {
                el.classList.toggle("focus", window.scrollY > 50);
            });
            $this.layers.each(el => {
                let type;
                $this.scrollSnap.each(snap => {
                    if ($this.layers.intersect(el, snap)) {
                        type = snap.classList.contains("bright-layer") ? "" : "nav-bright";
                        (type === "nav-bright" && el.classList.add(type));
                    }

                    (type !== "nav-bright" && el.classList.remove("nav-bright"));
                });
            });
        })
        .ready(() => {
            if ($this.downBtn.ele.length) {
                // When clicked goes down to the next layer that scrolling can snap too (".scroll-snap" class)
                $this.downBtn.each((el, i) => {
                    el.addEventListener("click", e => {
                        e.preventDefault();
                        let limit = Math.min(i + 1, $this.scrollSnap.ele.length - 1);
                        let next = $this.scrollSnap.ele[limit];
                        $this.view.animate({
                            scrollTop: $this.scrollSnap.y(next),
                            easing: "easeInOutQuad",
                            duration: 600
                        });
                    });
                });
            }

            if ($this.upBtn.ele.length) {
                // When clicked sends the user back to the top
                $this.upBtn.click(e => {
                    e.preventDefault();
                    $this.view.animate({
                        easing: "easeInOutQuad",
                        duration: 1000,
                        scrollTop: 0
                    });
                });
            }

            $this.img.start();
        });
});

export default Page;
