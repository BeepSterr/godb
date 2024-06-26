import {Storable} from "../index.js";
import DbString from "../types/String.js";
import DbRelation from "../types/Relation.js";
import User from "./User.js";

export default class UserNote extends Storable {

    static get table(){
        return 'user_notes';
    }


    /**
     *
     * @param Connector ../Base.js
     * @returns {[{field: string, name: string, type: *, nullable: ?boolean, references: ?Storable, reference_field: ?String, primary: ?Boolean}]}
     */
    static defineColumns(Connector){
        return [
            { name: 'note', field: 'note', type: DbString, primary: false },
            { name: 'user', field: 'user', type: DbRelation, references: User },
            ...super.defineColumns(Connector)
        ];
    }

    #note = '';
    get note(){
        return this.#note;
    }

    set note(v){
        this.#note = v;
    }

    /** @type {User|Stub} */
    #user;
    get user(){
        return this.#user;
    }

    set user(v){
        this.#user = v;
    }

}