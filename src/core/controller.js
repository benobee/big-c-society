import PubSub from "./pubsub";
import axios from "axios";
import KnackAPI from "./knackAPI";

/**
 * creates the axios promise
 * @type {Promise}
 */
const axiosInstance = KnackAPI.createInstance();
const Events = new PubSub();

/**
 * all methods, data related to members
 * @type {Object}
 */
const memberController = {
    /**
     * Initialize the controller
     * @memberOf memberController
     * @returns {Object}
     */
    init () {
        this.email = this.getQueryParametersByName("email");
        this.subscriptions();
        this.actions();
        return this;
    },

    /**
     * Looks for the register account page. If there are
     * paramaters in the email then it will emit a
     * pub sub event
     * @memberOf memberController
     */
    actions () {
        const registerAccount = document.getElementById("collection-5ab4283a70a6ad6a9cade23f");

        if (registerAccount && this.email) {
            Events.emit("query_params_found", this.email);
        }
    },

    /**
     * All the subcriptions for the app. Executed
     * like this for organization.
     * @memberOf memberController
     */
    subscriptions () {
        Events.on("query_params_found", () => {
            // find a member in the database from query param email
            this.checkIfSubscribed();
        });
        Events.on("subscription_found", (data) => {
            this.updateMember(data.id, {
                field_311: "ACTIVE_PAID"
            });
            const password = document.getElementById("password");
            const email = document.getElementById("email");
            const button = document.querySelector(".kn-button.is-primary");

            password.autocomplete = "off";
            email.auocomplete = "off";
            document.querySelector(".login_form.control").reset();
            email.value = this.email;
            password.value = "Z:_5gt!+q#XH";
            button.value = "Continue";
            button.classList.add("show");
        });
    },

    /**
     * Looks at the search query in the url to
     * extract an email. This is tested in in two ways.
     * Looks to see if the account is subscribed as well
     * as if the account exists at all.
     * @memberOf memberController
     */
    checkIfSubscribed () {
        const subscribed = axiosInstance({
            url: `/object_6/records?filters=[{"field":"field_307", "operator":"is", "value":"${this.email}"}]`,
            method: "get"
        });
        const accountExists = axiosInstance({
            url: `/object_17/records?filters=[{"field":"field_128", "operator":"is", "value":"${this.email}"}]`,
            method: "get"
        });

        axios.all([subscribed, accountExists])
            .then(axios.spread((subsc, acct) => {
                Events.emit("subscription_found", acct.data.records[ 0 ]);
            }))
            .catch((error) => {
                console.log(error);
            });
    },

    /*
     * Updates the member based on certain criteria
     * @param  {String]}   id       [description]
     * @param  {Object}   data     [description]
     * @param  {Function} callback [description]
     * @returns {Promise}            [description]
     */
    updateMember (id, data, callback) {
        const request = axiosInstance({
            url: `/object_17/records/${ id}`,
            method: "put",
            data,
        }).then(() => {
            if (callback) {
                callback();
            }
        }).catch((error) => {
            if (callback) {
                callback();
            }
            console.log(error);
        });

        return request;
    },

    /*
     * Looks at the search query and a key
     * and return a value based on that key.
     * @param  {String} name
     * @param  {String} url
     * @memberOf memberController
     * @returns {String}
     */
    getQueryParametersByName (name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[[\]]/g, "\\$&");
        const regex = new RegExp(`[?&]${ name }(=([^&#]*)|&|#|$)`);
        const results = regex.exec(url);

        if (!results) {
            return null;
        }
        if (!results[ 2 ]) {
            return "";
        }
        return decodeURIComponent(results[ 2 ].replace(/\+/g, " "));
    }
};

export default memberController;