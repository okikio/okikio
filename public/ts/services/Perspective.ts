import { Service } from "@okikio/native";
import { toArr } from "../../../build/ts/toArr";

export class Perspective extends Service {
    rootEl: HTMLElement;
    el: HTMLElement[];
    waitOnMouseMove = false;

    public init() {
        super.init();

        this.mousemove = this.mousemove.bind(this);
        this.getEl();
    }

    public getEl() {
        this.rootEl = document.querySelector(".perspective-group");

        let el = document.querySelectorAll(".perspective");
        this.el = Array.from(el);

        if (this.rootEl) this.rootEl.addEventListener("mousemove", this.mousemove, { passive: true });
    }

    public removeEl() {
        while (this.el.length) this.el.pop();
        this.rootEl = undefined;
    }

    public mousemove(e: { clientX: number; clientY: number; }) {
        if (!this.waitOnMouseMove && window.innerWidth > 640) {
            this.waitOnMouseMove = true;
            let raf: number | void = window.requestAnimationFrame(() => {
                let i = 0, len = this.el.length;

                let { left, top, width, height } = this.rootEl.getBoundingClientRect();
                let clientX = e.clientX - left - (width / 2);
                let clientY = e.clientY - top - (height / 2);

                let x = clientX * 40 / width;
                let y = clientY * 40 / height;

                for (; i < len; i++) {
                    let el = this.el[i];
                    el.style.transform = `translate(${x}px, ${y}px)`;
                }

                // Set a timeout to un-throttle
                this.waitOnMouseMove = false;
                raf = window.cancelAnimationFrame(raf as number);
            });
        }
    }

    public initEvents() {
        this.emitter.on("BEFORE_TRANSITION_OUT", this.transitionOut, this);
        this.emitter.on("CONTENT_REPLACED", this.init, this);
    }

    public stopEvents() {

        this.emitter.off("BEFORE_TRANSITION_OUT", this.transitionOut, this);
        this.emitter.off("CONTENT_REPLACED", this.init, this);
    }

    public transitionOut() {
        if (this.rootEl) {
            this.rootEl.removeEventListener("mousemove", this.mousemove);
            this.removeEl();
        }
    }

    public uninstall() {
        this.removeEl();
        this.el = undefined;
    }
}
