// ================================================================
// RESPONSE SCORER — Auto-grade kualitas respons chatbot  
// Mendeteksi respons yang kurang berkualitas sebelum dikirim ke user
// ================================================================

class ResponseScorer {

    /**
     * Beri skor kualitas respons (0-100)
     * @param {string} response - Response AI
     * @param {string} query - Query user
     * @param {Array} data - Data dari database
     * @param {number} total - Total data
     * @returns {{ score: number, grade: string, issues: string[] }}
     */
    score(response, query, data, total) {
        if (!response || typeof response !== 'string') {
            return { score: 0, grade: 'F', issues: ['Response kosong'] };
        }

        let score = 100;
        const issues = [];

        // 1. Terlalu pendek untuk data yang ada
        if (response.length < 50 && data && data.length > 0) {
            score -= 20;
            issues.push('Respons terlalu pendek untuk jumlah data yang ada');
        }

        // 2. Terlalu panjang (> 3000 chars) — user bosan baca
        if (response.length > 3000) {
            score -= 10;
            issues.push('Respons terlalu panjang (> 3000 karakter)');
        }

        // 3. Tidak menyebut jumlah data padahal data > 1
        if (total > 1 && !response.match(/\d+/) && data && data.length > 1) {
            score -= 10;
            issues.push('Tidak menyebutkan jumlah data yang ditemukan');
        }

        // 4. Emoji berlebihan (> 8)
        const emojiCount = (response.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length;
        if (emojiCount > 8) {
            score -= 5;
            issues.push(`Terlalu banyak emoji (${emojiCount})`);
        }

        // 5. Mengandung nama teknis (underscore snake_case)  
        const technicalLeaks = response.match(/\b\w+_\w+\b/g) || [];
        const realLeaks = technicalLeaks.filter(t =>
            !t.startsWith('__') && // bukan dunder
            t.length > 4 &&
            /^[a-z]/.test(t) // dimulai huruf kecil = kemungkinan nama kolom
        );
        if (realLeaks.length > 0) {
            score -= 10;
            issues.push(`Nama teknis terdeteksi: ${realLeaks.slice(0, 3).join(', ')}`);
        }

        // 6. Mengandung SQL
        if (/\b(SELECT|FROM|WHERE|JOIN|GROUP BY|ORDER BY)\b/.test(response)) {
            score -= 15;
            issues.push('SQL query terdeteksi di dalam respons');
        }

        // 7. Bahasa spekulatif berlebihan
        const speculativeWords = (response.match(/\b(mungkin|barangkali|sepertinya|kira-kira|sekitar)\b/gi) || []);
        if (speculativeWords.length > 2) {
            score -= 10;
            issues.push(`Bahasa spekulatif berlebihan (${speculativeWords.length}x)`);
        }

        // 8. Repetisi kata berulang (indikasi AI ngawur)
        const words = response.toLowerCase().split(/\s+/);
        const wordFreq = {};
        words.forEach(w => { if (w.length > 4) wordFreq[w] = (wordFreq[w] || 0) + 1; });
        const maxRepeat = Math.max(...Object.values(wordFreq), 0);
        if (maxRepeat > 10) {
            score -= 15;
            issues.push('Pengulangan kata berlebihan (kemungkinan AI error)');
        }

        // 9. Response dalam bahasa Inggris padahal user pakai Bahasa Indonesia
        const englishWords = (response.match(/\b(the|is|are|was|were|have|has|been|with|from|this|that|which|about)\b/gi) || []);
        if (englishWords.length > 5 && !query.match(/[a-zA-Z]{4,}/)) {
            score -= 10;
            issues.push('Respons mengandung terlalu banyak kata Inggris');
        }

        score = Math.max(0, Math.min(100, score));

        return {
            score,
            grade: this._grade(score),
            issues
        };
    }

    _grade(score) {
        if (score >= 90) return 'A';
        if (score >= 75) return 'B';
        if (score >= 60) return 'C';
        if (score >= 40) return 'D';
        return 'F';
    }
}

module.exports = new ResponseScorer();
