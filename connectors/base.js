const {InvalidConnectorException} = require("../errors");
module.exports =  class Connector {

    #connection;

    types = {}
    validators = {}

    async initStore(input){
        /*
            If you're reading this you've accidentally imported the base Connector class instead of
            one based on your Database. Implementations can be found in the directory of this file.
         */
        throw new InvalidConnectorException(input);
    }

    async *search(Model, filter, group){
        throw new InvalidConnectorException(Model);
    }
    
    async save(object){
        throw new InvalidConnectorException(object);
    }

}
