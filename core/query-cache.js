// ================================================================
// QUERY CACHE — Semantic caching untuk skip API call
// Query mirip yang sudah pernah berhasil tidak perlu generate SQL ulang
// ================================================================

const natural = require('natural');
const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.join(__dirname, '..', 'query-cache-data.json');

class QueryCache {
    constructor() {
        this.cache = new Map();
        this.maxSize = 200;
        this.maxAge = 60 * 60 * 1000; // 1 jam
        this.stats = { hits: 0, misses: 0 };
        this._load();
    }

    /**
     * Simpan query yang berhasil ke cache
     */
    set(question, database, sql, total) {
        const key = this._normalize(question);
        this.cache.set(key, {
            sql,
            database,
            total,
            originalQuestion: question,
            timestamp: Date.now(),
            hitCount: 0
        });

        // Evict jika terlalu besar
        if (this.cache.size > this.maxSize) this._evict();

        // Auto-save
        if (this.cache.size % 10 === 0) this._save();
    }

    /**
     * Cari query yang cocok atau mirip dari cache
     * @returns {{ sql, database, total, hitCount } | null}
     */
    find(question, database) {
        const key = this._normalize(question);

        // Ekstrak guards dari pertanyaan
        const questionYear = this._extractYear(question);
        const questionJenis = this._extractJenisKI(question);
        const questionFakultas = this._extractFakultas(question);

        // 1. Exact match
        if (this.cache.has(key)) {
            const entry = this.cache.get(key);
            if (entry.database === database && !this._isExpired(entry)) {
                entry.hitCount++;
                this.stats.hits++;
                console.log(`⚡ Cache HIT (exact): "${question}" → SQL cached`);
                return entry;
            }
        }

        // 2. Fuzzy match — Levenshtein distance ≤ 3
        let bestMatch = null;
        let bestDist = Infinity;

        for (const [cacheKey, entry] of this.cache) {
            if (entry.database !== database || this._isExpired(entry)) continue;

            // Skip jika panjang terlalu berbeda 
            if (Math.abs(key.length - cacheKey.length) > 10) continue;

            // YEAR GUARD: Jika pertanyaan mengandung tahun, jangan fuzzy-match
            // ke cache yang mengandung tahun BERBEDA
            if (questionYear) {
                const cachedYear = this._extractYear(entry.originalQuestion || cacheKey);
                if (cachedYear && cachedYear !== questionYear) continue;
            }

            // JENIS KI GUARD: Jika pertanyaan menyebut jenis KI tertentu,
            // jangan match ke cache yang TIDAK menyebut jenis KI (atau jenis berbeda)
            // Contoh: "berapa KI paten" TIDAK boleh match ke cache "berapa KI"
            const cachedJenis = this._extractJenisKI(entry.originalQuestion || cacheKey);
            if (questionJenis && !cachedJenis) continue;  // query ada filter, cache tidak → skip
            if (!questionJenis && cachedJenis) continue;  // query tidak ada filter, cache ada → skip 
            if (questionJenis && cachedJenis && questionJenis !== cachedJenis) continue; // filter berbeda → skip

            // FAKULTAS GUARD: Sama seperti jenis KI guard
            const cachedFakultas = this._extractFakultas(entry.originalQuestion || cacheKey);
            if (questionFakultas && !cachedFakultas) continue;
            if (!questionFakultas && cachedFakultas) continue;
            if (questionFakultas && cachedFakultas && questionFakultas !== cachedFakultas) continue;

            const dist = natural.LevenshteinDistance(key, cacheKey);
            if (dist <= 3 && dist < bestDist) {
                bestDist = dist;
                bestMatch = entry;
            }
        }

        if (bestMatch) {
            bestMatch.hitCount++;
            this.stats.hits++;
            console.log(`⚡ Cache HIT (fuzzy, dist=${bestDist}): "${question}" → SQL cached`);
            return bestMatch;
        }

        this.stats.misses++;
        return null;
    }

    /**
     * Ekstrak tahun 4 digit dari string (helper untuk year guard)
     */
    _extractYear(str) {
        if (!str) return null;
        const match = String(str).match(/\b(20\d{2}|19\d{2})\b/);
        return match ? match[1] : null;
    }

    /**
     * Ekstrak jenis KI dari string (helper untuk entity guard)
     * Returns: 'paten' | 'hak cipta' | 'merek' | 'desain industri' | null
     */
    _extractJenisKI(str) {
        if (!str) return null;
        const s = String(str).toLowerCase();
        if (/\bpaten\b/.test(s)) return 'paten';
        if (/\bhak\s*cipta\b/.test(s)) return 'hak cipta';
        if (/\bmerek\b/.test(s)) return 'merek';
        if (/\bdesain\s*industri\b/.test(s)) return 'desain industri';
        return null;
    }

    /**
     * Ekstrak fakultas dari string (helper untuk entity guard)
     * Returns: fakultas code uppercase | null
     */
    _extractFakultas(str) {
        if (!str) return null;
        const match = String(str).match(/\b(FTI|FMIPA|FTMD|STEI|SITH|FITB|FSRD|SBM|FTTM|SF|SAPPK)\b/i);
        return match ? match[1].toUpperCase() : null;
    }

    /**
     * Hapus cache untuk database tertentu (misal setelah schema berubah)  
     */
    invalidate(database) {
        for (const [key, entry] of this.cache) {
            if (entry.database === database) this.cache.delete(key);
        }
        console.log(`🗑️ Cache invalidated for database: ${database}`);
    }

    /**
     * Dapatkan statistik cache
     */
    getStats() {
        const total = this.stats.hits + this.stats.misses;
        return {
            size: this.cache.size,
            hits: this.stats.hits,
            misses: this.stats.misses,
            hitRate: total > 0 ? ((this.stats.hits / total) * 100).toFixed(1) + '%' : '0%'
        };
    }

    // ════════════════════════════════════════
    // INTERNAL METHODS
    // ════════════════════════════════════════

    _normalize(q) {
        return q.toLowerCase().trim()
            .replace(/\b(tampilkan|tunjukkan|lihatkan|perlihatkan|show|liatkan|liatin)\b/g, 'tampilkan')
            .replace(/\b(berapa|jumlah|total|hitung|ada berapa)\b/g, 'berapa')
            .replace(/\b(cari|carikan|temukan)\b/g, 'cari')
            .replace(/[?!.,]+/g, '')
            .replace(/\s+/g, ' ');
    }

    _isExpired(entry) {
        return Date.now() - entry.timestamp > this.maxAge;
    }

    _evict() {
        // Hapus entry yang paling jarang dipakai dan paling lama
        const sorted = [...this.cache.entries()]
            .sort((a, b) => {
                // Prioritas: hitCount rendah, lalu timestamp lama
                if (a[1].hitCount !== b[1].hitCount) return a[1].hitCount - b[1].hitCount;
                return a[1].timestamp - b[1].timestamp;
            });
        const toRemove = Math.max(1, Math.floor(this.cache.size * 0.1));
        for (let i = 0; i < toRemove && i < sorted.length; i++) {
            this.cache.delete(sorted[i][0]);
        }
    }

    _save() {
        try {
            const data = Array.from(this.cache.entries());
            fs.writeFileSync(CACHE_FILE, JSON.stringify({ cache: data, stats: this.stats, lastSaved: Date.now() }, null, 2));
        } catch (e) { /* silent */ }
    }

    _load() {
        try {
            if (fs.existsSync(CACHE_FILE)) {
                const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
                if (data.cache) {
                    this.cache = new Map(data.cache.filter(([, v]) => !this._isExpired(v)));
                }
                if (data.stats) this.stats = data.stats;
                console.log(`✅ Query cache loaded: ${this.cache.size} entries, hit rate: ${this.getStats().hitRate}`);
            }
        } catch (e) { /* silent */ }
    }
}

module.exports = new QueryCache();
