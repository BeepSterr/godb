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

    async #test(){
        return false;
    }

    async *search(){
        throw new InvalidConnectorException();
    }

    async getByID(){
        throw new InvalidConnectorException();
    }

    async getByField(){
        throw new InvalidConnectorException();
    }

    async find(){
        throw new InvalidConnectorException();
    }

    async save(){
        throw new InvalidConnectorException();
    }

}
