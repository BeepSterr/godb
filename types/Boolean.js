import Type from "../utilities/Type.js";

export default class DbBoolean extends Type {

    /**
     *
     * @param value {boolean}
     * @returns {boolean}
     */
    shrink(value){
        return !!value;
    }

    /**
     * @param value {boolean}
     * @returns {boolean}
     */
    expand(value) {
        return !!value;
    }
}