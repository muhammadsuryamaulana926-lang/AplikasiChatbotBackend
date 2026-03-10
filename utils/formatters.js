// ================================================================
// FORMATTERS UTILS — Centralized data formatting logic
// ================================================================

/**
 * FORMAT TANGGAL — Ubah string DB ke format Indonesia
 */
function formatDate(dateStr) {
    if (!dateStr) return '-';
    try {
        const d = new Date(dateStr);
        if (isNaN(d)) return dateStr;
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
        return dateStr;
    }
}

/**
 * FORMAT ANGKA RIBUAN — Contoh: 1000 -> 1.000
 */
function formatNumber(n) {
    if (n === null || n === undefined) return '0';
    return Number(n).toLocaleString('id-ID');
}

/**
 * STRIP EMOJI — Hapus karakter emoji dari string
 */
function stripEmoji(text) {
    if (!text) return text;
    return text.replace(
        /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F3FB}-\u{1F3FF}\u{1FAD0}-\u{1FAD6}\u{1F400}-\u{1F4FF}]/gu,
        ''
    );
}

/**
 * FORMAT SNAKE CASE TO HUMAN READABLE — Contoh: jenis_ki -> Jenis Ki
 */
function formatSnakeCaseValue(val) {
    if (!val || typeof val !== 'string') return val;
    return val.split(',').map(part => {
        let p = part.trim();
        if (p.includes('_') && !p.includes(' ') && !p.includes('@') && !p.match(/^http/i) && !p.match(/\.\w{2,4}$/)) {
            return p.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }
        return p;
    }).join(', ');
}

/**
 * FORMAT INVENTOR LIST — Bersihkan HTML, ambil nama & fakultas
 */
function formatInventorList(inventorRaw) {
    if (!inventorRaw) return '';

    let cleaned = inventorRaw
        .replace(/<br\s*\/?>/gi, '|||')
        .replace(/<[^>]+>/g, '')
        .trim();

    const parts = cleaned.split(/\|\|\||,(?!\s*\d)|\n/).map(s => s.trim()).filter(Boolean);

    const result = [];
    for (const part of parts) {
        const match = part.match(/^([^(]+)\s*\(([^)-]+)/);
        if (match) {
            const nama = match[1].trim();
            const fakultas = match[2].trim();
            if (nama.length > 3) result.push(`- ${nama} (${fakultas})`);
        } else {
            const cleaned2 = part.replace(/\s*-\s*(Dosen|Alumni|Mahasiswa|NIP|\d+).*$/i, '').trim();
            if (cleaned2.length > 3) result.push(`- ${cleaned2}`);
        }
    }

    return [...new Set(result)].join('\n');
}

/**
 * FORMAT DATABASE NAME — Contoh: kekayaan_intelektual_db -> Kekayaan Intelektual
 */
function formatDbName(db) {
    if (!db) return '';
    return db.replace(/_db$/, '').split('_')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

module.exports = {
    formatDate,
    formatNumber,
    stripEmoji,
    formatSnakeCaseValue,
    formatInventorList,
    formatDbName
};
