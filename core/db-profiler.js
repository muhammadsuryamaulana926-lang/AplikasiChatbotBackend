const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

class DatabaseProfiler {
    constructor() {
        this.profiles = {};
        this.askAI = null;
        this.isProfiling = false;
    }

    setAIHandler(handler) {
        this.askAI = handler;
    }

    async profileDatabases(connections) {
        if (this.isProfiling) {
            console.log('⚠️ Profiling already in progress. Waiting for it to finish...');
            while(this.isProfiling) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            return this.profiles;
        }

        this.isProfiling = true;
        try {
            // Try load from cache first
            const cachePath = path.join(__dirname, '../db-profiles.json');
            try {
                if (fs.existsSync(cachePath)) {
                    this.profiles = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
                    console.log('📦 Loaded database profiles from cache.');
                }
            } catch (e) {
                console.error('Failed to load profiles cache:', e.message);
            }

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
                        const colDetails = columns.map(c => `${c.Field} (${c.Type})`).join(', ');
                        const colNames = columns.map(c => c.Field).join(', ');

                        // Capture sample rows for grounding (using backticks for safety)
                        const [samples] = await conn.execute(`SELECT * FROM \`${tableName}\` LIMIT 3`);

                        tableContext.push(`Tabel [${tableName}] memiliki kolom: ${colDetails}`);
                        schemaData[tableName] = {
                            columns: colNames,
                            column_details: colDetails,
                            sample_rows: samples
                        };
                    }

                    // Check if we already have insights in cache to save AI tokens
                    const existing = this.profiles[config.database];
                    const hasValidInsights = existing && existing.insights && !existing.insights.error;

                    const fullContext = tableContext.join('; ');
                    this.profiles[config.database] = {
                        database: config.database,
                        summary: fullContext,
                        schema: schemaData,
                        keywords: this.extractKeywords(fullContext),
                        insights: hasValidInsights ? existing.insights : null
                    };

                    // Trigger Proactive AI Analysis (Sequentially to avoid rate limits)
                    if (this.askAI && !hasValidInsights) {
                        try {
                            console.log(`🧠 AI is analyzing database structure for: ${config.database}...`);
                            const insights = await this.generateProactiveInsights(config.database, schemaData);
                            this.profiles[config.database].insights = insights;
                            console.log(`✅ AI Insights generated for: ${config.database}`);
                            // Small delay to avoid hitting rate limits for the next DB
                            await new Promise(resolve => setTimeout(resolve, 2000));
                        } catch (e) {
                            console.error(`⚠️ AI Insights failed for ${config.database}:`, e.message);
                        }
                    }

                    await conn.end();
                    console.log(`✅ Profiled: ${config.database}`);
                } catch (error) {
                    console.error(`❌ Failed to profile ${config.database}:`, error.message);
                }
            }
            // Save to cache after all profiling is done
            try {
                const cachePath = path.join(__dirname, '../db-profiles.json');
                fs.writeFileSync(cachePath, JSON.stringify(this.profiles, null, 2));
                console.log('💾 Database profiles saved to cache.');
            } catch (e) {
                console.error('Failed to save profiles cache:', e.message);
            }

            return this.profiles;
        } finally {
            this.isProfiling = false;
        }
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
        const found = commonNames.filter(k => {
            const regex = new RegExp(`\\b${k}\\b`, 'i');
            return regex.test(textLower);
        });
        
        // Special logic for 'ki' shorthand
        if (textLower.includes('kekayaan_intelektual') || textLower.includes('kekayaan intelektual')) {
            if (!found.includes('ki')) found.push('ki');
        }
        
        return found;
    }

    getProfiles() {
        return this.profiles;
    }
}

module.exports = new DatabaseProfiler();
