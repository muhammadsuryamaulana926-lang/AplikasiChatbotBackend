# Test Chatbot KI ITB

## Cara Menjalankan Test

1. **Pastikan semua dependencies sudah terinstall:**
   ```bash
   npm install
   ```

2. **Pastikan database sudah terkonfigurasi:**
   - File `active-db.json` sudah ada
   - Database connection bisa diakses

3. **Jalankan test:**
   ```bash
   node test-questions.js
   ```

4. **Hasil test akan disimpan di:**
   - File: `test-results.md`
   - Format: Markdown dengan struktur kategori

## Kategori Test

### KATEGORI 1: SQL KOMPLEKS & AGREGASI (10 pertanyaan)
- Query dengan multiple JOIN
- Agregasi kompleks (COUNT, AVG, GROUP BY)
- Filter dengan range tanggal
- Deteksi anomali data

### KATEGORI 2: PENCARIAN AMBIGU & CONTEXT (10 pertanyaan)
- Follow-up questions
- Context-aware queries
- Referensi ke hasil sebelumnya

### KATEGORI 3: PERTANYAAN JEBAKAN / EDGE CASE (10 pertanyaan)
- Data tidak ada
- Input tidak valid
- Query yang terlalu luas
- Konsistensi jawaban

### KATEGORI 4: ANALISIS & INSIGHT (10 pertanyaan)
- Analisis tren
- Korelasi data
- Pattern detection
- Statistical analysis

### KATEGORI 5: MULTI-STEP & FOLLOW-UP CHAIN (10 pertanyaan)
- Conversation flow
- Multi-turn dialogue
- Context preservation

### KATEGORI 6: PERTANYAAN GABUNGAN / KOMPLEKS (5 pertanyaan)
- Multiple conditions
- Complex filtering
- Cross-reference queries

## Output Format

Hasil test akan berisi:
- Pertanyaan
- Jawaban dari AI
- Waktu eksekusi (ms)
- Error message (jika ada)

## Catatan

- Test akan berjalan sekitar 5-10 menit (tergantung jumlah pertanyaan)
- Ada delay 1 detik antar pertanyaan untuk menghindari rate limit
- Jika ada error, test akan tetap lanjut ke pertanyaan berikutnya
- Context akan dipertahankan untuk test kategori 2 dan 5

## Troubleshooting

**Jika test gagal:**
1. Cek koneksi database
2. Cek API key untuk AI provider
3. Cek log di `debug_sql_out.txt`
4. Pastikan semua dependencies terinstall

**Jika hasil tidak sesuai:**
1. Review SQL query yang di-generate (ada di debug log)
2. Cek schema database
3. Cek sample data di database

## Evaluasi Hasil

Setelah test selesai, evaluasi:
- ✅ Berapa pertanyaan yang dijawab dengan benar?
- ⚠️ Berapa yang perlu improvement?
- ❌ Berapa yang error?
- 📊 Rata-rata waktu response

## Improvement

Berdasarkan hasil test, Anda bisa:
1. Improve SQL generation prompt
2. Tambah handling untuk edge cases
3. Improve context management
4. Optimize response time
