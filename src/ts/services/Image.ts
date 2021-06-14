import { Service } from "@okikio/native";
export class Image extends Service {
    images: HTMLImageElement[];
    WebpSupport = false;

    public init() {
        super.init();
        this.resize = this.resize.bind(this);
        this.before_transition_out = this.before_transition_out.bind(this);
        this.content_insert = this.content_insert.bind(this);

        this.get_images();
        this.load_img();
    }

    public get_images() {
        this.images = Array.from(document.querySelectorAll("figure.img"));
    }

    public remove_images() {
        while (this.images.length) this.images.pop();
    }

    public load_img() {
        for (let elem of this.images) {
            let img = elem.querySelector(".img-core") as HTMLImageElement;
            let srcset = img.getAttribute("data-src");
            let srcWid = Math.max(Math.round(elem.clientWidth), 50);
            let srcHei = Math.max(Math.round(elem.clientHeight), 50);

            // Use the largest image dimensions it remembers
            let maxW = img.hasAttribute("data-max-w") ? img.getAttribute("data-max-w") : 0;
            if (Number(maxW) < Number(srcWid)) {
                img.setAttribute("data-max-w", "" + srcWid);
                img.setAttribute("width", "" + srcWid);
                img.setAttribute("height", "" + srcHei);
            } else srcWid = Number(maxW);

            let src = srcset.replace(/w_auto/, `w_${srcWid}`);

            // If nothing has changed don't bother
            if (src === img.src) return;

            // Ensure the image has loaded, then replace the small preview
            img.src = src;
            if (!elem.classList.contains("img-show"))
                (img.onload = () => { elem.classList.add("img-show"); img.onload = undefined; img = undefined; }); // Hide the image preview

        }
    }

    waitOnResize = false;
    rafID: number;
    resize() {
        if (!this.waitOnResize) {
            let timer;
            this.waitOnResize = true;
            this.rafID = requestAnimationFrame(() => {
                cancelAnimationFrame(this.rafID);
                this.load_img();

                // set a timeout to un-throttle
                timer = window.setTimeout(() => {
                    this.waitOnResize = false;
                    timer = window.clearTimeout(timer);
                }, 500);
            });
        }
    }

    public initEvents() {
        window.addEventListener(
            "resize", this.resize,
            { passive: true }
        );

        this.emitter.on("BEFORE_TRANSITION_OUT", this.before_transition_out);
        this.emitter.on("CONTENT_INSERT", this.content_insert);
    }

    public content_insert() {
        this.get_images();
        this.load_img();
    }

    public before_transition_out() {
        this.remove_images();
    }

    public stopEvents() {
        window.removeEventListener("resize", this.resize);

        this.emitter.off("BEFORE_TRANSITION_OUT", this.before_transition_out);
        this.emitter.off("CONTENT_INSERT", this.content_insert);
    }

    public uninstall() {
        this.remove_images();
        this.images = undefined;
    }
}
