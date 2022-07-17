module.exports = {

    storable: require('./utilities/Storable'),
    collection: require('./utilities/Collection'),

    baseConnector: require('./connectors/Base'),
    sqlbased: require('./connectors/Sqlbased'),
    sqlite: require('./connectors/Sqlite'),
    mysql: require('./connectors/Mysql'),
}