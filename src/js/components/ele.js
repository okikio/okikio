import anime from 'animejs';

// Element Object
class Ele {
    constructor(sel, opt = {}) {
        this.ele = sel && sel.nodeType == window.Node.ELEMENT_NODE ? [sel] : [...document.querySelectorAll(sel)]; // Element
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
    animate(opt = {}) {
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

export default Ele;