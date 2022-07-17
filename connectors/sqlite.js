const Knex = require('knex');
const Path = require('path');
const Collection = require("../utilities/Collection");
const Sqlbased = require("./Sqlbased");

module.exports = class Sqlite extends Sqlbased {

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