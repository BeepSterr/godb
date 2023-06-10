# Writing Connectors

yes hello if you read this stop, this document is mainly for myself so I don't create inconsistencies in the codebase

### Da Rulez
- All connectors must extend the `Connector` class
- All connectors must at least implement the `get()` method
- All connectors must return `undefined` if the requested data does not exist in its scope.
- Methods that return multiple models must return a `Collection<Model>`
- Methods that are not implemented must not be defined so `Base` can throw an error if they are called.
