import {IllegalModification} from "./errors.js";;
import DbString from "../types/string.js";
import DbDateTime from "../types/datetime.js";
import DbBoolean from "../types/boolean.js";
import Stub from "./stub.js";

export default class Storable {

    static get table(){
        return 'model';
    }

    static generateID(){

        const now = Math.floor(new Date().getTime() / 100).toString(36);
        const node = process.pid.toString(36);

        const rnd1 = Math.floor(Math.random() * 10000000000).toString(36);
        const rnd2 = Math.floor(Math.random() * 10000000000000).toString(36);
        const rnd3 = Math.floor(Math.random() * 10000000000).toString(36);

        return `${now}-${node}-${rnd1}-${rnd2}-${rnd3}`;
    }

    static get idType(){
        return DbString;
    }

    /**
     *
     * @param Connector ../base.js
     * @returns {[{field: string, name: string, type: *, nullable: ?boolean, references: ?Storable, reference_field: ?String, primary: ?Boolean}]}
     */
    static defineColumns(Connector){
        return [
            { name: 'id', field: 'id',type: this.idType, primary: true },
            { name: 'createdon', field: 'createdon',type: DbDateTime },
            { name: 'updatedon', field: 'updatedon',type: DbDateTime },
            { name: 'deleted', field: 'deleted',type: DbBoolean, nullable: false},
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
            throw new IllegalModification(this, 'id');
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
            const expander = new column.type(Connector);
            x[column.field] = await expander.expand(resultSet[column.name]);
        }

        return x;
    }

    toRelation(){
        return `{${this.constructor.table}/${this.id}}`
    }

    toString(){
        return `{${this.constructor.name}/${this.id}}`
    }

}