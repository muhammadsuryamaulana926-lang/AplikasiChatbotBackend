// ================================================================
// INTENT CLASSIFIER — 7 Tipe Intent + Context-Aware + AI Fallback
// Menggantikan routeIntent() yang hanya 2 tipe
// ================================================================

const INTENT_TYPES = {
    DATABASE_QUERY: 'DATABASE_QUERY',     // Minta data dari DB
    FOLLOW_UP: 'FOLLOW_UP',              // Lanjutan pertanyaan sebelumnya
    CLARIFICATION: 'CLARIFICATION',      // Klarifikasi jawaban sebelumnya
    COMMAND: 'COMMAND',                   // Perintah (lanjut, reset, detail X)
    CONVERSATION: 'CONVERSATION',        // Sapaan, terima kasih, chit-chat
    CONFIRMATION: 'CONFIRMATION',        // Ya/tidak sebagai jawaban
    AMBIGUOUS: 'AMBIGUOUS'               // Tidak jelas, perlu klarifikasi
};

const COMMAND_SUBTYPES = {
    PAGINATE_NEXT: 'PAGINATE_NEXT',
    PAGINATE_PREV: 'PAGINATE_PREV',
    PAGINATE_RESET: 'PAGINATE_RESET',
    PAGINATE_RANGE: 'PAGINATE_RANGE',
    SELECT_NUMBER: 'SELECT_NUMBER',
    DATABASE_LIST: 'DATABASE_LIST'
};

class IntentClassifier {

    /**
     * CLASSIFY — tentukan intent dari input user (3-layer approach)
     *
     * Layer 1: Rule-based quick match (instant, high confidence)
     * Layer 2: Context-aware classification (uses session state)
     * Layer 3: AI-assisted (only if needed, costs API call)
     *
     * @param {string} input - Input user yang sudah di-normalize
     * @param {Object} session - SessionState dari context manager
     * @param {Object} options - { dbCatalog, askAI function }
     * @returns {{ intent: string, subtype: string|null, confidence: number, data: Object|null }}
     */
    async classify(input, session, options = {}) {
        const q = input.trim();
        const qLower = q.toLowerCase();

        // ═══════════════════════════════════════════
        // LAYER 1: Rule-based Quick Match
        // ═══════════════════════════════════════════
        const quickResult = this.quickClassify(qLower, session);
        if (quickResult.confidence >= 0.90) {
            return quickResult;
        }

        // ═══════════════════════════════════════════
        // LAYER 2: Context-Aware Classification
        // ═══════════════════════════════════════════
        const contextResult = this.contextClassify(qLower, q, session);
        if (contextResult.confidence >= 0.80) {
            return contextResult;
        }

        // ═══════════════════════════════════════════
        // LAYER 3: AI-Assisted Classification
        // ═══════════════════════════════════════════
        if (options.askAI && options.dbCatalog) {
            const aiResult = await this.aiClassify(q, session, options);
            return aiResult;
        }

        // Default: DATABASE_QUERY (karena ini chatbot database)
        return {
            intent: INTENT_TYPES.DATABASE_QUERY,
            subtype: null,
            confidence: 0.60,
            data: null
        };
    }

    /**
     * LAYER 1: Rule-Based Quick Match
     * Untuk pattern yang sudah pasti (commands, confirmations, pure greetings)
     */
    quickClassify(qLower, session) {
        const q = qLower.trim();

        // === COMMAND: Pagination ===
        if (q.match(/^(lagi|lanjut(kan)?|berikutnya|next|more|tampilkan lagi|lihat lagi|selanjutnya|mau lagi|mana lagi)/i)) {
            return { intent: INTENT_TYPES.COMMAND, subtype: COMMAND_SUBTYPES.PAGINATE_NEXT, confidence: 0.95, data: null };
        }

        if (q.match(/^(awal|dari awal|ulang|reset|kembali|data (pertama|awal)|tampilkan (lagi )?(data )?(1|pertama)|dari (data )?1)/i)) {
            return { intent: INTENT_TYPES.COMMAND, subtype: COMMAND_SUBTYPES.PAGINATE_RESET, confidence: 0.95, data: null };
        }

        // === COMMAND: Range Pagination ===
        const rangeMatch = q.match(/(?:data|tampilkan|lihat)\s*(?:yang\s+)?(?:ke\s+)?(\d+)\s*(?:sampai|hingga|-|sd|s\/d)\s*(\d+)/i);
        if (rangeMatch) {
            return {
                intent: INTENT_TYPES.COMMAND,
                subtype: COMMAND_SUBTYPES.PAGINATE_RANGE,
                confidence: 0.95,
                data: { start: parseInt(rangeMatch[1]), end: parseInt(rangeMatch[2]) }
            };
        }

        // === COMMAND: Database list ===
        if (q.match(/database\s+(apa|mana)\s*(saja|aja)?|ada\s+database|list.*database/i)) {
            return { intent: INTENT_TYPES.COMMAND, subtype: COMMAND_SUBTYPES.DATABASE_LIST, confidence: 0.95, data: null };
        }

        // === CONFIRMATION: Ya / Tidak ===
        if (session && (session.awaitingConfirmation || session.pendingDataDisplay)) {
            if (q.match(/^(ya+|iya+|yaps?|y|mau|boleh|silakan|gas|tampilkan|lihat|liat|liatkan|liatin|show|tunjukin|kasih liat|ok|oke|okey|sip|dong)\b/i)) {
                return { intent: INTENT_TYPES.CONFIRMATION, subtype: 'CONFIRM_YES', confidence: 0.95, data: { value: true } };
            }
            if (q.match(/^(tidak|nggak|gak|no|nope|ga|enggak|ndak|tdk|jangan|skip)\b/i)) {
                return { intent: INTENT_TYPES.CONFIRMATION, subtype: 'CONFIRM_NO', confidence: 0.95, data: { value: false } };
            }
        }

        // === CONFIRMATION: Ya/Tidak setelah COUNT query ===
        if (session && (session.wasCountQuery || session.pendingDataDisplay)) {
            if (q.match(/^(ya+|iya+|yaps?|y|mau|boleh|silakan|gas|tampilkan|lihat|liat|liatkan|liatin|show|daftar|list|mana saja|apa saja|namanya|tunjukin|kasih liat|dong)\b/i)) {
                return { intent: INTENT_TYPES.CONFIRMATION, subtype: 'CONFIRM_YES', confidence: 0.95, data: { value: true } };
            }
            if (q.match(/^(tidak|nggak|gak|no|nope|ga|enggak|ndak|tdk|jangan|skip)\b/i)) {
                return { intent: INTENT_TYPES.CONFIRMATION, subtype: 'CONFIRM_NO', confidence: 0.95, data: { value: false } };
            }
        }

        // === CONVERSATION: Sapaan murni ===
        if (q.match(/^(hai|halo|hi|hello|assalamualaikum|selamat (pagi|siang|sore|malam)|apa kabar|hey)$/i)) {
            return { intent: INTENT_TYPES.CONVERSATION, subtype: 'GREETING', confidence: 0.95, data: null };
        }

        // === CONVERSATION: Terima kasih / pamitan ===
        if (q.match(/^(terima kasih|makasih|thanks|thank you|thx|ok(e)? (makasih|terima kasih)|sip (makasih|terima kasih)?)$/i)) {
            return { intent: INTENT_TYPES.CONVERSATION, subtype: 'THANKS', confidence: 0.95, data: null };
        }
        if (q.match(/^(sampai jumpa|bye|dadah|selamat tinggal|pamit)$/i)) {
            return { intent: INTENT_TYPES.CONVERSATION, subtype: 'GOODBYE', confidence: 0.95, data: null };
        }

        // === COMMAND: User ketik nomor ===
        const numMatch = q.match(/^(?:detail\s+)?(\d+)$|^(?:no\.?\s*|nomor\s*)(\d+)$/i);
        if (numMatch) {
            const num = parseInt(numMatch[1] || numMatch[2]);
            return {
                intent: INTENT_TYPES.COMMAND,
                subtype: COMMAND_SUBTYPES.SELECT_NUMBER,
                confidence: 0.90,
                data: { number: num }
            };
        }

        // Tidak ada match pasti
        return { intent: null, subtype: null, confidence: 0, data: null };
    }

    /**
     * LAYER 2: Context-Aware Classification
     * Menggunakan session state untuk menentukan apakah input adalah follow-up
     */
    contextClassify(qLower, originalQ, session) {
        if (!session) {
            return { intent: null, subtype: null, confidence: 0, data: null };
        }

        // === FOLLOW-UP: Cek apakah pertanyaan ini merujuk ke pertanyaan sebelumnya ===
        if (session.isFollowUp && session.isFollowUp(originalQ)) {
            const resolved = session.resolveReference ? session.resolveReference(originalQ) : null;

            return {
                intent: INTENT_TYPES.FOLLOW_UP,
                subtype: resolved?.type || 'GENERAL_FOLLOWUP',
                confidence: 0.85,
                data: resolved
            };
        }

        // === QUERY MODIFICATION: Input pendek + ada lastSqlQuery ===
        if (session.lastSqlQuery && originalQ.length < 80) {
            // Pattern: tambah kolom, ganti filter, ganti sorting
            const modPatterns = [
                /\b(tambah(kan)?|hapus|ganti|ubah)\s+(kolom|filter|urutan|sort)/i,
                /\b(urutkan|sort)\s+(berdasarkan|by)\b/i,
                /\b(filter|hanya|saring)\s+(yang|data)\b/i,
                /\b(tanpa|kecuali|exclude)\s+/i
            ];

            if (modPatterns.some(p => p.test(originalQ))) {
                return {
                    intent: INTENT_TYPES.FOLLOW_UP,
                    subtype: 'QUERY_MODIFICATION',
                    confidence: 0.85,
                    data: { lastSQL: session.lastSqlQuery, lastDB: session.lastDatabase }
                };
            }
        }

        // === AMBIGUOUS: Input terlalu pendek tanpa context ===
        if (qLower.length <= 2 && !session.awaitingConfirmation) {
            return {
                intent: INTENT_TYPES.AMBIGUOUS,
                subtype: 'TOO_SHORT',
                confidence: 0.90,
                data: null
            };
        }

        return { intent: null, subtype: null, confidence: 0, data: null };
    }

    /**
     * LAYER 3: AI-Assisted Classification
     * Menggunakan AI hanya jika Layer 1 & 2 tidak bisa menentukan
     */
    async aiClassify(q, session, options) {
        const { askAI, dbCatalog } = options;
        const contextStr = session?.conversationHistory?.slice(-5)
            .map(h => `${h.role === 'user' ? 'User' : 'Asisten'}: ${h.content?.slice(0, 150)}`)
            .join('\n') || 'Percakapan baru';

        const prompt = `Kamu adalah router intent cerdas untuk asisten database.

Database yang aktif:
${dbCatalog?.summary || 'Tidak ada database'}

Konteks percakapan:
${contextStr}

Pertanyaan user: "${q}"

KLASIFIKASI INTENT:
- DATABASE_QUERY: Pertanyaan yang meminta menghitung, mencari, menampilkan, mengurutkan data, ATAU meminta informasi topik database.
- FOLLOW_UP: Pertanyaan lanjutan yang merujuk ke percakapan sebelumnya ("yang tadi", "itu", "totalnya").
- CONVERSATION: HANYA sapaan, terima kasih, chit-chat, pamitan, tanya identitas.
- AMBIGUOUS: Pertanyaan tidak jelas, terlalu singkat, ambigu, perlu klarifikasi.

TOLERANSI TYPO: Pahami maksud walaupun ada typo (misal "tampipk" = "tampilkan").

PENTING:
- Jika ragu antara DATABASE_QUERY dan lainnya, PILIH DATABASE_QUERY.
- Jika pertanyaan berkaitan dengan topik data (KI, paten, inventor, dll), SELALU pilih DATABASE_QUERY.
- AMBIGUOUS HANYA jika benar-benar tidak bisa ditentukan sama sekali.

Jawab HANYA dengan JSON:
{"intent": "DATABASE_QUERY|FOLLOW_UP|CONVERSATION|AMBIGUOUS", "confidence": 0.0-1.0}`;

        try {
            const res = await askAI(prompt, 0, 0, 0.1);
            const parsed = this.parseJSON(res);

            if (parsed?.intent) {
                const validIntents = Object.values(INTENT_TYPES);
                const intent = validIntents.includes(parsed.intent) ? parsed.intent : INTENT_TYPES.DATABASE_QUERY;

                return {
                    intent,
                    subtype: null,
                    confidence: parsed.confidence || 0.75,
                    data: null
                };
            }
        } catch (err) {
            console.error('AI Classification error:', err.message);
        }

        // Fallback: DATABASE_QUERY
        return {
            intent: INTENT_TYPES.DATABASE_QUERY,
            subtype: null,
            confidence: 0.60,
            data: null
        };
    }

    /**
     * JSON Parser helper
     */
    parseJSON(text) {
        if (!text) return null;
        try {
            const match = text.match(/\{[\s\S]*?\}/);
            return match ? JSON.parse(match[0]) : null;
        } catch { return null; }
    }
}

module.exports = new IntentClassifier();
module.exports.INTENT_TYPES = INTENT_TYPES;
module.exports.COMMAND_SUBTYPES = COMMAND_SUBTYPES;
