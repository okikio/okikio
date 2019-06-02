import anime from 'animejs';
import Util from "./util";
import Registry from "./registry";
import Page from '../components/page';
        
const doc = window.document;
class Transition {
    constructor(opt = {}) {
        this.opt = opt; // Options
        this.JSON = { ...this.opt };
        Registry.register("transition-list", { ...this.JSON });
    }
    
    static create(opt) {
        return new Transition(opt);
    }
    
    static base() {}
    static all(obj = {}) {
        Transition.base = obj;
        return this;
    }
}

Transition.all({
    leave({ current, next, trigger }) {
        const done = this.async();
        let url = next.url.path;
        // if (current.url.path == trigger.href) return done();
        
        let page = Registry.load("page-list", Util.routeName(url));
        anime.timeline()
            .add({
                targets: doc.scrollingElement || doc.body || doc.documentElement,
                scrollTop: 0,
                easing: "easeOutSine",
                duration: 400
            })
            .add({
                targets: "#yellow-banner",
                height: "100vh",
                easing: "easeOutSine",
                duration: 400
            }, 0)
            .add({
                targets: "#yellow-banner",
                easing: "easeOutSine",
                delay: 500,
                height: "0",
                duration: 800,
                begin() {
                    done();
                },
                complete() {
                    Util.pageSetup(url);
                    Page.prototype.init.call(page || {}, url);
                }
            });
    }
});

export default Transition;