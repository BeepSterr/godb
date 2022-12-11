import Type from "../utilities/type.js";
import { DateTime } from "luxon";

export default class DbDateTime extends Type {

    /**
     *
     * @param value {DateTime}
     * @returns {string}
     */
    shrink(value){
        if(value instanceof DateTime) {
            return value.toISO();
        }

        if(value instanceof Date){
            return DateTime.fromJSDate(value).toISO();
        }

        if(value instanceof String && DateTime.fromISO(value).isValid){
            return value;
        }

        return null;

    }

    /**
     * @param value {string}
     * @returns {DateTime}
     */
    expand(value) {
        return DateTime.fromISO(value);
    }
}