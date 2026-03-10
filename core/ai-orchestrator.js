// ================================================================
// AI ORCHESTRATOR — Hybrid Orchestrator (Phase 1)
// 
// Menggabungkan intent classification + entity extraction + SQL generation
// dalam SATU panggilan AI, menggantikan pipeline 4-layer:
//   - semantic-normalizer.js (masih dipakai untuk isComment/isEducational saja)
//   - intent-enricher.js → DIHAPUS dari pipeline utama
//   - intent-classifier.js Layer 3 (aiClassify) → DIGABUNG ke sini
//   - generateSQL prompt 260 baris → DIPANGKAS
//
// PRINSIP:
// - Quick rules (regex) HANYA untuk perintah 100% pasti: pagination, ya/tidak, nomor
// - Semua yang lain → 1 AI call yang mengembalikan JSON terstruktur
// ================================================================

class AIOrchestrator {
    constructor() {
        this.QUICK_COMMANDS = {
            PAGINATE_NEXT: /^(lagi|lanjut(kan)?|berikutnya|next|more|tampilkan lagi|lihat lagi|selanjutnya|mau lagi|mana lagi)\b/i,
            PAGINATE_RESET: /^(awal|dari awal|ulang|reset|kembali|data (pertama|awal)|tampilkan (lagi )?(data )?(1|pertama)|dari (data )?1)\b/i,
            PAGINATE_RANGE: /(?:data|tampilkan|lihat)\s*(?:yang\s+)?(?:ke\s+)?(\d+)\s*(?:sampai|hingga|-|sd|s\/d)\s*(\d+)/i,
            DATABASE_LIST: /database\s+(apa|mana)\s*(saja|aja)?|ada\s+database|list.*database/i,
            SELECT_NUMBER: /^(?:detail\s+)?(\d+)$|^(?:no\.?\s*|nomor\s*)(\d+)$/i,
        };

        this.CONFIRM_YES = /^(ya+|iya+|yaps?|y|mau|boleh|silakan|gas|tampilkan|lihat|liat|liatkan|liatin|show|tunjukin|kasih liat|ok|oke|okey|sip|dong|daftar|list|mana saja|apa saja|namanya)\b/i;
        this.CONFIRM_NO = /^(tidak|nggak|gak|no|nope|ga|enggak|ndak|tdk|jangan|skip)\b/i;

        // Perintah grafik/export — tetap regex karena 100% pasti
        this.CHART_CMD = /\b(grafik(?:nya)?|diagram(?:nya)?|chart(?:nya)?|buatkan\s+grafik|bikin\s+grafik|tampilkan\s+grafik|buat\s+grafik|bikin\s+diagram|buatkan\s+diagram|jadikan\s+(?:grafik|grafil|gravis|grafic|graph))\b/i;
        this.EXPORT_CMD = /\b(export|unduh|download|csv|excel|ekspor|exel|xls|xlsx|jadikan\s+(?:exel|excel|escel|eksel|xs|xsl|xlsx))\b/i;
        this.EXPORT_PDF_CMD = /\b(pdf|buatkan\s+pdf|export\s+pdf|download\s+pdf|bikin\s+pdf|cetak\s+pdf|unduh\s+pdf)\b/i;
        this.DASHBOARD_CMD = /\b(dashboard(?:nya)?|visualisasi\s+interaktif|buka\s+dashboard|buatkan\s+dashboard|tampilkan\s+dashboard)\b/i;

        // Sapaan murni — cepat tanpa AI
        this.GREETING = /^(hai|halo|hi|hello|assalamualaikum|selamat (pagi|siang|sore|malam)|apa kabar|hey)$/i;
        this.THANKS = /^(terima kasih|makasih|thanks|thank you|thx|ok(e)? (makasih|terima kasih)|sip (makasih|terima kasih)?)$/i;
        this.GOODBYE = /^(sampai jumpa|bye|dadah|selamat tinggal|pamit)$/i;
    }

    // ════════════════════════════════════════════════════════════════
    // QUICK CLASSIFY — Regex HANYA untuk perintah 100% pasti
    // Return null jika tidak cocok → lanjut ke AI
    // ════════════════════════════════════════════════════════════════
    quickClassify(q, session) {
        const input = q.trim();
        const qLower = input.toLowerCase();

        // === PAGINATION ===
        if (this.QUICK_COMMANDS.PAGINATE_NEXT.test(qLower)) {
            return { intent: 'COMMAND', command: 'PAGINATE_NEXT', confidence: 0.98 };
        }
        if (this.QUICK_COMMANDS.PAGINATE_RESET.test(qLower)) {
            return { intent: 'COMMAND', command: 'PAGINATE_RESET', confidence: 0.98 };
        }
        const rangeMatch = qLower.match(this.QUICK_COMMANDS.PAGINATE_RANGE);
        if (rangeMatch) {
            return { intent: 'COMMAND', command: 'PAGINATE_RANGE', confidence: 0.98, data: { start: parseInt(rangeMatch[1]), end: parseInt(rangeMatch[2]) } };
        }

        // === DATABASE LIST ===
        if (this.QUICK_COMMANDS.DATABASE_LIST.test(qLower)) {
            return { intent: 'COMMAND', command: 'DATABASE_LIST', confidence: 0.98 };
        }

        // === KONFIRMASI (Ya/Tidak) — hanya jika awaiting ===
        const lastEntry = session?.getLastEntry?.() || session;
        const isAwaitingConfirm = lastEntry?.pendingDataDisplay || lastEntry?.wasCountQuery || session?.awaitingConfirmation;
        if (isAwaitingConfirm) {
            if (this.CONFIRM_YES.test(qLower)) {
                return { intent: 'CONFIRMATION', value: true, confidence: 0.98 };
            }
            if (this.CONFIRM_NO.test(qLower)) {
                return { intent: 'CONFIRMATION', value: false, confidence: 0.98 };
            }
        }

        // === SAPAAN MURNI ===
        if (this.GREETING.test(qLower)) {
            return { intent: 'CONVERSATION', subtype: 'GREETING', confidence: 0.98 };
        }
        if (this.THANKS.test(qLower)) {
            return { intent: 'CONVERSATION', subtype: 'THANKS', confidence: 0.98 };
        }
        if (this.GOODBYE.test(qLower)) {
            return { intent: 'CONVERSATION', subtype: 'GOODBYE', confidence: 0.98 };
        }

        // === KETIK NOMOR ===
        const numMatch = qLower.match(this.QUICK_COMMANDS.SELECT_NUMBER);
        if (numMatch) {
            return { intent: 'COMMAND', command: 'SELECT_NUMBER', confidence: 0.95, data: { number: parseInt(numMatch[1] || numMatch[2]) } };
        }

        // === GRAFIK ===
        if (this.CHART_CMD.test(qLower)) {
            return { intent: 'COMMAND', command: 'CHART', confidence: 0.95 };
        }

        // === EXPORT ===
        if (this.EXPORT_PDF_CMD.test(qLower)) {
            return { intent: 'COMMAND', command: 'EXPORT_PDF', confidence: 0.95 };
        }
        if (this.DASHBOARD_CMD.test(qLower)) {
            return { intent: 'COMMAND', command: 'DASHBOARD', confidence: 0.95 };
        }
        if (this.EXPORT_CMD.test(qLower)) {
            return { intent: 'COMMAND', command: 'EXPORT', confidence: 0.95 };
        }

        // Tidak cocok → serahkan ke AI
        return null;
    }

    // ════════════════════════════════════════════════════════════════
    // AI CLASSIFY + SQL — Satu panggilan AI untuk semuanya
    // 
    // Mengembalikan:
    // {
    //   intent: "DATABASE_QUERY" | "FOLLOW_UP" | "CONVERSATION" | "AMBIGUOUS",
    //   sql: "SELECT ..." | null,
    //   database_hint: "kekayaan_intelektual_db" | null,
    //   natural_response: "..." | null,  (untuk CONVERSATION)
    //   entities: { jenis_ki, tahun, fakultas, inventor, ... },
    //   transformed_query: "..." | null
    // }
    // ════════════════════════════════════════════════════════════════
    buildUnifiedPrompt(userInput, schemaInfo, conversationContext, dbCatalogSummary, lastEntry) {
        // Build schema section (compact)
        let schemaSection = '';
        if (schemaInfo && Object.keys(schemaInfo).length > 0) {
            const schemas = [];
            for (const [dbName, tables] of Object.entries(schemaInfo)) {
                const tableDescs = Object.entries(tables).map(([tName, tInfo]) => {
                    const sampleRow = tInfo.sample_rows?.[0] || {};
                    return `  Tabel: ${tName}\n  Kolom: ${tInfo.columns}\n  Contoh: ${JSON.stringify(sampleRow).substring(0, 200)}`;
                }).join('\n');
                schemas.push(`Database: ${dbName}\n${tableDescs}`);
            }
            schemaSection = schemas.join('\n\n');
        }

        // Build last context (what was the previous interaction)
        let lastContextSection = '';
        if (lastEntry) {
            const parts = [];
            if (lastEntry.lastQuestion) parts.push(`Pertanyaan terakhir: "${lastEntry.lastQuestion}"`);
            if (lastEntry.lastSqlQuery) parts.push(`SQL terakhir: ${lastEntry.lastSqlQuery.substring(0, 150)}`);
            if (lastEntry.lastDatabase) parts.push(`Database terakhir: ${lastEntry.lastDatabase}`);
            if (lastEntry.lastTotal !== undefined) parts.push(`Total data terakhir: ${lastEntry.lastTotal}`);
            if (lastEntry.lastItemDetail) parts.push(`ITEM DETAIL TERAKHIR (Sedang dibahas): ${JSON.stringify(lastEntry.lastItemDetail)}`);
            if (lastEntry.lastDistinctValues) parts.push(`Nilai distinct terakhir: ${JSON.stringify(lastEntry.lastDistinctValues.values?.slice(0, 5))}`);
            lastContextSection = parts.join('\n');
        }

        const prompt = `Kamu adalah AI Router + SQL Generator untuk chatbot eksplorasi database dinamis.

DATABASE & SCHEMA (WAJIB JADI ACUAN UTAMA):
${schemaSection || dbCatalogSummary || 'Belum ada database aktif'}

KONTEKS PERCAKAPAN:
${conversationContext || 'Percakapan baru'}

DATA SESI TERAKHIR:
${lastContextSection || 'Tidak ada data sebelumnya'}

INPUT USER: "${userInput}"

═══════════════════════════════════════
TUGAS: Analisis input user dan jawab dalam format JSON KETAT.

KLASIFIKASI INTENT:
1. DATABASE_QUERY → User ingin mencari/menghitung/menganalisis DATA dari tabel yang tersedia di atas.
   - Contoh: "ada berapa data?", "tampilkan data X", "cari nama Y", "yang nilainya Z"
   - Termasuk follow-up filter: "yang tahun 2020 saja", "kalau dari kota B?"
2. CONVERSATION → HANYA sapaan, ucapan terima kasih, atau percakapan umum.
3. AMBIGUOUS → Benar-benar tidak bisa dimengerti atau tidak berhubungan dengan kolom manapun di database.

ATURAN PENTING & SELF-HEALING:
- Jika user mencari sesuatu yang TIDAK ADA kolomnya di Schema (misal user cari "Hobi" padahal cuma ada "Nama"), JANGAN BUAT SQL. 
- Jika RAGU antara DATABASE_QUERY dan lainnya → PILIH DATABASE_QUERY
- Kamu HARUS menyesuaikan nama kolom dan tebakan filter berdasarkan CONTOH DATA (Sample Rows) yang terlampir di bagian SCHEMA.
- Bebas bahasa: Pahami bahasa gaul, singkatan, dan typo. Terjemahkan ke Indonesia baku dan taruh di 'transformed_query'.
- PENTING (Gelar & Sapaan): JANGAN sertakan gelar (Prof, Dr, Ir, S.T, M.T, dll) atau sapaan (Pak, Bu, Bapak, Ibu) ke dalam parameter SQL LIKE, kecuali jika user secara spesifik bertanya tentang gelar. Fokuslah pada NAMA INTI untuk hasil pencarian yang lebih luas. Contoh: "Pak Bagus Endar" -> WHERE inventor LIKE '%Bagus%' AND inventor LIKE '%Endar%'.
- PENTING (FILTER KOLOM / SLICING): Jika user hanya ingin melihat kolom tertentu (misal: "tampilkan nama dan email saja" atau "judulnya saja"), kamu WAJIB mencantumkan nama-nama kolom tersebut dalam array pada field JSON 'target_columns'. Jika user tidak membatasi, biarkan null.

ATURAN SQL & MULTI-DATABASE (jika intent = DATABASE_QUERY):
- Selalu cocokkan nama tabel dan nama kolom persis seperti yang tertulis di Schema.
- PENTING (PENCARIAN LINTAS DB): Jika satu database (misal 'kekayaan_intelektual') tidak memiliki tabel yang relevan dengan pertanyaan user (misal user tanya 'siapa anggota ujicoba'), kamu HARUS mencari di database lain yang tersedia di skema. Tentukan 'database_hint' dengan nama database yang paling cocok.
- PENTING (PENCARIAN TEKS): JANGAN PERNAH gunakan '=' untuk mencari nama orang, judul, atau instansi. SELALU gunakan pencarian fuzzy LIKE '%kata_kunci%'.
- PENTING (AKURASI & FAKTA): Jika data tidak ditemukan atau kolom tidak ada, JANGAN berhalusinasi. Gunakan intent 'AMBIGUOUS' dan berikan penjelasan singkat di 'natural_response' tentang apa yang tersedia.
- PENTING (JOIN QUERY): Jika user bertanya hubungan antara dua tabel dalam satu database (misal: "tampilkan anggota dan hobinya"), kamu DIPERBOLEHKAN menggunakan JOIN yang valid.
- PENTING (FOLLOW-UP / CONTEXT INHERITANCE): Jika input user adalah pertanyaan lanjutan yang TERIKAT KUAT dengan percakapan sebelumnya (misal: "tampilkan judul-nya", "siapa saja inventornya?", "dari fakultas apa saja?", "apakah ada yang paten?") dan ada 'SQL terakhir' di data sesi, kamu WAJIB MENYALIN klausa 'WHERE' dari SQL terakhir. 
- PENTING (NEW QUERY = JANGAN SALIN KONTEKS): JIKA input user sangat spesifik dan merupakan subjek mandiri (misal: "listkan pertahun", "berapa total paten tahun 2020", "cari nama Budi", "ada yang tentang motor?"), JANGAN copy klausa WHERE dari pertanyaan sebelumnya. Mulailah SQL dari nol. Jangan berasumsi "motor" yang dimaksud adalah milik penemu dari percakapan sebelumnya kecuali user menyuruh eksplisit.
- PENTING (AKURASI SEARCH): Jika user mencari NAMA ORANG/INVENTOR (misal: "Harry Pragoya") dan nama tersebut dirasa typo, JANGAN mencoba mencari data lain yang tidak nyambung (seperti mencari judul atau ID acak). Tetaplah buat kueri SQL dengan NAMA TERSEBUT (LIKE '%Harry%Pragoya%'). Lebih baik sistem mengembalikan 0 hasil agar fitur "Saran Nama Mirip" kami muncul, daripada kamu memberikan data yang salah (halusinasi). JANGAN pernah memaksakan hasil jika data tidak cocok 100%.
- PENTING (GRAFIK/VISUALISASI): Jika user minta "buat grafik per X", "tren Y", atau "diagram", buatlah SQL agregasi (GROUP BY) demi visualisasi yang bermakna. Contoh: SELECT kolom_X, COUNT(*) as total GROUP BY kolom_X.
- PENTING (DOWNLOAD/EXCEL): Jika user minta "download data X" atau "excel", buatlah query yang relevan dengan filter tersebut.
- Minta rincian jenis/kategori: SELECT kolom, COUNT(*) as total GROUP BY kolom
- PENTING (WAKTU & RENTANG): Jika user menyebutkan rentang waktu (misal "dari 2017 sampai 2021" atau "antara tahun X dan Y"), kamu WAJIB menggunakan operator BETWEEN atau >= dan <= pada kolom tanggal asli dari skema. Contoh: WHERE YEAR(tgl_pendaftaran) BETWEEN 2017 AND 2021.
- PENTING (WAKTU): Jika ada kata "peningkatan", "tren", "perkembangan", atau rentang waktu, HARUS gunakan kelompok per tahun (GROUP BY). Gunakan nama kolom tanggal asli (misal: tgl_pendaftaran). Contoh: SELECT YEAR(tgl_pendaftaran) AS tahun, COUNT(*) AS total ... GROUP BY YEAR(tgl_pendaftaran) ORDER BY tahun ASC. JANGAN gunakan teks "kolom_tanggal" sebagai nama kolom.
- Minta jumlah total (hanya jika ditanya "berapa total keseluruhan"): SELECT COUNT(*) AS total
- Minta jumlah entitas unik: SELECT COUNT(DISTINCT kolom) AS total
- Minta data detail: SELECT * ... LIMIT 10 OFFSET 0
- Jika minta daftar nama/identitas saja: SELECT DISTINCT kolom ... LIMIT 50
- JANGAN pernah menggunakan COUNT(*) jika user mencari nama orang berserta keterangannya.
- JANGAN PERNAH menyertakan kalimat instruksi internal bot (seperti "AI mencari data", "Asisten membantu") di dalam 'natural_response' atau field lainnya. Jawab langsung ke inti pertanyaan.

Jawab HANYA dalam JSON (tanpa markdown, tanpa backticks):
{
  "intent": "DATABASE_QUERY",
  "sql": "SELECT ...",
  "database_hint": "nama_db",
  "target_columns": ["kolom1", "kolom2"] | null,
  "entities": { "filter": "nilai" },
  "natural_response": "Pesan jika intent=CONVERSATION atau AMBIGUOUS",
  "transformed_query": "Pertanyaan yang sudah diperjelas"
}`;

        return prompt;
    }

    // Parse JSON response dari AI (toleran terhadap format yang tidak sempurna)
    parseAIResponse(text) {
        if (!text) return null;
        try {
            // Coba langsung parse
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (e) {
            // Coba perbaiki common issues
            try {
                let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
                const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]);
                }
            } catch (e2) {
                console.error('AI Orchestrator: Failed to parse AI response:', e2.message);
            }
        }
        return null;
    }
}

module.exports = new AIOrchestrator();
