import axios from "axios";

/**
 * Knack API communication
 * @type {Object}
 */
const KnackAPI = {

    /**
     * returns a promise from axios
     * @returns {Promise}
     */
    createInstance () {
        return axios.create({
            baseURL: "https://api.knack.com/v1/objects/",
            timeout: 8000,
            headers: {
                "X-Knack-Application-ID": "5ab05b45cc623a1bf0f39954",
                "X-Knack-REST-API-Key": "59e22c60-2be5-11e8-97e3-a3edf7ef457e",
                "content-type": "application/json"
            }
        });
    }
};

export default KnackAPI;