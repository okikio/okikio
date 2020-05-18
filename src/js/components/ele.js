import { _is } from "./util";

let ele;
let slice = [].slice;
let tagRE = /^\s*<(\w+|!)[^>]*>/;
let tagExpandRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig;
export let _qsa = (dom = document, sel) => {
    let classes, _dom = dom;
    _is.str(dom) && (_dom = _qsa(document, dom)[0]);
    _is.inst(dom, ele) && (_dom = dom[0]);
    if (!_is.str(sel) || sel.length === 0) return [];
    if (_is.inst(_dom, HTMLCollection)) return slice.call(_dom);
    if (/^(#?[\w-]+|\.[\w-.]+)$/.test(sel)) {
        switch (sel.charAt(0)) {
            case '#':
                return [_dom.getElementById(sel.substr(1))];
            case '.':
                classes = sel.substr(1);
                if (/^[\w-]*$/.test(classes)) {
                    return slice.call(_dom.getElementsByClassName(classes));
                }
                break;
            default:
                return slice.call(_dom.getElementsByTagName(sel));
        }
    }

    return slice.call(_dom.querySelectorAll(sel));
};

// Create an Element List from a HTML string
export let _createElem = html => {
    let dom, container;
    container = document.createElement('div');
    container.innerHTML = '' + html.replace(tagExpandRE, "<$1></$2>");
    dom = slice.call(container.childNodes);
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
        { return slice.call(sel).filter(item => _is.def(item)); }
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
