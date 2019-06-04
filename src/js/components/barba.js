import Transition from "./transition";

let barba = window.barba;
let barbaPrefetch = window.barbaPrefetch;

// Tell Barba to use the prefetch module
barba.use(barbaPrefetch);
barba.init({
    transitions: Transition.registry.load("transition-list")
});
