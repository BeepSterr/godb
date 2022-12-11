import Type from "../utilities/type.js";

export default class DbJson extends Type {

    /**
     *
     * @param value {Object}
     * @returns {string}
     */
    shrink(value){
        return JSON.stringify(value);
    }

    /**
     * @param value {string}
     * @returns {Object}
     */
    expand(value) {
        return JSON.parse(value);
    }
}