import Connector from "../Base.js";
import Collection from "../../utilities/Collection.js";
import {Storable} from "../../index.js";
import {InvalidArgument, InvalidDataTypeError} from "../../utilities/Errors.js";

import DbString from "../../types/String.js";
import DbText from "../../types/Text.js";
import DbJson from "../../types/Json.js";
import DbInteger from "../../types/Integer.js";
import DbFloat from "../../types/Float.js";
import DbBoolean from "../../types/Boolean.js";
import DbDateTime from "../../types/DateTime.js";
import DbRelation from "../../types/Relation.js";
import {DateTime} from "luxon";

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
     * @param CreateTables
     */
    async initializeModels(models, CreateTables = true){
        await super.initializeModels(models);
        if(models[Symbol.iterator] && CreateTables){
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
        const instance = new Model();
        const columns = Model.defineColumns(this);

        for(let b = 0; b < columns.length;b++){

            const column = columns[b];

            // create base column type with limit if possible.
            let col = tableBuilder.specificType(column.name, this.types.get(column.type));

            column.nullable ? col.nullable() : col.notNullable();

            if(column.primary === true && !cc.includes(column.name)){
                col.primary()
            }

            // TODO: find a way to only add the index if it does not exist.
            // if(column.index){
            //     col.index(`idx${column.index}`);
            // }

            if(instance[column.name] !== undefined && column.default !== false){
                col.default(new Model()[column.name]);
            }

            // TODO: find a way to only add the index if it does not exist.
            // if(column.unique){
            //     col.unique();
            // }

            // TODO: find a way to only add the index if it does not exist.
            // if(column.references  && column.references.prototype instanceof Storable){
            //     col.references(`${column.references.table}.id`);
            // }

            // if exists alter
            if(cc.includes(column.name)){
                col.alter();
            }

        }

        return tableBuilder;
    }
    deletedColumn(Model){
        return Model.defineColumns(this).find(c => c.field === 'deleted');
    }

    /** @returns {Promise<Storable>} */
    async get(Model, Id, deleted = false){

        let deletedColumn = this.deletedColumn(Model);
        const filter = {
            id: Id,
        }

        if(!deleted && deletedColumn){
            filter[deletedColumn.name] = 0
        }

        const col = await this.connection.table(Model.table).where(filter).queryContext({ model: Model, db: this});
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
     * @param deleted
     * @returns Collection
     */
    async simpleSearch(Model, filter = [], limit = 100, offset = 0, countField = 'id', deleted = false){

        const countSplit = countField.split('|');
        let q = this.connection.table(Model.table).limit(limit).offset(offset).orderBy(countSplit[0], countSplit[1]).queryContext({ model: Model, db: this});

        filter.forEach( w => {
            q = q.andWhere(w.field, w.operator, w.value);
        });

        if(!deleted){
            q = q.andWhere('deleted', '=', 0);
        }

        return q;
    }

    /**
     *
     * @param Model Storable
     * @param filter [{{field: String, operation: String, value: *}}]
     * @param deleted
     * @returns Collection
     */
    async count(Model, filter = [], deleted = false){
        let q = this.connection.table(Model.table);
        filter.forEach( w => {
            q = q.andWhere(w.field, w.operator, w.value);
        })
        if(!deleted){
            q = q.andWhere('deleted', '=', 0);
        }
        return q.count();
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

        if(!force){
            const isChanged = await object.changed;
            if(!isChanged) return false;
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
            if(!this.types.has(cc.type)){
                throw new InvalidDataTypeError(cc.type.constructor.name);
            }

            let type = new cc.type(this);
            newValues[cc.name] = await type.shrink(object[cc.name]);
        }

        if(!object.new){

            // update records
            await this.connection.table(object.constructor.table)
                .where({ id: object.id })
                .update(newValues);
        }else{

            // create ID
            if(object.id === null){
                newValues['id'] = await object.constructor.generateID();
                object.id = newValues['id'];
            }

            // create record
            await this.connection.table(object.constructor.table)
                .insert(newValues);

            object.new = false;
        }

        const columns = object.constructor.defineColumns(this);

        for(let cid in columns){
            let column = columns[cid];
            object._ogstate[column.name] = object[column.name];
        }

        if(object.afterSave && typeof object.afterSave === 'function'){
            await object.afterSave();
        }

        return true;

    }

}
