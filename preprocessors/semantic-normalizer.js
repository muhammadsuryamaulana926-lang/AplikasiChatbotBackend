// ================================================================
// SEMANTIC NORMALIZER — Layer 2
// Memahami STRUKTUR kalimat, bukan hanya kata-kata
// Bekerja SETELAH input-normalizer (SLANG_MAP)
// ================================================================

class SemanticNormalizer {

    constructor() {
        // Pola kalimat → transformasi cerdas
        this.SEMANTIC_PATTERNS = [

            // ── KOREKSI / RALAT MID-SENTENCE ──────────────────────────────────
            // "eh tunggu, yang saya maksud paten"  "bukan, yang dimaksud hak cipta"
            {
                id: 'CORRECTION',
                pattern: /^(?:eh\s+)?(?:tunggu|wait|bukan|ralat|salah|maaf|koreksi|maksudnya|yang dimaksud|yang saya maksud|yang saya mau|yang bener)[,.]?\s+(.+)$/i,
                transform: (m) => ({ normalized: m[1].trim(), meta: { wasCorrection: true } })
            },

            // ── KOMENTAR / EKSPRESI (BUKAN QUERY) ─────────────────────────────
            // "ini banyak banget ya", "wah seru juga", "oke mantap"
            {
                id: 'COMMENT',
                pattern: /^(?:wah|wow|oke|ok|sip|bagus|mantap|keren|luar biasa|hebat|asyik|seru|banyak juga|banyak banget|sedikit juga|sedikit banget|terima kasih|makasih|thanks|thx)\b.{0,40}$/i,
                transform: (m, original) => {
                    // Cek jika ini sebenarnya closing
                    if (this.isClosing(original)) return null;
                    return { normalized: null, meta: { isComment: true, original } };
                }
            },

            // ── PENUTUPAN / SELESAI ───────────────────────────────────────────
            // "oke sudah cukup", "makasih ya", "sampai jumpa", "baik terima kasih"
            {
                id: 'CLOSING',
                pattern: /^(?:oke|baik|siap|sip|ok|siip)\s*(?:sudah\s+)?(?:cukup|selesai|udahan|berhenti|stop|clear|makasih|terimakasih|terima kasih|thanks|thx|tq|bungkus|sampai jumpa|bye|udahan dulu|tuntas)\b.{0,25}$/i,
                transform: (m, original) => ({ normalized: null, meta: { isClosing: true, original } })
            },

            // ── VARIASI "YANG MIRIP QUERY SEBELUMNYA" ─────────────────────────
            // "coba yang versi FMIPA", "yang kaya gitu tapi 2024", "yang sama tapi paten"
            {
                id: 'VARIATION_PREVIOUS',
                pattern: /^(?:coba\s+)?yang\s+(?:kaya\s+gitu|serupa|sama)\s+tapi\s+(.+)$/i,
                transform: (m, original, context) => {
                    const lastQ = context?.lastQuestion || '';
                    return { normalized: lastQ ? `${lastQ} ${m[1]}` : original, meta: { inheritedContext: true } };
                }
            },
            {
                id: 'VARIATION_VERSION',
                pattern: /^(?:coba\s+)?yang\s+(?:versi\s+)?(.+?)\s+(?:nya|saja|aja|doang)$/i,
                transform: (m, original, context) => {
                    const lastQ = context?.lastQuestion || '';
                    const filter = m[1].trim();
                    return { normalized: lastQ ? `${lastQ} dari ${filter}` : original, meta: { addedFilter: filter } };
                }
            },

            // ── "TAPI YANG X" — filter tambahan ───────────────────────────────
            // "tapi yang paten", "tapi tahun 2023", "tapi dari FMIPA"
            {
                id: 'BUT_FILTER',
                pattern: /^(?:tapi|tetapi|tapiii+|namun)\s+(?:yang\s+)?(.+)$/i,
                transform: (m, original, context) => {
                    const lastQ = context?.lastQuestion || '';
                    return { normalized: lastQ ? `${lastQ} ${m[1]}` : original, meta: { addedFilter: m[1] } };
                }
            },

            // ── "BAGAIMANA KALAU X" → tampilkan X ─────────────────────────────
            {
                id: 'HOW_ABOUT',
                pattern: /^(?:bagaimana|gimana|gmn)\s+(?:kalau|kalo|jika|dengan)\s+(.+?)[\?\.]*$/i,
                transform: (m) => ({ normalized: `tampilkan ${m[1]}`, meta: {} })
            },

            // ── PERTANYAAN RETORIS (ISI KONTEN, BUKAN QUERY DB) ──────────────
            // "kenapa ada yang gagal?", "kok bisa banyak banget?"
            {
                id: 'RHETORICAL',
                pattern: /^(?:kenapa|mengapa|kok|masa|masa iya|masa sih|emangnya|emang)\s+(?:ada|bisa|banyak|sedikit|tidak|gak|ga\s+ada).{0,60}[\?\.]*$/i,
                transform: (m, original) => ({ normalized: null, meta: { isRhetorical: true, original } })
            },

            // ── PERMINTAAN DENGAN JUMLAH SPESIFIK ─────────────────────────────
            // "kasih 5 saja", "tampilkan 20 data", "lihat 3 saja ya"
            {
                id: 'LIMIT_PREFIX',
                pattern: /^(?:kasih|tampilkan|lihat|cari|show|gimme)\s+(\d+)\s+(?:saja|aja|data|buah|item)?\s*(.*)$/i,
                transform: (m) => ({
                    normalized: `tampilkan ${m[2] || ''} limit ${m[1]}`.trim(),
                    meta: { explicitLimit: parseInt(m[1]) }
                })
            },

            // ── PERTANYAAN "DARI SEMUA X, MANA YANG Y" ──────────────────────
            // "dari semua paten, mana yang terbaru?", "dari itu, mana yang paling lama?"
            {
                id: 'FROM_ALL_WHICH',
                pattern: /^dari\s+(?:semua\s+)?(.+?)[,]?\s+mana\s+yang\s+(.+?)[\?\.]*$/i,
                transform: (m) => ({ normalized: `${m[2]} dari ${m[1]}`, meta: {} })
            },

            // ── "ADA GAK/GK" → cek eksistensi ────────────────────────────────
            // "ada gak ki yang...?", "ada nggak data yang...?"
            // "apakah ada ki yang dari 2015?"
            {
                id: 'EXISTENCE_CHECK',
                pattern: /^(?:apakah\s+)?ada\s+(?:gak|gk|nggak|tidak|ngga|ga)?\s*(?!berapa|apa\s+saja|siapa|di\s+mana)(ki|KI|data\s*ki|data|paten|hak cipta|merek|desain industri|inventor)?\s*(?:yang\s+)?(?:dari\s+)?(.+)\s*[?\.]*$/i,
                transform: (m) => {
                    // Preserve entity context (ki, paten, etc.)
                    const entity = (m[1] || '').trim();
                    const filter = (m[2] || '').trim();
                    if (!filter) return null; // Skip if no meaningful filter

                    // Build query that preserves entity and filter
                    let entityLabel = '';
                    if (/^(ki|KI|data\s*ki)$/i.test(entity)) entityLabel = 'data KI';
                    else if (entity) entityLabel = `data ${entity}`;
                    else entityLabel = 'data KI';

                    // Check if filter contains a year
                    const yearMatch = filter.match(/\b(19\d{2}|20\d{2})\b/);
                    if (yearMatch) {
                        return { normalized: `tampilkan ${entityLabel} tahun ${yearMatch[1]}`, meta: { isExistenceCheck: true } };
                    }

                    return { normalized: `tampilkan ${entityLabel} yang ${filter}`, meta: { isExistenceCheck: true } };
                }
            },

            // ── "SIAPA X YANG Y" → daftar berfilter ──────────────────────────
            // "siapa inventor yang paling banyak paten?"
            {
                id: 'WHO_FILTER',
                pattern: /^siapa\s+(?:saja\s+)?(?:inventor|dosen|peneliti|pembuat)\s+(?:yang\s+)?(.+?)[\?\.]*$/i,
                transform: (m) => ({ normalized: `daftar inventor yang ${m[1]}`, meta: {} })
            },

            // ── "BERAPA BANYAK X YANG Y" → COUNT dengan filter ───────────────
            {
                id: 'COUNT_FILTER',
                pattern: /^(?:berapa|brp)\s+(?:banyak\s+)?(?:jumlah\s+)?(.+?)\s+yang\s+(.+?)[\?\.]*$/i,
                transform: (m) => ({ normalized: `hitung ${m[1]} yang ${m[2]}`, meta: {} })
            },

            // ── PERTANYAAN INFORMATIF UMUM (bukan DB query) ──────────────
            // "apa itu paten?", "jelaskan hak cipta", "apa bedanya merek dan paten?"
            {
                id: 'EDUCATIONAL',
                pattern: /^(?:apa(?:\s+itu)?|jelaskan|ceritakan|apa\s+bedanya|bagaimana\s+cara)\s+(.+?)[\?\.]*$/i,
                transform: (m, original) => {
                    // Jika ada keyword data, ini tetap query DB
                    const hasDataKeyword = /\b(tampilkan|lihat|daftar|list|berapa|total|jumlah)\b/i.test(original);
                    if (hasDataKeyword) return null;
                    return { normalized: null, meta: { isEducational: true, topic: m[1], original } };
                }
            },

            // ── "ADA APA SAJA X" → tampilkan daftar X ────────────────────
            // "ada apa saja instansi di ki", "ada apa saja jenis ki"
            {
                id: 'LIST_WHAT',
                pattern: /^(?:ada\s+)?(?:apa|apa\s+saja)\s+(?:yang\s+ada\s+di|yang\s+ada|yang\s+tersedia\s+di|ada\s+di)?\s*(.+?)\??$/i,
                transform: (m) => ({ normalized: `tampilkan daftar ${m[1].trim()}`, meta: { isList: true } })
            },

            // ── "X ITU APA SAJA" → tampilkan daftar X ────────────────────
            {
                id: 'WHAT_IS_LIST',
                pattern: /^(.+?)\s+(?:itu\s+)?apa\s+saja[?\.]?$/i,
                transform: (m) => ({ normalized: `tampilkan daftar ${m[1].trim()}`, meta: { isList: true } })
            },
        ];
    }

    /**
     * Normalisasi semantik — coba cocokkan pola, kembalikan query yang lebih bersih
     * @param {string} q - Input sudah melewati SLANG_MAP
     * @param {Object} context - Konteks percakapan terakhir
     * @returns {{ normalized: string|null, meta: Object, patternId: string|null }}
     */
    normalize(q, context = {}) {
        if (!q || typeof q !== 'string') return { normalized: q, meta: {}, patternId: null };

        const trimmed = q.trim();

        for (const rule of this.SEMANTIC_PATTERNS) {
            const match = trimmed.match(rule.pattern);
            if (match) {
                const result = rule.transform(match, trimmed, context);
                if (result === null) continue; // Pattern tidak applicable, coba berikutnya

                console.log(`🔤 Semantic [${rule.id}]: "${trimmed}" → "${result.normalized || '(bukan query)'}"`);
                return {
                    normalized: result.normalized,
                    meta: result.meta || {},
                    patternId: rule.id
                };
            }
        }

        return { normalized: trimmed, meta: {}, patternId: null };
    }

    /**
     * Ekstrak limit eksplisit dari kalimat
     */
    extractExplicitLimit(q) {
        const m = q.match(/\b(\d+)\s*(?:saja|aja|data|buah|item|hasil)?\b/i);
        if (m && parseInt(m[1]) <= 100) return parseInt(m[1]);
        return null;
    }

    /**
     * Apakah ini kalimat koreksi/ralat?
     */
    isCorrection(q) {
        return /^(?:eh\s+)?(?:tunggu|bukan|ralat|salah|maaf|koreksi|maksudnya)\b/i.test(q.trim());
    }

    /**
     * Apakah ini ekspresi/komentar (bukan query)?
     */
    isNonQuery(q) {
        const patterns = [
            /^(?:wah|wow|oke|sip|bagus|mantap|keren|makasih|thanks)\b/i,
            /^(?:banyak|sedikit)\s+(?:juga|banget|sekali)[\s!\.]*$/i,
            /^(?:iya|ya|yap|oke)\s*[\!\.]*$/i,
        ];
        return patterns.some(p => p.test(q.trim()));
    }

    /**
     * Apakah ini kalimat penutup?
     */
    isClosing(q) {
        return /^(?:oke|baik|siap|sip|ok|siip)\s*(?:sudah\s+)?(?:cukup|selesai|udahan|makasih|thanks|tq|bungkus|sampai jumpa|bye|tuntas)\b/i.test(q.trim().toLowerCase());
    }
}

module.exports = new SemanticNormalizer();
