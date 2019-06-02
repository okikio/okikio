import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';
import Transition from "./transition";

for (let [i, v] of Object.entries(Transition.base)) {
    barba.hooks[i](v);
}

// Tell Barba to use the prefetch module
barba.use(barbaPrefetch);
barba.init();
