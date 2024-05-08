export default class Stub {

    model = null
    id = null

    static get #rexp(){ return new RegExp(/{([A-z]*)\/([a-z0-9\-_]*)}/g) };

    /**
     *
     * @param db {Connector}
     * @param model {Storable}
     * @param id {string}
     */
    constructor(model, id){
        this.model = model;
        this.id = id;
    }

    static create(db, value){
        const parts = [...value.matchAll(this.#rexp)];
        return new this(db.getModel(parts[0][1]), parts[0][2]);
    }

    async fetch(db){
        return await db.get(this.model, this.id, false);
    }

    toRelation(){
        return `{${this.model.table}/${this.id}}`
    }
}

