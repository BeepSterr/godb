module.exports = {

    storable: require('./utilities/storable'),
    collection: require('./utilities/collection'),

    baseConnector: require('./connectors/base'),
    sqlbased: require('./connectors/Sqlbased'),
    sqlite: require('./connectors/Sqlite'),
    mysql: require('./connectors/Mysql'),
}