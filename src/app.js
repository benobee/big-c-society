import Controller from "./core/controller";

const App = {
    init () {
        this.blog = new Controller("blog", {
            el: ".blog",
            rendered (el) {
                // run code
                console.log("hello blog", el);
            }
        });
    }
};

document.addEventListener("DOMContentLoaded", () => {
    App.init();
});