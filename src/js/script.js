let anime = window.anime; // animejs
let Image = window.Image; // Image
let Promise = window.Promise; // Promise
// Element Object
class Ele {
    constructor(sel, opt = {}) {
        this.ele = [...document.querySelectorAll(sel)]; // Element
        this.sel = sel; // Selector
        this.opt = opt; // Options
    }
    x(el) { return this.clientRect(el).x; }
    y(el) { return this.clientRect(el).y; }
    width(el) { return this.clientRect(el).width; }
    height(el) { return this.clientRect(el).height; }
    clientRect(el) { return el.getBoundingClientRect(); }
    each(fn = () => {}) {
        this.ele.forEach(fn, this);
        return this;
    }
    map(fn = () => {}) {
        return this.ele.map(fn, this);
    }
    style(ele, css = {}) {
        Object.assign(ele.style, css);
        return this;
    }
    parents(sel) {
        var eleNode = window.Node.ELEMENT_NODE;
        return this.map(function(el) {
            var elems = [], parent = el;
            while ((parent = parent.parentElement) !== null) {
                if (parent.nodeType == eleNode && parent.matches(sel)) {
                    elems.push(parent);
                }
            }
            return elems;
        });
    }
    animate(opt) {
        anime({
            targets: this.sel,
            ...opt
        });
        return this;
    }
    click(fn = () => {}) {
        return this.each(function(ele) {
            ele.addEventListener("click", fn.bind(this));
        }, this);
    }
    hover(fn = () => {}) {
        return this.each(function(ele) {
            ele.addEventListener("mouseover", fn.bind(this));
        }, this);
    }
    mousemove(fn = () => {}) {
        return this.each(function(ele) {
            ele.addEventListener("mousemove", fn.bind(this));
        }, this);
    }
    intersect($this, el) {
        return (
            this.x($this) < this.x(el) + this.width(el) &&
            this.x(el) < this.x($this) + this.width($this) &&
            this.y($this) < this.y(el) + this.height(el) &&
            this.y(el) < this.y($this) + this.height($this)
        );
    }
}

// Viewport Object
class View extends Ele {
    constructor(sel = "body", breakpoints = {}) {
        super(sel, {});
        this.breakpoints = breakpoints;
        this.each(el => this.responsive(el));
    }
    x(el) { return el.scrollLeft; }
    y(el) { return el.scrollTop; }
    responsive(el) {
        let wid = this.width(el);
        let breakpoints = Object.keys(this.breakpoints);
        if (breakpoints.length) {
            breakpoints.forEach(function(v) {
                let val = `${wid}${v.replace(/&&|\|\|/g, `$& ${wid}`)}`;
                if (Function(`"use strict";return (${val})`)()) {
                    this.breakpoints[v].call(this, wid);
                }
            }, this);
        }
        return this;
    }
    resize(fn = () => {}) {
        let breakpoints = this.responsive.bind(this);
        window.addEventListener(
            "resize",
            function(...args) {
                this.each(el => breakpoints(el));
                fn.apply(this, args);
            }.bind(this)
        );
        return this;
    }
    ready(fn = () => {}) {
        // Checking the document.readyState property. If it contains the string in (as in uninitialized and loading) set a timeout and check again. Otherwise, execute function. [stackoverflow.com/a/30319853]
        if (/in/.test(document.readyState)) {
            window.setTimeout(() => { this.ready(fn); }, 9);
        } else { fn.call(this); }
        return this;
    }
    click(fn = () => {}) {
        return this.each(function(ele) {
            ele.addEventListener("click", fn.bind(this));
        }, this);
    }
    scroll(fn = () => {}) {
        return this.each(function(ele) {
            ele.addEventListener("scroll", fn.bind(this));
        }, this);
    }
}

// Perspective  Object
class Perspective extends Ele {
    constructor(sel = ".perspec", opt = {}) {
        super(sel, opt);
        this._viewport = { x: () => 0, y: () => 0 };
        this.view = new View(this.opt.view);
        this.viewport(this.opt.viewport);
    }
    viewport(port = {}) {
        Object.assign(this._viewport, port);
        return this;
    }
    init() {
        if (this.ele.length) {
            let style = function(e) {
                this.each((el, i) => {
                    this.style(el, {
                        transform: `translate(
                            ${this._viewport.x(e, this, el)},
                            ${this._viewport.y(e, this, el)}
                        )`.trim()
                    });
                });
            }.bind(this);
            this.view.mousemove(style);
            style({ clientX: 0, clientY: 0 });
        }
    }
    static axis(type, axis = "x", rate = 20, limit = 0) {
        return typeof type == "function"
            ? type
            : (e, $this, el) => {
                  let all = (e[`client${axis.toUpperCase()}`] - $this[axis](el)) / rate;
                  return `${(type == "all" ? all : Math[type](all, limit))}px`;
              };
    }
}

// Navbar Object
class Navbar extends Ele {
    constructor(sel = ".navbar", opt = {}) {
        super(sel, opt);
        this.container = new Ele(this.opt.container);
        this.toggleClass = this.opt.toggleClass;
        this.focus = new Ele(this.opt.focus);
        this.foot = new Ele(this.opt.foot);
        this.link = new Ele(this.opt.link);
    }
    select(offset = 100) {
        this.link.hover(e => {
            let wid = this.width(e.target) - offset;
            let pos = e.target.offsetLeft + (offset / 2);
            this.focus.each(function (ele) {
                this.style(ele, { 
                    width: `${wid}px`,
                    left: `${pos}px`
                });
            });
        });
        return this;
    }
    toggle($class) {
        this.foot.click(e => {
            this.container.each(el => {
                el.classList.toggle($class);
            });
        });
        return this;
    }
}

// Sidebar Object
class Sidebar extends Navbar {
    constructor(sel = ".sidebar", opt = {}) {
        super(sel, opt);
        this.list = new Ele(`${this.sel} ${this.opt.list}`);
        this.link = new Ele(`${this.list.sel} ${this.opt.link}`);
    }
    mobile() {
        this.link.each((el, i) => {
            el.textContent = this.list.ele[i].getAttribute("title");
        });
        return this;
    }
    init() {
        this.list.each((el, i) => {
            let link = this.link.ele[i];
            let txt = link.textContent;
            el.addEventListener("mouseover", e => {
                link.textContent = el.getAttribute("title");
            });
            
            el.addEventListener("mouseout", e => {
                link.textContent = txt;
            });
        });
        return this;
    }
}

// Img Object
class Img extends Ele {
    constructor(sel = "load-img", opt = {}) {
        super(sel, opt);
        this.src = this.opt.src || "src";
        this.alt = this.opt.alt || "alt";
        this.path = this.opt.path || "";
        this.run = this.opt.run || false;
        this.class = this.opt.class || "";
        this.promise = [];
    }
    init(resolve, reject, el) {
        let img = new Image();
        let src = el.getAttribute(this.src);
        let alt = el.getAttribute(this.alt);
        let _class = el.className;
        img.src = this.path + src;
        img.onload = function () {
            resolve([el, img, src, alt, _class]);
        };

        img.onerror = (e) => { reject(e); };
        return this;
    }
    start() { 
        if (this.ele.length) {
            this.each((el, i) => {
                this.promise[i] = new Promise(function (resolve, reject) {
                    this.init.call(this, resolve, reject, el);
                }.bind(this));
            });
            this.load(args => {
                let [el, img, src, alt, _class] = args;
                img.setAttribute("alt", alt);
                img.classList.add(this.sel);
                _class && img.classList.add(_class);
                el.insertAdjacentElement('beforebegin', img);
                el.parentNode.removeChild(el);
            });

            this.err(e => {
                console.log("One of the images didn't load: " + e);
            });
        }
        return this; 
    }
    load(fn = () => {}) { 
        this.each((el, i) => {
            this.promise[i].then(fn.bind(this));
        });
        return this; 
    }
    err(fn = () => {}) { 
        this.each((el, i) => {
            this.promise[i].catch(fn.bind(this)); 
        });
        return this; 
    }
}

let axis = Perspective.axis;
let layers = new Ele(".navbar, .navbar-menu, .social-sidebar li, .copyright-bar");
let scrollSnap = new Ele(".scroll-snap");
let downBtn = new Ele(".next-layer");
let upBtn = new Ele(".top-layer");
let navbar = new Navbar(".navbar", {
    toggleClass: "mobile-on",
    focus: ".navbar-select",
    link: ".navbar-link",
    foot: ".navbar-foot",
    container: "header"
});

let socialSidebar = new Sidebar(".social-sidebar", {
    list: "li", link: "a"
});

let img = new Img("load-img");
let view = new View("body", {
    " < 650": function () {
        socialSidebar.mobile();
        new Perspective(".perspec-head, .perspec-sidebar, .perspec-img", {
            viewport: {
                x: axis(() => `0px`),
                y: axis(() => `0px`)
            },
            view: this.sel
        }).init();
    },
    " >= 650": function() {
        navbar.select(100);
        socialSidebar.init();
        new Perspective(".perspec-head", {
            viewport: {
                x: axis("max", "x", 20, -20),
                y: axis(e => {
                    return `${-e.clientY / 20}px`;
                })
            },
            view: this.sel
        }).init();
        
        new Perspective(".perspec-sidebar", {
            viewport: {
                x: axis("min", "x", 10, -10),
                y: axis("min", "y", -20, 10)
            },
            view: this.sel
        }).init();
        
        new Perspective(".perspec-img", {
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

navbar.toggle(navbar.toggleClass);

view.resize()
    .scroll(e => {
        layers.each(el => {
            let type;
            scrollSnap.each((snap) => {
                if (layers.intersect(el, snap)) {
                    type = snap.classList.contains("bright-layer") ? "" : "nav-bright";
                    (type === "nav-bright" && el.classList.add(type));
                }

                (type !== "nav-bright" && el.classList.remove("nav-bright"));
            });
        });
    })
    .ready(() => {
        if (downBtn.ele.length) {
            // When clicked goes down to the next layer that scrolling can snap too (".scroll-snap" class)
            // let top = view.y(view.ele[0]); 
            downBtn.each((el, i) => {
                el.addEventListener("click", e => {
                    e.preventDefault();
                    let limit = Math.min(i + 1, scrollSnap.ele.length - 1);
                    let next = scrollSnap.ele[limit];
                    console.log(scrollSnap.y(next));
                    view.animate({ 
                        scrollTop: scrollSnap.y(next),
                        easing: "easeInOutQuad",
                        duration: 600
                    });
                });
            });
        }
    
        if (upBtn.ele.length) {
            // When clicked sends the user back to the top
            upBtn.click(e => {
                e.preventDefault();
                view.animate({ 
                    easing: "easeInOutQuad",
                    duration: 1000, 
                    scrollTop: 0
                });
            });
        }
    
        img.start();
    });
