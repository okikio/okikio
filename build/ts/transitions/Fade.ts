import { ITransition, ITransitionData, animate } from "@okikio/native";

//== Transitions
export const Fade: ITransition = {
    name: "default",
    duration: 350,
    scrollable: true,

    out({ from, trigger }: ITransitionData) {
        let { duration } = this;
        let fromWrapper = from.wrapper;
        return animate({
            target: fromWrapper,
            keyframes: [
                {
                    transform: "translateY(0)",
                    opacity: 1,
                },
                {
                    opacity: 0,
                    transform: `translateY(${window.scrollY > 100 &&
                        !/back|popstate|forward/.test(trigger as string)
                        ? 100
                        : 0
                        }px)`,
                },
            ],
            easing: "out",
            duration,
        });
    },

    in({ to, scroll }: ITransitionData) {
        let { duration } = this;
        let toWrapper = to.wrapper;

        window.scroll(scroll.x, scroll.y);
        return animate({
            target: toWrapper,
            opacity: [0, 1],
            easing: "in",
            duration,
        });
    }
};
