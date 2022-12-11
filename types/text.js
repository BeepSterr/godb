import DbString from "../types/string.js";

/**
 * Added to support SQL "text" type
 * Doesn't do anything special, just extends String.
 */
export default class DbText extends DbString {

}