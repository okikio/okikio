import Ele from './ele';
import Navbar from './navbar';

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

export default Sidebar;