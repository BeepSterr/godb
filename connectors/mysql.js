const Knex = require('knex');
const Path = require('path');
const Connector = require('./base');
const Storable = require("../storable");
const {InvalidArgumentError} = require("../errors");

module.exports = class MySql extends Connector {

    #connection;

    // Types used by the database
    types = {
        id: 'VARCHAR(255)',
        string: 'VARCHAR(255)',
        text: 'TEXT',
        int: 'INTEGER',
        boolean: 'BOOLEAN',
        date: 'DATETIME'
    }

    /*
    TODO: Add proper data validators, these are placeholders
     */
    validators = {
        string: async function(input){
            return String(input);
        },
        text: async function(input){
            return String(input);
        },
        id: async function(input){
            return String(input);
        },
        int: async function(input){
            return Number(input).toFixed(0);
        },
        boolean: async function(input){
            return !!input;
        },
        datetime: async function(input){
            if(input instanceof Date){
                return input;
            }else{
                return new Date(input);
            }
        },
    }

    constructor(config){
        super();

        this.#connection = new Knex({
            client: 'mysql',
            connection: {
                host : config.host,
                port : config.port,
                user : config.user,
                password : config.password,
                database : config.database
            }
        });

        this.#test();
    }

    async #test(){
        return await this.#connection.raw('SELECT 1+1')['1+1'] === 2;
    }


    /**
     *
     * @param Model ../storable.js
     * @returns {Promise<void>}
     */
    initStore(Model){

        console.log(`Store initialization for ${Model.table}`)

        let me = this;
        this.#connection.schema.hasTable(Model.table).then(function(success){
            if(!success){
                me.#createTableSchema(Model);
            }else{
                me.#updateTableSchema(Model);
            }
        })

    }

    /**
     *
     * @param Model ../storable.js
     */
    async #createTableSchema(Model){
        let me = this;
        return this.#connection.schema.createTable(`${Model.table}`, async function (table) {
            table = me.buildTable(Model, table, [], false);
            return table;
        });
    }

    /**
     *
     * @param Model ../storable.js
     */
    async #updateTableSchema(Model){
        let me = this;
        let createdColumns = await this.getCreatedColumns(Model);

        return this.#connection.schema.table(`${Model.table}`, async function (table) {
            table = me.buildTable(Model, table, createdColumns, true);
            return table;
        })
    }

    async getCreatedColumns(Model){

        const columns = Model.defineColumns(this);

        let cc = [];
        for(let b = 0; b < columns.length;b++){
            const column = columns[b]
            let exists = await this.#connection.schema.hasColumn(Model.table, column.name);
            if(exists){
                cc.push(column.name);
            }
        }

        return cc;

    }

    async buildTable(Model, tableBuilder, cc, isUpdate){

        const columns = Model.defineColumns(this);

        for(let b = 0; b < columns.length;b++){

            const column = columns[b]

            // create base column type with limit if possible.
            let col = tableBuilder.specificType(column.name, column.type);

            column.nullable ? col.nullable() : col.notNullable();

            if(column.primary === true){
                col.primary();
            }

            if(column.index){
                col.index(`x${column.index}`);
            }

            if(column.references  && column.references.prototype instanceof Storable){

                let ref_field = column.reference_field;
                if(!column.reference_field){
                    ref_field = 'id';
                }

                col.references(`${column.references.table}.${ref_field}`);
            }

            // if exists alter
            if(cc.includes(column.name)){
                col.alter();
            }

        }

        return tableBuilder;
    }

    /**
     *
     * @param Model ../storable.js
     * @param filter {{field: String, operation: String, value: *}}
     * @param limit Number
     * @returns {AsyncGenerator<*, void, *>}
     */
    async *search(Model, filter, limit){



    }

    /**
     *
     * @param object Storable
     * @returns {Promise<void>}
     */
    async save(object){

        if(!(object instanceof Storable)){
            throw new InvalidArgumentError();
        }

        const Model = object.prototype;

    }

}