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

function debugLog(label, content) {
    try {
        const fs = require('fs');
        const path = require('path');
        fs.appendFileSync(
            path.join(__dirname, '..', 'debug_sql_out.txt'),
            `\n[${new Date().toISOString()}] RAG_${label}: ${typeof content === 'object' ? JSON.stringify(content) : content}`
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
                intent: quick.intent,
                action: quick.command, // Mapping internal Bot command to RAG action
                confidence: quick.confidence,
                data: quick.data
            };
        }

        // 2. AI Understanding via Orchestrator Prompting
        const prompt = aiOrchestrator.buildUnifiedPrompt(
            query,
            this.schemaCache,
            conversationContext,
            JSON.stringify(dbProfiler.getProfiles()),
            lastEntry
        );

        const aiRaw = await this.aiHandler(prompt, 0, 0, 0.2);
        const parsed = aiOrchestrator.parseAIResponse(aiRaw);

        debugLog('STAGE1_AI', { query, parsed });

        if (!parsed) return null;

        return {
            intent: parsed.intent,
            action: parsed.action || null, // Map if exists
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
    async retrieve(sql, database) {
        if (!sql || !database) return { data: [], total: 0 };
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
            return { data: rows, total, sql };
        } catch (e) {
            debugLog('RETRIEVE_ERROR', { error: e.message, sql });
            return { data: [], total: 0, error: e.message };
        }
    }

    // ════════════════════════════════════════════════════════════════
    // STAGE 3: GENERATE (Perfect Context Aware)
    // ════════════════════════════════════════════════════════════════
    async generate(query, data, total, database, lastEntry) {
        if (!data || data.length === 0) return this._generateNoDataResponse(query, database);

        const keys = Object.keys(data[0]);
        const isCount = data.length === 1 && keys.some(k => ['total', 'jumlah', 'count'].includes(k.toLowerCase()));

        // Formatting specifically for perfect mobile UX and warm human tone
        const prompt = `Gunakan nada bicara yang ramah, hangat, dan membantu (seperti asisten manusia).
Pertanyaan User: "${query}"
Data dari Database: ${JSON.stringify(data.slice(0, 10))}
Total data (Jika rekap/group-by, ini adalah jumlah baris): ${data.length}
Grand Total (Jika rekap/group-by, ini adalah jumlah total item): ${total}

INSTRUKSI FORMATTING (WAJIB):
1. **Daftar Lengkap & Berjarak**: Tampilkan list 1-10 dengan menyajikan informasi yang relevan dari JSON (Mulai dari Jenis KI, Status KI, Tgl Pendaftaran, No Permohonan, Tgl Sertifikasi, No Sertifikat, Status Dokumen, Inventor, Fakultas, Pekerjaan, Instansi, dll).
   DILARANG menyembunyikan kolom kecuali **ID**, **TKT**, **ABSTRAK**, dan **MITRA**.
   
   Format per nomor (TANPA bullet point '-' di depan):
   1. **[JUDUL/NAMA DALAM HURUF KAPITAL]**
   **JENIS KI**: [Nilai]
   **STATUS**: [Nilai]
   **TGL PENDAFTARAN**: [Nilai]
   **NOMOR PERMOHONAN**: [Nilai]
   **FAKULTAS**: [Nilai]
   **INVENTOR**: [Nilai]
   **STATUS DOKUMEN**: [Nilai]
   (Iterasi semua kolom lain yang ada di data tersebut kecuali ID, TKT, ABSTRAK, MITRA).

   TAMBAHKAN **DUA KALI BARIS BARU** antar nomor agar sangat lega.

2. **Navigasi Data (PAGING)**: 
   - JIKA (Grand Total - 10) > 0, tuliskan: "Masih ada [sisa] data lagi. Ketik **'lanjut'** untuk melihat berikutnya ya, Mas/Mbak."
   - JIKA sisa adalah 0, JANGAN sebutkan kalimat "Masih ada 0 data". Langsung tutup saja dengan ramah.

3. **Analisis Rekap (Group-By)**: Jika data berupa tabel angka, berikan narasi singkat yang menyebutkan Grand Total.

4. **Tanpa Jargon**: DILARANG mendaftarkan nama tabel atau kolom teknis dalam tanda kurung (id, nama, dsb) di jawaban awal. Jawab seperti asisten manusia yang ramah. Jika ditanya mengenai isi database secara umum, berikan penjelasan dalam kalimat narasi yang hangat.

5. **Detail Tersembunyi**: Informasikan bahwa **Abstrak** dan **Mitra** (jika ada pada database tersebut) hanya bisa dilihat dengan mengetik nomor urutnya. Jika data yang ditampilkan tidak memiliki kolom abstrak/mitra, abaikan kalimat ini.

Contoh Respon List Ideal:
"Tentu! Ini hasil lengkap yang saya temukan:

1. **ROBOT ANGKLUNG AKUSTIK**
**JENIS KI**: Paten
**TKT**: 3
**STATUS**: Ajuan Paten
**TGL PENDAFTARAN**: 2010-12-30
**NOMOR PERMOHONAN**: P00201000123
**FAKULTAS**: FTI
**INVENTOR**: Krisna Diastama, dkk
**STATUS DOKUMEN**: Terdaftar

2. ... (jarak jauh)

Ketik nomornya jika Mas/Mbak ingin melihat detail **Abstrak** atau **Mitra** Lengkapnya ya. 😊"

Jawab sekarang dengan ramah:`;

        const response = await this.aiHandler(prompt, 0, 0, 0.4);
        return response || this._fallbackFormat(data, total);
    }

    async _generateNoDataResponse(query, database) {
        const prompt = `User bertanya "${query}" tapi data TIDAK ditemukan di database ${database}.
        Berikan respon ramah yang menjelaskan bahwa data tidak ada, sarankan kemungkinkan salah ketik, dan berikan 2 ide pertanyaan alternatif yang relevan dengan topik database tersebut.`;
        return await this.aiHandler(prompt, 0, 0, 0.7);
    }

    _fallbackFormat(data, total) {
        return `Ditemukan ${total} data. Silakan ketik nomor untuk melihat rincian atau 'lanjut' untuk data berikutnya.`;
    }
}

module.exports = new RAGPipeline();
