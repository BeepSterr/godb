import Type from "../utilities/type.js";

export default class DbFloat extends Type {

    /**
     * @param value {number}
     * @returns {number}
     */
    shrink(value){
        if(value instanceof Number){
            return value;
        }else{
            return Number(value);
        }
    }

    /**
     * @param value {number}
     * @returns {number}
     */
    expand(value) {
        return Number(value);
    }
}