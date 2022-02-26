const Knex = require('knex');
const Path = require('path');
const Connector = require('./base');
const Storable = require("../utilities/storable");
const {InvalidArgumentError} = require("../utilities/errors");
const Collection = require("../utilities/collection");
const Sqlite = require("./Sqlbased");

module.exports = class Mysql extends Sqlite {

    constructor(opts) {
        super();
        this.createDatabase(opts);
    }

    createDatabase(opts){
        this.connection = new Knex({
            client: opts.client || 'mysql',
            connection: {
                host : opts.host,
                port : opts.port || 3306,
                user : opts.user,
                password : opts.password,
                database : opts.db
            },
            useNullAsDefault: true,
            postProcessResponse: (result, queryContext) => {

                if(!queryContext){
                    return result;
                }

                if (Array.isArray(result)) {
                    let list = new Collection(queryContext);
                    result.forEach( res => {
                        const obj = queryContext.fromResultSet(res)
                        list.set(obj.id, obj);
                    });
                    return list;
                } else {
                    return queryContext.fromResultSet(result);
                }
            }
        });

    }

}