// ================================================================
// RAG PIPELINE — Retrieval-Augmented Generation (V2 Perfect)
// 
// 3-Stage Pipeline:
//   Stage 1: UNDERSTAND — AI memahami pertanyaan + pilih DB + klasifikasi intent/perintah
//   Stage 2: RETRIEVE  — Ambil data jika intent = DATABASE_QUERY
//   Stage 3: GENERATE  — AI merangkai jawaban natural
// ================================================================

const mysql = require('mysql2/promise');
const dbHelper = require('../db-helper');
const dbProfiler = require('./db-profiler');
const databaseRouter = require('./database-router');
const aiOrchestrator = require('./ai-orchestrator');
const queryCache = require('./query-cache');
const sqlValidator = require('../safety/sql-validator');

function debugLog(label, content) {
    try {
        const fs = require('fs');
        const path = require('path');
        const safeContent = typeof content === 'object'
            ? JSON.stringify(content, (k, v) => typeof v === 'bigint' ? v.toString() : v)
            : content;
        fs.appendFileSync(
            path.join(__dirname, '..', 'debug_sql_out.txt'),
            `\n[${new Date().toISOString()}] RAG_${label}: ${safeContent}`
        );
    } catch (e) { }
}

class RAGPipeline {
    constructor() {
        this.aiHandler = null;
        this.schemaCache = null;
        this.ensureSchema = null;
    }

    init({ askAI, schemaCache, ensureSchemaCache }) {
        this.aiHandler = askAI;
        this.schemaCache = schemaCache;
        this.ensureSchema = ensureSchemaCache;
    }

    // ════════════════════════════════════════════════════════════════
    // STAGE 1: UNDERSTAND — AI Memahami Apapun (Enhanced)
    // ════════════════════════════════════════════════════════════════
    async understand(query, conversationContext, lastEntry) {
        // 1. Quick Classify via Orchestrator (Regex based for high confidence commands)
        const quick = aiOrchestrator.quickClassify(query, lastEntry);
        if (quick) {
            debugLog('STAGE1_QUICK', { query, quick });
            return {
                ...quick, // Spread everything to avoid losing 'value'
                intent: quick.intent,
                action: quick.command || quick.action,
                targetDb: quick.targetDb || quick.database_hint,
                is_quick: true // Hint for retry logic
            };
        }

        // 2. CHECK CACHE (Smart Caching Enhancement)
        const cached = queryCache.find(query, lastEntry?.lastDatabase);
        if (cached && !query.toLowerCase().includes('data baru')) {
            debugLog('STAGE1_CACHE_HIT', { query, sql: cached.sql });
            return {
                intent: 'DATABASE_QUERY',
                sql: cached.sql,
                targetDb: cached.database,
                confidence: 0.99,
                from_cache: true
            };
        }

        // 3. AI Understanding via Orchestrator Prompting
        // Merge schemaCache with live profiler data for maximum context
        const profiles = dbProfiler.getProfiles();
        const mergedSchema = { ...this.schemaCache };
        for (const [db, p] of Object.entries(profiles)) {
            if (p.schema) mergedSchema[db] = p.schema;
        }

        const prompt = aiOrchestrator.buildUnifiedPrompt(
            query,
            mergedSchema,
            conversationContext,
            JSON.stringify(profiles, (key, value) => typeof value === 'bigint' ? value.toString() : value),
            lastEntry
        );

        let aiRaw = await this.aiHandler(prompt, 0, 0, 0.2);
        let parsed = aiOrchestrator.parseAIResponse(aiRaw, query);

        // 4. RESCUE LOGIC (If AI fails/junk/429) - DYNAMIC VERSION
        if (!parsed) {
            debugLog('STAGE1_RESCUE', 'Main AI failed, trying dynamic rescue prompt...');
            
            // Build MUCH BETTER dynamic DB summary for rescue
            const dbSummary = Object.keys(profiles).map(db => {
                const p = profiles[db];
                return `DB[${db}]: ${p.summary.substring(0, 500)}`;
            }).join('\n');

            const rescuePrompt = `Tugas: Buat SQL sederhana untuk pertanyaan di bawah.
User tanya: "${query}"
Informasi Database & Tabel:
${dbSummary}

Instruksi: Jawab HANYA JSON: {"intent":"DATABASE_QUERY","database_hint":"[Nama DB]","sql":"SELECT * FROM [Nama Tabel] WHERE [Kolom] LIKE '%...%' LIMIT 10"}`;

            try {
                aiRaw = await this.aiHandler(rescuePrompt, 0, 0, 0.1); 
                parsed = aiOrchestrator.parseAIResponse(aiRaw);
            } catch (e) {
                debugLog('RESCUE_FAILED', e.message);
            }
        }

        // --- PHASE 7 HEURISTIC RESCUE (Last Resort if AI completely dead) ---
        if (!parsed) {
            debugLog('STAGE1_HEURISTIC_RESCUE', 'AI completely dead, trying keywords...');
            const queryLower = query.toLowerCase();
            const topDb = await databaseRouter.routeQuery(query, lastEntry?.lastDatabase);
            const dbName = typeof topDb === 'object' ? topDb.database : topDb;
            
            if (dbName && profiles[dbName]) {
                const schema = profiles[dbName].schema;
                const firstTable = Object.keys(schema)[0];
                if (firstTable) {
                    const columns = schema[firstTable].columns.split(', ');
                    // Try to finding a column that might be a name or title
                    const bestCol = columns.find(c => ['judul', 'nama', 'name', 'judul_ki'].includes(c.toLowerCase()));
                    if (bestCol) {
                        parsed = {
                            intent: 'DATABASE_QUERY',
                            database_hint: dbName,
                            sql: `SELECT * FROM ${firstTable} WHERE ${bestCol} LIKE '%${query.replace(/['"]/g, '')}%' LIMIT 10`
                        };
                    }
                }
            }
        }

        debugLog('STAGE1_AI', { query, parsed });

        if (!parsed) return null;

        // 5. SMART ROUTING REFINEMENT (Phase 7)
        const finalDb = await databaseRouter.routeQuery(query, lastEntry?.lastDatabase, parsed?.database_hint);

        return {
            intent: parsed.intent,
            action: parsed.action || null,
            sql: parsed.sql,
            targetDb: finalDb,
            targetColumns: parsed.target_columns,
            entities: parsed.entities,
            natural_response: parsed.natural_response,
            transformed_query: parsed.transformed_query
        };
    }

    // ════════════════════════════════════════════════════════════════
    // STAGE 2: RETRIEVE
    // ════════════════════════════════════════════════════════════════
    async retrieve(sql, database, originalQuery = '') {
        if (!sql || !database) return { data: [], total: 0 };

        // --- ENSURE SCHEMA CACHE ---
        if ((!this.schemaCache || !this.schemaCache[database]) && this.ensureSchema) {
            try {
                const allActive = dbHelper.getAllActiveConnectionConfigs();
                const conf = allActive.find(c => c.database === database);
                if (conf) {
                    const conn = await mysql.createConnection(conf);
                    await this.ensureSchema(conn, database);
                    await conn.end();
                    debugLog('SCHEMA_FETCHED_ON_DEMAND', database);
                }
            } catch (e) {
                debugLog('ENSURE_SCHEMA_FAIL', e.message);
            }
        }

        // --- SQL GUARD: PRE-VALIDATION ---
        sqlValidator.setSchemaCache(this.schemaCache);
        const validation = sqlValidator.validate(sql, database);
        
        if (!validation.valid) {
            debugLog('SQL_VALIDATION_FAILED', { errors: validation.errors, sql });
            // Coba fix otomatis jika ada saran fixedSQL
            if (validation.fixedSQL) {
                debugLog('SQL_AUTO_FIXED', validation.fixedSQL);
                sql = validation.fixedSQL;
            } else {
                // Minta AI untuk memperbaiki SQL (Self-Correction)
                debugLog('SQL_AI_SELF_CORRECTION_TRIGGERED', validation.errors);
                const fixPrompt = `SQL berikut ERROR terhadap schema database: 
                SQL: "${sql}"
                Error: ${validation.errors.join('; ')}
                Database: ${database}
                
                Tolong berikan SQL yang BENAR dan VALID sesuai schema. 
                Jawab HANYA string SQL murni tanpa markdown.`;
                
                const fixedSqlRaw = await this.aiHandler(fixPrompt, 0, 0, 0.1);
                if (fixedSqlRaw && fixedSqlRaw.toUpperCase().includes('SELECT')) {
                    sql = fixedSqlRaw.trim().replace(/```sql\s*|```/gi, '');
                    debugLog('SQL_AI_FIX_RESULT', sql);
                } else {
                    return { data: [], total: 0, error: `Validasi SQL Gagal: ${validation.errors[0]}` };
                }
            }
        } else if (validation.fixedSQL && validation.fixedSQL !== sql) {
            sql = validation.fixedSQL;
            debugLog('SQL_NORMALIZED', sql);
        }
        // --- END SQL GUARD ---

        const allActive = dbHelper.getAllActiveConnectionConfigs();
        const conf = allActive.find(c => c.database === database);
        if (!conf) return { data: [], total: 0 };

        try {
            const conn = await mysql.createConnection(conf);
            const [rows] = await conn.execute(sql);
            let total = rows.length;

            // Smart total count for pagination & aggregation
            const keys = Object.keys(rows[0] || {});
            const isAgg = keys.some(k => ['total', 'jumlah', 'count'].includes(k.toLowerCase()));

            if (isAgg && rows.length === 1) {
                total = Number(rows[0][keys.find(k => ['total', 'jumlah', 'count'].includes(k.toLowerCase()))]) || 1;
            } else if (!/LIMIT/i.test(sql)) {
                total = rows.length;
            } else {
                try {
                    const cleanSQL = sql.replace(/LIMIT \d+( OFFSET \d+)?/gi, '').replace(/ORDER BY[\s\S]*$/i, '');
                    const countSQL = `SELECT COUNT(*) AS total FROM (${cleanSQL}) AS sub`;
                    const [countRes] = await conn.execute(countSQL);
                    total = countRes[0]?.total || rows.length;
                } catch (e) {
                    debugLog('COUNT_ERROR', e.message);
                }
            }

            await conn.end();

            // Save to Cache if successful
            if (rows.length > 0 && !sql.includes('LIMIT 0') && originalQuery) {
                queryCache.set(originalQuery, database, sql, total);
            }

            return { data: rows, total, sql };
        } catch (e) {
            debugLog('RETRIEVE_ERROR', { error: e.message, sql });
            return { data: [], total: 0, error: e.message };
        }
    }

    // Helper to translate technical columns to human labels
    _getHumanLabel(key) {
        const mapping = {
            'no_permohonan': 'No. Permohonan',
            'id_ki': 'ID KI',
            'jenis_ki': 'Jenis KI',
            'status_ki': 'Status KI',
            'judul': 'Judul KI',
            'tgl_pendaftaran': 'Tgl Pendaftaran',
            'tgl_sertifikasi': 'Tgl Sertifikasi',
            'fakultas_inventor': 'Fakultas',
            'inventor': 'Inventor',
            'status_dokumen': 'Status Dokumen',
            'id_sertifikat': 'ID Sertifikat'
        };
        const k = key.toLowerCase();
        if (mapping[k]) return mapping[k];
        return k.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    // ════════════════════════════════════════════════════════════════
    // STAGE 3: GENERATE (Perfect Context Aware)
    // ════════════════════════════════════════════════════════════════
    async generate(query, data, total, database, lastEntry, metadata = {}) {
        if (!data || data.length === 0) return this._generateNoDataResponse(query, database);

        const keys = Object.keys(data[0]);
        // Support COUNT(*), count(1) etc in generation detection
        const isCount = data.length === 1 && keys.length <= 2 && keys.some(k => {
            const kl = k.toLowerCase();
            return kl === 'total' || kl === 'jumlah' || kl === 'count' || 
                   kl.includes('count(') || kl.includes('total(') || 
                   (kl.includes('jumlah') && !kl.includes('nama')) ||
                   kl.includes('total_');
        });

        // CASE A: Handle simple Total Count queries separately to avoid "List Phrasing"
        if (isCount && !metadata.forceList) {
            const countKey = keys.find(k =>
                ['total', 'jumlah', 'count'].includes(k.toLowerCase()) ||
                k.toLowerCase().includes('count(') ||
                k.toLowerCase().includes('total(')
            );
            const countValue = data[0][countKey];
            const prompt = `Gunakan nada bicara yang ramah, hangat, dan empatik.
Tugas: Menjawab jumlah total data kepada user.
User bertanya: "${query}"
Informasi: Terdapat ${countValue} data yang ditemukan di database ${database}.
Tipe Data: ${this._detectDataType(database, data)}

INSTRUKSI:
1. Jangan gunakan format list (1. ..., 2. ...).
2. Sebutkan jumlah ${countValue} secara natural dalam kalimat.
3. Contoh: "Ada total 628 data KI Paten yang terdaftar di database ITB, Mas/Mbak. Mau saya listkan beberapa contohnya?"
4. Jika jumlahnya 0, jangan bilang "total data yang ditemukan 0" secara dingin. Jawablah "Maaf, sepertinya belum ada data KI yang statusnya 'Tersertifikasi' di sistem kami saat ini."

5. **Rekomendasi Pintar**: Di akhir jawaban, berikan 3 rekomendasi pertanyaan pendek (maks 6 kata) yang relevan dalam **Bahasa Indonesia** yang natural. Gunakan format:
   💡 **Rekomendasi Pertanyaan:**
   1. [Pertanyaan 1]
   2. [Pertanyaan 2]
   3. [Pertanyaan 3]

6. **PELARANGAN JARGON**: DILARANG KERAS menggunakan kata-kata teknis seperti "REKAPITULASI", "STATISTIK", "AGGREGATION", "DATASET", atau "COLUMNS" dalam jawaban. Gunakan bahasa sehari-hari yang hangat.

7. **PEMBERSIHAN DATA (HUMAN-FRIENDLY)**:
   - Jika nilai mengandung underscore (pemeriksaan_formil, dsb), GANTI UNDERSCORE DENGAN SPASI dan KAPITALKAN (Pemeriksaan Formil).
   - Jika status_dokumen adalah 'penerbitan_sertifikat', tuliskan 'Sertifikat Sudah Terbit'.
   - Jika nilai adalah 'null', '-', atau kosong, tuliskan 'Data tidak tersedia'.

Jawab sekarang:`;
            let responseText;
            try {
                responseText = await this.aiHandler(prompt, 0, 0, 0.5);
            } catch (e) {
                debugLog('COUNT_AI_ERROR', e.message);
            }
            if (!responseText || responseText.length < 10) {
                return `Berdasarkan database **${database}**, ditemukan total **${countValue}** data yang sesuai dengan pencarian Anda, Mas/Mbak. 😊`;
            }
            return responseText;
        }

        // CASE B: Handle Database List results
        const dataType = this._detectDataType(database, data);
        
        // PRE-PROCESS DATA: Clean technical junk before AI sees it
        const cleanData = data.slice(0, 10).map(item => {
            const newItem = {};
            for (const [k, v] of Object.entries(item)) {
                // Skip technical IDs unless relevant
                if (['id', 'created_at', 'updated_at', 'tkt'].includes(k.toLowerCase())) continue;
                
                const label = this._getHumanLabel(k);
                let val = v;
                
                // Special: Clean Inventor string
                if (k.toLowerCase() === 'inventor' && typeof v === 'string') {
                    val = v.replace(/<br\s*\/?>/gi, '; ').replace(/,\s+/g, '; ');
                }
                
                // Unified null handling
                if (val === null || val === 'null' || val === '' || val === '-') val = 'Data tidak tersedia';
                
                newItem[label] = val;
            }
            return newItem;
        });

        const prompt = `### PERAN
Anda adalah asisten database ITB yang profesional dan ramah.

### DATA UNTUK DITAMPILKAN:
${JSON.stringify(cleanData)}

### INFORMASI TAMBAHAN:
- Kata Kunci User: "${query}"
- Total Data: ${total}
- Database: ${database}

### INSTRUKSI FORMAT:
Tampilkan data di atas sebagai daftar vertikal yang rapi. Ikuti aturan ini:
1. Berikan nomor urut yang benar dan berurutan secara hitungan (1., 2., 3., dst.) pada setiap item. JANGAN beri angka 1 semua.
2. Judul utama data harus di-bold.
3. Gunakan bullet point (•) untuk detail di bawahnya.
4. Satu baris HANYA untuk satu informasi.
5. Gunakan baris kosong (double enter) antar nomor agar lega.
6. JANGAN memunculkan teks "Berikut adalah rekomendasi pertanyaan".

### LABEL YANG DIGUNAKAN:
Gunakan label: No. Permohonan, Jenis KI, Status KI, Status Dokumen, Fakultas, Tgl Pendaftaran.

### TEMPLATE VISUAL:
[Nomor Urut]. **[Judul/Nama Data]**
• **Judul KI**: [Nilai]
• **No. Permohonan**: [Nilai]
• **Jenis KI**: [Nilai]
... dst

Jawab sekarang secara rapi:`;

        let response;
        try {
            response = await this.aiHandler(prompt, 0, 0, 0.4);
        } catch (e) {
            debugLog('GENERATE_AI_ERROR', e.message);
        }
        
        // Anti-Empty/Fallback logic: Jika AI mengembalikan pesan terlalu pendek atau gagal
        if (!response || response.length < 50) {
            debugLog('USING_TECHNICAL_FALLBACK', 'AI response failed or too short');
            return this._fallbackFormat(data, total, dataType, database);
        }
        return response;
    }

    async _generateNoDataResponse(query, database) {
        const prompt = `Gunakan nada bicara yang ramah, sopan, dan hangat.
Konteks: User bertanya "${query}" tapi tidak ada data yang ditemukan di database ${database}.

INSTRUKSI:
1. Sampaikan permohonan maaf karena data belum tersedia untuk pencarian "${query}".
2. Jika kata kunci terlalu singkat (seperti "ki"), jelaskan bahwa user bisa mencari lebih spesifik berdasarkan kategori (Paten, Hak Cipta, Merek, Desain Industri).
3. Berikan 2 contoh pertanyaan yang relevan dalam **Bahasa Indonesia** yang pas dengan isi database ${database}.
4. JANGAN menyalahkan user. Gunakan kalimat santai seperti: "Wah, maaf banget Mas/Mbak, data tentang '${query}' sepertinya belum masuk ke sistem kita nih."

5. **Rekomendasi Pintar**: Berikan 3 saran pertanyaan pendek yang valid di database ini dalam **Bahasa Indonesia** agar user tidak bingung.
   Format:
   💡 **Rekomendasi Pertanyaan:**
   1. ...
   2. ...
   3. ...

Jawab sekarang:`;
        try {
            const response = await this.aiHandler(prompt, 0, 0, 0.7);
            if (response) return response;
        } catch (e) {
            debugLog('NO_DATA_AI_ERROR', e.message);
        }
        
        return `Wah, maaf banget Mas/Mbak, data tentang "**${query}**" sepertinya belum tersedia di database **${database}** kami saat ini. 😊\n\n💡 **Saran:** Coba cari dengan kata kunci yang lebih spesifik atau kategori lain.`;
    }

    _fallbackFormat(data, total, dataType = 'data', database = '') {
        let msg = `🤖 **HASIL PENCIPTAAN DATA**\n`;
        msg += `*(Pesan otomatis: AI sedang sibuk, menampilkan format teknis)*\n\n`;
        msg += `Ditemukan **${total}** data pada database **${database || 'sistem'}**.\n\n`;
        
        data.slice(0, 5).forEach((item, i) => {
            msg += `${i + 1}. **${item.judul || item.nama || item.name || 'DATA DETAIL'}**\n`;
            for (const [k, v] of Object.entries(item)) {
                if (['id', 'created_at', 'updated_at', 'tkt'].includes(k.toLowerCase())) continue;
                if (!v || v === 'null') continue;
                msg += `• **${this._getHumanLabel(k)}**: ${String(v).substring(0, 100)}${String(v).length > 100 ? '...' : ''}\n`;
            }
            msg += `\n`;
        });

        if (total > 5) msg += `*...dan ${total - 5} data lainnya.*`;
        
        msg += `\n\n📊 Ketik "buat grafik" atau "cetak pdf" untuk mengolah data ini.`;
        return msg;
    }

    _getVisualContext(data) {
        if (!data || data.length < 2) return "Data tunggal, tidak perlu visualisasi.";
        const keys = Object.keys(data[0]);
        const hasTime = keys.some(k => k.toLowerCase().includes('tahun') || k.toLowerCase().includes('tgl') || k.toLowerCase().includes('tanggal'));
        const hasCount = keys.some(k => ['total', 'jumlah', 'count', 'c'].includes(k.toLowerCase()));

        if (hasTime && hasCount) return "DATA TREN WAKTU: Sangat cocok untuk Line Chart atau Bar Chart.";
        if (hasCount && keys.length === 2) return "DATA PERBANDINGAN: Sangat cocok untuk Pie Chart atau Bar Chart.";
        if (data.length > 5) return "DATA BANYAK: Cocok untuk ringkasan dalam Dashboard.";
        return "Data tabular standar.";
    }

    _detectDataType(database, data) {
        if (!data || data.length === 0) return 'UMUM';
        const keys = Object.keys(data[0]).map(k => k.toLowerCase());

        // Check for Statistical / Aggregation data
        const isStats = keys.some(k => ['total', 'jumlah', 'count', 'persentase'].includes(k)) || 
                       (data.length > 1 && keys.some(k => k.includes('tahun') || k.includes('bulan')));
        if (isStats && keys.length <= 4) return 'STATISTIK';

        // Intellectual Property pattern
        const kiKeys = ['jenis_ki', 'judul', 'inventor', 'no_permohonan', 'status_ki', 'fakultas_inventor'];
        const matches = kiKeys.filter(k => keys.includes(k)).length;

        if (database === 'itb_db' || matches >= 2) return 'KEKAYAAN_INTELEKTUAL';

        // Employee/Member pattern
        if (keys.includes('nama') && (keys.includes('jabatan') || keys.includes('email') || keys.includes('hobi'))) return 'ANGGOTA_KARYAWAN';

        return 'UMUM';
    }
}

module.exports = new RAGPipeline();
