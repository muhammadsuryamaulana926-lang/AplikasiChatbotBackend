const mysql = require('mysql2/promise');
async function test() {
    try {
        const conn = await mysql.createConnection({host:'localhost',user:'root',password:'',database:'itb_db'});
        const [rows] = await conn.execute("SELECT inventor FROM kekayaan_intelektual WHERE inventor LIKE '%Pekik%' LIMIT 5");
        console.log('Pekik:', rows);
        const [rows2] = await conn.execute("SELECT inventor FROM kekayaan_intelektual WHERE inventor LIKE '%Argo%' LIMIT 5");
        console.log('Argo:', rows2);
        await conn.end();
    } catch (e) {
        console.error(e);
    }
}
test();
