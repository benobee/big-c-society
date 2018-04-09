import Scrollmap from "scrollmap";
import controller from "./core/controller";
import PubSub from "./core/pubsub";

const Events = new PubSub();

/**
 * Main app closure. Handles both the Knack
 * and the site code.
 * @type {Object}
 */
const App = {

    /**
     * Initalizes specific methods for Knack
     * @memberOf App
     */
    initKnack () {
        this.memberController = controller.init();
    },

    /**
     * Initializes specific methods for the Squarespace site.
     * @memberOf App
     */
    initSite () {
        this.fixedNav();
    },

    /**
     * used in conjuction with scroll events
     * @returns {String} returns the position of the body
     */
    getTopPosition () {
        return document.querySelector("body").getBoundingClientRect().top;
    },

    /**
     * Used for binding scroll events and adding or removing
     * classes to adjust for the fixed nav.
     */
    fixedNav () {
        const header = document.querySelector(".Header-inner--bottom");
        let top = this.getTopPosition();

        window.addEventListener("scroll", () => {
            top = this.getTopPosition();

            if (top < -500) {
                header.classList.add("scroll-active");
            } else {
                header.classList.remove("scroll-active");
            }
        });
    }
};

// window load event
window.addEventListener("load", () => {
    App.initSite();
    Events.emit("window_loaded");
    Scrollmap.trigger({
        target: ".image-block-v2.design-layout-card",
        surfaceVisible: 0.5
    });
});

// Expose
window.EventBus = Events;
window.BigCApp = App;