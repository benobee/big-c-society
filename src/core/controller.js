const controller = (controllerName, config) => {

    /**
     * Tests whether the node is active in the DOM
     * @param  {String} query query selector
     * @returns {Object}       DOM Node
     */
    const elementIsActive = (query) => {
        const el = document.querySelector(query);

        if (!el) {
            return false;
        }
        config.rendered(el);
        return el;
    };

    return {
        el: elementIsActive(config.el)
    };
};

export default controller;