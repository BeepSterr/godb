const Storable = require("../utilities/Storable");
module.exports = class User extends Storable {

    static get table(){
        return 'user';
    }


    /**
     *
     * @param Connector ../Base.js
     * @returns {[{field: string, name: string, type: *, nullable: ?boolean, references: ?Storable, reference_field: ?String, primary: ?Boolean}]}
     */
    static defineColumns(Connector){
        return [
            { name: 'username', field: 'username',type: Connector.types.string, primary: false },
            ...super.defineColumns(Connector)
        ];
    }

    #username;
    get username(){
        return this.#username;
    }

    set username(v){
        this.changed = true;
        this.#username = v;
    }

}