import barba from '@barba/core';
import Registry from "./registry";
import Transition from "./transition";

for (let [i, v] of Object.entries(Transition.base)) {
    barba.hooks[i](v);
}

barba.init({
    transitions: Registry.values("transition-list")
});
