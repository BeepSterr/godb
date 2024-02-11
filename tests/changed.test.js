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

await test_sqlite.initializeModels([User, UserNote]);

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

        /** @type {User} */
        let user2 = await test_sqlite.get(User, user.id);
        expect(await user2.changed).toBe(false);
    });


    test('cleanup (not a real test)', async () => {
        test_sqlite.connection.destroy();
    });

});