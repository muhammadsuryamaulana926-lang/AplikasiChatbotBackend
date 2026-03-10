// ================================================================
// INTENT ENRICHER — Layer 3
// Ekstrak NUANSA dari query: waktu, limit, sort, tone, perbandingan
// Memberikan konteks tambahan ke LLM agar SQL lebih presisi
// ================================================================

class IntentEnricher {

    constructor() {
        // Pola waktu
        this.TIME_PATTERNS = [
            { pattern: /\btahun\s+(20\d{2}|19\d{2})\b/gi, type: 'YEAR_SPECIFIC' },
            { pattern: /\b(20\d{2}|19\d{2})\b/g, type: 'YEAR_BARE' },
            { pattern: /\btahun\s+(?:ini|sekarang|berjalan)\b/i, type: 'YEAR_CURRENT', value: new Date().getFullYear() },
            { pattern: /\btahun\s+lalu\b/i, type: 'YEAR_LAST', value: new Date().getFullYear() - 1 },
            { pattern: /\b2\s+tahun\s+(?:lalu|terakhir)\b/i, type: 'YEAR_2AGO', value: new Date().getFullYear() - 2 },
            { pattern: /\bbulan\s+(?:ini|sekarang)\b/i, type: 'MONTH_CURRENT' },
            { pattern: /\bbaru-baru\s+ini\b/i, type: 'RECENT' },
            { pattern: /\bterbaru\b/i, type: 'LATEST' },
            { pattern: /\bterlama\b/i, type: 'OLDEST' },
            { pattern: /\bantara\s+(20\d{2}|19\d{2})\s+(?:dan|sampai|hingga|-)\s+(20\d{2}|19\d{2})\b/i, type: 'YEAR_RANGE' },
            { pattern: /\bdari\s+(20\d{2}|19\d{2})\s+(?:sampai|hingga|ke|-)\s+(20\d{2}|19\d{2})\b/i, type: 'YEAR_RANGE' },
        ];

        // Pola limit/jumlah
        this.LIMIT_PATTERNS = [
            { pattern: /\b(\d+)\s*(?:saja|aja|data|buah|item|hasil|record)\b/i, group: 1 },
            { pattern: /\bhanya\s+(\d+)\b/i, group: 1 },
            { pattern: /\bcukup\s+(\d+)\b/i, group: 1 },
            { pattern: /\btampilkan\s+(\d+)\b/i, group: 1 },
            { pattern: /\blihat\s+(\d+)\b/i, group: 1 },
            { pattern: /\bsemua(?:nya)?\b/i, type: 'ALL' },
        ];

        // Pola sort
        this.SORT_PATTERNS = [
            { pattern: /\bterbaru\b/i, value: 'tgl_pendaftaran DESC' },
            { pattern: /\bterlama\b/i, value: 'tgl_pendaftaran ASC' },
            { pattern: /\bpaling\s+baru\b/i, value: 'tgl_pendaftaran DESC' },
            { pattern: /\bpaling\s+lama\b/i, value: 'tgl_pendaftaran ASC' },
            { pattern: /\ba\s*-\s*z\b/i, value: 'judul ASC' },
            { pattern: /\bz\s*-\s*a\b/i, value: 'judul DESC' },
            { pattern: /\bterbanyak\b/i, value: 'COUNT DESC' },
            { pattern: /\btersedikit\b/i, value: 'COUNT ASC' },
            { pattern: /\bpaling\s+banyak\b/i, value: 'COUNT DESC' },
            { pattern: /\bpaling\s+sedikit\b/i, value: 'COUNT ASC' },
            { pattern: /\bpaling\s+tinggi\b/i, value: 'value DESC' },
            { pattern: /\bpaling\s+rendah\b/i, value: 'value ASC' },
        ];

        // Pola tone
        this.TONE_PATTERNS = [
            { pattern: /\b(?:dong|deh|sih|please|tolong)\b/i, tone: 'casual_polite' },
            { pattern: /[!]{2,}/, tone: 'urgent' },
            { pattern: /\b(?:mohon|harap|dengan hormat)\b/i, tone: 'formal' },
            { pattern: /\b(?:segera|cepat|asap|sekarang juga)\b/i, tone: 'urgent' },
            { pattern: /\?{2,}/, tone: 'confused' },
        ];

        // Pola perbandingan
        this.COMPARISON_PATTERNS = [
            { pattern: /\b(.+?)\s+(?:vs|versus|dibanding(?:kan)?|atau)\s+(.+?)\b/i, type: 'COMPARE_TWO' },
            { pattern: /\bmana\s+(?:yang\s+)?(?:paling|lebih)\b/i, type: 'FIND_BEST' },
            { pattern: /\bperbedaan\s+(?:antara\s+)?(.+?)\s+dan\s+(.+?)\b/i, type: 'DIFF_TWO' },
        ];
    }

    /**
     * Enrich query dengan metadata intent
     * @param {string} q - Query ternormalisasi
     * @param {Object} context - Konteks percakapan
     * @returns {Object} enrichedIntent
     */
    enrich(q, context = {}) {
        if (!q) return {};

        const enriched = {
            original: q,
            timeFilter: this._extractTime(q),
            limitHint: this._extractLimit(q),
            sortHint: this._extractSort(q),
            tone: this._detectTone(q),
            comparison: this._extractComparison(q),
            isExistenceCheck: /\bapakah\s+ada\b|\bada\s+(?:gak|nggak|tidak)\b/i.test(q),
            isCountQuery: /\b(?:berapa|jumlah|total|hitung|count)\b/i.test(q),
            isSuperlativeQuery: /\b(?:terbanyak|terkecil|tersedikit|paling\s+(?:banyak|sedikit|sering|aktif|tinggi|rendah)|yang\s+mana\s+(?:paling|ter))/i.test(q),
            isNegation: /\b(?:bukan|tidak|selain|kecuali|tanpa|yang\s+bukan)\b/i.test(q),
            entityFilter: this._extractEntities(q),
            // Apakah ini modifikasi dari query sebelumnya?
            isModification: this._isModification(q, context),
        };

        // Log enrichment yang signifikan
        const significantKeys = ['timeFilter', 'limitHint', 'comparison', 'isNegation', 'isModification'];
        const hasEnrichment = significantKeys.some(k => enriched[k] && enriched[k] !== false && enriched[k] !== null);
        if (hasEnrichment) {
            console.log(`🧠 Intent enriched:`, {
                time: enriched.timeFilter?.type || null,
                limit: enriched.limitHint,
                sort: enriched.sortHint,
                compare: enriched.comparison?.type || null,
                isModif: enriched.isModification
            });
        }

        return enriched;
    }

    _extractTime(q) {
        for (const p of this.TIME_PATTERNS) {
            const match = q.match(p.pattern);
            if (match) {
                return { type: p.type, raw: match[0], value: p.value || match[1], match2: match[2] };
            }
        }
        return null;
    }

    _extractLimit(q) {
        for (const p of this.LIMIT_PATTERNS) {
            if (p.type === 'ALL') {
                if (p.pattern.test(q)) return 'ALL';
            } else {
                const match = q.match(p.pattern);
                if (match) {
                    const num = parseInt(match[p.group]);
                    if (num > 0 && num <= 500) return num;
                }
            }
        }
        return null;
    }

    _extractSort(q) {
        for (const p of this.SORT_PATTERNS) {
            if (p.pattern.test(q)) return p.value;
        }
        return null;
    }

    _detectTone(q) {
        const tones = [];
        for (const p of this.TONE_PATTERNS) {
            if (p.pattern.test(q)) tones.push(p.tone);
        }
        return tones.length > 0 ? tones[0] : 'neutral';
    }

    _extractComparison(q) {
        for (const p of this.COMPARISON_PATTERNS) {
            const match = q.match(p.pattern);
            if (match) {
                return { type: p.type, a: match[1], b: match[2], raw: match[0] };
            }
        }
        return null;
    }

    _extractEntities(q) {
        const entities = {};
        // Fakultas
        const fakultas = ['FMIPA', 'FTMD', 'FTI', 'STEI', 'SITH', 'FITB', 'FSRD', 'SBM', 'FTTM', 'SF', 'SAPPK'];
        entities.fakultas = fakultas.filter(f => q.toUpperCase().includes(f));
        // Jenis KI
        const jenisKI = ['paten', 'hak cipta', 'merek', 'desain industri', 'rahasia dagang'];
        entities.jenisKI = jenisKI.filter(j => q.toLowerCase().includes(j));
        return entities;
    }

    _isModification(q, context) {
        // Cek apakah ini tambahan filter dari query sebelumnya
        const lastQ = context?.lastQuestion || '';
        if (!lastQ) return false;
        const modPatterns = [
            /^tapi\s+/i,
            /^dan\s+/i,
            /^(?:yang\s+)?(?:hanya|cuma|saja)\s+/i,
            /^dari\s+(?:itu|tersebut)\b/i,
            /^yang\s+sama\s+tapi\s+/i,
        ];
        return modPatterns.some(p => p.test(q.trim()));
    }

    /**
     * Buat SQL hint berdasarkan enrichment
     * Hasilnya dimasukkan ke prompt generateSQL
     */
    toSQLHint(enriched) {
        const hints = [];

        if (enriched.timeFilter) {
            const t = enriched.timeFilter;
            if (t.type === 'YEAR_SPECIFIC' || t.type === 'YEAR_BARE') {
                const yr = t.value || t.match;
                hints.push(`- [WAJIB] Filter tahun ${yr}: tambahkan WHERE (YEAR(tgl_pendaftaran) = ${yr} OR YEAR(tgl_sertifikasi) = ${yr}) di query SQL. JANGAN tampilkan data tahun lain!`);
            } else if (t.type === 'YEAR_RANGE') {
                hints.push(`- [WAJIB] Filter rentang tahun: WHERE (YEAR(tgl_pendaftaran) BETWEEN ${t.value} AND ${t.match2} OR YEAR(tgl_sertifikasi) BETWEEN ${t.value} AND ${t.match2}). JANGAN tampilkan data di luar rentang ini!`);
            } else if (t.type === 'LATEST') {
                hints.push(`- Urutkan: ORDER BY tgl_pendaftaran DESC, tgl_sertifikasi DESC`);
            } else if (t.type === 'OLDEST') {
                hints.push(`- Urutkan: ORDER BY tgl_pendaftaran ASC, tgl_sertifikasi ASC`);
            }
        }

        if (enriched.limitHint && enriched.limitHint !== 'ALL') {
            hints.push(`- Batas data: LIMIT ${enriched.limitHint}`);
        } else if (enriched.limitHint === 'ALL') {
            hints.push(`- Tampilkan semua: Hapus LIMIT atau gunakan LIMIT yang besar`);
        }

        if (enriched.sortHint && !enriched.timeFilter) {
            hints.push(`- Pengurutan: ORDER BY ${enriched.sortHint}`);
        }

        if (enriched.isNegation) {
            hints.push(`- Perhatian: Query mengandung negasi (NOT/BUKAN/SELAIN) - gunakan NOT IN atau != atau NOT LIKE`);
        }

        if (enriched.isCountQuery && !enriched.isSuperlativeQuery) {
            hints.push(`- [WAJIB] Query ini MENANYAKAN JUMLAH/TOTAL. Gunakan SELECT COUNT(*) AS total FROM ... JANGAN gunakan SELECT kolom biasa! Contoh: "ada berapa ki 2018?" → SELECT COUNT(*) AS total FROM ... WHERE (YEAR(tgl_pendaftaran) = 2018 OR YEAR(tgl_sertifikasi) = 2018)`);
        }

        if (enriched.isSuperlativeQuery) {
            hints.push(`- [PENTING] Query ini mencari data RANKING/TERBANYAK/TERKECIL. Gunakan GROUP BY + ORDER BY + LIMIT. Contoh: "inventor terbanyak" → SELECT judul, inventor, (LENGTH(inventor) - LENGTH(REPLACE(inventor, '<br/>', ''))) / LENGTH('<br/>') + 1 AS jumlah_inventor FROM ... ORDER BY jumlah_inventor DESC LIMIT 10. Contoh: "fakultas paling aktif" → SELECT fakultas_inventor, COUNT(*) AS total FROM ... GROUP BY fakultas_inventor ORDER BY total DESC LIMIT 10`);
        }

        if (enriched.comparison?.type === 'COMPARE_TWO') {
            hints.push(`- Query komparasi antara "${enriched.comparison.a}" dan "${enriched.comparison.b}" - pertimbangkan GROUP BY`);
        }

        if (enriched.entityFilter?.jenisKI?.length > 0) {
            hints.push(`- Jenis KI terdeteksi: ${enriched.entityFilter.jenisKI.join(', ')} - gunakan WHERE jenis_ki IN (...)`);
        }

        return hints.length > 0 ? `\nSQL HINTS OTOMATIS (dari analisis query):\n${hints.join('\n')}\n` : '';
    }
}

module.exports = new IntentEnricher();
