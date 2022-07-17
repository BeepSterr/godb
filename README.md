# godb
A Database Interaction Core Kindof (DICK)

no, it's not for go. it's js.

![](https://i.imgur.com/7ihmQW2.png)



## Model Example
```js
const Storable = require("godb").storable;
const moment = require("moment");

module.exports = class Cooldown extends Storable {

    constructor() {
        super();
    }

    static get table(){
        return 'cooldowns';
    }

    static async hasCooldown(user, action) {

        let results = await global.db.loadBy(Cooldown, [
            {field: 'user_id', operator: db.COMPARE.EQUALS, value: user},
            {field: 'expires', operator: db.COMPARE.GREATER_THAN, value: new moment().toDate()}
        ], false);

        return results.size !== 0;
    }

    /**
     * @param Connector godb.Connector
     * @returns {[{field: string, name: string, type: *, nullable: ?boolean, references: ?Storable, reference_field: ?String, primary: ?Boolean}]}
     */
    static defineColumns(Connector){
        return [
            { name: 'user_id', field: 'user_id',type: Connector.types.string },
            { name: 'expires', field: 'expires',type: Connector.types.date, nullable: false, default: new Date() },
            ... Storable.defineColumns(Connector)];
    }

    #user_id;
    get user_id(){
        return this.#user_id;
    }

    set user_id(v){
        this.changed = true;
        this.#user_id = v;
    }

    #expires;
    get expires(){
        return this.#expires;
    }

    set expires(v){
        this.changed = true;
        if(moment.isMoment(v)){
            this.#expires = v.toDate();
        }else{
            this.#expires = new moment(v).toDate();
        }
    }
}
```

## Initialization
```js
async function dbInit(){

    const dbdriver = require('godb').mysql;
    global.db = new dbdriver({
        client: 'mysql2',
        user: 'username',
        password: "pass",
        host: "host",
        port: "port",
        db: "database",
        ssl: true
    });
    
    await global.db.initStore(require('./models/cooldown'));

}
```
