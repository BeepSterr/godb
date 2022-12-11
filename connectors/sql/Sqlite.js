import SqlBased from "./Sqlbased.js";
import {default as Knex} from "knex";
import * as Path from "path";

export default class Sqlite extends SqlBased {

    constructor() {
        super();
        this.createDatabase();
    }

    createDatabase(){
        this.connection = new Knex({
            client: 'sqlite3',
            connection: {
                filename: Path.join(process.cwd(), 'database.db'),
                flags: ['OPEN_URI', 'OPEN_SHAREDCACHE']
            },
            useNullAsDefault: true,
            postProcessResponse: this.sqlCollectionBuilder
        });

    }

}