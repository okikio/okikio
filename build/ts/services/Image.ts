import { Service } from "@okikio/native";
import { toArr } from "../toArr";

export class Image extends Service {
    images: HTMLImageElement[];
    WebpSupport = false;

    public init() {
        super.init();
        this.resize = this.resize.bind(this);
        this.before_transition_out = this.before_transition_out.bind(this);
        this.content_insert = this.content_insert.bind(this);

        (async () => {
            await this.test_webp();
            this.get_images();
            requestAnimationFrame(() => {
                this.load_img();
            });
        })();
    }

    public get_images() {
        this.images = toArr(document.querySelectorAll("figure.img"));
    }

    public remove_images() {
        while (this.images.length) this.images.pop();
    }

    public async test_webp() {
        let check_webp_feature = (feature) => {
            return new Promise((resolve, reject) => {
                let kTestImages = {
                    lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
                    lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
                    alpha: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
                    animation: "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"
                };

                let img: HTMLImageElement | void = new window.Image();

                // @ts-ignore
                img.src = "data:image/webp;base64," + kTestImages[feature];
                // @ts-ignore
                img.onload = () => {
                    // @ts-ignore
                    let result = (img.width > 0) && (img.height > 0);
                    img = resolve(result);
                };

                // @ts-ignore
                img.onerror = () => {
                    img = reject(false);
                };
            });
        };

        // Quick test for webp support
        try {
            let result = await check_webp_feature("lossless");
            this.WebpSupport = result as boolean;
        } catch (e) {
            this.WebpSupport = false;
            // Safari still doesn't support WebP
            console.info(
                "Using JPG instead, of WEBP as this browser doesn't support WEBP."
            );
        }
    }

    public load_img() {
        for (let elem of this.images) {
            let img = elem.querySelector(".img-core") as HTMLImageElement;
            let srcset = img.getAttribute("data-src");
            let srcWid = Math.max(Math.round(elem.clientWidth), 10);
            let srcHei = Math.max(Math.round(elem.clientHeight), 10);

            // Use the largest image dimensions it remembers
            let maxW = img.hasAttribute("data-max-w") ? img.getAttribute("data-max-w") : 0;
            if (Number(maxW) < Number(srcWid)) {
                img.setAttribute("data-max-w", "" + srcWid);
                img.setAttribute("width", "" + srcWid);
                img.setAttribute("height", "" + srcHei);
            } else srcWid = Number(maxW);

            let src = srcset.replace(/w_auto/, `w_${srcWid}`);
            if (srcHei > srcWid) src = src.replace(/ar_4:3,/, `ar_3:4,`); 
            if (!this.WebpSupport) src = src.replace(".webp", ".jpg");

            // If nothing has changed don't bother
            if (src === img.src) return;

            // Ensure the image has loaded, then replace the small preview
            img.src = src;
            if (!elem.classList.contains("img-show"))
                (img.onload = () => { elem.classList.add("img-show"); img.onload = undefined; img = undefined; }); // Hide the image preview

        }
    }

    waitOnResize = false;
    resize() {
        if (!this.waitOnResize) {
            let timer;
            this.waitOnResize = true;
            requestAnimationFrame(() => {
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
