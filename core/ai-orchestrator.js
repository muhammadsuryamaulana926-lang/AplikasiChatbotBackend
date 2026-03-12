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
            DATABASE_LIST: /database\s+(apa|mana)\s*(saja|aja)?|ada\s+(berapa\s+)?database|list.*database|database.*aktif|database.*tersedia|db\s+(apa|mana|aktif)|ada\s+db\s+apa/i,
            SELECT_NUMBER: /^(?:detail\s+)?(\d+)$|^(?:no\.?\s*|nomor\s*)(\d+)$/i,
        };

        this.CONFIRM_YES = /(?:^|\b)(?:ya+|iya+|yaps?|y|mau|boleh|silakan|gas|tampilkan|lihat|liat|liatkan|liatin|show|tunjukin|kasih liat|ok|oke|okey|sip|siap|dong|daftar|list|mana saja|apa saja|namanya|lanjut|lakukan|tampil)\b/i;
        this.CONFIRM_NO = /(?:^|\b)(?:tidak|nggak|gak|no|nope|ga|enggak|ndak|tdk|jangan|skip)\b/i;
        
        // Safety: ensure common name words aren't blocked
        this.NAME_PRESERVE = /\b(pekik|argo|endar|agus|budi)\b/i;

        // Perintah grafik/export — tetap regex karena 100% pasti
        this.CHART_CMD = /\b(grafik(?:nya)?|diagram(?:nya)?|chart(?:nya)?|buatkan\s+grafik|bikin\s+grafik|tampilkan\s+grafik|buat\s+grafik|bikin\s+diagram|buatkan\s+diagram|jadikan\s+(?:grafik|grafil|gravis|grafic|graph))\b/i;
        this.EXPORT_CMD = /\b(export|unduh|download|csv|excel|ekspor|exel|xls|xlsx|jadikan\s+(?:exel|excel|escel|eksel|xs|xsl|xlsx))\b/i;
        this.EXPORT_PDF_CMD = /\b(pdf|pdh|pfd|buatkan\s+pdf|export\s+pdf|download\s+pdf|bikin\s+pdf|cetak\s+pdf|unduh\s+pdf|jadikan\s+(?:pdf|pdh|pfd)|jadiin\s+(?:pdf|pdh|pfd))\b/i;
        this.DASHBOARD_CMD = /\b(dashboard(?:nya)?|dashbod(?:nya)?|desbor[dt]?(?:nya)?|visualisasi\s+interaktif|buka\s+(?:dashboard|dashbod|desbor[dt]?)|buatkan\s+(?:dashboard|dashbod|desbor[dt]?)|tampilkan\s+(?:dashboard|dashbod|desbor[dt]?)|jadikan\s+(?:dashboard|dashbod|desbor[dt]?))\b/i;

        // Sapaan murni — cepat tanpa AI (Toleran tanda baca)
        this.GREETING = /^(hai|halo|hi|hello|assalamualaikum|selamat (pagi|siang|sore|malam)|apa kabar|hey|salam|pagi|siang|malam|halo(.*)bot)[.?!\s]*$/i;
        this.THANKS = /^(terima kasih|makasih|thanks|thank you|thx|ok(e)? (makasih|terima kasih)|sip (makasih|terima kasih)?|siap|siap terimaksih|siap terimakasih|siap (makasih|terimakasih|terima kasih)|okee|oke siap|yoi|oke terimakasih|ok siap|oke siap|siap bosque|mantap|ok mantap|sip mantap)[.?!\s]*$/i;
        this.GOODBYE = /^(sampai jumpa|bye|dadah|selamat tinggal|pamit|udahan|cukup|dah)[.?!\s]*$/i;
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
        const isAwaitingConfirm = lastEntry?.pendingDataDisplay || lastEntry?.wasCountQuery || session?.awaitingConfirmation || lastEntry?.pendingOffer;
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

        // Catch-all for short confirmations like "ya", "tampilkan", "liatkan"
        if (qLower.length < 25 && this.CONFIRM_YES.test(qLower)) {
            return { intent: 'CONFIRMATION', value: true, confidence: 0.90 };
        }

        // Pattern: "ki 2024", "data ki 2016", "coba yang 2021 deh", "tahun 2020", "ada berapa 2006"
        const yearPattern = /(?:\b(ki|paten|hak cipta|merek|data)\b)?.*?\b(20\d{2}|19\d{2})\b/i;
        const yearMatch = qLower.match(yearPattern);
        
        const hasCountWord = /\b(berapa|total|jumlah|banyak)\b/i.test(qLower);
        const hasSubject = !!yearMatch?.[1];
        const isShortYear = /^\d{4}$/.test(qLower);
        const hasHelper = /\b(yang|coba|deh|tahun|thn)\b/i.test(qLower);

        if (yearMatch && (hasSubject || isShortYear || hasHelper)) {
            const subject = yearMatch[1]?.toLowerCase() || 'data';
            const year = yearMatch[2];
            const selectClause = hasCountWord ? "SELECT COUNT(*) AS total" : "SELECT *";
            
            let whereClause = `(tgl_pendaftaran LIKE '%${year}%')`;
            if (subject.includes('paten')) whereClause = `jenis_ki LIKE '%Paten%' AND (tgl_pendaftaran LIKE '%${year}%')`;
            if (subject.includes('hak cipta')) whereClause = `jenis_ki LIKE '%Hak Cipta%' AND (tgl_pendaftaran LIKE '%${year}%')`;

            return {
                intent: 'DATABASE_QUERY',
                database_hint: 'itb_db', 
                sql: `${selectClause} FROM kekayaan_intelektual WHERE ${whereClause} LIMIT 10 OFFSET 0`,
                confidence: 0.85,
                entities: { year, subject, isCount: hasCountWord },
                action: 'DATABASE_QUERY',
                targetDb: 'itb_db'
            };
        }

        return null;
    }

    // ════════════════════════════════════════════════════════════════
    // AI CLASSIFY + SQL — Satu panggilan AI untuk semuanya
    // ════════════════════════════════════════════════════════════════
    buildUnifiedPrompt(userInput, schemaInfo, conversationContext, dbCatalogSummary, lastEntry) {
        // Load System Grounding (Stats from api-databases.json for extreme accuracy)
        let sysStats = "";
        try {
            const fs = require('fs');
            const path = require('path');
            const statsPath = path.join(__dirname, '..', 'api-databases.json');
            if (fs.existsSync(statsPath)) {
                const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
                sysStats = stats.map(s => `- Database ${s.name}: Berisi ${s.records} data (terakhir diperbarui ${s.importedAt})`).join('\n');
            }
        } catch (e) {}

        let schemaSection = '';
        if (schemaInfo && Object.keys(schemaInfo).length > 0) {
            const schemas = [];
            for (const [dbName, tables] of Object.entries(schemaInfo)) {
                const tableDescs = Object.entries(tables).map(([tName, tInfo]) => {
                    const sampleRow = tInfo.sample_rows?.[0] || {};
                    const sampleStr = JSON.stringify(sampleRow, (k, v) => typeof v === 'bigint' ? v.toString() : v).substring(0, 300);
                    return `  Tabel: ${tName}\n  Kolom: ${tInfo.columns}\n  Contoh Data: ${sampleStr}`;
                }).join('\n');
                schemas.push(`Database: ${dbName}\n${tableDescs}`);
            }
            schemaSection = schemas.join('\n\n');
        }

        let lastContextSection = '';
        if (lastEntry) {
            const parts = [];
            if (lastEntry.lastQuestion) parts.push(`Pertanyaan terakhir user: "${lastEntry.lastQuestion}"`);
            if (lastEntry.lastSqlQuery) parts.push(`SQL terakhir yang sukses: ${lastEntry.lastSqlQuery.substring(0, 150)}`);
            if (lastEntry.lastDatabase) parts.push(`Database terakhir: ${lastEntry.lastDatabase}`);
            if (lastEntry.lastTotal !== undefined) parts.push(`Total data ditemukan sebelumnya: ${lastEntry.lastTotal}`);
            lastContextSection = parts.join('\n');
        }

        let insightsSection = '';
        try {
            const profilesObj = typeof dbCatalogSummary === 'string' ? JSON.parse(dbCatalogSummary) : dbCatalogSummary;
            const insights = [];
            for (const [db, p] of Object.entries(profilesObj)) {
                if (p.insights && !p.insights.error) {
                    insights.push(`- Database [${db}]: Topik utama adalah ${p.insights.topic}. 
                      Poin analitik kunci: ${(p.insights.analytic_points || []).join(', ')}.
                      Prediksi pertanyaan user: ${(p.insights.typical_questions || []).join(', ')}.`);
                }
            }
            if (insights.length > 0) {
                insightsSection = `\nDATABASE ANALYTIC INSIGHTS (Telah dipelajari AI):\n${insights.join('\n')}\n`;
            }
        } catch (e) {}

        const prompt = `Kamu adalah Pakar Database & AI Router untuk ITB Support Research. 

---
STATISTIK SISTEM (GROUNDING):
${sysStats || 'Memuat data...'}

SCHEMA DATABASE (ACUAN MUTLAK):
${schemaSection || (typeof dbCatalogSummary === 'string' ? dbCatalogSummary : JSON.stringify(dbCatalogSummary))}

${insightsSection}
---

PERINGATAN KERAS (ANTI-HALUSINASI): 
1. JANGAN PERNAH gunakan nama tabel selain yang ada di daftar SCHEMA di atas. 
2. Di database 'itb_db', tabelnya adalah 'kekayaan_intelektual'. JANGAN PERNAH gunakan 'ki', 'intellectual_property', atau 'data'.
3. Jika user menyebut FAKULTAS (seperti FTTM, FTI, SITH), kamu WAJIB memfilter kolom 'fakultas_inventor'. 
   Contoh: "ki fttm" -> WHERE fakultas_inventor LIKE '%FTTM%'
4. Jika user menyebut nomor alfanumerik (seperti E300...), itu adalah kolom 'no_permohonan'.
5. Jika user bertanya "peningkatan", "tren", atau "perbandingan tahun", gunakan GROUP BY (contoh: SELECT SUBSTRING(tgl_pendaftaran, 1, 4) as tahun, COUNT(*) as jumlah FROM ... GROUP BY tahun).
6. **Matematika & Analitik**: Jika user meminta perhitungan matematika (contoh: "berapa persentasenya", "jumlahkan A dan B"), AI harus membuat SQL yang mengambil angka-angka mentah dan menjelaskan langkah perhitungannya.
7. **LIST vs COUNT (PENTING)**:
   - Jika user berkata "tampilkan", "daftar", "siapa saja", "apa saja", "lihat", atau "data", kamu WAJIB gunakan 'SELECT *'.
   - Hanya gunakan 'SELECT COUNT(*)' JIKA user bertanya "berapa", "jumlah", "total", atau "banyak".
   - JANGAN menawarkan ringkasan jika user sudah minta "lihat data". Langsung tampilkan datanya.

---

KONTEKS PERCAKAPAN:
${conversationContext || 'Percakapan baru'}

DATA SESI TERAKHIR:
${lastContextSection || 'Tidak ada data sebelumnya'}

INPUT USER SAAT INI: "${userInput}"

---
ATURAN PENTING (GROUNDING & ACCURACY):
1. **Pembersihan Kata (Conversational Pruning)**: 
   - KELUARKAN kata-kata pengisi seperti "coba cek", "tolong", "ada gak nannya", "ya", "saja" dari filter SQL.
   - Contoh: "data ki yang Erika yuni coba" -> SQL: WHERE inventor LIKE '%Erika%Yuni%'. 

2. **Fuzzy Search Strategy**:
   - Selalu gunakan LIKE '%...%' untuk string. 
   - Gabungkan kata kunci dengan % (Erika%Yuni).

3. **Intent Classification**:
   - DATABASE_QUERY: Mencari/menghitung data.
   - CONVERSATION: Sapaan atau konfirmasi pendek (Ya, oke, makasih, siap).
   - AMBIGUOUS: Tidak nyambung.

4. **Column Adherence**:
   - Jika user meminta kolom spesifik (contoh: "nama dan email saja"), kamu WAJIB memasukkan kolom tersebut ke SQL (SELECT nama, email FROM ...) dan meletakkannya di target_columns.

5. **JSON Format**: Jawab hanya dalam JSON murni.
{
  "intent": "DATABASE_QUERY" | "CONVERSATION" | "AMBIGUOUS",
  "sql": "SELECT ...",
  "database_hint": "itb_db",
  "target_columns": ["judul", "jenis_ki", "inventor", "tgl_pendaftaran"],
  "entities": { "filter": "nilai" },
  "natural_response": "Pesan ramah",
  "transformed_query": "Instruksi bersih"
}

PERINGATAN AKURASI SEARCH: 
- User sering mengetik: "liatkan data ki yang Erika yuni coba"
- SQL yang BENAR: SELECT * FROM kekayaan_intelektual WHERE inventor LIKE '%Erika%Yuni%'
- JANGAN PERNAH masukkan kata "coba", "data", "liatkan", "yang", atau "punya" ke dalam filter SQL. HANYA ambil nama asli subjeknya.
`;
        return prompt;
    }

    parseAIResponse(text) {
        if (!text) return null;
        try {
            let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
            const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (e) {
            console.error('AI Orchestrator: Failed to parse AI response:', e.message);
            try {
                return JSON.parse(text.trim());
            } catch(e2) {}
        }
        return null;
    }

    stripPromptLeak(text) {
        if (!text || typeof text !== 'string') return text || '';
        let cleaned = text.replace(/^(Asisten|AI|Sistem|Berikut|Tentu|Baik|Daftar Lengkap|Struktur Jawaban|Instruksi|Template)(.*?)?:\s*/gi, '').trim();
        cleaned = cleaned.replace(/^Sure, here is the list:|^Tentu, ini datanya:|^Ok, let me look that up:|^Berikut daftar|^\[Nilai\]/gi, '').trim();
        cleaned = cleaned.replace(/\[Nilai\]/g, '-').replace(/\[JUDUL.*?\]/g, '');
        return cleaned || text; 
    }
}

module.exports = new AIOrchestrator();
