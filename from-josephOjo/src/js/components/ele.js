import { _is } from "./util";

let ele;
let tagRE = /^\s*<(\w+|!)[^>]*>/;
let tagExpandRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig;
export let _qsa = (dom = document, sel) => {
    let classes;
    if (!_is.str(sel) || sel.length === 0) return [];
    if (/^(#?[\w-]+|\.[\w-.]+)$/.test(sel)) {
        switch (sel.charAt(0)) {
            case '#':
                return [dom.getElementById(sel.substr(1))];
            case '.':
                classes = sel.substr(1).replace(/\./g, ' ');
                return [...dom.getElementsByClassName(classes)];
            default:
                return [...dom.getElementsByTagName(sel)];
        }
    }

    return [...dom.querySelectorAll(sel)];
};

// Create an Element List from a HTML string
export let _createElem = html => {
    let dom, container;
    container = document.createElement('div');
    container.innerHTML = '' + html.replace(tagExpandRE, "<$1></$2>");
    dom = [].slice.call(container.childNodes);
    dom.forEach(el => {
        container.removeChild(el);
    });

    return dom;
};

// Element selector
export let _elem = (sel, ctxt) => {
    if (_is.str(sel)) {
        sel = sel.trim();
        if (tagRE.test(sel)) { return _createElem(sel); }
        else { return _qsa(ctxt, sel); }
    } else if (_is.inst(sel, ele)) { return sel; }
    else if (_is.arr(sel) || _is.inst(sel, NodeList))
        { return [...sel].filter(item => _is.def(item)); }
    else if (_is.obj(sel) || _is.el(sel)) { return [sel]; }
    else if (_is.fn(sel)) { return _elem(sel()); }
    return [];
};

// Element Object [Based on Zepto.js]
export default ele = class {
    constructor(sel = '', ctxt) {
        this.sel = sel; // Selector
        this.ele = _elem(this.sel, ctxt); // Element

        for (let i = 0; i < this.ele.length; i++) {
            this[i] = this.ele[i];
        }
        this.length = this.ele.length;
    }
};
