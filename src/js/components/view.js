import Ele from './ele';

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
                let val = `${wid}${v.replace(/&&|\|\|/g, `$&& ${wid}`)}`;
                if (Function(`"use strict";return (${val})`)()) {
                    this.breakpoints[v].call(this, wid);
                }
            }, this);
        }
        return this;
    }
    addBreakpoints(obj = {}) {
        Object.assign(this.breakpoints, obj);
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
        window.addEventListener("scroll", fn.bind(this));
        return this;
    }
}

export default View;