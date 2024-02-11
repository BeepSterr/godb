import {IllegalModification} from "./Errors.js";;
import DbString from "../types/String.js";
import DbDateTime from "../types/DateTime.js";
import DbBoolean from "../types/Boolean.js";
import Stub from "./Stub.js";

export default class Storable {

    static get table(){
        return 'model';
    }

    _ogstate = {};

    #connector;

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

    new = true;

    /**
     * @deprecated
     * @param v
     */
    set changed(v){
        console.warn("Deprecated: Storable.changed is deprecated, change tracking is now automatic. Force-save using db.save(object, true))");
    }

    get changed(){

        return new Promise(async (resolve, reject) => {

            const columns = this.constructor.defineColumns(this.#connector);

            for(let cid in columns){
                let column = columns[cid];

                const parser = new column.type(this.#connector);
                let original = await parser.shrink(this._ogstate[column.field]);
                let current = await parser.shrink(this[column.field]);

                if(original !== current){
                    resolve(true);
                }
            }

            resolve(false);

        });
    }

    #id = null;
    get id(){
        return this.#id;
    }

    set id(v){
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
        this.#createdon = v;
    }

    #updatedon = null;
    get updatedon(){
        return this.#updatedon;
    }

    set updatedon(v){
        this.#updatedon = v;
    }


    #deleted = 0;
    get deleted(){
        return this.#deleted;
    }

    set deleted(v){
        if(v !== this.#deleted){
            this.#deleted = !!v;
        }
    }


    static async fromResultSet(resultSet, Connector){

        let x = new this;
        x.new = false;

        x.#connector = Connector;
        const columns = this.defineColumns(Connector);

        for(let cid in columns){
            let column = columns[cid];
            const expander = new column.type(Connector);
            x[column.field] = await expander.expand(resultSet[column.name]);
            x._ogstate[column.field] = await expander.expand(resultSet[column.name]);
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