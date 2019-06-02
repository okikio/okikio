import Ele from './ele';

// Navbar Object
class Navbar extends Ele {
    constructor(sel = ".header", opt = {}) {
        super(sel, opt);
        this.container = new Ele(this.opt.container);
        this.toggleClass = this.opt.toggleClass;
        this.focus = new Ele(this.opt.focus);
        this.foot = new Ele(this.opt.foot);
        this.link = new Ele(this.opt.link);
    }
    select(offset = 40) {
        this.link.hover(e => {
            let wid = offset;
            let pos = e.target.offsetLeft + (e.target.offsetWidth - wid) / 2;
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

export default Navbar;