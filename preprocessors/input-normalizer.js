// ================================================================
// INPUT NORMALIZER — Enhanced typo correction + slang + entity extraction
// Menggunakan library 'natural' untuk fuzzy matching
// ================================================================

const natural = require('natural');
const fs = require('fs');
const path = require('path');

const DYNAMIC_SLANG_FILE = path.join(__dirname, '..', 'dynamic-slang.json');

// ================================================================
// SLANG MAP — Lebih lengkap dari sebelumnya
// ================================================================
const SLANG_MAP = {
    // Navigasi / lanjut (disimpan untuk Quick Rules)
    'next': 'lanjutkan', 'next dong': 'lanjutkan', 'next aja': 'lanjutkan',
    'lanjut dong': 'lanjutkan', 'lanjut bos': 'lanjutkan',
    'lanj': 'lanjut', 'lanjutt': 'lanjut', 'lajut': 'lanjut', 'lnjut': 'lanjut',
    'cont': 'lanjut', 'continue': 'lanjut', 'lanjutin': 'lanjut',

    // Konfirmasi / persetujuan (disimpan untuk flow ya/tidak Quick Rules)
    'ok': 'ya', 'oke': 'ya', 'oke sip': 'ya', 'ok sip': 'ya',
    'sip': 'ya', 'siap': 'ya', 'yoi': 'ya', 'yap': 'ya', 'yup': 'ya',
    'boleh': 'ya', 'gas': 'ya', 'setuju': 'ya',
    'iya': 'ya', 'iyah': 'ya', 'iyap': 'ya', 'betul': 'ya',

    // KI (sebagai domain standar)
    'aki': 'KI', 'kie': 'KI', 'k.i': 'KI'
};

// ================================================================
// KEYWORD DICTIONARY — untuk typo correction
// ================================================================
const DOMAIN_KEYWORDS = [
    // Kata perintah
    'tampilkan', 'tunjukkan', 'lihat', 'cari', 'temukan', 'hitung',
    'berapa', 'jumlah', 'total', 'daftar', 'list', 'data',
    'lanjut', 'lanjutkan', 'berikutnya', 'selanjutnya', 'kembali', 'ulang',
    'jelaskan', 'ceritakan', 'informasikan', 'carikan', 'tunjukkan', 'perlihatkan',
    // Domain KI
    'paten', 'hak cipta', 'merek', 'desain industri', 'kekayaan intelektual',
    'inventor', 'fakultas', 'instansi', 'sertifikat', 'pendaftaran',
    'status', 'judul', 'abstrak', 'permohonan',
    // Entitas
    'dosen', 'mahasiswa', 'alumni', 'ITB',
    'FMIPA', 'FTMD', 'FTI', 'STEI', 'SITH', 'FITB', 'FSRD', 'SBM', 'FTTM', 'SF', 'SAPPK',
    // Filter
    'terbaru', 'terlama', 'terbanyak', 'tersedikit', 'terbesar', 'terkecil',
    'tahun', 'bulan', 'tanggal', 'dari', 'sampai', 'antara',
    'aktif', 'kadaluarsa', 'pending', 'tersertifikasi', 'granted',
    'disetujui', 'ditolak', 'diproses', 'ajuan', 'diberi',
    // Analisis
    'duplikat', 'anomali', 'rangkum', 'kelompokkan', 'bandingkan',
    'rata-rata', 'tertinggi', 'terendah', 'persentase', 'tren',
    'komparasi', 'perbandingan', 'distribusi', 'statistik',
    // Tambahan entitas penting
    'mitra', 'kepemilikan', 'sertifikasi', 'permohonan', 'jenis',
];

class InputNormalizer {

    constructor() {
        // DYNAMIC_SLANG: otomatis dimuat dari adaptive-learner
        this._dynamicSlang = {};
        this._loadDynamicSlang();
        this._watchDynamicSlang(); // Hot-reload tanpa restart server!
    }

    // ── DYNAMIC SLANG: Load + Hot-reload ─────────────────────────
    _loadDynamicSlang() {
        try {
            if (fs.existsSync(DYNAMIC_SLANG_FILE)) {
                const raw = JSON.parse(fs.readFileSync(DYNAMIC_SLANG_FILE, 'utf8'));
                let count = 0;
                for (const [slang, data] of Object.entries(raw)) {
                    const mapping = typeof data === 'string' ? data : data.mapping;
                    if (mapping && !SLANG_MAP[slang]) { // jangan timpa yang sudah ada di SLANG_MAP statis
                        this._dynamicSlang[slang] = mapping;
                        count++;
                    }
                }
                if (count > 0) {
                    console.log(`🔄 [InputNormalizer] Loaded ${count} dynamic SLANG mappings dari adaptive-learner`);
                }
            }
        } catch (e) { /* silent */ }
    }

    _watchDynamicSlang() {
        // Hot-reload: setiap kali adaptive-learner update file, langsung reload
        try {
            if (fs.existsSync(DYNAMIC_SLANG_FILE)) {
                fs.watch(DYNAMIC_SLANG_FILE, (eventType) => {
                    if (eventType === 'change') {
                        setTimeout(() => {
                            this._dynamicSlang = {};
                            this._loadDynamicSlang();
                            console.log('✅ [InputNormalizer] Dynamic SLANG hot-reloaded!');
                        }, 200); // small debounce
                    }
                });
            } else {
                // File belum ada, pantau folder parent
                const dir = path.dirname(DYNAMIC_SLANG_FILE);
                const watcher = fs.watch(dir, (eventType, filename) => {
                    if (filename === 'dynamic-slang.json') {
                        this._loadDynamicSlang();
                        watcher.close(); // Setelah file ada, ganti ke watch file
                        this._watchDynamicSlang();
                    }
                });
            }
        } catch (e) { /* silent */ }

        // Juga listen ke event bus jika dalam proses yang sama
        try {
            const adaptiveLearner = require('../core/adaptive-learner');
            if (adaptiveLearner?.slangEvents) {
                adaptiveLearner.slangEvents.on('slang_updated', (newSlang) => {
                    for (const [slang, data] of Object.entries(newSlang)) {
                        const mapping = typeof data === 'string' ? data : data.mapping;
                        if (mapping && !SLANG_MAP[slang]) {
                            this._dynamicSlang[slang] = mapping;
                        }
                    }
                    console.log(`⚡ [InputNormalizer] Dynamic SLANG updated in-process (${Object.keys(this._dynamicSlang).length} entries)`);
                });
            }
        } catch (e) { /* silent — dependency mungkin belum load */ }
    }

    /**
     * NORMALISASI LENGKAP — pipeline preprocessing
     * @param {string} input - Raw input dari user
     * @returns {{ normalized: string, corrections: Array, entities: Object }}
     */
    normalize(input) {
        if (!input || typeof input !== 'string') {
            return { normalized: '', corrections: [], entities: {} };
        }

        const corrections = [];
        let q = input.trim();
        const originalQ = q;

        // Step 1: Normalize whitespace
        q = q.replace(/\s+/g, ' ').trim();

        // Step 2: Slang normalization — statis dulu, lalu dynamic
        q = this.normalizeSlang(q, corrections);

        // Step 2b: Dynamic SLANG (dari adaptive-learner) — otomatis!
        q = this._applyDynamicSlang(q, corrections);

        // Step 3: Typo correction (menggunakan Levenshtein distance)
        q = this.correctTypos(q, corrections);

        // Step 4: Extract entities (tahun, nama, angka)
        const entities = this.extractEntities(q);

        // Step 5: Normalize case untuk keyword tertentu
        q = this.normalizeCase(q);

        if (q !== originalQ && corrections.length > 0) {
            console.log(`📝 Input normalized: "${originalQ}" → "${q}" (${corrections.length} koreksi)`);
        }

        return { normalized: q, corrections, entities };
    }

    /**
     * APPLY DYNAMIC SLANG — dari adaptive-learner
     */
    _applyDynamicSlang(query, corrections) {
        if (!this._dynamicSlang || Object.keys(this._dynamicSlang).length === 0) return query;
        let q = query;
        for (const [slang, formal] of Object.entries(this._dynamicSlang)) {
            const escaped = slang.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
            if (regex.test(q)) {
                const before = q;
                q = q.replace(regex, formal);
                if (q !== before) {
                    corrections.push({ type: 'DYNAMIC_SLANG', from: slang, to: formal, description: `Auto-learned: "${slang}" → "${formal}"` });
                }
            }
        }
        return q;
    }

    /**
     * SLANG NORMALIZATION — replace slang dengan kata formal
     */
    normalizeSlang(query, corrections) {
        let q = query;

        // Sort by length (longer phrases first) untuk menghindari partial replace
        const entries = Object.entries(SLANG_MAP).sort((a, b) => b[0].length - a[0].length);

        for (const [slang, formal] of entries) {
            // Boundary-aware replacement
            const escaped = slang.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(?:^|\\b|\\s)${escaped}(?:\\b|\\s|$)`, 'gi');

            if (regex.test(q)) {
                const before = q;
                q = q.replace(new RegExp(`\\b${escaped}\\b`, 'gi'), formal);
                if (q !== before) {
                    corrections.push({
                        type: 'SLANG',
                        from: slang,
                        to: formal,
                        description: `Normalisasi slang "${slang}" → "${formal}"`
                    });
                }
            }
        }

        // ═══ SMART KI NORMALIZATION ═══
        // Jangan expand "ki" jadi frasa panjang jika sudah ada konteks jenis/filter/tahun
        // Cukup uppercase jadi "KI" agar AI tetap paham tanpa membingungkan SQL generation
        const qLower = q.toLowerCase();
        const hasKI = /\bki\b/i.test(q);
        if (hasKI) {
            // Cek apakah sudah ada konteks jenis/filter yang memperjelas
            const hasTypeContext = /\b(paten|hak cipta|merek|desain industri|jenis|yang|dari|tahun|fti|fmipa|ftmd|stei|sith|fitb|fsrd|sbm|fttm|sf|sappk|inventor)\b/i.test(qLower);
            const hasFilterContext = /\b(berapa|total|jumlah|daftar|tampilkan|lihat|cari|saya mau|data|selain|bukan)\b/i.test(qLower);

            if (hasTypeContext || hasFilterContext) {
                // Hanya uppercase, jangan expand — agar AI tetap paham ini "Kekayaan Intelektual"
                const before = q;
                q = q.replace(/\bki\b/gi, 'KI');
                if (q !== before && !corrections.some(c => c.from === 'ki')) {
                    corrections.push({ type: 'SLANG', from: 'ki', to: 'KI', description: 'Smart normalize: keep KI short with context' });
                }
            } else {
                // Tidak ada konteks → expand untuk kejelasan
                const before = q;
                q = q.replace(/\bki\b/gi, 'kekayaan intelektual');
                if (q !== before && !corrections.some(c => c.from === 'ki')) {
                    corrections.push({ type: 'SLANG', from: 'ki', to: 'kekayaan intelektual', description: 'Expand KI for clarity' });
                }
            }
        }

        return q;
    }

    /**
     * TYPO CORRECTION — menggunakan Levenshtein distance
     * Hanya corrects kata yang > 3 huruf dan distance ≤ 2
     */
    correctTypos(query, corrections) {
        const words = query.split(/\s+/);
        const correctedWords = [];

        for (const word of words) {
            // Skip kata yang terlalu pendek, angka, atau sudah ada di dictionary
            if (word.length <= 3 || /^\d+$/.test(word) || DOMAIN_KEYWORDS.includes(word.toLowerCase())) {
                correctedWords.push(word);
                continue;
            }

            // Cek apakah kata ini terlihat seperti typo dari keyword domain
            const closest = this.findClosestKeyword(word.toLowerCase());
            if (closest && closest.distance <= 2 && closest.distance > 0) {
                correctedWords.push(closest.keyword);
                corrections.push({
                    type: 'TYPO',
                    from: word,
                    to: closest.keyword,
                    distance: closest.distance,
                    description: `Koreksi typo "${word}" → "${closest.keyword}" (jarak: ${closest.distance})`
                });
            } else {
                correctedWords.push(word);
            }
        }

        return correctedWords.join(' ');
    }

    /**
     * FIND CLOSEST KEYWORD — Levenshtein distance matching
     */
    findClosestKeyword(word) {
        let bestMatch = null;
        let bestDistance = Infinity;

        for (const keyword of DOMAIN_KEYWORDS) {
            const keywordLower = keyword.toLowerCase();

            // Exact match
            if (word === keywordLower) return { keyword, distance: 0 };

            // Hanya compare jika panjang tidak terlalu berbeda
            if (Math.abs(word.length - keywordLower.length) > 3) continue;

            const dist = natural.LevenshteinDistance(word, keywordLower);

            // Threshold berdasarkan panjang kata
            const maxDist = word.length <= 5 ? 1 : 2;

            if (dist <= maxDist && dist < bestDistance) {
                bestDistance = dist;
                bestMatch = keyword;
            }
        }

        return bestMatch ? { keyword: bestMatch, distance: bestDistance } : null;
    }

    /**
     * EXTRACT ENTITIES — tahun, nama fakultas, angka, dll
     */
    extractEntities(query) {
        const entities = {};

        // Tahun (4 digit antara 1990-2030)
        const yearMatches = query.match(/\b(19|20)\d{2}\b/g);
        if (yearMatches) {
            entities.years = yearMatches.map(Number);
        }

        // Fakultas
        const fakultas = ['FMIPA', 'FTMD', 'FTI', 'STEI', 'SITH', 'FITB', 'FSRD', 'SBM', 'SF', 'FTTM', 'SAPPK'];
        const foundFakultas = fakultas.filter(f => query.toUpperCase().includes(f));
        if (foundFakultas.length > 0) {
            entities.fakultas = foundFakultas;
        }

        // Jenis KI
        const jenisKI = [
            { keyword: 'paten', value: 'Paten' },
            { keyword: 'hak cipta', value: 'Hak Cipta' },
            { keyword: 'merek', value: 'Merek' },
            { keyword: 'desain industri', value: 'Desain Industri' },
            { keyword: 'rahasia dagang', value: 'Rahasia Dagang' }
        ];
        const foundJenis = jenisKI.filter(j => query.toLowerCase().includes(j.keyword));
        if (foundJenis.length > 0) {
            entities.jenisKI = foundJenis.map(j => j.value);
        }

        // Range angka (data 1-10, data ke 5 sampai 20)
        const rangeMatch = query.match(/(\d+)\s*(?:sampai|hingga|-|sd|s\/d)\s*(\d+)/i);
        if (rangeMatch) {
            entities.range = { start: parseInt(rangeMatch[1]), end: parseInt(rangeMatch[2]) };
        }

        // Status
        const statusKeywords = ['aktif', 'kadaluarsa', 'expired', 'pending', 'granted', 'terdaftar', 'tersertifikasi'];
        const foundStatus = statusKeywords.filter(s => query.toLowerCase().includes(s));
        if (foundStatus.length > 0) {
            entities.status = foundStatus;
        }

        return entities;
    }

    /**
     * NORMALIZE CASE — pastikan keyword penting dalam case yang benar
     */
    normalizeCase(query) {
        let q = query;

        // Uppercase untuk singkatan fakultas
        const upperFakultas = ['fmipa', 'ftmd', 'fti', 'stei', 'sith', 'fitb', 'fsrd', 'sbm', 'itb'];
        for (const f of upperFakultas) {
            q = q.replace(new RegExp(`\\b${f}\\b`, 'gi'), f.toUpperCase());
        }

        return q;
    }

    /**
     * CEK APAKAH INPUT TERLALU PENDEK / AMBIGU
     */
    isAmbiguous(input, hasContext) {
        const q = input.trim().toLowerCase();

        // Terlalu pendek (< 3 chars) dan bukan jawaban ya/tidak
        if (q.length < 3 && !q.match(/^(ya|y|ok|no)$/i)) {
            return { ambiguous: true, reason: 'INPUT_TOO_SHORT' };
        }

        // Kata tunggal yang ambigu (tanpa context)
        if (!hasContext && q.split(/\s+/).length === 1) {
            const ambiguousSingleWords = ['data', 'tabel', 'semua', 'info', 'lihat', 'cek'];
            if (ambiguousSingleWords.includes(q)) {
                return { ambiguous: true, reason: 'SINGLE_WORD_AMBIGUOUS', word: q };
            }
        }

        return { ambiguous: false };
    }
}

module.exports = new InputNormalizer();
