const mysql = require("mysql2/promise");

async function inspectData() {
    const config = { host: "localhost", port: 3306, database: "itb_db", user: "root", password: "" };
    try {
        const conn = await mysql.createConnection(config);
        console.log("=== COLUMNS ===");
        const [cols] = await conn.execute("DESCRIBE kekayaan_intelektual");
        console.table(cols);

        console.log("\n=== SAMPLES (TGL_PENDAFTARAN) ===");
        const [rows] = await conn.execute("SELECT tgl_pendaftaran, jenis_ki, judul FROM kekayaan_intelektual LIMIT 20");
        console.table(rows);

        console.log("\n=== TOTAL BY YEAR (if detectable) ===");
        const [years] = await conn.execute("SELECT SUBSTRING(tgl_pendaftaran, -4) as year, COUNT(*) as count FROM kekayaan_intelektual GROUP BY year LIMIT 10");
        console.table(years);

        await conn.end();
    } catch (e) {
        console.error(e);
    }
}
inspectData();
