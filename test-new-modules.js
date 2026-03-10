// Quick test for new modules
const sv = require('./safety/sql-validator');
const hg = require('./safety/hallucination-guard');
const ic = require('./core/intent-classifier');

console.log('=== SQL VALIDATOR TEST ===');
sv.setSchemaCache({
    test_db: {
        data_import: {
            columns: 'id (int), judul (varchar), jenis_ki (varchar), status_ki (varchar), tgl_pendaftaran (date), inventor (text)',
            sample_rows: []
        }
    }
});

// Test 1: Valid SQL
const r1 = sv.validate("SELECT * FROM data_import WHERE jenis_ki LIKE '%Paten%' LIMIT 10", 'test_db');
console.log('Test1 Valid SQL:', r1.valid ? 'PASS' : 'FAIL');

// Test 2: Wrong table
const r2 = sv.validate("SELECT * FROM wrong_table LIMIT 10", 'test_db');
console.log('Test2 Wrong Table:', !r2.valid ? 'PASS' : 'FAIL', '-', r2.errors[0]?.slice(0, 80));

// Test 3: Wrong column
const r3 = sv.validate("SELECT wrong_col FROM data_import LIMIT 10", 'test_db');
console.log('Test3 Wrong Col:', r3.warnings.length > 0 || !r3.valid ? 'PASS' : 'FAIL');

// Test 4: Unsafe SQL (DELETE)
const r4 = sv.validate("DELETE FROM data_import", 'test_db');
console.log('Test4 Unsafe SQL:', !r4.valid ? 'PASS' : 'FAIL', '-', r4.errors[0]?.slice(0, 80));

// Test 5: No LIMIT
const r5 = sv.validate("SELECT * FROM data_import WHERE id > 1", 'test_db');
console.log('Test5 Missing LIMIT:', r5.warnings.some(w => w.includes('LIMIT')) ? 'PASS (auto-added)' : 'FAIL');

// Test 6: SQL Injection
const r6 = sv.validate("SELECT * FROM data_import; DROP TABLE data_import", 'test_db');
console.log('Test6 Injection:', !r6.valid ? 'PASS' : 'FAIL');

console.log('\n=== HALLUCINATION GUARD TEST ===');

// Test 7: Number mismatch
const h1 = hg.validate("Ditemukan sekitar 150 data paten.", [{ id: 1 }], 87, "berapa paten?");
console.log('Test7 Number Mismatch:', h1.issues.some(i => i.type === 'NUMBER_MISMATCH') ? 'PASS' : 'FAIL');

// Test 8: SQL Leak
const h2 = hg.validate("Saya menemukan data menggunakan SELECT * FROM data_import dan hasilnya...", [{ id: 1 }], 1, "test");
console.log('Test8 SQL Leak:', h2.issues.some(i => i.type === 'SQL_LEAK') ? 'PASS' : 'FAIL');

// Test 9: Technical leak
const h3 = hg.validate("Data dari tabel data_import menunjukkan tgl_pendaftaran tahun 2023", [{ id: 1 }], 1, "test");
console.log('Test9 Tech Leak:', h3.issues.some(i => i.type === 'TECHNICAL_LEAK') ? 'PASS' : 'FAIL');

// Test 10: Clean response
const h4 = hg.validate("Ditemukan 87 data paten yang sudah tersertifikasi.", [{ id: 1 }], 87, "berapa paten?");
console.log('Test10 Clean:', h4.isClean ? 'PASS' : 'FAIL');

console.log('\n=== INTENT CLASSIFIER TEST ===');

// Test 11: Greeting
const i1 = ic.quickClassify('halo', {});
console.log('Test11 Greeting:', i1.intent === 'CONVERSATION' ? 'PASS' : 'FAIL');

// Test 12: Pagination
const i2 = ic.quickClassify('lanjut', {});
console.log('Test12 Paginate:', i2.intent === 'COMMAND' ? 'PASS' : 'FAIL');

// Test 13: Confirm yes
const i3 = ic.quickClassify('ya', { awaitingConfirmation: true });
console.log('Test13 Confirm Yes:', i3.intent === 'CONFIRMATION' ? 'PASS' : 'FAIL');

// Test 14: Confirm no
const i4 = ic.quickClassify('tidak', { awaitingConfirmation: true });
console.log('Test14 Confirm No:', i4.intent === 'CONFIRMATION' ? 'PASS' : 'FAIL');

// Test 15: Select number
const i5 = ic.quickClassify('3', {});
console.log('Test15 Select Num:', i5.intent === 'COMMAND' && i5.data?.number === 3 ? 'PASS' : 'FAIL');

// Test 16: Thanks
const i6 = ic.quickClassify('terima kasih', {});
console.log('Test16 Thanks:', i6.intent === 'CONVERSATION' ? 'PASS' : 'FAIL');

console.log('\n=== ALL TESTS COMPLETE ===');
