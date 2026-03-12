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
        let parsed = aiOrchestrator.parseAIResponse(aiRaw);

        // 4. RESCUE LOGIC (If AI fails/junk/429)
        if (!parsed) {
            debugLog('STAGE1_RESCUE', 'Main AI failed, trying minimalist rescue prompt...');
            const rescuePrompt = `User tanya: "${query}"
Database: itb_db (ki, paten), ujicoba (anggota).
Tugas: Jawab DALAM JSON SAJA: {"intent":"DATABASE_QUERY","database_hint":"itb_db","sql":"SELECT * FROM ... LIMIT 10"}`;

            aiRaw = await this.aiHandler(rescuePrompt, 0, 0, 0.1); // Try with lower temp
            parsed = aiOrchestrator.parseAIResponse(aiRaw);
        }

        debugLog('STAGE1_AI', { query, parsed });

        if (!parsed) return null;

        return {
            intent: parsed.intent,
            action: parsed.action || null,
            sql: parsed.sql,
            targetDb: parsed.database_hint,
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

    // ════════════════════════════════════════════════════════════════
    // STAGE 3: GENERATE (Perfect Context Aware)
    // ════════════════════════════════════════════════════════════════
    async generate(query, data, total, database, lastEntry, metadata = {}) {
        if (!data || data.length === 0) return this._generateNoDataResponse(query, database);

        const keys = Object.keys(data[0]);
        // Support COUNT(*), count(1) etc in generation detection
        const isCount = data.length === 1 && keys.length <= 2 && keys.some(k =>
            ['total', 'jumlah', 'count'].includes(k.toLowerCase()) ||
            k.toLowerCase().includes('count(') ||
            k.toLowerCase().includes('total(')
        );

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

Jawab sekarang:`;
            return await this.aiHandler(prompt, 0, 0, 0.5);
        }

        // CASE B: Handle Database List results
        const dataType = this._detectDataType(database, data);
        const prompt = `Bertindaklah sebagai asisten cerdas yang ramah dan sangat rapi.
Pertanyaan User: "${query}"
Data: ${JSON.stringify(data.slice(0, 10))}
Grand Total: ${total}
Tipe Data: ${dataType}

INSTRUKSI JAWABAN:
1. KALIMAT PEMBUKA: "Ditemukan ${total} data. Berikut adalah data yang relevan:"
   - DILARANG KERAS menggunakan kata "REKAPITULASI", "STATISTIK", atau istilah teknis lain.
2. FORMAT LIST: Gunakan format yang sangat lega dan ber-hierarki.
   - Gunakan nomor tebal (**1.**, **2.**).
   - Gunakan bullet point (•) untuk detail di bawah nomor.
   - JANGAN menumpuk banyak nama orang dalam satu baris panjang. Jika ada lebih dari 2 orang, pecah menjadi baris-baris bullet.
   - WAJIB memberikan baris kosong (double enter) ANTAR nomor.
3. SEMBUNYIKAN DETAIL: 
   - DILARANG menampilkan isi 'ABSTRAK' atau 'MITRA' di list ini. 
   - Tulis di akhir: "Untuk melihat **Abstrak** atau **Mitra** secara lengkap, silakan ketik nomor urutnya ya, Mas/Mbak!"
4. NAVIGASI: Jika Grand Total > 10, infokan: "Masih ada ${total - 10} data lagi. Ketik **'lanjut'** untuk melihat berikutnya."
${metadata.forceList ? '5. PENTING: User ingin melihat DAFTAR LENGKAP, jangan diringkas.' : ''}

TEMPLATE PER ITEM (ACUAN VISUAL VERTIKAL MUTLAK):
- JIKA Tipe Data 'KEKAYAAN_INTELEKTUAL':
  **[Nomor]. [IDENTITAS UTAMA]**
  
  • **No. Permohonan**: [no_permohonan]
  
  • **ID KI**: [id_ki]
  
  • **Jenis KI**: [jenis_ki]
  
  • **Status KI**: [status_ki]

  • **Status Dokumen**: [status_dokumen]
  
  • **Fakultas**: [fakultas_inventor]
  
  • **Tgl Pendaftaran**: [tgl_pendaftaran]
  
  • **Tgl Sertifikasi**: [tgl_sertifikasi]
  
  • **Inventor**: 
    - [Nama Orang 1]
    - [Nama Orang 2]

  (Berikan baris ganda di sini sebelum nomor berikutnya)

  *ATURAN FORMATTING KERAS:*
  1. SATU BARIS HANYA UNTUK SATU POIN (•). DILARANG KERAS menulis dua poin atau lebih dalam satu baris horizontal yang sama.
  2. Setiap poin (•) harus dipisahkan oleh 'Enter' (baris baru).
  3. Hanya LABEL yang ditebalkan (Contoh: **Jenis KI**:), NILAINYA jangan ditebalkan.
  4. Sembunyikan 'abstrak' dan 'mitra_kepemilikan'.
  5. Jika user tanya "Siapa inventor...", maka [IDENTITAS UTAMA] adalah Nama Inventor.
  6. Jika user tanya "Apa saja judul...", maka [IDENTITAS UTAMA] adalah Judul KI.

- JIKA Tipe Data 'UMUM' atau 'ANGGOTA_KARYAWAN':
  **[Nomor]. [NAMA / IDENTITAS TERPENTING]**
  • [Detail 1]: [Nilai]
  • [Detail 2]: [Nilai]
  
  [Berikan jarak 1 baris antar nomor agar lega]

Jawab sekarang secara rapi dan sangat detail:`;

        const response = await this.aiHandler(prompt, 0, 0, 0.4);
        
        // Anti-Empty/Fallback logic: Jika AI mengembalikan pesan terlalu pendek atau gagal
        if (!response || response.length < 50) {
            return this._fallbackFormat(data, total, dataType);
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
        const response = await this.aiHandler(prompt, 0, 0, 0.7);
        return response || `Wah, maaf banget Mas/Mbak, data tentang '${query}' sepertinya belum tersedia di database ${database} kami saat ini. Coba cari dengan kata kunci lain ya!`;
    }

    _fallbackFormat(data, total, dataType = 'data') {
        let msg = `Ditemukan ${total} data ${dataType === 'KEKAYAAN_INTELEKTUAL' ? 'Kekayaan Intelektual (KI)' : ''}. Berikut adalah rinciannya:\n\n`;
        
        data.slice(0, 5).forEach((item, i) => {
            const title = item.judul || item.nama || item.name || Object.values(item)[1] || `Data ${i+1}`;
            msg += `**${i+1}. ${String(title).toUpperCase()}**\n`;
            Object.entries(item).forEach(([k, v]) => {
                const keyLower = k.toLowerCase();
                if (['id', 'abstrak', 'mitra_kepemilikan', 'created_at', 'updated_at'].includes(keyLower)) return;
                msg += `• **${k}**: ${v}\n`;
            });
            msg += `\n`;
        });

        if (total > 5) msg += `\n(Menampilkan 5 data pertama) Masih ada ${total - 5} data lagi. Ketik **'lanjut'** untuk melihat berikutnya.`;
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
