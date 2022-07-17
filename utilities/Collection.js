const {InvalidCollectionEntry, InvalidCollectionType} = require("./Errors");

module.exports = class Collection extends Map {

    #type = null

    constructor(type) {
        super();

        if(!type || !type.constructor){
            throw new InvalidCollectionType(type);
        }
        this.#type = type;
    }

    get first(){
        for (const [key, value] of this) {
            return value;
        }
    }

    get last(){
        const arr = this.toArray();
        return arr[arr.length - 1];
    }

    set(key, value){
        if(value instanceof this.#type){
            super.set(key, value);
        }else{
            throw new InvalidCollectionEntry(this.#type);
        }
    }

    toArray(){
        return [...this.values()];
    }

    toFeed(req){
        const data = [];
        this.toArray().forEach( item => {
            data.push(item.toFeed(req));
        })
        return data;
    }


}