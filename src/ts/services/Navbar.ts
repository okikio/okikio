import { Service, animate } from "@okikio/native";
import type { PJAX, LinkEvent } from "@okikio/native";

export class Navbar extends Service {
    public nav: HTMLElement;
    public elements: HTMLElement[];
    public menu: HTMLElement;
    public active: boolean;
    public navCover: HTMLElement;
    public mobileLinks: HTMLElement[];
    public linkBar: HTMLElement;

    public init() {
        // Elements
        this.nav = document.querySelector("nav") as HTMLElement;
        this.elements = Array.from(this.nav.querySelectorAll(".navbar-link"));
        this.mobileLinks = Array.from(this.nav.querySelectorAll(`navbar-list[type="mobile"] .navbar-link`));
        this.menu = document.querySelector(".navbar-menu") as HTMLElement;
        this.navCover = document.querySelector(`nav-cover[type="large"]`);
        this.linkBar = document.querySelector(`nav-link-bar`);
        this.active = false;

        this.click = this.click.bind(this);
        this.mouseover = this.mouseover.bind(this);
        this.mouseout = this.mouseout.bind(this);
        this.activateLink = this.activateLink.bind(this);
    }

    public click(event: Event) {
        let pjax = this.manager.get("PJAX") as PJAX;
        let el = pjax.getLink(event as LinkEvent);
        if (!el) return;

        let offEl = (el.classList.contains("navbar-menu") || el.classList.contains("navbar-link") || el.classList.contains("navbar-logo"));
        if (el.classList.contains("navbar-menu") && !this.active) {
            this.showNav();
        } else if (this.active && offEl) {
            this.hideNav();
        }
    }

    public mouseover(event: Event) {
        let pjax = this.manager.get("PJAX") as PJAX;
        let el = pjax.getLink(event as LinkEvent);
        if (!el) return;

        if (el.classList.contains("navbar-link")) {
            this.linkBar.style.setProperty("--opacity", `1`);

            let { left, width } = el.getBoundingClientRect();
            this.linkBar.style.setProperty("--pos", `${left + (width - 40) / 2}px`);
        }
    }

    public mouseout() {
        this.linkBar.style.setProperty("--opacity", `0`);
    }

    public async showNav() {
        this.active = true;
        this.nav.classList.add("show");

        let duration = 650;
        await Promise.all([
            animate({
                target: this.navCover,
                transform: [`translateY(-100vh)`, `translateY(0)`],
                fillMode: "both",
                duration,
                easing: "ease-out"
            }),

            animate({
                target: this.mobileLinks,
                transform(index: number) {
                    return [`translateY(${50 * (index + 1)}px)`, `translateY(0)`];
                },
                delay(index: number) {
                    return duration / 2 + (index * 100);
                },
                opacity: [0, 1],
                fillMode: "both",
                duration: 650,
                easing: "ease"
            })
        ]);
    }

    public async hideNav() {
        this.active = false;
        this.nav.classList.remove("show");
        await Promise.all([
            animate({
                target: this.navCover,
                transform: [`translateY(0)`, `translateY(-100vh)`],
                fillMode: "both",
                duration: 650,
                easing: "ease-out"
            }),

            animate({
                target: this.mobileLinks,
                opacity: [1, 0],
                fillMode: "both",
                duration: 550,
                easing: "ease"
            })
        ]);
    }

    public activateLink() {
        let { href } = window.location;

        for (let item of this.elements) {
            let itemHref =
                item.getAttribute("data-path") ??
                (item as HTMLAnchorElement).href;

            let URLmatch = new RegExp(itemHref, "i").test(href);
            item.classList.toggle("active", URLmatch);
        }
    }

    public initEvents() {
        window.addEventListener('hashchange', this.activateLink, false);
        this.nav.addEventListener("click", this.click);
        this.nav.addEventListener("mouseover", this.mouseover);
        this.nav.addEventListener("mouseout", this.mouseout);
        this.emitter.on("READY", this.activateLink, this);
        this.emitter.on("GO", this.activateLink, this);
    }

    public stopEvents() {
        window.removeEventListener('hashchange', this.activateLink);
        this.nav.removeEventListener("click", this.click);
        this.nav.removeEventListener("mouseover", this.mouseover);
        this.nav.removeEventListener("mouseout", this.mouseout);
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