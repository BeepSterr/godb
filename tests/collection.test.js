/*

    TODO: Fix tests when jest supports es6 properly.

 */

import {Collection} from '../index.js';
import User from "./User.js"
import {describe, test, expect} from '@jest/globals';

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