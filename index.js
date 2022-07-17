module.exports = {

    connection: false,
    setConnection: function(c){
        if(c instanceof require('./connectors/base')){
            this.connection = c;
        }else{
            throw new Error('Connection can only be set to instance of baseConnector')
        }
    },

    storable: require('./utilities/Storable'),
    collection: require('./utilities/Collection'),

    baseConnector: require('./connectors/Base'),
    sqlbased: require('./connectors/Sqlbased'),
    sqlite: require('./connectors/Sqlite'),
    mysql: require('./connectors/Mysql'),
}