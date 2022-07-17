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
            postProcessResponse: async (result, queryContext) => {

                if (!queryContext) {
                    return result;
                }

                if (Array.isArray(result)) {
                    let list = new Collection(queryContext);
                    for (const res of result) {
                        const obj = await queryContext.fromResultSet(res, this);
                        list.set(obj.id, obj);
                    }
                    return list;
                } else {
                    return await queryContext.fromResultSet(result, this);
                }
            }
        });

    }

}