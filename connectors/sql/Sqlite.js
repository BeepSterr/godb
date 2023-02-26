import SqlBased from "./Sqlbased.js";
import {default as Knex} from "knex";
import * as Path from "path";

export default class Sqlite extends SqlBased {

    constructor(options) {
        super();
        this.createDatabase(options);
    }

    createDatabase(options){

        if(!options){
            options = {};
        }

        if(!options.path){
            options.path = Path.join(process.cwd(), 'database.db');
        }

        this.connection = new Knex({
            client: 'sqlite3',
            connection: {
                filename: options.path,
                flags: ['OPEN_URI', 'OPEN_SHAREDCACHE']
            },
            useNullAsDefault: true,
            postProcessResponse: this.sqlCollectionBuilder
        });

    }

}