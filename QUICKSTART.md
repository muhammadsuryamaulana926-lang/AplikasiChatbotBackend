# 🚀 Quick Start - Test Chatbot

## Langkah Cepat (5 Menit)

### 1. Persiapan
```bash
# Pastikan di folder chatbot-backend
cd d:\chatbot-backend

# Install dependencies (jika belum)
npm install
```

### 2. Jalankan Test
```bash
# Opsi A: Test Otomatis (semua pertanyaan)
node test-questions.js

# Opsi B: Test Manual (interaktif)
node test-manual.js
```

### 3. Lihat Hasil
```bash
# Hasil test otomatis
type test-results.md

# Hasil test manual
type manual-test-results.md
```

## 📋 Checklist Sebelum Test

- [ ] Database sudah running
- [ ] File `active-db.json` sudah ada
- [ ] API key sudah di-set (GEMINI_API_KEY, GROQ_API_KEY, dll)
- [ ] Dependencies sudah terinstall

## ⚡ Test Cepat (Sample)

Jika ingin test cepat tanpa menjalankan semua pertanyaan:

```bash
node -e "
const ChatbotHandler = require('./chatbot-logic');
const handler = new ChatbotHandler();

(async () => {
  console.log('Test 1: Simple query');
  let res = await handler.processMessage('Berapa total KI?', 'test');
  console.log('Jawaban:', res.message);
  
  console.log('\nTest 2: Complex query');
  res = await handler.processMessage('Tampilkan paten tahun 2019', 'test');
  console.log('Jawaban:', res.message.slice(0, 200) + '...');
  
  console.log('\nTest 3: Follow-up');
  res = await handler.processMessage('lanjut', 'test');
  console.log('Jawaban:', res.message.slice(0, 200) + '...');
})();
"
```

## 📊 Hasil yang Diharapkan

### ✅ Good Response
```
Breakdown berdasarkan jenis_ki:

1. Paten: 450
2. Hak Cipta: 320
3. Desain Industri: 180

Total keseluruhan: 950
```

### ⚠️ Needs Improvement
```
Data berhasil dimuat.
[Terlalu generic, tidak informatif]
```

### ❌ Error
```
Maaf, terjadi kesalahan teknis.
[Perlu fix]
```

## 🔍 Debug Mode

Untuk melihat SQL query yang di-generate:

```bash
# Lihat debug log
type debug_sql_out.txt

# Atau tail real-time (PowerShell)
Get-Content debug_sql_out.txt -Wait -Tail 20
```

## 📈 Monitoring Progress

Saat test berjalan, Anda akan melihat:
```
🚀 Memulai test chatbot...

================================================================================
📋 KATEGORI 1: SQL KOMPLEKS & AGREGASI
================================================================================

[1/10] ❓ Berapa jumlah KI per jenis yang status dokumennya "penerbitan_sertifikat"?
✅ Breakdown berdasarkan jenis_ki: 1. Paten: 150...
⏱️  1234ms

[2/10] ❓ Inventor mana yang punya KI di lebih dari satu jenis?
✅ Daftar inventor dengan multiple jenis KI...
⏱️  2345ms
```

## 🎯 Tips

1. **Jika test terlalu lama:** Kurangi delay di line 87 `test-questions.js`
2. **Jika banyak error:** Cek koneksi database dan API key
3. **Jika hasil tidak akurat:** Review SQL prompt di `chatbot-logic.js`
4. **Jika ingin test kategori tertentu:** Gunakan `test-manual.js`

## 📞 Troubleshooting Cepat

| Error | Solusi |
|-------|--------|
| Cannot connect to database | Cek `active-db.json` |
| AI provider failed | Cek API key |
| SQL syntax error | Review SQL generation prompt |
| Timeout | Increase timeout di `chatbot-logic.js` |

## ✨ Setelah Test

1. Buka `test-results.md`
2. Hitung success rate
3. Identifikasi pattern error
4. Improve prompt jika perlu
5. Re-run test

---

**Estimasi Waktu:**
- Test Otomatis: 5-10 menit
- Test Manual: Sesuai kebutuhan
- Review Hasil: 10-15 menit

**Total: ~30 menit untuk full test cycle**
