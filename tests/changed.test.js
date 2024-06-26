/*

    TODO: Fix tests when jest supports es6 properly.

 */

import {Collection, Sqlite} from '../index.js';
import User from "./User.js"
import {describe, test, expect} from '@jest/globals';
import UserNote from "./UserNote.js";

let test_sqlite = new Sqlite({
    path: './test.db'
});

const models = [User, UserNote];

// reset db
for( let model of models){
    await test_sqlite.connection.schema.dropTable(model.table);
}

await test_sqlite.initializeModels([User, UserNote], true);

describe('Storable Changed', () => {

    test('New instance', async () => {
        let user = new User();
        expect(await user.changed).toBe(false);
    });

    test('Changing data', async () => {
        let user = new User();
        user.username = 'Someone';
        expect(await user.changed).toBe(true);
    });

    test('Is Field Changed', async () => {
        let user = new User();
        user.username = 'Someone';
        user.email = user.email;
        expect(await user.isFieldChanged('username')).toBe(true);
        expect(await user.isFieldChanged('email')).toBe(false);
    });

    test('After Save', async () => {
        let user = new User();
        user.username = 'Someone';
        await test_sqlite.save(user);
        expect(await user.changed).toBe(false);
    });

    test('After Save Change', async () => {
        let user = new User();
        user.username = 'Someone';
        await test_sqlite.save(user);
        user.username = 'Someone else';
        expect(await user.changed).toBe(true);
    });

    test('Fetched Instance', async () => {
        let user = new User();
        user.username = 'Someone';
        await test_sqlite.save(user);
        let user2 = await test_sqlite.get(User, user.id);
        expect(await user2.changed).toBe(false);
    });


    test('cleanup (not a real test)', async () => {
        test_sqlite.connection.destroy();
    });

});