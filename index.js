module.exports = {

    connection: false,
    setConnection: function(c){
        if(c instanceof require('./connectors/base')){
            this.connection = c;
        }else{
            throw new Error('Connection can only be set to instance of baseConnector')
        }
    },

    storable: require('./utilities/storable'),
    collection: require('./utilities/collection'),

    baseConnector: require('./connectors/base'),
    sqlbased: require('./connectors/Sqlbased'),
    sqlite: require('./connectors/Sqlite'),
    mysql: require('./connectors/Mysql'),
}