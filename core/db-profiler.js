const mysql = require('mysql2/promise');

class DatabaseProfiler {
    constructor() {
        this.profiles = {};
        this.askAI = null;
    }

    setAIHandler(handler) {
        this.askAI = handler;
    }

    async profileDatabases(connections) {
        console.log('🔍 Profiling databases for Semantic Routing & AI Insights...');
        for (const config of connections) {
            try {
                const conn = await mysql.createConnection(config);
                const [tables] = await conn.execute('SHOW TABLES');
                const tableNameKey = `Tables_in_${config.database}`;

                const tableContext = [];
                const schemaData = {};
                for (const row of tables) {
                    const tableName = row[tableNameKey];
                    const [columns] = await conn.execute(`DESCRIBE \`${tableName}\``);
                    const colNames = columns.map(c => c.Field).join(', ');

                    // Capture sample rows for grounding (using backticks for safety)
                    const [samples] = await conn.execute(`SELECT * FROM \`${tableName}\` LIMIT 3`);

                    tableContext.push(`Tabel [${tableName}] memiliki kolom: ${colNames}`);
                    schemaData[tableName] = {
                        columns: colNames,
                        sample_rows: samples
                    };
                }

                const fullContext = tableContext.join('; ');
                this.profiles[config.database] = {
                    database: config.database,
                    summary: fullContext,
                    schema: schemaData,
                    keywords: this.extractKeywords(fullContext),
                    insights: null // Will be filled by AI
                };

                // Trigger Proactive AI Analysis (In background)
                if (this.askAI) {
                    this.generateProactiveInsights(config.database, schemaData).then(insights => {
                        this.profiles[config.database].insights = insights;
                        console.log(`🧠 AI Insights generated for: ${config.database}`);
                    });
                }

                await conn.end();
                console.log(`✅ Profiled: ${config.database}`);
            } catch (error) {
                console.error(`❌ Failed to profile ${config.database}:`, error.message);
            }
        }
        return this.profiles;
    }

    async generateProactiveInsights(dbName, schema) {
        try {
            const schemaPreview = JSON.stringify(schema, null, 2);
            const prompt = `Bertindaklah sebagai Data Analyst. Analisislah skema database berikut dan berikan "Analisis Prediktif" tentang pertanyaan apa saja yang akan muncul dari user.
            
DATABASE NAME: ${dbName}
SCHEMA:
${schemaPreview.substring(0, 3000)}

INSTRUKSI:
1. Identifikasi topik utama database ini.
2. Temukan kolom yang bisa dipakai untuk statistik (COUNT, SUM, AVG) atau tren (YEAR, DATE).
3. Buatlah 5 contoh pertanyaan yang SANGAT MUNGKIN ditanyakan user (contoh: "Berapa jumlah x per tahun?", "Siapa yang paling banyak y?").
4. Prediksikan relasi data jika ada.

Jawab dalam format JSON string murni (tanpa markdown) dengan struktur:
{
 "topic": "...",
 "analytic_points": ["...", "..."],
 "typical_questions": ["...", "..."]
}`;
            const res = await this.askAI(prompt, 0, 0, 0.4);
            return JSON.parse(res.replace(/```json\s*|```/gi, ''));
        } catch (e) {
            return { error: 'Gagal melakukan analisis proaktif' };
        }
    }

    extractKeywords(text) {
        const commonNames = ['penemu', 'judul', 'nama', 'email', 'mahasiswa', 'alumni', 'dosen', 'karyawan', 'hobi', 'ki', 'paten', 'hak cipta', 'merek', 'desain industri', 'status', 'tahun', 'fakultas'];
        const textLower = text.toLowerCase();
        return commonNames.filter(k => textLower.includes(k));
    }

    getProfiles() {
        return this.profiles;
    }
}

module.exports = new DatabaseProfiler();
