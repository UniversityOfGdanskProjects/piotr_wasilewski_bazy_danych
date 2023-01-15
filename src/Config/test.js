const {session} = require('./db_connector.js');

const start = async () => {
    const result = await session.run('MATCH (n) RETURN n');
    result.records.forEach(record => {
        console.log(record);
    });
    }
start();