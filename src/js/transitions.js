var anime = window.anime; // Element Transition
var barba = window.barba; // Page Transition 

barba.Pjax.start();

var FadeTransition = barba.BaseTransition.extend({
  start: function() {
    /**
     * This function is automatically called as soon the Transition starts
     * this.newContainerLoading is a Promise for the loading of the new container
     * (Barba.js also comes with an handy Promise polyfill!)
     */

    // As soon the loading is finished and the old page is faded out, let's fade the new page
    Promise
      .all([this.newContainerLoading, this.fadeOut()])
      .then(this.fadeIn.bind(this));
  },

  fadeOut: function() {
    /**
     * this.oldContainer is the HTMLElement of the old Container
     */

    return new Promise(function (resolve, reject) {
        anime({
            targets: ".barba-container",
            translateY: "100%",
            scale: [1, 0.95],
            duration: 1000,
            easing: "easeInExpo",
            complete: function () {
                resolve();
            }
        });
    });
  },

  fadeIn: function() {
    /**
     * this.newContainer is the HTMLElement of the new Container
     * At this stage newContainer is on the DOM (inside our #barba-container and with visibility: hidden)
     * Please note, newContainer is available just after newContainerLoading is resolved!
     */

    anime({
        targets: ".barba-container",
        translateY: ["-100%", 0],
        scale: [1.1, 1],
        duration: 1000,
        easing: "easeOutCubic",
        complete: function () {
            console.log("loaded");
        }
    });
    this.done();
  }
});

/**
 * Next step, you have to tell Barba to use the new Transition
 */

barba.Pjax.getTransition = function() {
  /**
   * Here you can use your own logic!
   * For example you can use different Transition based on the current page or link...
   */

  return FadeTransition;
};

console.log("She runs.");