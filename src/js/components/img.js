import Ele from './ele';

let Image = window.Image; // Image
let Promise = window.Promise; // Promise

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
        let src = el.getAttribute(this.src);
        let alt = el.getAttribute(this.alt);
        let _class = el.className;
        
        let img = new Image();
        img.src = this.path + src;
        img.onload = () => {
            resolve([el, img, src, alt, _class]);
        };

        img.onerror = e => { reject(e); };
        return this;
    }
    start() { 
        if (this.ele.length) {
            this.each((el, i) => {
                let src = el.getAttribute(this.src);
                this.promise[i] = src.includes("<%") ? {} : new Promise(function (resolve, reject) {
                    this.init.call(this, resolve, reject, el);
                }.bind(this));
            });
            
            this.load(args => {
                let [el, img, src, alt, _class] = args;
                img.setAttribute("alt", alt);
                img.classList.add(this.sel);
                _class && img.classList.add(_class);
                el.insertAdjacentElement('beforebegin', img);
                el.remove();
            });

            this.err(e => {
                console.log(`One of the images didn't load: ${e.message}`);
            });
        }
        return this; 
    }
    load(fn = () => {}) { 
        this.each((el, i) => {
            let promise = this.promise[i];
            promise.then && promise.then(fn.bind(this));
        });
        return this; 
    }
    err(fn = () => {}) { 
        this.each((el, i) => {
            let promise = this.promise[i];
            promise.catch && promise.catch(fn.bind(this)); 
        });
        return this; 
    }
}

export default Img;