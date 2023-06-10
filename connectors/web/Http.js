import Connector from "../Base.js";
import Collection from "../../utilities/Collection.js";
import {Storable} from "../../index.js";
import {InvalidArgument, InvalidDataTypeError} from "../../utilities/Errors.js";
import {DateTime} from "luxon";

export default class Http extends Connector {

    #host;
    #headers;

    constructor(opts){

        super();

        this.#host = opts.host ?? '';
        this.#headers = opts.headers ?? {};

    }

    async #httpResultToCollection(result, Model){

            let collection = new Collection(Model);
            let data = await result.json();

            if(Array.isArray(data)){
                data.forEach( row => {
                    collection.add(Model.fromResultSet(row));
                })
                return collection;
            }else{
                return Model.fromResultSet(data);
            }

    }

    async #fetch(Model, action, value){

        let params = new URLSearchParams({
            model: Model.table,
            ttl: Model.ttl ?? 0,
            action: action,
            value: btoa(JSON.stringify(value))
        });

        console.log(this.#host + '?' + params.toString());
        let response = await fetch(this.#host + '?' + params.toString(), {
            headers: this.#headers
        });

        if(!response.ok){
            throw new Error('HTTP Error: ' + response.status);
        }

        return this.#httpResultToCollection(response, Model);

    }

    async get(Model, Id, deleted = false){
        return await this.#fetch(Model, 'get', Id);
    }

    /**
     * @param object Storable
     * @param force
     * @returns Promise
     */
    async save(object, force = false){

        if(!(object instanceof Storable)){
            throw new InvalidArgument(object, Storable);
        }

        if(!object.changed && !force){
            return false;
        }

        let newValues = {}
        const fields = object.constructor.defineColumns(this);

        // update internally managed fields
        object.updatedon = DateTime.now();
        if(!object.createdon){
            object.createdon = DateTime.now();
        }

        for(let field in fields){
            const cc = fields[field];
            let type = new cc.type(this);
            newValues[cc.name] = await type.shrink(object[cc.name]);
        }

        // create ID
        if(object.id === null){
            newValues['id'] = await object.constructor.generateID();
            object.id = newValues['id'];
        }

        await this.#fetch(object.constructor, 'set', {
            id: newValues['id'],
            values: newValues
        })

        if(object.afterSave && typeof object.afterSave === 'function'){
            await object.afterSave();
        }

        return true;

    }

}