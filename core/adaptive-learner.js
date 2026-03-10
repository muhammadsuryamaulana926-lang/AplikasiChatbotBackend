// ================================================================
// ADAPTIVE LEARNER — Layer 4 (Paling Canggih)
// Chatbot yang BELAJAR SENDIRI dari setiap interaksi
//
// Kemampuan:
// 1. Merekam query yang BERHASIL → perkuat pola
// 2. Merekam query yang GAGAL → identifikasi kelemahan
// 3. Deteksi pola berulang yang belum di-handle → saran mapping baru
// 4. Buat laporan performa mingguan otomatis
// 5. Auto-suggest SLANG baru berdasarkan statistik kegagalan
// ================================================================

const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

const DATA_FILE = path.join(__dirname, '..', 'adaptive-learning-data.json');
const REPORT_FILE = path.join(__dirname, '..', 'adaptive-learning-report.json');
const DYNAMIC_SLANG_FILE = path.join(__dirname, '..', 'dynamic-slang.json');

// Event bus untuk notify input-normalizer agar hot-reload SLANG_MAP
const slangEvents = new EventEmitter();
module.exports = null; // placeholder, diganti di bawah

class AdaptiveLearner {

    constructor() {
        this.data = this._load();
        this._autoSaveInterval = null;
        this._startAutoSave();
    }

    // ──────────────────────────────────────────────────────────────
    // CORE: Rekam setiap interaksi
    // ──────────────────────────────────────────────────────────────

    /**
     * Catat query berhasil (dapat data dari DB)
     */
    recordSuccess(rawInput, normalizedInput, sql, database, resultCount, executionTimeMs) {
        const key = this._normalize(rawInput);
        if (!this.data.patterns[key]) {
            this.data.patterns[key] = this._createPattern(rawInput);
        }

        const p = this.data.patterns[key];
        p.successCount++;
        p.totalCount++;
        p.lastSeen = Date.now();
        p.avgResultCount = Math.round(((p.avgResultCount || 0) * (p.successCount - 1) + resultCount) / p.successCount);
        p.avgExecutionMs = Math.round(((p.avgExecutionMs || 0) * (p.successCount - 1) + executionTimeMs) / p.successCount);

        // Simpan SQL yang berhasil (max 3 variasi)
        if (sql && !p.successfulSQLs.includes(sql)) {
            p.successfulSQLs.unshift(sql);
            if (p.successfulSQLs.length > 3) p.successfulSQLs.pop();
        }

        // Rekam database yang berhasil
        if (database && !p.databases.includes(database)) p.databases.push(database);

        // Analisis kosakata (untuk saran SLANG)
        this._analyzeVocabulary(rawInput, normalizedInput, true);

        this.data.stats.totalSuccess++;
    }

    /**
     * Catat query gagal (tidak dapat data / SQL error)
     */
    recordFailure(rawInput, normalizedInput, reason = 'NO_DATA') {
        const key = this._normalize(rawInput);
        if (!this.data.patterns[key]) {
            this.data.patterns[key] = this._createPattern(rawInput);
        }

        const p = this.data.patterns[key];
        p.failureCount++;
        p.totalCount++;
        p.lastSeen = Date.now();
        p.failureReasons.push({ reason, ts: Date.now() });
        if (p.failureReasons.length > 5) p.failureReasons.shift(); // Keep last 5

        // Analisis kosakata (untuk saran SLANG)
        this._analyzeVocabulary(rawInput, normalizedInput, false);

        this.data.stats.totalFailure++;

        // Jika pattern ini gagal berkali-kali, flag sebagai perlu perhatian
        if (p.failureCount >= 3 && p.successCount === 0) {
            p.needsAttention = true;
            this.data.stats.patternsNeedingAttention++;
            console.log(`⚠️ [AdaptiveLearner] Pattern perlu perhatian (${p.failureCount}x gagal): "${rawInput.substring(0, 60)}"`);
        }

        // ── AUTO-APPLY SLANG saat confidence cukup tinggi ─────────────
        // Setelah 5+ kegagalan, coba auto-generate mapping dan apply langsung
        if (p.failureCount >= 5 && p.failureCount % 5 === 0) {
            this._tryAutoApplySlang(rawInput);
        }
    }

    /**
     * Catat query yang tidak dikenali (bukan database query, bukan conversation)
     */
    recordUnhandled(rawInput, classifiedAs) {
        const key = this._normalize(rawInput);
        if (!this.data.unhandled[key]) {
            this.data.unhandled[key] = {
                original: rawInput,
                count: 0,
                classifiedAs: classifiedAs,
                firstSeen: Date.now(),
                lastSeen: Date.now()
            };
        }
        this.data.unhandled[key].count++;
        this.data.unhandled[key].lastSeen = Date.now();
        this.data.stats.totalUnhandled++;
    }

    // ──────────────────────────────────────────────────────────────
    // INTELLIGENCE: Analisis & Sarankan Perbaikan
    // ──────────────────────────────────────────────────────────────

    /**
     * ═══════════════════════════════════════════════════════════
     * AUTO-APPLY SLANG — FULLY AUTOMATIC (tidak perlu manual!)
     * Ketika confidence >= 0.75, langsung tulis ke dynamic-slang.json
     * input-normalizer.js hot-reload file ini otomatis
     * ═══════════════════════════════════════════════════════════
     */
    autoApplyHighConfidenceSlang() {
        const suggestions = this.getSuggestedSlangMappings();
        const highConf = suggestions.filter(s => s.suggestedMapping && s.confidence >= 0.75 && s.failCount >= 5);

        if (highConf.length === 0) return { applied: 0, skipped: suggestions.length };

        // Baca dynamic-slang.json yang ada
        let currentDynamic = {};
        try {
            if (fs.existsSync(DYNAMIC_SLANG_FILE)) {
                currentDynamic = JSON.parse(fs.readFileSync(DYNAMIC_SLANG_FILE, 'utf8'));
            }
        } catch (e) { currentDynamic = {}; }

        let applied = 0;
        for (const s of highConf) {
            if (!currentDynamic[s.slang]) {
                currentDynamic[s.slang] = {
                    mapping: s.suggestedMapping,
                    confidence: s.confidence,
                    failCount: s.failCount,
                    autoAppliedAt: new Date().toISOString()
                };
                applied++;
                console.log(`✅ [AutoSlang] Otomatis tambah: "${s.slang}" → "${s.suggestedMapping}" (conf: ${(s.confidence * 100).toFixed(0)}%)`);
            }
        }

        if (applied > 0) {
            try {
                fs.writeFileSync(DYNAMIC_SLANG_FILE, JSON.stringify(currentDynamic, null, 2));
                // Notify input-normalizer untuk hot-reload
                slangEvents.emit('slang_updated', currentDynamic);
                console.log(`🔄 [AutoSlang] ${applied} SLANG baru diterapkan otomatis ke dynamic-slang.json`);
            } catch (e) {
                console.error('[AutoSlang] Gagal tulis dynamic-slang.json:', e.message);
            }
        }

        return { applied, total: highConf.length };
    }

    /**
     * Baca dynamic-slang saat ini (sebagai plain object {slang:mapping})
     */
    getDynamicSlangMap() {
        try {
            if (fs.existsSync(DYNAMIC_SLANG_FILE)) {
                const raw = JSON.parse(fs.readFileSync(DYNAMIC_SLANG_FILE, 'utf8'));
                // Convert ke format SLANG_MAP {slang: mapping_string}
                const result = {};
                for (const [slang, data] of Object.entries(raw)) {
                    result[slang] = typeof data === 'string' ? data : data.mapping;
                }
                return result;
            }
        } catch (e) { /* silent */ }
        return {};
    }

    /**
     * Internal: coba auto-apply untuk satu input yang sering gagal
     */
    _tryAutoApplySlang(rawInput) {
        const words = rawInput.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(w => w.length > 3);
        const successVocab = this.data.vocabulary.success;
        let appliedAny = false;

        let dynamic = {};
        try {
            if (fs.existsSync(DYNAMIC_SLANG_FILE)) {
                dynamic = JSON.parse(fs.readFileSync(DYNAMIC_SLANG_FILE, 'utf8'));
            }
        } catch (e) { dynamic = {}; }

        for (const word of words) {
            if (dynamic[word] || this.data.vocabulary.success[word]) continue; // sudah ada
            const closest = this._findClosestSuccessWord(word);
            if (closest && closest.similarity >= 0.75) {
                dynamic[word] = { mapping: closest.word, confidence: closest.similarity, failCount: (this.data.vocabulary.fail[word] || 1), autoAppliedAt: new Date().toISOString() };
                appliedAny = true;
                console.log(`🤖 [AutoSlang] Auto-learn: "${word}" → "${closest.word}" (${(closest.similarity * 100).toFixed(0)}%)`);
            }
        }

        if (appliedAny) {
            try {
                fs.writeFileSync(DYNAMIC_SLANG_FILE, JSON.stringify(dynamic, null, 2));
                slangEvents.emit('slang_updated', dynamic);
            } catch (e) { /* silent */ }
        }
    }

    /**
     * Dapatkan saran SLANG baru berdasarkan pola kegagalan
     * Auto-deteksi kata/frasa yang sering gagal tapi berhasil kalau di-rephrase
     */
    getSuggestedSlangMappings() {
        const suggestions = [];

        // Cari kata unik di query yang selalu gagal tapi tidak ada di kata yang berhasil
        const failVocab = this.data.vocabulary.fail;
        const successVocab = this.data.vocabulary.success;

        for (const [word, count] of Object.entries(failVocab)) {
            if (count >= 3 && !successVocab[word]) {
                // Cari kata sukses yang mirip (Levenshtein-like sederhana)
                const possibleTarget = this._findClosestSuccessWord(word);
                if (possibleTarget) {
                    suggestions.push({
                        slang: word,
                        suggestedMapping: possibleTarget.word,
                        confidence: possibleTarget.similarity,
                        failCount: count,
                        reasoning: `"${word}" muncul ${count}x di query gagal, mungkin seharusnya "${possibleTarget.word}"`
                    });
                } else {
                    suggestions.push({
                        slang: word,
                        suggestedMapping: null,
                        confidence: 0,
                        failCount: count,
                        reasoning: `"${word}" muncul ${count}x di query gagal - perlu mapping manual`
                    });
                }
            }
        }

        return suggestions.sort((a, b) => b.failCount - a.failCount).slice(0, 20);
    }

    /**
     * Dapatkan query yang paling sering gagal — untuk review manual
     */
    getTopFailingPatterns(limit = 10) {
        return Object.values(this.data.patterns)
            .filter(p => p.failureCount > 0 && p.successCount === 0)
            .sort((a, b) => b.failureCount - a.failureCount)
            .slice(0, limit)
            .map(p => ({
                query: p.original,
                failCount: p.failureCount,
                lastSeen: new Date(p.lastSeen).toLocaleDateString('id-ID'),
                reasons: [...new Set(p.failureReasons.map(r => r.reason))]
            }));
    }

    /**
     * Dapatkan query yang paling populer (berhasil banyak kali)
     */
    getTopSuccessPatterns(limit = 10) {
        return Object.values(this.data.patterns)
            .filter(p => p.successCount > 1)
            .sort((a, b) => b.successCount - a.successCount)
            .slice(0, limit)
            .map(p => ({
                query: p.original,
                successCount: p.successCount,
                avgResultCount: p.avgResultCount,
                avgExecutionMs: p.avgExecutionMs,
                bestSQL: p.successfulSQLs[0]?.substring(0, 100)
            }));
    }

    /**
     * Cek apakah ada shortcut SQL yang bisa digunakan (tanpa AI!)
     */
    getSQLShortcut(rawInput) {
        const key = this._normalize(rawInput);
        const pattern = this.data.patterns[key];
        if (pattern && pattern.successCount >= 2 && pattern.successfulSQLs.length > 0) {
            return pattern.successfulSQLs[0]; // SQL yang paling sering berhasil
        }

        // Cari fuzzy match (80% mirip)
        for (const [k, p] of Object.entries(this.data.patterns)) {
            if (p.successCount >= 2 && p.successfulSQLs.length > 0) {
                const similarity = this._computeSimilarity(key, k);
                if (similarity >= 0.80) {
                    console.log(`🚀 [AdaptiveLearner] SQL shortcut (${Math.round(similarity * 100)}% similar): "${p.original.substring(0, 50)}"`);
                    return p.successfulSQLs[0];
                }
            }
        }
        return null;
    }

    // ──────────────────────────────────────────────────────────────
    // REPORTING: Laporan Performa
    // ──────────────────────────────────────────────────────────────

    /**
     * Generate laporan performa lengkap
     */
    generateReport() {
        const totalQueries = this.data.stats.totalSuccess + this.data.stats.totalFailure;
        const successRate = totalQueries > 0
            ? ((this.data.stats.totalSuccess / totalQueries) * 100).toFixed(1)
            : '0';

        const report = {
            generatedAt: new Date().toISOString(),
            overview: {
                totalQueryProcessed: totalQueries,
                successCount: this.data.stats.totalSuccess,
                failureCount: this.data.stats.totalFailure,
                successRate: `${successRate}%`,
                unhandledPatterns: this.data.stats.totalUnhandled,
                patternsNeedingAttention: this.data.stats.patternsNeedingAttention,
                uniquePatterns: Object.keys(this.data.patterns).length,
            },
            topFailingQueries: this.getTopFailingPatterns(10),
            topSuccessQueries: this.getTopSuccessPatterns(10),
            suggestedNewSlang: this.getSuggestedSlangMappings(),
            unhandledQueries: Object.values(this.data.unhandled)
                .sort((a, b) => b.count - a.count)
                .slice(0, 15)
                .map(u => ({ query: u.original, count: u.count, classifiedAs: u.classifiedAs })),
            recommendation: this._generateRecommendations(successRate)
        };

        // Simpan report
        try {
            fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
        } catch (e) { /* silent */ }

        return report;
    }

    /**
     * Statistik ringkas untuk endpoint /analytics
     */
    getStats() {
        const total = this.data.stats.totalSuccess + this.data.stats.totalFailure;
        return {
            totalProcessed: total,
            successRate: total > 0 ? `${((this.data.stats.totalSuccess / total) * 100).toFixed(1)}%` : '0%',
            successCount: this.data.stats.totalSuccess,
            failureCount: this.data.stats.totalFailure,
            uniquePatterns: Object.keys(this.data.patterns).length,
            patternsNeedingAttention: this.data.stats.patternsNeedingAttention,
            topFailingQueries: this.getTopFailingPatterns(3),
            suggestedSlangCount: this.getSuggestedSlangMappings().length,
        };
    }

    // ──────────────────────────────────────────────────────────────
    // PRIVATE HELPERS
    // ──────────────────────────────────────────────────────────────

    _analyzeVocabulary(rawInput, normalizedInput, success) {
        const words = rawInput.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 2);

        const target = success ? this.data.vocabulary.success : this.data.vocabulary.fail;
        for (const word of words) {
            target[word] = (target[word] || 0) + 1;
        }
    }

    _findClosestSuccessWord(word) {
        let best = null;
        let bestSim = 0;
        const successVocab = this.data.vocabulary.success;

        for (const successWord of Object.keys(successVocab)) {
            if (Math.abs(word.length - successWord.length) > 4) continue;
            const sim = this._stringSimilarity(word, successWord);
            if (sim > 0.65 && sim > bestSim) {
                bestSim = sim;
                best = successWord;
            }
        }
        return best ? { word: best, similarity: bestSim } : null;
    }

    _stringSimilarity(a, b) {
        const longer = a.length > b.length ? a : b;
        const shorter = a.length > b.length ? b : a;
        if (longer.length === 0) return 1.0;

        const editDist = this._levenshtein(longer, shorter);
        return (longer.length - editDist) / longer.length;
    }

    _levenshtein(a, b) {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                matrix[i][j] = b[i - 1] === a[j - 1]
                    ? matrix[i - 1][j - 1]
                    : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
            }
        }
        return matrix[b.length][a.length];
    }

    _computeSimilarity(a, b) {
        // Bigram-based similarity untuk kalimat panjang
        const bigramsA = new Set(this._bigrams(a));
        const bigramsB = new Set(this._bigrams(b));
        const intersection = [...bigramsA].filter(x => bigramsB.has(x)).length;
        const union = bigramsA.size + bigramsB.size - intersection;
        return union === 0 ? 0 : intersection / union;
    }

    _bigrams(str) {
        const result = [];
        for (let i = 0; i < str.length - 1; i++) result.push(str.slice(i, i + 2));
        return result;
    }

    _normalize(rawInput) {
        return rawInput.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[?!.,;:]+$/, '');
    }

    _createPattern(original) {
        return {
            original: original.substring(0, 200),
            successCount: 0,
            failureCount: 0,
            totalCount: 0,
            needsAttention: false,
            databases: [],
            successfulSQLs: [],
            failureReasons: [],
            avgResultCount: 0,
            avgExecutionMs: 0,
            firstSeen: Date.now(),
            lastSeen: Date.now()
        };
    }

    _generateRecommendations(successRate) {
        const rate = parseFloat(successRate);
        const recs = [];
        if (rate < 60) {
            recs.push('⚠️ Success rate di bawah 60% — perlu review prompt SQL dan tambah SLANG mappings');
        }
        const topFail = this.getTopFailingPatterns(3);
        if (topFail.length > 0) {
            recs.push(`🔴 ${topFail.length} query sering gagal — cek: ${topFail.map(f => `"${f.query}"`).join(', ')}`);
        }
        const slangSuggestions = this.getSuggestedSlangMappings().filter(s => s.confidence > 0.7);
        if (slangSuggestions.length > 0) {
            recs.push(`💡 ${slangSuggestions.length} saran SLANG baru dengan confidence tinggi — siap ditambah ke SLANG_MAP`);
        }
        return recs;
    }

    _load() {
        try {
            if (fs.existsSync(DATA_FILE)) {
                return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
            }
        } catch (e) { /* silent */ }
        return {
            patterns: {},
            unhandled: {},
            vocabulary: { success: {}, fail: {} },
            stats: {
                totalSuccess: 0,
                totalFailure: 0,
                totalUnhandled: 0,
                patternsNeedingAttention: 0
            }
        };
    }

    _save() {
        try {
            fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2));
        } catch (e) { /* silent */ }
    }

    _startAutoSave() {
        // Auto-save setiap 2 menit
        this._autoSaveInterval = setInterval(() => this._save(), 2 * 60 * 1000);

        // ── AUTO-APPLY SLANG setiap 30 menit ──────────────────────────
        // Sepenuhnya otomatis: cek saran baru, apply yang confidence-nya tinggi
        this._autoSlangInterval = setInterval(() => {
            const result = this.autoApplyHighConfidenceSlang();
            if (result.applied > 0) {
                console.log(`🧠 [AutoSlang] Periodic check: ${result.applied} mapping baru diterapkan`);
            }
        }, 30 * 60 * 1000); // setiap 30 menit

        // Graceful shutdown
        process.on('SIGTERM', () => { this._save(); clearInterval(this._autoSaveInterval); clearInterval(this._autoSlangInterval); });
        process.on('SIGINT', () => { this._save(); clearInterval(this._autoSaveInterval); clearInterval(this._autoSlangInterval); });
    }
}

const instance = new AdaptiveLearner();
instance.slangEvents = slangEvents;
instance.DYNAMIC_SLANG_FILE = DYNAMIC_SLANG_FILE;
module.exports = instance;
