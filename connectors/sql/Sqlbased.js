import Connector from "../base.js";
import Collection from "../../utilities/collection.js";
import {Storable} from "../../index.js";
import {InvalidArgument, InvalidDataTypeError} from "../../utilities/errors.js";

import DbString from "../../types/string.js";
import DbText from "../../types/text.js";
import DbJson from "../../types/json.js";
import DbInteger from "../../types/integer.js";
import DbFloat from "../../types/float.js";
import DbBoolean from "../../types/boolean.js";
import DbDateTime from "../../types/datetime.js";
import DbRelation from "../../types/relation.js";

export default class SqlBased extends Connector {

    connection;

    // Types used by the database

    types = new Map();

    async sqlCollectionBuilder(result, queryContext){
        if (!queryContext) {
            return result;
        }

        if (Array.isArray(result)) {
            let list = new Collection(queryContext.model);
            for (const res of result) {
                const obj = await queryContext.model.fromResultSet(res, queryContext.db);
                list.set(obj.id, obj);
            }
            return list;
        } else {
            return await queryContext.model.fromResultSet(result, queryContext.db);
        }
    }

    constructor(){
        super();

        this.types.set(DbRelation, 'VARCHAR(255)');
        this.types.set(DbString, 'VARCHAR(255)');
        this.types.set(DbText, 'TEXT');
        this.types.set(DbJson, 'JSON');
        this.types.set(DbInteger, 'INTEGER');
        this.types.set(DbFloat, 'FLOAT');
        this.types.set(DbBoolean, 'BOOLEAN');
        this.types.set(DbDateTime, 'DATETIME');

    }

    createDatabase(){
        //this.connection = new Knex();
    }

    /**
     * @returns {Promise<void>}
     * @param models
     */
    async initializeModels(models){
        await super.initializeModels(models);
        if(models[Symbol.iterator]){
            for (const model of models) {
                await this.initStore(model);
            }
        }else{
            await this.initStore(models);
        }
    }

    /**
     * @param Model ../storable.js
     * @returns {Promise<void>}
     */
    async initStore(Model){

        return new Promise( async (resolve, reject) => {
            let me = this;
            this.connection.schema.hasTable(Model.table).then(async function(success){
                if(!success){
                    await me.#createTableSchema(Model);
                }else{
                    await me.#updateTableSchema(Model);
                }
                resolve(true);
            });
        });


    }
    /**
     *
     * @param Model ../storable.js
     */
    async #createTableSchema(Model){
        let me = this;
        return this.connection.schema.createTable(`${Model.table}`, async function (table) {
            return me.buildTable(Model, table, [], false);
        });
    }
    /**
     *
     * @param Model ../storable.js
     */
    async #updateTableSchema(Model){
        let me = this;
        let createdColumns = await this.getCreatedColumns(Model);

        return this.connection.schema.table(`${Model.table}`, function (table) {
            return me.buildTable(Model, table, createdColumns, true);
        })
    }
    async getCreatedColumns(Model){

        const columns = Model.defineColumns(this);

        let cc = [];
        for(let b = 0; b < columns.length;b++){
            const column = columns[b]
            let exists = await this.connection.schema.hasColumn(Model.table, column.name);
            if(exists){
                cc.push(column.name);
            }
        }

        return cc;

    }
    async buildTable(Model, tableBuilder, cc, isUpdate){
        const columns = Model.defineColumns(this);

        for(let b = 0; b < columns.length;b++){

            const column = columns[b];

            // create base column type with limit if possible.
            let col = tableBuilder.specificType(column.name, this.types.get(column.type));

            column.nullable ? col.nullable() : col.notNullable();

            if(column.primary === true && !cc.includes(column.name)){
                col.primary()
            }

            if(column.index){
                col.index(`idx${column.index}`);
            }

            const t = new Model();
            if(t[column.name] !== undefined){
                col.default(new Model()[column.name]);
            }

            if(column.references  && column.references.prototype instanceof Storable){
                col.references(`${column.references.table}.id`);
            }

            // if exists alter
            if(cc.includes(column.name)){
                col.alter();
            }

        }

        return tableBuilder;
    }

    async get(Model, Id, deleted = false){
        const col = await this.connection.table(Model.table).where({
            id: Id,
            deleted: deleted ? 1 : 0
        }).queryContext({ model: Model, db: this});
        return col.first;
    }

    async getBy(Model, field, value, deleted = false){

        let where = {
            deleted: deleted ? 1 : 0
        };
        where[field] = value;
        return this.connection.table(Model.table).where(where).queryContext({ model: Model, db: this});
    }

    async find(Model, Where, deleted = false){

        let q = this.connection.table(Model.table).queryContext({ model: Model, db: this});
        if(!deleted){
            q = q.andWhere('deleted', 0);
        }
        Where.forEach( w => {
            q = q.andWhere(w.field, w.operator, w.value);
        })

        return q;

    }

    /**
     *
     * @param Model Storable
     * @param filter {{field: String, operation: String, value: *}}
     * @param limit Number
     * @param countField String
     * @returns {AsyncGenerator<*, void, *>}
     */
    async *search(Model, filter, limit, countField = 'updatedon'){

        let resultCount = Number(limit);
        let offset = 0;

        let queryResult;
        while(resultCount >= limit){

            queryResult = await this.connection.table(Model.table).where(filter).andWhere('updatedon', '>', offset).limit(limit).queryContext({ model: Model, db: this});
            resultCount = queryResult.length;
            if(resultCount > 0){
                offset = queryResult[resultCount-1].updatedon;
            }

            if(resultCount >= limit){
                yield {result: queryResult, currentOffset: offset, count: resultCount};
            }else{
                return {result: queryResult, currentOffset: offset, count: resultCount};
            }

        }

    }

    /**
     *
     * @param Model Storable
     * @param filter [{{field: String, operation: String, value: *}}]
     * @param limit Number
     * @param offset
     * @param countField String
     * @returns Collection
     */
    async simpleSearch(Model, filter = [], limit = 100, offset = 0, countField = 'id'){
        let q = this.connection.table(Model.table).limit(limit).offset(offset).queryContext({ model: Model, db: this});

        filter.forEach( w => {
            q = q.andWhere(w.field, w.operator, w.value);
        })

        return q;
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
        object.updatedon = new Date();
        if(object.createdon === null){
            object.createdon = new Date();
        }

        for(let field in fields){
            const cc = fields[field];
            if(!this.types.has(cc.type)){
                throw new InvalidDataTypeError(cc.type.constructor.name);
            }

            let type = new cc.type(this);
            newValues[cc.name] = await type.shrink(object[cc.name]);
        }

        if(object.id !== null){

            // update records
            await this.connection.table(object.constructor.table)
                .where({ id: object.id })
                .update(newValues);

            return true;


        }else{

            // create ID
            newValues['id'] = await object.constructor.generateID();
            object.id = newValues['id'];

            // create record
            await this.connection.table(object.constructor.table)
                .insert(newValues);

            return true;

        }

    }

}