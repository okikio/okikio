import { Service } from "@okikio/native";
import { toArr } from "../toArr";

export class Navbar extends Service {
    public nav: HTMLElement;
    public elements: HTMLElement[];
    public menu: HTMLElement;

    public init() {
        // Elements
        this.nav = document.querySelector(".nav") as HTMLElement;
        this.elements = toArr(this.nav.querySelectorAll(".navbar-link"));
        this.menu = document.querySelector(".navbar-menu") as HTMLElement;

        this.click = this.click.bind(this);
    }

    public validLink(el: HTMLAnchorElement): boolean {
        return (
            el &&
            el.tagName &&
            (el.tagName.toLowerCase() === "a" ||
                el.tagName.toLowerCase() === "button")
        );
    }

    public getLink({ target }): HTMLAnchorElement {
        let el = target as HTMLAnchorElement;
        while (el && !this.validLink(el))
            el = (el as HTMLElement).parentNode as HTMLAnchorElement;

        // Check for a valid link
        if (!el) return;
        return el;
    }

    public click(event: Event) {
        let el = this.getLink(event);
        if (!el) return;

        if (el.classList.contains("navbar-menu")) {
            this.nav.classList.toggle("active");
        }

        // else if (el.classList.contains("navbar-link"))
        // this.navbar.classList.remove("active");
    }

    public activateLink() {
        let { href } = window.location;

        for (let item of this.elements) {
            let itemHref =
                item.getAttribute("data-path") ||
                (item as HTMLAnchorElement).href;
            if (!itemHref || itemHref.length < 1) continue;

            let URLmatch = new RegExp(itemHref).test(href);
            let isActive = item.classList.contains("active");
            if (!(URLmatch && isActive)) {
                item.classList.toggle("active", URLmatch);
            }
        }

    }

    public initEvents() {
        this.nav.addEventListener("click", this.click);
        this.emitter.on("READY", this.activateLink, this);
        this.emitter.on("GO", this.activateLink, this);
    }

    public stopEvents() {
        this.nav.removeEventListener("click", this.click);
        this.emitter.off("READY", this.activateLink, this);
        this.emitter.off("GO", this.activateLink, this);
    }

    public uninstall() {
        while (this.elements.length) this.elements.pop();
        this.elements = undefined;
        this.menu = undefined;
        this.nav = undefined;
    }
}
