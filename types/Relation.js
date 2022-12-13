import Type from "../utilities/Type.js";
import {Storable} from "../index.js";
import {InvalidDataTypeError} from "../utilities/Errors.js";
import Stub from "../utilities/Stub.js";

/**
 * Added to support SQL "text" type
 * Doesn't do anything special, just extends String.
 */
export default class DbRelation extends Type {

    /**
     *
     * @param value
     */
    shrink(value){
        if(typeof value === 'string'){
            value = Stub.create(this.db, value);
        }

        if(value instanceof Storable || value instanceof Stub){
            return value.toRelation();
        }

        if(value === null || value === undefined){
            return null;
        }

        throw new InvalidDataTypeError(value);
    }

    /**
     * @param value
     * @returns {Stub}
     */
    expand(value) {
        return Stub.create(this.db, value);
    }

}