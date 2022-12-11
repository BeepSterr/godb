import {InvalidDataTypeError} from "./errors.js";

export default class Type {

    db = null;

    constructor(db) {
        this.db = db;
    }

    shrink(){
        throw new InvalidDataTypeError(this.constructor.name);
    }

    expand(){
        throw new InvalidDataTypeError(this.constructor.name);
    }

}