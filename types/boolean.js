import Type from "../utilities/type.js";

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