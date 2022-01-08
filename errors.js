
class InvalidArgumentError extends Error {
    constructor(model){
        super();
        this.name = this.constructor.name;
        this.message = `Tried to save object not based on Storable`;
        Error.captureStackTrace(this, this.constructor);
    }
}

class InvalidConnectorException extends Error {
    constructor(model){
        super();
        this.name = this.constructor.name;
        this.message = `Tried to initialize model ${model.table} using base Connector.`;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {
    InvalidArgumentError,
    InvalidConnectorException
}