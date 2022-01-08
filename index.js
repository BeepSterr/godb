module.exports = {
    storable: require('./storable'),
    baseConnector: require('./connectors/base'),
    sqlite: require('./connectors/sqlite'),
    mysql: require('./connectors/mysql'),
}