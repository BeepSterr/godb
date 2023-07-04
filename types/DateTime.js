import Type from "../utilities/Type.js";
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

        if(value instanceof String && (DateTime.fromISO(value).isValid || DateTime.fromSQL(value).isValid)){
            return value;
        }

        return null;

    }

    /**
     * @param value {string}
     * @returns {DateTime}
     */
    expand(value) {
        if(typeof value === 'string' && DateTime.fromISO(value).isValid){
            return DateTime.fromISO(value);
        }

        if(typeof value === 'string' && DateTime.fromSQL(value).isValid){
            return DateTime.fromSQL(value);
        }

        let date = new Date(value);
        if(date instanceof Date && !isNaN(date)){
            return DateTime.fromJSDate(date);
        }
    }
}