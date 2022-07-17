const {IllegalModificationException} = require("./Errors");
module.exports = class Storable {

    static get table(){
        return 'model';
    }

    static generateID(){
        const { customAlphabet } = require('nanoid');
        const alphabet = '0123456789abcdefghjklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nanoid = customAlphabet(alphabet, 16);
        return nanoid();
    }

    static get idType(){
        return "string"
    }

    /**
     *
     * @param Connector ../base.js
     * @returns {[{field: string, name: string, type: *, nullable: ?boolean, references: ?Storable, reference_field: ?String, primary: ?Boolean}]}
     */
    static defineColumns(Connector){
        return [
            { name: 'id', field: 'id',type: Connector.types[this.idType], primary: true },
            { name: 'createdon', field: 'createdon',type: Connector.types.date },
            { name: 'updatedon', field: 'updatedon',type: Connector.types.date },
            { name: 'deleted', field: 'deleted',type: Connector.types.boolean, nullable: true},
        ];
    }

    #changed = false;
    set changed(v){
        this.#changed = !!v;
    }

    get changed(){
        return this.#changed;
    }

    #id = null;
    get id(){
        return this.#id;
    }

    set id(v){
        this.changed = true;
        if(this.#id !== null){
            throw new IllegalModificationException(this, 'id');
        }
        this.#id = v;
    }

    #createdon = null;
    get createdon(){
        return this.#createdon;
    }

    set createdon(v){
        this.changed = true;
        this.#createdon = v;
    }

    #updatedon = null;
    get updatedon(){
        return this.#updatedon;
    }

    set updatedon(v){
        this.changed = true;
        this.#updatedon = v;
    }


    #deleted = false;
    get deleted(){
        return this.#deleted;
    }

    set deleted(v){
        if(v !== this.#deleted){
            this.changed = true;
            this.#deleted = !!v;
        }
    }

    static async fromResultSet(resultSet, Connector){

        let x = new this;
        const columns = this.defineColumns(Connector);

        for(let cid in columns){
            let column = columns[cid];
            if(column && column.type){
                x[column.field] = await column.type.expander(resultSet[column.name]);
            }
        }

        return x;
    }

    toString(){
        return `{${this.constructor.name}/${this.id}}`
    }

}