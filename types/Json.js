import Type from "../utilities/Type.js";

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
        if(typeof value === 'object'){
            return value;
        }
        return JSON.parse(value);
    }
}