import SqlBased from "./Sqlbased.js";
import {default as Knex} from "knex";

export default class Mysql extends SqlBased {

    constructor(opts) {
        super();
        this.createDatabase(opts);
    }

    createDatabase(opts){

        let extraOptions = {};
        if(typeof opts.onSlowQuery === 'function'){
            extraOptions = {
                debug: true, // Enable debug to potentially catch more detailed info
                log: {
                    debug(message) {
                        if (message.sql) {
                            const queryStartTime = process.hrtime.bigint(); // Get start time in nanoseconds
                            this.connection.raw(message.sql, message.bindings).then(() => {
                                const queryEndTime = process.hrtime.bigint(); // Get end time in nanoseconds
                                const queryDuration = Number(queryEndTime - queryStartTime) / 1e6; // Convert to milliseconds
                                if (queryDuration > 200) { // Define your threshold for slow queries
                                    opts.onSlowQuery(message.sql, queryDuration)
                                }
                            }).catch(console.error);
                        }
                    }
                }
            }
        }


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
            postProcessResponse: this.sqlCollectionBuilder,
            ...extraOptions
        });

    }

}