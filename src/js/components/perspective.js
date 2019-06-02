import Ele from './ele';
import View from './view';

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
        if (this.ele.length > 0) {
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

export default Perspective;