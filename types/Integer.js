import Type from "../utilities/Type.js";

export default class DbInteger extends Type {

    /**
     * @param value {number}
     * @returns {number}
     */
    shrink(value){
        if(value instanceof Number){
            return Math.trunc(value);
        }else{
            return Math.trunc(Number(value));
        }
    }

    /**
     * @param value {number}
     * @returns {number}
     */
    expand(value) {
        return Math.trunc(Number(value));
    }
}