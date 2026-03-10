// ================================================================
// CONTEXT MANAGER — Session state + conversation memory + entity tracking
// Menggantikan simple Map dengan state machine yang proper
// ================================================================

class ContextManager {
    constructor() {
        this.sessions = new Map();    // userId -> SessionState
        this.maxSessions = 1000;      // Maximum concurrent sessions
        this.sessionTimeout = 30 * 60 * 1000; // 30 menit
    }

    /**
     * GET SESSION — buat baru jika belum ada
     */
    getSession(userId) {
        if (!this.sessions.has(userId)) {
            this.sessions.set(userId, new SessionState(userId));
        }
        const session = this.sessions.get(userId);
        session.lastActivity = Date.now();
        return session;
    }

    /**
     * ADD MESSAGE ke session (backward compatible)
     */
    addToContext(userId, role, content, metadata = null) {
        const session = this.getSession(userId);
        session.addMessage(role, content, metadata);
    }

    /**
     * GET CONTEXT (backward compatible)
     * Returns array of history entries
     */
    getContext(userId) {
        const session = this.getSession(userId);
        return session.conversationHistory;
    }

    /**
     * BUILD CONVERSATION CONTEXT STRING (backward compatible)
     */
    buildConversationContext(history, getRelativeTime) {
        const now = new Date();
        const currentDateTime = now.toLocaleString('id-ID', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        const prefix = `Waktu Sekarang: ${currentDateTime}\n\n`;

        if (!history || !history.length) return prefix + "Percakapan baru.";

        const relevant = history.slice(-10).map(h => {
            const role = h.role === "user" ? "User" : "Asisten";
            const content = h.content?.slice(0, 300) || '';
            const timeLabel = h.timestamp && getRelativeTime ? ` (${getRelativeTime(h.timestamp)})` : '';

            let contextInfo = `${role}${timeLabel}: ${content}`;

            if (h.lastSqlQuery) contextInfo += `\n[SQL: ${h.lastSqlQuery.slice(0, 100)}...]`;
            if (h.lastDatabase) contextInfo += `\n[Database: ${h.lastDatabase}]`;

            return contextInfo;
        });

        return prefix + "Konteks Percakapan Sebelumnya:\n" + relevant.join('\n\n');
    }

    /**
     * CLEANUP — hapus session yang expired
     */
    cleanup() {
        const now = Date.now();
        for (const [userId, session] of this.sessions) {
            if (now - session.lastActivity > this.sessionTimeout) {
                this.sessions.delete(userId);
            }
        }
    }
}


// ================================================================
// SESSION STATE — state machine per user
// ================================================================
class SessionState {
    constructor(userId) {
        this.userId = userId;
        this.conversationHistory = [];
        this.lastActivity = Date.now();

        // === Current State ===
        this.currentTopic = null;          // Topik aktif saat ini
        this.awaitingConfirmation = false;  // Menunggu ya/tidak?
        this.confirmationType = null;      // 'show_data' | 'count_detail' | 'paginate'

        // === Last Query State ===
        this.lastQuestion = null;          // Pertanyaan terakhir user
        this.originalQuestion = null;      // Pertanyaan original (sebelum modifikasi)
        this.lastDatabase = null;          // Database yang diquery terakhir
        this.lastSqlQuery = null;          // SQL terakhir
        this.lastResults = null;           // Data hasil terakhir (untuk "yang tadi")
        this.lastTotal = null;             // Total data terakhir
        this.wasCountQuery = false;        // Apakah query terakhir COUNT?

        // === Active Filters (untuk filter stacking) ===
        this.activeFilters = {
            jenisKI: null,      // 'Paten', 'Hak Cipta', 'Merek', 'Desain Industri'
            fakultas: null,     // 'FTI', 'FMIPA', etc.
            tahun: null,        // 2023, 2024, etc.
            inventor: null,     // nama inventor
            status: null        // 'Diberi Paten', 'Ajuan', etc.
        };

        // === Pagination State ===
        this.paginationState = null;       // PaginationState object

        // === Entity Memory ===
        this.entityMemory = new Map();     // Entity yang pernah disebut { key -> value }
        this.mentionedTopics = new Set();  // Topik yang pernah dibahas

        // === Pending Action ===
        this.pendingAction = null;         // Data yang menunggu aksi user
        this.pendingDataDisplay = false;   // Menunggu konfirmasi tampil data
    }

    /**
     * ADD MESSAGE — tambahkan entry ke history dengan metadata
     */
    addMessage(role, content, metadata = null) {
        const entry = {
            role,
            content,
            timestamp: Date.now(),
            ...metadata
        };
        this.conversationHistory.push(entry);

        // Update state berdasarkan metadata
        if (metadata) {
            if (metadata.lastQuestion) this.lastQuestion = metadata.lastQuestion;
            if (metadata.originalQuestion) this.originalQuestion = metadata.originalQuestion;
            if (metadata.lastDatabase) this.lastDatabase = metadata.lastDatabase;
            if (metadata.lastSqlQuery) this.lastSqlQuery = metadata.lastSqlQuery;
            if (metadata.lastTotal !== undefined) this.lastTotal = metadata.lastTotal;
            if (metadata.wasCountQuery !== undefined) this.wasCountQuery = metadata.wasCountQuery;
            if (metadata.pendingDataDisplay !== undefined) this.pendingDataDisplay = metadata.pendingDataDisplay;
            if (metadata.lastMultipleDatabases) this.lastResults = metadata.lastMultipleDatabases;
            if (metadata.lastOffset !== undefined) {
                if (!this.paginationState) {
                    this.paginationState = new PaginationState(
                        metadata.lastQuestion || metadata.originalQuestion,
                        metadata.lastDatabase,
                        metadata.lastTotal || 0
                    );
                }
                this.paginationState.currentOffset = metadata.lastOffset;
            }
        }

        // Limit history
        if (this.conversationHistory.length > 30) {
            this.conversationHistory = this.conversationHistory.slice(-30);
        }

        return entry;
    }

    /**
     * CEK APAKAH INI FOLLOW-UP dari pertanyaan sebelumnya
     */
    isFollowUp(input) {
        if (!this.lastQuestion) return false;

        const q = input.toLowerCase().trim();

        // Pattern pronoun / referensi ke percakapan sebelumnya
        const followUpPatterns = [
            /\b(yang tadi|itu|tadi|tersebut|data tersebut)\b/i,
            /\b(lalu|terus|kemudian|selanjutnya|berikutnya)\b/i,
            /\b(totalnya|jumlahnya|semuanya|sisanya|datanya|hasilnya)\b/i,
            /\b(yang mana|yang ini|di atas|yang barusan)\b/i,
            /\b(gimana|bagaimana)\s*(dengan|soal|tentang)\s*(itu|yang|data)/i,
            /\b(masih ada|ada lagi|apalagi)\b/i,
            /\b(coba|tolong)\s*(lihat|tampilkan|cek)\s*(lagi|ulang)/i
        ];

        return followUpPatterns.some(p => p.test(q));
    }

    /**
     * RESOLVE REFERENSI — "yang tadi", "itu", "totalnya"
     * Returns: { type, resolvedQuery, resolvedData }
     */
    resolveReference(input) {
        const q = input.toLowerCase().trim();

        // "totalnya berapa?" / "jumlahnya?" → hitung dari lastResults
        if (/\b(totalnya|jumlahnya|berapa (total|jumlah)nya)\b/i.test(q)) {
            if (this.lastTotal !== null) {
                return {
                    type: 'AGGREGATE_LAST',
                    resolvedQuery: `total dari ${this.lastQuestion}`,
                    data: { total: this.lastTotal, database: this.lastDatabase }
                };
            }
        }

        // "yang tadi" / "itu" → ulangi query sebelumnya
        if (/\b(yang tadi|itu|tadi|yang barusan)\b/i.test(q)) {
            if (this.lastQuestion) {
                // Replace pronoun dengan query sebelumnya
                const resolvedQuery = q
                    .replace(/\b(yang tadi|itu|tadi|yang barusan)\b/gi, this.lastQuestion)
                    .trim();

                return {
                    type: 'REFERENCE_RESOLVED',
                    resolvedQuery,
                    originalRef: this.lastQuestion,
                    database: this.lastDatabase
                };
            }
        }

        // "datanya" / "hasilnya" → referensi ke data terakhir
        if (/\b(datanya|hasilnya|daftar(nya)?)\b/i.test(q)) {
            if (this.lastQuestion) {
                return {
                    type: 'DATA_REFERENCE',
                    resolvedQuery: `tampilkan ${this.lastQuestion}`,
                    database: this.lastDatabase
                };
            }
        }

        return null;
    }

    /**
     * SET PENDING CONFIRMATION — menunggu jawaban user
     */
    setPendingConfirmation(type, data) {
        this.awaitingConfirmation = true;
        this.confirmationType = type;
        this.pendingAction = data;
    }

    /**
     * CLEAR PENDING CONFIRMATION
     */
    clearPendingConfirmation() {
        this.awaitingConfirmation = false;
        this.confirmationType = null;
        this.pendingAction = null;
        this.pendingDataDisplay = false;
    }

    /**
     * TRACK ENTITY — simpan entity yang pernah disebut
     */
    trackEntity(type, value) {
        this.entityMemory.set(type, { value, timestamp: Date.now() });
        this.mentionedTopics.add(type);
    }

    /**
     * GET LAST ENTRY — backward compatible
     */
    getLastEntry() {
        if (this.conversationHistory.length === 0) return null;
        return this.conversationHistory[this.conversationHistory.length - 1];
    }

    /**
     * CHECK apakah topik sudah pernah dibahas
     */
    hasDiscussed(topic) {
        return this.mentionedTopics.has(topic);
    }

    /**
     * UPDATE ACTIVE FILTERS dari SQL yang berhasil dieksekusi
     * Parse WHERE clause untuk extract filter aktif
     */
    updateFiltersFromSQL(sql) {
        if (!sql) return;
        const sqlLower = sql.toLowerCase();

        // Extract jenis_ki filter
        const jenisMatch = sql.match(/jenis_ki\s+(?:LIKE\s+'%|=\s*')(Paten|Hak Cipta|Merek|Desain Industri)/i);
        if (jenisMatch) this.activeFilters.jenisKI = jenisMatch[1];

        // Extract fakultas filter
        const fakMatch = sql.match(/fakultas_inventor\s+LIKE\s+'%(FTI|FMIPA|FTMD|STEI|SITH|FITB|FSRD|SBM|FTTM|SF|SAPPK)%'/i);
        if (fakMatch) this.activeFilters.fakultas = fakMatch[1].toUpperCase();

        // Extract tahun filter
        const tahunMatch = sql.match(/YEAR\s*\(\s*tgl_pendaftaran\s*\)\s*=\s*(\d{4})/i);
        if (tahunMatch) this.activeFilters.tahun = parseInt(tahunMatch[1]);

        // Extract inventor filter
        const invMatch = sql.match(/inventor\s+LIKE\s+'%([^%']+)%'/i);
        if (invMatch) this.activeFilters.inventor = invMatch[1];
    }

    /**
     * UPDATE ACTIVE FILTERS dari query natural language
     * Mengekstrak entity dari teks user untuk di-stack dengan filter lama
     */
    updateFiltersFromQuery(query) {
        if (!query) return;
        const q = query.toLowerCase();

        // Detect jenis KI
        if (/\bpaten\b/.test(q)) this.activeFilters.jenisKI = 'Paten';
        else if (/\bhak\s*cipta\b/.test(q)) this.activeFilters.jenisKI = 'Hak Cipta';
        else if (/\bmerek\b/.test(q)) this.activeFilters.jenisKI = 'Merek';
        else if (/\bdesain\s*industri\b/.test(q)) this.activeFilters.jenisKI = 'Desain Industri';

        // Detect fakultas
        const fakMatch = query.match(/\b(FTI|FMIPA|FTMD|STEI|SITH|FITB|FSRD|SBM|FTTM|SF|SAPPK)\b/i);
        if (fakMatch) this.activeFilters.fakultas = fakMatch[1].toUpperCase();

        // Detect tahun
        const tahunMatch = query.match(/\b(20\d{2}|19\d{2})\b/);
        if (tahunMatch) this.activeFilters.tahun = parseInt(tahunMatch[1]);
    }

    /**
     * GET SQL HINT dari active filters
     * Menghasilkan string hint untuk ditambahkan ke SQL prompt
     */
    getFilterHints() {
        const hints = [];
        if (this.activeFilters.jenisKI) hints.push(`Filter jenis KI aktif: jenis_ki LIKE '%${this.activeFilters.jenisKI}%'`);
        if (this.activeFilters.fakultas) hints.push(`Filter fakultas aktif: fakultas_inventor LIKE '%${this.activeFilters.fakultas}%'`);
        if (this.activeFilters.tahun) hints.push(`Filter tahun aktif: YEAR(tgl_pendaftaran) = ${this.activeFilters.tahun}`);
        if (this.activeFilters.inventor) hints.push(`Filter inventor aktif: inventor LIKE '%${this.activeFilters.inventor}%'`);
        return hints.length > 0 ? '\nFILTER CONTEXT DARI QUERY SEBELUMNYA (pertahankan jika relevan):\n' + hints.join('\n') : '';
    }

    /**
     * CLEAR FILTERS — reset semua filter aktif
     */
    clearFilters() {
        this.activeFilters = { jenisKI: null, fakultas: null, tahun: null, inventor: null, status: null };
    }
}


// ================================================================
// PAGINATION STATE — proper pagination tracking
// ================================================================
class PaginationState {
    constructor(query, database, totalResults) {
        this.query = query;
        this.database = database;
        this.totalResults = totalResults;
        this.currentOffset = 0;
        this.pageSize = 10;
        this.sqlTemplate = null; // SQL tanpa LIMIT/OFFSET
    }

    next() {
        this.currentOffset = Math.min(this.currentOffset + this.pageSize, this.totalResults - 1);
        return this;
    }

    prev() {
        this.currentOffset = Math.max(0, this.currentOffset - this.pageSize);
        return this;
    }

    reset() {
        this.currentOffset = 0;
        return this;
    }

    setRange(start, end) {
        this.currentOffset = Math.max(0, start - 1);
        this.pageSize = Math.min(50, end - start + 1);
    }

    get hasMore() {
        return this.currentOffset + this.pageSize < this.totalResults;
    }

    get currentPage() {
        return Math.floor(this.currentOffset / this.pageSize) + 1;
    }

    get totalPages() {
        return Math.ceil(this.totalResults / this.pageSize);
    }

    get displayRange() {
        const start = this.currentOffset + 1;
        const end = Math.min(this.currentOffset + this.pageSize, this.totalResults);
        return { start, end };
    }
}


// ================================================================
// AUTO-CLEANUP: Jalankan setiap 10 menit
// ================================================================
const contextManager = new ContextManager();

setInterval(() => {
    contextManager.cleanup();
}, 10 * 60 * 1000);


module.exports = contextManager;
module.exports.ContextManager = ContextManager;
module.exports.SessionState = SessionState;
module.exports.PaginationState = PaginationState;
