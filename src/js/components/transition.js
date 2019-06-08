import Util from "./util";
import Registry from "./registry";
import Page from '../components/page';

const anime = window.anime;
const doc = window.document;
class Transition {
    constructor(opt = { type: "" }) {
        this.opt = opt; // Options
        this.JSON = { ...this.opt };
        Registry.register(`transition-list`, { ...this.JSON });
    }
    
    static create(opt) {
        return new Transition(opt);
    }
    
    static get registry() { return Registry; }
    static base() {}
    static all(obj = {}) {
        Transition.base = obj;
        return this;
    }
}

let base = Page.create({
    name: "index",
    fn(...args) {
        Page.base.call(this, ...args);
    }
});

Transition.create({
    before({ current, next, trigger }) {
        const done = this.async();
        let url = next.url.path;
                    
        anime.timeline()
            .add({
                targets: "#yellow-banner",
                height: "100vh",
                easing: "easeOutSine",
                duration: 400,
            })
            .add({
                targets: doc.scrollingElement || doc.body || doc.documentElement,
                scrollTop: 0,
                easing: "easeOutSine",
                delay: 200,
                duration: 400,
            })
            .add({
                targets: ".mobile-on",
                height: "50px",
                easing: "easeOutSine",
                duration: 600,
                complete() {
                    let mobileON = Page.ele(".mobile-on");
                    mobileON.each(el => {
                        mobileON.style(el,{
                            height: "0"
                        });
                        el.classList.remove("mobile-on");
                    });
                }
            }, 0)
            .add({
                targets: "#yellow-banner",
                easing: "easeOutSine",
                delay: 400,
                duration: 400,
                complete() {
                    Util.pageSetup(url);
                    done();
                },
            });
    },
    enter({ current, next, trigger }) {
        const done = this.async();
        try {
            document.title = next.container.getAttribute('title');
            Page.base.call(base);
        } catch (e) {
            console.log(e.message);
        }
        done();
    },
    after({ current, next, trigger }) {
        const done = this.async();
        anime.timeline()
            .add({
                targets: "#yellow-banner",
                height: "0vh",
                delay: 200,
                easing: "easeOutSine",
                duration: 400,
                complete() {
                    done();
                }
            });
    },
});

export default Transition;