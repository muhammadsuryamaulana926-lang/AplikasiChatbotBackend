// ================================================================
// HALLUCINATION GUARD — Anti jawaban ngasal
// Validasi bahwa response AI sesuai dengan data aktual
// ================================================================

class HallucinationGuard {

    /**
     * VALIDASI RESPONSE — cek angka, entitas, dan bahasa spekulatif
     * @param {string} aiResponse - Response yang di-generate AI
     * @param {Array} actualData - Data aktual dari database
     * @param {number} actualTotal - Total data aktual
     * @param {string} query - Query asli user
     * @returns {{ isClean: boolean, issues: Array, sanitizedResponse: string }}
     */
    validate(aiResponse, actualData, actualTotal, query) {
        if (!aiResponse || typeof aiResponse !== 'string') {
            return { isClean: true, issues: [], sanitizedResponse: aiResponse };
        }

        const issues = [];

        // 1. CEK ANGKA — angka di response harus cocok dengan data
        const numberIssues = this.checkNumbers(aiResponse, actualData, actualTotal);
        issues.push(...numberIssues);

        // 2. CEK BAHASA SPEKULATIF — tanpa dasar data
        const speculativeIssues = this.checkSpeculativeLanguage(aiResponse);
        issues.push(...speculativeIssues);

        // 3. CEK FORMAT TEKNIS — nama tabel/kolom mentah tidak boleh muncul
        const technicalIssues = this.checkTechnicalLeaks(aiResponse);
        issues.push(...technicalIssues);

        // 4. CEK SQL LEAK — SQL query tidak boleh muncul di response
        const sqlLeakIssues = this.checkSQLLeak(aiResponse);
        issues.push(...sqlLeakIssues);

        // 5. CEK DOMAIN HALLUCINATION — KI = Kekayaan Intelektual, BUKAN Kecerdasan Buatan
        const domainIssues = this.checkDomainHallucination(aiResponse);
        issues.push(...domainIssues);

        // Sanitize jika ada issues HIGH severity
        const highIssues = issues.filter(i => i.severity === 'HIGH');
        const sanitizedResponse = highIssues.length > 0
            ? this.sanitize(aiResponse, issues, actualTotal)
            : aiResponse;

        return {
            isClean: highIssues.length === 0,
            issues,
            sanitizedResponse
        };
    }

    /**
     * CEK ANGKA — angka besar di response harus ada di data
     */
    checkNumbers(response, actualData, actualTotal) {
        const issues = [];

        // Extract angka dari response (abaikan angka kecil 0-10, tahun, dan formatting)
        const numberMatches = response.match(/\b\d[\d.,]*\b/g) || [];
        const numbersInResponse = numberMatches
            .map(n => parseInt(n.replace(/[.,]/g, '')))
            .filter(n => !isNaN(n) && n > 10 && n < 100000)
            .filter(n => !(n >= 1900 && n <= 2100)); // Abaikan tahun

        // Kumpulkan semua angka dari data aktual
        const numbersInData = new Set();
        numbersInData.add(actualTotal);
        if (actualData && Array.isArray(actualData)) {
            numbersInData.add(actualData.length);
            for (const row of actualData) {
                for (const val of Object.values(row)) {
                    if (typeof val === 'number' && val > 10) {
                        numbersInData.add(val);
                    }
                }
            }
        }

        for (const num of numbersInResponse) {
            // Cek apakah angka ada di data (dengan toleransi ±1)
            const found = [...numbersInData].some(d => Math.abs(d - num) <= 1);
            if (!found) {
                issues.push({
                    type: 'NUMBER_MISMATCH',
                    detail: `Angka ${num.toLocaleString('id-ID')} di response tidak cocok dengan data aktual (total: ${actualTotal})`,
                    severity: 'HIGH',
                    value: num,
                    expected: actualTotal
                });
            }
        }

        return issues;
    }

    /**
     * CEK BAHASA SPEKULATIF — kata-kata yang menandakan halusinasi
     */
    checkSpeculativeLanguage(response) {
        const issues = [];
        const lower = response.toLowerCase();

        const speculativePatterns = [
            { pattern: /\b(mungkin|barangkali|kemungkinan besar)\b/gi, word: 'mungkin/barangkali', severity: 'MEDIUM' },
            { pattern: /\b(sepertinya|tampaknya|kayaknya|rasanya)\b/gi, word: 'sepertinya/tampaknya', severity: 'MEDIUM' },
            { pattern: /\bkira-kira\b/gi, word: 'kira-kira', severity: 'LOW' },
            { pattern: /\b(saya rasa|menurut saya|saya pikir)\b/gi, word: 'opini tanpa data', severity: 'MEDIUM' },
            { pattern: /\b(sekitar|kurang lebih|lebih kurang)\s+\d/gi, word: 'estimasi angka', severity: 'HIGH' },
            { pattern: /\b(bisa jadi|tidak menutup kemungkinan|bukan tidak mungkin)\b/gi, word: 'spekulasi', severity: 'LOW' }
        ];

        for (const { pattern, word, severity } of speculativePatterns) {
            if (pattern.test(response)) {
                issues.push({
                    type: 'SPECULATIVE_LANGUAGE',
                    detail: `Menggunakan "${word}" — jawaban harus berdasarkan data, bukan perkiraan`,
                    severity
                });
            }
        }

        return issues;
    }

    /**
     * CEK TECHNICAL LEAKS — nama tabel/kolom mentah tidak boleh muncul
     */
    checkTechnicalLeaks(response) {
        const issues = [];

        // Deteksi nama tabel/kolom dengan underscore (snake_case) yang bukan di dalam code blocks
        const technicalPatterns = [
            { pattern: /\b(data_import|kekayaan_intelektual|tabel_\w+)\b/g, type: 'TABLE_NAME' },
            { pattern: /\b(tgl_pendaftaran|tgl_sertifikasi|status_ki|jenis_ki|no_permohonan|id_sertifikat|fakultas_inventor|pekerjaan_inventor|nama_instansi_inventor|mitra_kepemilikan|status_dokumen|id_ki)\b/g, type: 'COLUMN_NAME' }
        ];

        for (const { pattern, type } of technicalPatterns) {
            const matches = response.match(pattern);
            if (matches) {
                for (const match of matches) {
                    issues.push({
                        type: 'TECHNICAL_LEAK',
                        detail: `Nama teknis "${match}" muncul di response — harus dikonversi ke bahasa manusia`,
                        severity: 'MEDIUM',
                        value: match
                    });
                }
            }
        }

        return issues;
    }

    /**
     * CEK SQL LEAK — query SQL tidak boleh muncul di response
     */
    checkSQLLeak(response) {
        const issues = [];

        const sqlPatterns = [
            /\bSELECT\s+.+\s+FROM\s+/i,
            /\bWHERE\s+\w+\s*(=|LIKE|>|<|IN)\s*/i,
            /\bGROUP\s+BY\s+\w+/i,
            /\bORDER\s+BY\s+\w+\s+(ASC|DESC)/i,
            /\bLIMIT\s+\d+\s*(OFFSET\s+\d+)?/i,
            /\bCOUNT\s*\(\s*(\*|\w+)\s*\)/i,
            /\bJOIN\s+\w+\s+ON\s+/i
        ];

        for (const pattern of sqlPatterns) {
            if (pattern.test(response)) {
                // Pastikan bukan dalam konteks penjelasan (dalam quote atau backtick)
                // Kalau ada di luar backtick, itu leak
                const cleaned = response.replace(/`[^`]*`/g, '').replace(/```[\s\S]*?```/g, '');
                if (pattern.test(cleaned)) {
                    issues.push({
                        type: 'SQL_LEAK',
                        detail: `Pola SQL terdeteksi di response — SQL tidak boleh ditampilkan ke user`,
                        severity: 'HIGH'
                    });
                    break; // Cukup 1 laporan
                }
            }
        }

        return issues;
    }

    /**
     * CEK DOMAIN HALLUCINATION — KI = Kekayaan Intelektual, BUKAN Kecerdasan Buatan
     */
    checkDomainHallucination(response) {
        const issues = [];
        const lower = response.toLowerCase();

        // Cek apakah AI salah mengartikan KI sebagai Kecerdasan Buatan
        if (/kecerdasan\s+buatan/i.test(response) || /artificial\s+intelligence/i.test(response)) {
            issues.push({
                type: 'DOMAIN_HALLUCINATION',
                detail: 'AI salah mengartikan KI sebagai Kecerdasan Buatan — harus Kekayaan Intelektual',
                severity: 'HIGH',
                subtype: 'KI_MISINTERPRET'
            });
        }

        // Cek apakah AI mengarang jenis KI yang tidak ada
        const fakeTypes = /\b(KI\s+Super|KI\s+Kuat|KI\s+Lemah|KI\s+Ultra|KI\s+Sempit|KI\s+Umum|Narrow\s+AI|General\s+AI|Strong\s+AI|Weak\s+AI|machine\s+learning|deep\s+learning|neural\s+network|KI-PPI|KI-Hormonal|KI-Non Hormonal|KI-Alami|KI\s+Hidup|KI\s+Mati|KI\s+Tumbuh|KI\s+Hancur)\b/i;
        if (fakeTypes.test(response)) {
            issues.push({
                type: 'DOMAIN_HALLUCINATION',
                detail: 'AI mengarang jenis KI yang tidak ada dalam database',
                severity: 'HIGH',
                subtype: 'FAKE_KI_TYPES'
            });
        }

        return issues;
    }

    /**
     * SANITIZE — perbaiki response yang bermasalah
     */
    sanitize(response, issues, actualTotal) {
        let sanitized = response;

        for (const issue of issues) {
            switch (issue.type) {
                case 'NUMBER_MISMATCH':
                    // Replace angka yang salah dengan angka yang benar
                    if (issue.value && issue.expected) {
                        const wrongNum = issue.value.toLocaleString('id-ID');
                        const rightNum = issue.expected.toLocaleString('id-ID');
                        // Coba replace secara aman
                        sanitized = sanitized.replace(
                            new RegExp(`\\b${this.escapeRegex(wrongNum)}\\b`),
                            rightNum
                        );
                        // Juga coba format tanpa separator
                        sanitized = sanitized.replace(
                            new RegExp(`\\b${issue.value}\\b`),
                            String(issue.expected)
                        );
                    }
                    break;

                case 'SQL_LEAK':
                    // Remove SQL dari response
                    sanitized = sanitized
                        .replace(/SELECT\s+[\s\S]+?(?:FROM|;)/gi, '[query data]')
                        .replace(/WHERE\s+[\s\S]+?(?:GROUP|ORDER|LIMIT|$)/gi, '')
                        .replace(/LIMIT\s+\d+(\s+OFFSET\s+\d+)?/gi, '');
                    break;

                case 'TECHNICAL_LEAK':
                    if (issue.value) {
                        const humanName = this.technicalToHuman(issue.value);
                        sanitized = sanitized.replace(new RegExp(this.escapeRegex(issue.value), 'g'), humanName);
                    }
                    break;

                case 'SPECULATIVE_LANGUAGE':
                    // Untuk severity HIGH (estimasi angka), hapus kalimat spekulatif
                    if (issue.severity === 'HIGH') {
                        sanitized = sanitized.replace(/sekitar\s+\d[\d.,]*/gi, match => {
                            return match.replace(/sekitar\s+/i, '');
                        });
                        sanitized = sanitized.replace(/(kurang lebih|lebih kurang)\s+\d[\d.,]*/gi, match => {
                            return match.replace(/(kurang lebih|lebih kurang)\s+/i, '');
                        });
                    }
                    break;

                case 'DOMAIN_HALLUCINATION':
                    // Replace "Kecerdasan Buatan" dengan "Kekayaan Intelektual"
                    sanitized = sanitized.replace(/Kecerdasan\s+Buatan/gi, 'Kekayaan Intelektual');
                    sanitized = sanitized.replace(/Artificial\s+Intelligence/gi, 'Kekayaan Intelektual');
                    // Remove fabricated clauses
                    sanitized = sanitized.replace(/,?\s*(?:yaitu|antara lain|seperti|contohnya)[^.]*(?:KI\s+|KI-|Artificial|Narrow|General|Strong|Weak|Learning|Network)[^.]*/gi, '.');
                    break;
            }
        }

        return sanitized;
    }

    /**
     * Konversi nama teknis ke bahasa manusia
     */
    technicalToHuman(technicalName) {
        const map = {
            'data_import': 'Data',
            'kekayaan_intelektual': 'Kekayaan Intelektual',
            'tgl_pendaftaran': 'Tanggal Pendaftaran',
            'tgl_sertifikasi': 'Tanggal Sertifikasi',
            'status_ki': 'Status KI',
            'jenis_ki': 'Jenis KI',
            'no_permohonan': 'Nomor Permohonan',
            'id_sertifikat': 'Nomor Sertifikat',
            'fakultas_inventor': 'Fakultas Inventor',
            'pekerjaan_inventor': 'Pekerjaan Inventor',
            'nama_instansi_inventor': 'Nama Instansi',
            'mitra_kepemilikan': 'Mitra Kepemilikan',
            'status_dokumen': 'Status Dokumen',
            'id_ki': 'ID KI'
        };

        if (map[technicalName]) return map[technicalName];

        // Default: convert snake_case ke Title Case
        return technicalName.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    escapeRegex(str) {
        return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

module.exports = new HallucinationGuard();
