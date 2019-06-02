import 'particles.js';
import Page from '../components/page';

const particlesJS = window.particlesJS;
const Index = Page.create({
    name: "index",
    fn(...args) {
        let breakpoints;
        let particlesJSON = { 
            "particles": { "number": { "value": 75, "density": { "enable": true, "value_area": 1400 } }, "color": { "value": "#ffff00" }, "shape": { "type": "triangle", "stroke": { "width": 0, "color": "#000000" }, "polygon": { "nb_sides": 5 }, "image": { "src": "img/github.svg", "width": 100, "height": 100 } }, "opacity": { "value": 0.5, "random": false, "anim": { "enable": false, "speed": 1, "opacity_min": 0.3, "sync": false } }, "size": { "value": 4, "random": true, "anim": { "enable": false, "speed": 40, "size_min": 0.5, "sync": false } }, "line_linked": { "enable": true, "distance": 250, "color": "#ffff00", "opacity": 0.5, "width": 1 }, "move": { "enable": true, "speed": 6, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 } } }, "interactivity": { "detect_on": "window", "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true }, "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } }, "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 }, "repulse": { "distance": 200, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } } }, "retina_detect": false };
            
        Page.base.call(this, ...args);
        breakpoints = { ...this.view.breakpoints };
        this.view.addBreakpoints({
            "> 650": () => {
                breakpoints["> 650"]();
                particlesJSON.particles.number.value = 75;
                particlesJSON.particles.number.density.value_area = 1400;
            },
            "< 650": () => {
                breakpoints["< 650"]();
                particlesJSON.particles.number.value = 45;
                particlesJSON.particles.number.density.value_area = 650;
            }
        }).resize();
        
        if (Page.ele("#particles-js").ele.length > 0) {
            particlesJS('particles-js', particlesJSON);
        }
    }
});

export default Index;