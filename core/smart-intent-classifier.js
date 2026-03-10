// ================================================================
// SMART INTENT CLASSIFIER — AI-First + Minimal Regex Safety Net
// Menggantikan regex-heavy intent classification dengan AI
// ================================================================

const INTENT_TYPES = {
    DATABASE_QUERY: 'DATABASE_QUERY',
    FOLLOW_UP: 'FOLLOW_UP',
    CLARIFICATION: 'CLARIFICATION',
    COMMAND: 'COMMAND',
    CONVERSATION: 'CONVERSATION',
    CONFIRMATION: 'CONFIRMATION',
    AMBIGUOUS: 'AMBIGUOUS'
};

const COMMAND_SUBTYPES = {
    PAGINATE_NEXT: 'PAGINATE_NEXT',
    PAGINATE_PREV: 'PAGINATE_PREV',
    PAGINATE_RESET: 'PAGINATE_RESET',
    PAGINATE_RANGE: 'PAGINATE_RANGE',
    SELECT_NUMBER: 'SELECT_NUMBER',
    DATABASE_LIST: 'DATABASE_LIST'
};

class SmartIntentClassifier {

    /**
     * CLASSIFY — AI-First intent classification
     * 
     * Layer 0: Ultra-minimal regex (hanya ~5 pattern yang 100% pasti)
     * Layer 1: AI Classification (handles SEMUA sisanya)
     * 
     * @param {string} input - Raw input dari user
     * @param {Object} session - SessionState dari context manager
     * @param {Object} options - { dbCatalog, askAI function }
     */
    async classify(input, session, options = {}) {
        const q = input.trim();
        const qLower = q.toLowerCase().trim();

        // ═══════════════════════════════════════════
        // LAYER 0: Certainty Check (regex MINIMAL)
        // Hanya untuk input yang 100% pasti, 0 ambiguitas
        // ═══════════════════════════════════════════
        const certainty = this.checkCertainties(qLower, session);
        if (certainty) {
            return certainty;
        }

        // ═══════════════════════════════════════════
        // LAYER 1: AI Classification (UTAMA)
        // Handles: typo, slang, konteks, nuansa, bahasa campur
        // ═══════════════════════════════════════════
        if (options.askAI) {
            const aiResult = await this.aiClassify(q, session, options);
            return aiResult;
        }

        // Fallback jika AI tidak tersedia
        return {
            intent: INTENT_TYPES.DATABASE_QUERY,
            subtype: null,
            confidence: 0.50,
            data: null
        };
    }

    /**
     * LAYER 0: Certainty Check
     * HANYA untuk pattern yang 100% pasti dan tidak butuh AI
     * Total: ~5 pattern saja
     */
    checkCertainties(q, session) {
        // === Angka murni (1, 2, 3...) ===
        const numMatch = q.match(/^\d+$/);
        if (numMatch) {
            return {
                intent: INTENT_TYPES.COMMAND,
                subtype: COMMAND_SUBTYPES.SELECT_NUMBER,
                confidence: 1.0,
                data: { number: parseInt(q) }
            };
        }

        // === COMMAND: Pagination NEXT (deterministic, tidak perlu AI) ===
        if (/^(lagi|lanjut(kan|in)?|berikutnya|next|more|tampilkan lagi|lihat lagi|selanjutnya|mau lagi|mana lagi|terus)$/i.test(q)) {
            return {
                intent: INTENT_TYPES.COMMAND,
                subtype: COMMAND_SUBTYPES.PAGINATE_NEXT,
                confidence: 1.0,
                data: null
            };
        }

        // === COMMAND: Pagination RESET ===
        if (/^(awal|dari awal|ulang|reset|kembali|data (pertama|awal))$/i.test(q)) {
            return {
                intent: INTENT_TYPES.COMMAND,
                subtype: COMMAND_SUBTYPES.PAGINATE_RESET,
                confidence: 1.0,
                data: null
            };
        }

        // === Range pagination eksplisit (data 5-10) ===
        const rangeMatch = q.match(/(?:data|tampilkan|lihat)\s*(?:ke\s+)?(\d+)\s*(?:sampai|hingga|-|sd|s\/d)\s*(\d+)/i);
        if (rangeMatch) {
            return {
                intent: INTENT_TYPES.COMMAND,
                subtype: COMMAND_SUBTYPES.PAGINATE_RANGE,
                confidence: 1.0,
                data: { start: parseInt(rangeMatch[1]), end: parseInt(rangeMatch[2]) }
            };
        }

        // === COMMAND: Visualization / Export (Deterministic) ===
        if (/^(buat(kan)?|tampilkan|lihat|liat|show)?\s*(grafik|diagram|chart|visualisasi).*$/i.test(q)) {
            return { intent: INTENT_TYPES.COMMAND, subtype: 'GENERATE_CHART', confidence: 1.0, data: null };
        }
        if (/^(download|unduh|ekspor|export|simpan|cetak)\s*(data|excel|xlsx|csv|file).*$/i.test(q)) {
            return { intent: INTENT_TYPES.COMMAND, subtype: 'DOWNLOAD_DATA', confidence: 1.0, data: null };
        }

        // === CONVERSATION: Sapaan murni ===
        if (/^(hai|halo|hi|hello|hey|assalamualaikum|selamat (pagi|siang|sore|malam)|apa kabar)$/i.test(q)) {
            return {
                intent: INTENT_TYPES.CONVERSATION,
                subtype: 'GREETING',
                confidence: 1.0,
                data: null
            };
        }

        // === Ya/Tidak saat menunggu konfirmasi ===
        const isWaiting = session?.pendingDataDisplay || session?.wasCountQuery || session?.awaitingConfirmation;
        if (isWaiting) {
            // Pattern 1: Kata tunggal konfirmasi
            if (/^(ya?|y|iya|ok[e]?|oke|boleh|gas|ayo|sip|mantap|lanjut|tampilkan|kasih\s+lihat|liatkan|show|mau|setuju|bisa|dong)$/i.test(q)) {
                return {
                    intent: INTENT_TYPES.CONFIRMATION,
                    subtype: 'CONFIRM_YES',
                    confidence: 1.0,
                    data: { value: true }
                };
            }
            // Pattern 2: Frasa konfirmasi compound (sering digunakan user)
            if (/^(iya\s+coba|coba\s+(?:tampilkan|liatkan|lihatkan|tampil)|ya\s+tampilkan|boleh\s+(?:liatkan|lihatkan|tampilkan)|(?:iya|ya)\s+(?:boleh|mau|dong|sip)|(?:liatkan|lihatkan|tampilkan)\s+(?:data\s*nya|dong|deh)|(?:saya|aku)\s+mau\s+(?:liat|lihat)|mau\s+(?:liat|lihat|dong)|coba\s+(?:liat|lihat)(?:kan)?|boleh\s+(?:liat|lihat)|liatkan\s+(?:data|dengan)|tolong\s+tampilkan|(?:iya|ya)\s+(?:liatkan|lihatkan|tunjukkan)|coba\s+dong).*$/i.test(q)) {
                return {
                    intent: INTENT_TYPES.CONFIRMATION,
                    subtype: 'CONFIRM_YES',
                    confidence: 1.0,
                    data: { value: true }
                };
            }
            if (/^(tidak|no|tdk|ga[k]?|nggak|ngga|jangan|skip|nanti\s+aja|gak\s+usah|gajadi)$/i.test(q)) {
                return {
                    intent: INTENT_TYPES.CONFIRMATION,
                    subtype: 'CONFIRM_NO',
                    confidence: 1.0,
                    data: { value: false }
                };
            }
        }

        // Tidak ada certainty → lanjut ke AI
        return null;
    }

    /**
     * LAYER 1: AI Classification
     * Mengirim konteks lengkap ke AI dan mendapat JSON terstruktur
     */
    async aiClassify(q, session, options) {
        const { askAI, dbCatalog } = options;

        // Build conversation context (5 pesan terakhir)
        const lastMessages = session?.conversationHistory?.slice(-5)
            .map(h => {
                const role = h.role === 'user' ? 'User' : 'Bot';
                const content = (h.content || '').slice(0, 200);
                return `${role}: ${content}`;
            })
            .join('\n') || '(Percakapan baru)';

        // Build session state info
        const stateInfo = [];
        if (session?.wasCountQuery) {
            stateInfo.push('Bot baru saja menampilkan JUMLAH/COUNT data dan bertanya apakah user ingin melihat daftar datanya.');
        }
        if (session?.pendingDataDisplay) {
            stateInfo.push('Bot MENUNGGU KONFIRMASI dari user: apakah ingin melihat daftar data?');
        }
        if (session?.awaitingConfirmation) {
            stateInfo.push('Bot sedang menunggu jawaban YA/TIDAK dari user.');
        }
        if (session?.lastQuestion) {
            stateInfo.push(`Pertanyaan terakhir user yang diproses: "${session.lastQuestion}"`);
        }
        if (session?.lastDatabase) {
            stateInfo.push(`Database terakhir: ${session.lastDatabase}`);
        }
        if (session?.lastTotal) {
            stateInfo.push(`Jumlah data terakhir ditemukan: ${session.lastTotal}`);
        }

        const prompt = `Kamu adalah router intent PRESISI untuk chatbot database Kekayaan Intelektual.

PERCAKAPAN TERAKHIR:
${lastMessages}

STATUS SISTEM SAAT INI:
${stateInfo.length > 0 ? stateInfo.join('\n') : 'Percakapan baru, belum ada state.'}

DATABASE AKTIF:
${dbCatalog?.summary || 'Database Kekayaan Intelektual (paten, hak cipta, merek, desain industri, inventor)'}

PESAN USER SEKARANG: "${q}"

TUGAS: Klasifikasikan intent user. KEMBALIKAN HANYA JSON:
{
  "intent": "CONFIRMATION|DATABASE_QUERY|FOLLOW_UP|CONVERSATION|COMMAND|AMBIGUOUS",
  "subtype": "deskripsi singkat intent (misal: PAGINATE_NEXT, GREETING, COUNT_QUERY, dll)",
  "value": true atau false (KHUSUS untuk CONFIRMATION saja),
  "transformedQuery": "query user yang sudah diperbaiki typo, siap diproses ke SQL",
  "confidence": 0.0 sampai 1.0
}

PANDUAN KLASIFIKASI:
1. CONFIRMATION — User merespons pertanyaan ya/tidak dari bot. Termasuk:
   value:true → "ya", "iya", "mau", "boleh", "tampilkan", "liatkan", "liatin", "gas", "ayo", "coba dong", "ok", "sip", "yaudah", "tunjukin", "kasih liat", "show", "dong", "daftar(nya)", "iya coba lihatkan", "coba tampilkan", "boleh liatkan datanya", "ya tampilkan", "saya mau liat"
   value:false → "tidak", "nggak", "jangan", "skip", "gajadi", "nanti aja", "udah cukup"
   PENTING: Jika STATUS menunjukkan "menunggu konfirmasi" dan user merespons sesuatu yang bermakna persetujuan, itu CONFIRMATION value:true.
   Untuk CONFIRMATION, isi transformedQuery dengan query data yang siap SQL (misal: "berapa banyak paten" → "tampilkan daftar paten").

2. DATABASE_QUERY — Pertanyaan BARU tentang data. Contoh:
   - Hitungan: "berapa banyak paten?", "ada berapa inventor?"
   - Daftar: "tampilkan semua hak cipta", "siapa saja inventor FMIPA?"
   - Analisis: "bandingkan paten 2023 vs 2024", "tren paten per tahun"
   - Penjelasan: "apa itu hak cipta?", "jelaskan paten"
   - Filter: "paten dari STEI yang granted", "inventor luar ITB"
   Isi transformedQuery dengan query yang diperbaiki typo-nya.

3. FOLLOW_UP — Merujuk percakapan SEBELUMNYA:
   - "yang tadi", "itu", "totalnya?", "datanya?", "hasilnya?"
   - "gimana dengan yang barusan?", "maksudnya?"
   - "kalau yang paten?", "yang hak cipta", "kalau merek?"
   - "saya mau liat data yang jenisnya X", "coba tampilkan yang X saja"
   Isi transformedQuery dengan query LENGKAP hasil resolusi referensi (gabungkan konteks sebelumnya).

4. CONVERSATION — Sapaan, terima kasih, pamitan, self-intro:
   - "halo", "selamat pagi", "makasih", "bye", "assalamualaikum"
   - "siapa kamu?", "kamu bisa apa?"
   - PENTING: Jika pesan MENGANDUNG sapaan + pertanyaan/request data (contoh: "assalamualaikum, tampilkan data paten"), 
     tetap klasifikasikan sebagai CONVERSATION subtype GREETING. Handler greeting akan menangani bagian data-nya.
   - Isi transformedQuery dengan SELURUH pesan asli termasuk bagian data query-nya.

5. COMMAND — Perintah navigasi:
   - subtype PAGINATE_NEXT: "lanjut", "next", "lagi", "berikutnya", "selanjutnya"
   - subtype PAGINATE_RESET: "dari awal", "ulang", "reset"
   - subtype DATABASE_LIST: "database apa saja?"

6. AMBIGUOUS — HANYA jika benar-benar mustahil menentukan (sangat jarang).

KOREKSI TYPO di transformedQuery:
- "onvestor"/"investor" → "inventor" (dalam konteks KI, ini SELALU inventor)
- "ptenn" → "paten", "brp" → "berapa", "hakcpt" → "hak cipta"
- "liar itb" → "luar ITB", "fmpa" → "FMIPA"
- "KI" atau "ki" → ini singkatan "Kekayaan Intelektual", PERTAHANKAN sebagai "KI" di transformedQuery
- Perbaiki typo tapi JANGAN ubah maksud user.

ATURAN KRITIS:
- Jika ragu antara DATABASE_QUERY dan intent lain → pilih DATABASE_QUERY.
- SELALU isi transformedQuery untuk intent DATABASE_QUERY, FOLLOW_UP, dan CONFIRMATION.
- Gunakan temperature rendah untuk konsistensi.
- JAWAB HANYA JSON. Tanpa penjelasan, tanpa markdown.`;

        try {
            const res = await askAI(prompt, 0, 0, 0.05);
            const parsed = this.parseJSON(res);

            if (parsed?.intent) {
                const validIntents = Object.values(INTENT_TYPES);
                const intent = validIntents.includes(parsed.intent) ? parsed.intent : INTENT_TYPES.DATABASE_QUERY;

                // Map subtype untuk COMMAND
                let subtype = parsed.subtype || null;
                if (intent === INTENT_TYPES.COMMAND) {
                    if (/next|lanjut|berikut/i.test(subtype)) subtype = COMMAND_SUBTYPES.PAGINATE_NEXT;
                    else if (/reset|awal|ulang/i.test(subtype)) subtype = COMMAND_SUBTYPES.PAGINATE_RESET;
                    else if (/database.*list/i.test(subtype)) subtype = COMMAND_SUBTYPES.DATABASE_LIST;
                    else if (/select|number|nomor/i.test(subtype)) subtype = COMMAND_SUBTYPES.SELECT_NUMBER;
                }

                return {
                    intent,
                    subtype,
                    confidence: Math.min(parsed.confidence || 0.80, 0.95),
                    data: {
                        value: parsed.value !== undefined ? parsed.value : null,
                        transformedQuery: parsed.transformedQuery || null
                    }
                };
            }
        } catch (err) {
            console.error('Smart AI Classification error:', err.message);
        }

        // Fallback: DATABASE_QUERY (karena ini chatbot database)
        return {
            intent: INTENT_TYPES.DATABASE_QUERY,
            subtype: null,
            confidence: 0.50,
            data: { transformedQuery: q }
        };
    }

    /**
     * Parse JSON dari response AI (toleran terhadap noise)
     */
    parseJSON(text) {
        if (!text) return null;
        try {
            // Cari JSON object dalam response
            const match = text.match(/\{[\s\S]*\}/);
            if (!match) return null;

            // Clean up common AI mistakes
            let jsonStr = match[0]
                .replace(/,\s*}/g, '}')           // trailing comma
                .replace(/'/g, '"')                // single quotes
                .replace(/(\w+):/g, '"$1":')       // unquoted keys
                .replace(/""/g, '"');               // double quotes

            // Try parsing cleaned version first, then original
            try {
                return JSON.parse(jsonStr);
            } catch {
                return JSON.parse(match[0]);
            }
        } catch { return null; }
    }
}

module.exports = new SmartIntentClassifier();
module.exports.INTENT_TYPES = INTENT_TYPES;
module.exports.COMMAND_SUBTYPES = COMMAND_SUBTYPES;
