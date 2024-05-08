import SqlBased from "./Sqlbased.js";
import {default as Knex} from "knex";

export default class Mysql extends SqlBased {

    constructor(opts) {
        super();
        this.createDatabase(opts);
    }

    createDatabase(opts){

        if(!opts.rawOptions){
            opts.rawOptions = {};
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
            ...opts.rawOptions
        });

        if(typeof opts.slowQueryLogger === 'function'){
            const slowQueryThreshold = opts.slowQueryThreshold || 200; // milliseconds

            console.debug('Enabling slow query logger with a threshhold of', slowQueryThreshold)

            this.connection.on('query', (query) => {
                query.startTime = Date.now(); // Record the start time of the query
            });

            this.connection.on('query-response', (response, query) => {
                const duration = Date.now() - query.startTime; // Calculate the duration
                if (duration > slowQueryThreshold) {
                    opts.slowQueryLogger(query.query, duration);
                }
            });
        }

    }

}