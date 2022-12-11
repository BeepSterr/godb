import {InvalidConnector} from "../utilities/errors.js";

export default class Connector {

    /*
        This is the base Connector class, This class defines the API Connectors should implement.
        Please extend this class with your own connectors.
     */

    #connection;

    types = {}
    validators = {}
    expanders = {}

    get compare(){
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

    models = new Map();


    /**
     * Initialized a Storable object to be used in this connector
     * @returns boolean promise<boolean>
     * @param models [Storable]
     */
    async initializeModels(models){
        if(models[Symbol.iterator]){
            for (const model of models) {
                this.models.set(model.table, model)
            }
        }else{
            this.models.set(input.table, model)
        }
        return false;
    }

    /**
     * @param tablename {string}
     * @returns {Promise<void>}
     */
    getModel(tablename){
        return this.models.get(tablename);
    }

    /**
     * Loads a single Storable instance based on its ID
     * @returns {Promise<Store>}
     */
    async get(Store, id, deleted = false){
        console.warn('Tried to get object from base connector, this is not supported');
        return new Promise((resolve, reject) => { resolve(new Store()) });
    }

    /**
     * Loads a single Storable instance based on a single field
     * @returns {Promise<Collection>}
     */
    async getBy(Store, field, value, deleted = false){
        console.warn('Tried to get object from base connector, this is not supported');
        return this.get(Store, value, deleted);
    }

    /**
     * Loads a single Storable instance based on a single field
     * @returns {Promise<Collection>}
     */
    async find(Store, Where, deleted = false){
        console.warn('Tried to get object from base connector, this is not supported');
        return this.get(Store, Where, deleted);
    }

    /**
     * Deletes a instance of Storable
     * @param object {Storable}
     * @returns {Promise<unknown>}
     */
    async delete(object){
        object.setDeleted(true);
        return this.save(object);
    }

    async save(object){
        console.warn('Tried to save object to base connector, this is not supported');
        return new Promise((resolve, reject) => { reject(new InvalidConnector('Tried to save object to base connector, this is not supported')) });
    }

}
