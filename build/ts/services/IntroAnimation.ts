import { Service, animate } from "@okikio/native";
import { toArr } from "../toArr";

export class IntroAnimation extends Service {
    protected elements: Array<Element>;
    protected rootElement: HTMLElement;
    entries: Array<Element>;
    observer: IntersectionObserver;
    splashscreen: boolean;

    public init() {
        super.init();

        // Elements
        this.elements = toArr(document.querySelectorAll(".intro-animation"));
        this.entries = [];

        let scrollTop = window.scrollY;
        let scrollBottom = window.scrollY + window.innerHeight;
        for (let el of this.elements) {
            let { bottom, top } = el.getBoundingClientRect();
            if ((bottom > scrollTop && bottom < scrollBottom) ||
                (top < scrollBottom && top > scrollTop)) {
                this.entries.push(el);
            }
        }
    }

    public newPage() {

        this.init();
        this.prepareToShow();
    }

    public initEvents() {
        this.emitter.on(
            "BEFORE_SPLASHSCREEN_HIDE",
            this.prepareToShow,
            this
        );
        this.emitter.on("CONTENT_REPLACED", this.newPage, this);
        this.emitter.on(
            "AFTER_SPLASHSCREEN_HIDE BEFORE_TRANSITION_IN",
            this.show,
            this
        );
    }

    public stopEvents() {
        this.emitter.off(
            "BEFORE_SPLASHSCREEN_HIDE",
            this.prepareToShow,
            this
        );
        this.emitter.off("CONTENT_REPLACED", this.newPage, this);
        this.emitter.off(
            "AFTER_SPLASHSCREEN_HIDE BEFORE_TRANSITION_IN",
            this.show,
            this
        );
    }

    public uninstall() {
        requestAnimationFrame(() => {
            for (let el of this.entries) {
                (el as HTMLElement).style.opacity = "1";
            }
        });
    }

    public prepareToShow() {
        requestAnimationFrame(() => {
            for (let el of this.entries) {
                (el as HTMLElement).style.opacity = "0";
            }
        });
    }

    public async show() {
        return await animate({
            target: this.entries as HTMLElement[],
            opacity: [0, 1],
            delay(i: number) {
                return 300 * (i);
            },
            onfinish: (el: { style: { opacity: string, visibility: string } }) => {
                requestAnimationFrame(() => {
                    el.style.opacity = "1";
                });
            },
            easing: "ease-out",
            duration: 650,
        });
    }
}
