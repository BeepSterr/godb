export class InvalidArgument extends Error {
    constructor(model, type){
        super();
        this.name = this.constructor.name;
        this.message = `Argument not a valid ${type}`;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class IllegalModification extends Error {
    constructor(model, field){
        super();
        this.name = this.constructor.name;
        this.message = `Invalid operation on field ${field} in ${model}`;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class InvalidConnector extends Error {
    constructor(model){
        super();
        this.name = this.constructor.name;
        this.message = `Tried to initialize model ${model.table} using base Connector.`;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class InvalidCollectionEntry extends Error {
    constructor(data){
        super();
        this.name = this.constructor.name;
        this.message = `Tried to add object to Collection that is not of the Collections type! (${data.name})`;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class InvalidCollectionType extends Error {
    constructor(type){
        super();
        this.name = this.constructor.name;
        this.message = `Tried to use a non-class as collection type (${type})`;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class InvalidDataTypeError extends Error {
    constructor(type){
        super();
        this.name = this.constructor.name;
        this.message = `Tried to use a invalid type, or type not supported (${type})`;
        Error.captureStackTrace(this, this.constructor);
    }
}