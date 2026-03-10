// ================================================================
// ERROR MEMORY — Menyimpan SQL yang pernah gagal agar tidak diulangi
// AI belajar dari kesalahan masa lalu
// ================================================================

const fs = require('fs');
const path = require('path');

const ERROR_FILE = path.join(__dirname, '..', 'error-memory-data.json');

class ErrorMemory {
    constructor() {
        this.failures = new Map(); // normalized_query → [{ sql, error, timestamp }]
        this.maxPerQuery = 5;
        this._load();
    }

    /**
     * Catat kegagalan SQL
     */
    recordFailure(query, sql, errorMessage) {
        const key = this._normalize(query);
        if (!this.failures.has(key)) this.failures.set(key, []);

        const failures = this.failures.get(key);
        failures.push({
            sql: sql.substring(0, 300),
            error: errorMessage.substring(0, 150),
            timestamp: Date.now()
        });

        // Batasi jumlah per query
        if (failures.length > this.maxPerQuery) {
            failures.shift();
        }

        console.log(`❌ Error recorded: "${query}" → ${errorMessage.substring(0, 80)}`);
        this._save();
    }

    /**
     * Dapatkan peringatan SQL gagal untuk disertakan di prompt
     */
    getWarnings(query) {
        const key = this._normalize(query);
        const fails = this.failures.get(key);
        if (!fails || fails.length === 0) return '';

        // Ambil 3 kegagalan terakhir
        const recent = fails.slice(-3);
        const warnings = recent.map(f =>
            `- SQL "${f.sql.substring(0, 100)}..." → Error: ${f.error}`
        ).join('\n');

        return `\n⚠️ PERINGATAN: Query serupa PERNAH GAGAL sebelumnya. JANGAN ulangi kesalahan ini:\n${warnings}`;
    }

    /**
     * Cek apakah query ini sering gagal
     */
    isProblematic(query) {
        const key = this._normalize(query);
        const fails = this.failures.get(key);
        return fails && fails.length >= 3;
    }

    /**
     * Dapatkan statistik error
     */
    getStats() {
        let totalErrors = 0;
        let problematicQueries = 0;
        for (const [, fails] of this.failures) {
            totalErrors += fails.length;
            if (fails.length >= 3) problematicQueries++;
        }
        return {
            uniqueQueries: this.failures.size,
            totalErrors,
            problematicQueries
        };
    }

    _normalize(q) {
        return q.toLowerCase().trim().replace(/\s+/g, ' ').substring(0, 100);
    }

    _save() {
        try {
            const data = Array.from(this.failures.entries());
            fs.writeFileSync(ERROR_FILE, JSON.stringify({ errors: data, lastSaved: Date.now() }, null, 2));
        } catch (e) { /* silent */ }
    }

    _load() {
        try {
            if (fs.existsSync(ERROR_FILE)) {
                const data = JSON.parse(fs.readFileSync(ERROR_FILE, 'utf8'));
                if (data.errors) {
                    this.failures = new Map(data.errors);
                }
                console.log(`✅ Error memory loaded: ${this.failures.size} query patterns`);
            }
        } catch (e) { /* silent */ }
    }
}

module.exports = new ErrorMemory();
