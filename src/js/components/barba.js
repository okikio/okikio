import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';
import Transition from "./transition";

// Tell Barba to use the prefetch module
// barba.use(barbaPrefetch);
barba.init({
    transitions: Transition.registry.load("transition-list")
});
