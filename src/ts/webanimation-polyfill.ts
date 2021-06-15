if (!("KeyframeEffect" in window)) {
    let script = document.createElement("script");
    script.src = "./js/webanimation.min.js";
    document.head.appendChild(script);
}

export { };