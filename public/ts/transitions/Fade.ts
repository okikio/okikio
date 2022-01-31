import { ITransition, ITransitionData, animate, newURL } from "@okikio/native";

//== Transitions
export const Fade: ITransition = {
    name: "default",
    duration: 350,
    manualScroll: true,

    out({ from }: ITransitionData) {
        let { duration } = this;
        let fromWrapper = from.wrapper;
        return animate({
            target: fromWrapper,
            opacity: [1, 0],
            easing: "ease-out",
            duration,
        });
    },

    in({ to, scroll }: ITransitionData) {
        let { duration } = this;
        let toWrapper = to.wrapper;

        window.scroll(scroll.x, scroll.y);

        try {
            let { hash } = window.location;
            let _hash = hash[0] == "#" ? hash : newURL(hash).hash;
            if (_hash.length > 1) {
                let el = document.getElementById(_hash.slice(1));
                if (el) {
                    el.scrollIntoView?.();
                }
            }
        } catch (e) {
            console.warn("[hashAction] error", e);
        }

        return animate({
            target: toWrapper,
            opacity: [0, 1],
            easing: "ease-in",
            duration
        });
    }
};

