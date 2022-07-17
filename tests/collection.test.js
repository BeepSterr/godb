const Collection = require('../utilities/Collection');
const User = require("./User");

class CorrectType {
    static a = 0;
}
class WrongType {
    static a = 1;
}

describe('Collections', () => {

    test('instanceof self', () => {
        const x = new Collection(CorrectType);
        expect(x instanceof Collection).toBe(true);
    });

    test('Collection.first', () => {
        const x = new Collection(User);
        const y = new User(1);
        const z = new User(2);

        x.set(1, y);
        x.set(2, z);
        expect(x.first).toBe(y);
    });

    test('Collection.last', () => {
        const x = new Collection(User);
        const y = new User(1);
        const z = new User(2);

        x.set(1, y);
        x.set(2, z);
        expect(x.last).toBe(z);
    });

});