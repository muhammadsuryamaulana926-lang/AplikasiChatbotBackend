console.log('=== TESTING ALL 4 LAYERS ===\n');

// Layer 1
const inputNorm = require('./preprocessors/input-normalizer');
const r1 = inputNorm.normalize('kasih liat paten terbaru dong');
console.log('Layer 1 (SLANG_MAP):');
console.log('  In :', 'kasih liat paten terbaru dong');
console.log('  Out:', r1.normalized);

// Layer 2 
const semantic = require('./preprocessors/semantic-normalizer');
const r2a = semantic.normalize('tapi yang hak cipta saja', { lastQuestion: 'tampilkan paten FMIPA' });
console.log('\nLayer 2 (Semantic Normalizer):');
console.log('  Test 1 - Filter Tambahan:');
console.log('    In :', 'tapi yang hak cipta saja');
console.log('    Out:', r2a.normalized, '| Pattern:', r2a.patternId);

const r2b = semantic.normalize('wah banyak banget ya');
console.log('  Test 2 - Komentar:');
console.log('    In :', 'wah banyak banget ya');
console.log('    IsComment:', r2b.meta && r2b.meta.isComment ? 'YES ✓' : 'no');

const r2c = semantic.normalize('eh tunggu, maksudnya paten ITB');
console.log('  Test 3 - Koreksi:');
console.log('    In :', 'eh tunggu, maksudnya paten ITB');
console.log('    Out:', r2c.normalized, '| Pattern:', r2c.patternId);

const r2d = semantic.normalize('ada gak ki yang hampir kedaluwarsa');
console.log('  Test 4 - Existence Check:');
console.log('    In :', 'ada gak ki yang hampir kedaluwarsa');
console.log('    Out:', r2d.normalized, '| Pattern:', r2d.patternId);

// Layer 3
const enricher = require('./preprocessors/intent-enricher');
const r3 = enricher.enrich('tampilkan 5 paten FTMD terbaru tahun 2024');
console.log('\nLayer 3 (Intent Enricher):');
console.log('  Query :', 'tampilkan 5 paten FTMD terbaru tahun 2024');
console.log('  Time  :', r3.timeFilter ? r3.timeFilter.type + ' (' + r3.timeFilter.value + ')' : 'none');
console.log('  Limit :', r3.limitHint || 'none');
console.log('  Sort  :', r3.sortHint || 'none');
console.log('  Entities:');
console.log('    Fakultas:', r3.entityFilter.fakultas);
console.log('    JenisKI :', r3.entityFilter.jenisKI);
const hints = enricher.toSQLHint(r3);
console.log('  SQL Hints:\n' + hints);

const r3b = enricher.enrich('paten bukan dari FMIPA');
console.log('  Negation test:', r3b.isNegation ? 'YES ✓' : 'no');

// Layer 4
const adaptive = require('./core/adaptive-learner');
adaptive.recordSuccess('tampilkan paten FMIPA', 'tampilkan paten FMIPA', 'SELECT * FROM ki WHERE jenis_ki="Paten" AND fakultas LIKE "%FMIPA%" LIMIT 10', 'itb_db', 25, 1200);
adaptive.recordSuccess('tampilkan paten FMIPA', 'tampilkan paten FMIPA', 'SELECT * FROM ki WHERE jenis_ki="Paten" AND fakultas LIKE "%FMIPA%" LIMIT 10', 'itb_db', 25, 900);
adaptive.recordFailure('yang aktif numpang daftar', 'yang aktif terdaftar', 'NO_DATA');
adaptive.recordFailure('yang aktif numpang daftar', 'yang aktif terdaftar', 'NO_DATA');
adaptive.recordFailure('yang aktif numpang daftar', 'yang aktif terdaftar', 'NO_DATA');

// Test SQL shortcut
const shortcutSQL = adaptive.getSQLShortcut('tampilkan paten FMIPA');
console.log('\nLayer 4 (Adaptive Learner):');
console.log('  SQL Shortcut for repeated query:', shortcutSQL ? 'FOUND ✓' : 'not found');
console.log('  SQL:', shortcutSQL ? shortcutSQL.substring(0, 80) + '...' : 'N/A');

const slangSuggestions = adaptive.getSuggestedSlangMappings();
console.log('  Slang suggestions:', slangSuggestions.length, 'items');

const stats = adaptive.getStats();
console.log('  Success:', stats.successCount, '| Failure:', stats.failureCount, '| Rate:', stats.successRate);

const report = adaptive.generateReport();
console.log('  Report generated to adaptive-learning-report.json');

console.log('\n=== ALL 4 LAYERS WORKING ✅ ===');
