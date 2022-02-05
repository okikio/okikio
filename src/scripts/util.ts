export type Rect = { top: number, left: number, height: number, width: number, bottom: number, right: number, x: number, y: number }
export const generateClientRects = (arr: HTMLElement[]): Rect[] => {
    return arr.map(elem => {
      let { top, left, height, width, bottom, right, x, y } = elem.getBoundingClientRect();
      return {
        height,
        width,
        bottom, right, x, y,
        top: top + window.scrollY,
        left: left + window.scrollX
      };
    });
}
  
export const axis = (
    type: `no-limit` | "max" | "min" = "no-limit",
    axis: "x" | "y" = "x",
    rate = 20,
    limit = 0
) => {
    return (e: MouseEvent, clientRect: Rect) => {
        let mouseAxis = (e as MouseEvent)[`client${axis?.toUpperCase()}`];
        let elRectAxis = clientRect[axis?.toLowerCase()];
        let value = (mouseAxis - elRectAxis) / rate;
        return (type == "no-limit" ? value : Math[type](value, limit)) + `px`;
    };
}

/**
 * throttle function that catches and triggers last invocation
 * use time to see if there is a last invocation
 */
 export const throttle = (func: Function, limit = 300) => {
    let lastFunc: any;
    let lastRan: any;
    return function (...args: any) {
        const context = this;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function () {
                if (Date.now() - lastRan >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
};

/**
 * debounce function
 * use timer to maintain internal reference of timeout to clear
 */
export const debounce = (func: Function, timeout = 300) => {
    let timer: any;
    return function (...args: any) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
};