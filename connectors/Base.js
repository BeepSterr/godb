module.exports =  class Connector {

    /*
        This is the base Connector class, This class defines the API Connectors should implement.
        Please extend this class with your own connectors.
     */

    #connection;

    types = {}
    validators = {}

    get COMPARE(){
        return {
            NOT: '!=',
            EQUALS: '=',
            LIKE: 'like',
            IN: 'in',
            NOT_IN: 'in',
            GREATER_THAN: '>',
            SMALLER_THAN: '<',
        }
    }


    /**
     * Initialized a Storable object to be used in this connector
     * @returns boolean promise<boolean>
     * @param input [Storable]
     */
    async initializeModels(input){
        return false;
    }

    /**
     * Loads a single Storable instance based on its ID
     * @returns {Promise<Storable>}
     */
    async getById(Store, id){
        return new Store();
    }

    async save(object){
        return false;
    }

}
