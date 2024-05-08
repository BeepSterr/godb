import Connector from "./Base.js";
export default class BubblingConnector extends Connector {

    #connectors;

    constructor(opts){
        super();
        this.#connectors = opts.connectors ?? [];
    }


    async get(Model, Id, deleted = false){

        for(let connector of this.#connectors){
            let result = await connector.get(Model, Id, deleted);
            if(result && !result.new){
                return result;
            }
        }
        return new Model();
    }

}