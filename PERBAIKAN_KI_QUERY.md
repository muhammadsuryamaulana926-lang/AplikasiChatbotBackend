# Perbaikan Natural Language Processing untuk Query KI

## Masalah Sebelumnya
- Chatbot tidak bisa memahami pertanyaan natural seperti "Saya mau nanya tentang KI" atau "Paten"
- Menggunakan keyword statis yang harus diupdate manual
- Tidak bisa belajar dari pertanyaan user baru

## Solusi: Dynamic Learning System ✨

### 🧠 Sistem Belajar Otomatis

Chatbot sekarang **BELAJAR OTOMATIS** dari setiap pertanyaan user:

```javascript
// Setiap query disimpan dan dipelajari
queryLearning.learn(userQuery, database, wasSuccessful);

// Sistem menyimpan:
- Query yang sering digunakan
- Keyword yang muncul
- Success rate
- Frekuensi penggunaan
```

### 📊 Data yang Disimpan (query-patterns.json)

```json
{
  "queries": [
    {
      "query": "saya mau nanya tentang ki",
      "database": "itb",
      "count": 5,
      "successCount": 5,
      "firstSeen": 1708704000000,
      "lastUsed": 1708704000000
    }
  ],
  "keywords": ["ki", "paten", "hak", "cipta", ...]
}
```

### 🚀 Cara Kerja

1. **User bertanya**: "Saya mau nanya tentang KI"
2. **Sistem cek**: Apakah ada keyword yang sudah dipelajari?
3. **Jika ada**: Langsung route ke database query
4. **Jika tidak**: Gunakan AI untuk memutuskan
5. **Setelah selesai**: Simpan query + keyword baru ke JSON
6. **Next time**: Query serupa langsung dikenali!

### 💡 Keuntungan

✅ **Otomatis belajar** - Tidak perlu update manual
✅ **Makin pintar** - Semakin banyak dipakai, semakin pintar
✅ **Cepat** - Skip AI decision untuk query yang sudah dikenal
✅ **Fleksibel** - Bisa handle pertanyaan baru apapun
✅ **Scalable** - Menyimpan top 1000 queries

### 📡 API Endpoints Baru

```bash
# Lihat statistik learning
GET /api/learning/query-stats

# Lihat semua keywords yang dipelajari
GET /api/learning/keywords
```

### 🧪 Testing

```bash
# Test query learning
node test-ki-query.js

# Cek hasil learning
curl http://localhost:3000/api/learning/query-stats
```

## Cara Testing

### Manual Test:
1. Restart backend server
2. Coba pertanyaan:
   - "Saya mau nanya tentang KI"
   - "Paten"
   - "Hak Cipta"
   - "Ada database apa saja"

### Automated Test:
```bash
node test-ki-query.js
```

## Expected Results
✅ Pertanyaan "Saya mau nanya tentang KI" → Menampilkan semua data KI
✅ Pertanyaan "Paten" → Menampilkan data Paten saja
✅ Pertanyaan "Hak Cipta" → Menampilkan data Hak Cipta saja
✅ Error message memberikan saran yang membantu

## Files Modified/Created
1. `query-learning.js` - **NEW** Dynamic learning system
2. `query-patterns.json` - **NEW** Learned patterns storage
3. `chatbot-logic.js` - Integrated learning system
4. `server.js` - Added learning API endpoints
5. `cors-config.js` - Network configuration
6. `test-ki-query.js` - Test file
7. `PERBAIKAN_KI_QUERY.md` - Documentation

## Contoh Evolusi Sistem

### Hari 1:
```json
{"keywords": ["ki", "paten", "hak cipta"]}
```

### Hari 7 (setelah 100 queries):
```json
{
  "keywords": [
    "ki", "paten", "hak cipta", "inventor", "judul",
    "tahun", "2019", "2020", "fakultas", "teknik",
    "energi", "teknologi", "daftar", "total"
  ]
}
```

### Hari 30 (setelah 1000 queries):
Sistem sudah mengenal ratusan variasi pertanyaan dan bisa handle hampir semua query natural language! 🎉
