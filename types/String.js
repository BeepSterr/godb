import Type from "../utilities/Type.js";

export default class DbString extends Type {

    /**
     *
     * @param value {string}
     * @returns {string}
     */
    shrink(value){

        if(value === null || value === undefined){
            return null;
        }

        if(value.toString !== undefined){
            return value.toString();
        }

        return String(value)
    }

    /**
     * @param value {string}
     * @returns {string}
     */
    expand(value) {
        return String(value);
    }
}