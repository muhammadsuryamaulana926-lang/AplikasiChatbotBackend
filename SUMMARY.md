# 🧪 Test Suite Chatbot KI ITB

## 📦 File yang Dibuat

1. **test-questions.js** - Script otomatis untuk menjalankan semua test
2. **test-manual.js** - Script interaktif untuk test manual
3. **TEST-README.md** - Dokumentasi lengkap
4. **SUMMARY.md** - File ini

## 🚀 Cara Menjalankan

### Opsi 1: Test Otomatis (Semua Pertanyaan)

```bash
node test-questions.js
```

**Kelebihan:**
- Menjalankan semua 55 pertanyaan otomatis
- Hasil langsung disimpan ke `test-results.md`
- Tidak perlu interaksi manual

**Kekurangan:**
- Memakan waktu 5-10 menit
- Tidak bisa skip pertanyaan tertentu

### Opsi 2: Test Manual (Interaktif)

```bash
node test-manual.js
```

**Kelebihan:**
- Kontrol penuh atas pertanyaan yang ditest
- Bisa test kategori tertentu saja
- Bisa lihat hasil real-time
- Bisa simpan hasil kapan saja

**Kekurangan:**
- Perlu input manual untuk setiap pertanyaan

## 📊 Kategori Test (55 Pertanyaan Total)

### 1️⃣ SQL KOMPLEKS & AGREGASI (10 pertanyaan)
Test kemampuan generate SQL kompleks dengan:
- Multiple conditions
- Agregasi (COUNT, AVG, SUM)
- GROUP BY, HAVING
- Date range filtering
- Anomaly detection

**Contoh:**
- "Berapa jumlah KI per jenis yang status dokumennya 'penerbitan_sertifikat' dan didaftarkan antara 2018 sampai 2023?"
- "Berapa rata-rata waktu dari pendaftaran sampai sertifikasi untuk setiap jenis KI?"

### 2️⃣ PENCARIAN AMBIGU & CONTEXT (10 pertanyaan)
Test kemampuan memahami context dan follow-up:
- Reference ke hasil sebelumnya
- Modifikasi query sebelumnya
- Context-aware filtering

**Contoh:**
- "Yang tadi, tapi hanya dari FMIPA"
- "Tampilkan detailnya nomor 3"
- "Sama seperti sebelumnya tapi tahun 2020"

### 3️⃣ PERTANYAAN JEBAKAN / EDGE CASE (10 pertanyaan)
Test handling untuk kasus ekstrem:
- Data tidak ada
- Input tidak valid
- Query terlalu luas
- Konsistensi jawaban

**Contoh:**
- "Tampilkan semua KI" (13k+ data)
- "KI nomor 9999 detail lengkapnya" (tidak ada)
- "Inventor bernama 'A'" (terlalu pendek)

### 4️⃣ ANALISIS & INSIGHT (10 pertanyaan)
Test kemampuan analisis data:
- Pattern detection
- Trend analysis
- Correlation
- Statistical insights

**Contoh:**
- "Jenis KI apa yang paling sering ditolak dan apa polanya?"
- "Tren pendaftaran KI dari 2010 sampai 2024 naik atau turun?"

### 5️⃣ MULTI-STEP & FOLLOW-UP CHAIN (10 pertanyaan)
Test conversation flow:
- Multi-turn dialogue
- Context preservation
- Progressive filtering

**Contoh:**
- "Tampilkan inventor dari FTTM" → "berapa total mereka" → "siapa yang paling banyak"

### 6️⃣ PERTANYAAN GABUNGAN / KOMPLEKS (5 pertanyaan)
Test query super kompleks:
- Multiple conditions
- Cross-reference
- Complex logic

**Contoh:**
- "Tampilkan KI yang inventornya lebih dari 3 orang dan statusnya sudah tersertifikasi"
- "Bandingkan KI yang didaftarkan oleh Dosen vs Alumni vs Mahasiswa"

## 📈 Evaluasi Hasil

Setelah test selesai, evaluasi berdasarkan:

### ✅ Success Criteria
- [ ] Query SQL yang di-generate benar
- [ ] Hasil sesuai dengan pertanyaan
- [ ] Response time < 5 detik
- [ ] Tidak ada error/crash
- [ ] Context dipertahankan dengan baik

### ⚠️ Warning Criteria
- [ ] Query benar tapi format output kurang rapi
- [ ] Response time 5-10 detik
- [ ] Context kadang hilang

### ❌ Fail Criteria
- [ ] Query SQL salah
- [ ] Hasil tidak relevan
- [ ] Error/crash
- [ ] Response time > 10 detik

## 📝 Format Hasil Test

File `test-results.md` akan berisi:

```markdown
# Hasil Test Chatbot KI ITB

**Tanggal:** [timestamp]
**Total Pertanyaan:** 55

## KATEGORI 1: SQL KOMPLEKS & AGREGASI

### 1. Berapa jumlah KI per jenis yang status dokumennya "penerbitan_sertifikat"?

**Jawaban:**
Breakdown berdasarkan jenis_ki:

1. Paten: 150
2. Hak Cipta: 89
3. Desain Industri: 45

Total keseluruhan: 284

*Waktu: 1234ms*
```

## 🔧 Troubleshooting

### Error: "Cannot connect to database"
**Solusi:** Cek `active-db.json` dan pastikan database running

### Error: "AI provider failed"
**Solusi:** Cek API key di environment variables

### Test terlalu lama
**Solusi:** 
- Reduce delay di `test-questions.js` (line 87)
- Atau gunakan `test-manual.js` untuk test kategori tertentu saja

### Hasil tidak akurat
**Solusi:**
- Review SQL query di `debug_sql_out.txt`
- Improve SQL generation prompt di `chatbot-logic.js`

## 📊 Metrics yang Diukur

1. **Accuracy** - Berapa % pertanyaan dijawab dengan benar?
2. **Response Time** - Rata-rata waktu response
3. **Error Rate** - Berapa % pertanyaan yang error?
4. **Context Retention** - Berapa % follow-up yang berhasil?
5. **SQL Quality** - Berapa % SQL query yang valid?

## 🎯 Target Benchmark

- ✅ Accuracy: > 80%
- ✅ Response Time: < 3 detik (rata-rata)
- ✅ Error Rate: < 5%
- ✅ Context Retention: > 90%
- ✅ SQL Quality: > 95%

## 📞 Support

Jika ada pertanyaan atau issue:
1. Cek `debug_sql_out.txt` untuk SQL query yang di-generate
2. Cek console output untuk error message
3. Review `test-results.md` untuk pattern error

## 🚀 Next Steps

Setelah test selesai:
1. Review hasil di `test-results.md`
2. Identifikasi kategori yang perlu improvement
3. Update SQL generation prompt jika perlu
4. Re-run test untuk validasi improvement
5. Document lessons learned

---

**Happy Testing! 🎉**
