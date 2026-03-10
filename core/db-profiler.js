const mysql = require('mysql2/promise');

class DatabaseProfiler {
    constructor() {
        this.profiles = {};
    }

    async profileDatabases(connections) {
        console.log('🔍 Profiling databases for Semantic Routing...');
        for (const config of connections) {
            try {
                const conn = await mysql.createConnection(config);
                const [tables] = await conn.execute('SHOW TABLES');
                const tableNameKey = `Tables_in_${config.database}`;

                const tableContext = [];
                for (const row of tables) {
                    const tableName = row[tableNameKey];
                    const [columns] = await conn.execute(`DESCRIBE ${tableName}`);
                    const colNames = columns.map(c => c.Field).join(', ');
                    tableContext.push(`Tabel [${tableName}] memiliki kolom: ${colNames}`);
                }

                this.profiles[config.database] = {
                    database: config.database,
                    summary: tableContext.join('; '),
                    keywords: this.extractKeywords(tableContext.join(' '))
                };

                await conn.end();
                console.log(`✅ Profiled: ${config.database}`);
            } catch (error) {
                console.error(`❌ Failed to profile ${config.database}:`, error.message);
            }
        }
        return this.profiles;
    }

    extractKeywords(text) {
        // Simple keyword extraction (can be improved with AI)
        const commonNames = ['penemu', 'judul', 'nama', 'email', 'mahasiswa', 'alumni', 'dosen', 'karyawan', 'hobi', 'ki', 'paten', 'hak cipta', 'merek', 'desain industri', 'status', 'tahun', 'fakultas'];
        const textLower = text.toLowerCase();
        return commonNames.filter(k => textLower.includes(k));
    }

    getProfiles() {
        return this.profiles;
    }
}

module.exports = new DatabaseProfiler();
