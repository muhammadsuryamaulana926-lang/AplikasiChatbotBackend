const mysql = require('mysql2/promise');
async function test() {
    try {
        const conn = await mysql.createConnection({host:'localhost',user:'root',password:'',database:'itb_db'});
        const [rows] = await conn.execute("SELECT inventor FROM kekayaan_intelektual WHERE inventor LIKE '%Erika%' OR inventor LIKE '%Yuni%' LIMIT 5");
        console.log('Results:', JSON.stringify(rows, null, 2));
        await conn.end();
    } catch (e) {
        console.error(e);
    }
}
test();
