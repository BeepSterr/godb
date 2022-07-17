
    const User = require("./tests/User");

    const godb = require('./index');
    const db = new godb.mysql({
        client: 'mysql2',
        user: 'godb',
        password: "Cv4LMjo8f00aCPU3",
        host: "kube-db-do-user-9376401-0.b.db.ondigitalocean.com",
        port: "25060",
        db: "godb-test",
        ssl: true
    });

    async function run(){

        await db.initStore(User);

        db.getByField(User, 'username','testy').then(r => {
            let result = r.first;
            console.log(result.toString());
        });
    }

    run();
