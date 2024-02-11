import {Storable} from "../index.js";
import DbString from "../types/String.js";

export default class User extends Storable {

    static get table(){
        return 'users';
    }


    /**
     *
     * @param Connector ../base.js
     * @returns {[{field: string, name: string, type: *, nullable: ?boolean, references: ?Storable, reference_field: ?String, primary: ?Boolean}]}
     */
    static defineColumns(Connector){
        return [
            { name: 'username', field: 'username', type: DbString, primary: false },
            ...super.defineColumns(Connector)
        ];
    }

    #username;
    get username(){
        return this.#username;
    }

    set username(v){
        this.#username = v;
    }

    #email;
    get email(){
        return this.#email;
    }

    set email(v){
        this.#email = v;
    }

}