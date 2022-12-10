import SqlBased from "./Sqlbased.js";
import {default as Knex} from "knex";

export default class Mysql extends SqlBased {

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
            postProcessResponse: this.sqlCollectionBuilder
        });

    }

}