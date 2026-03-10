const mysql = require("mysql2/promise");

async function check2019() {
    const config = {
        host: "localhost",
        port: 3306,
        database: "itb_db",
        user: "root",
        password: ""
    };

    try {
        const conn = await mysql.createConnection(config);
        const [rows] = await conn.execute("SELECT COUNT(*) as total FROM kekayaan_intelektual WHERE tgl_pendaftaran LIKE '%2019%' OR tgl_sertifikasi LIKE '%2019%'");
        console.log("Total for 2019:", rows[0].total);

        const [samples] = await conn.execute("SELECT tgl_pendaftaran, tgl_sertifikasi FROM kekayaan_intelektual LIMIT 5");
        console.log("Samples:", samples);

        await conn.end();
    } catch (e) {
        console.error(e);
    }
}

check2019();
