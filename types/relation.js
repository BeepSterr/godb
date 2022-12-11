import Type from "../utilities/type.js";
import {Storable} from "../index.js";
import {InvalidDataTypeError} from "../utilities/errors.js";
import Stub from "../utilities/stub.js";

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