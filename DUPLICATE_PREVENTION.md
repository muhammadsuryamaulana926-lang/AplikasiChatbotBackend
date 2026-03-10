# Cara Kerja Pencegahan Duplikat Keyword

## 🔒 Menggunakan JavaScript Set

### Apa itu Set?
Set adalah struktur data JavaScript yang **otomatis mencegah duplikat**.

```javascript
const keywords = new Set();

keywords.add('paten');  // ✅ Ditambahkan
keywords.add('paten');  // ❌ Diabaikan (sudah ada)
keywords.add('paten');  // ❌ Diabaikan (sudah ada)

console.log(keywords.size); // Output: 1 (bukan 3!)
```

## 📊 Implementasi di Query Learning

### 1. Load Patterns (Convert Array → Set)
```javascript
loadPatterns() {
  const data = JSON.parse(fs.readFileSync(LEARNING_FILE, 'utf8'));
  data.keywords = new Set(data.keywords || []); // Array → Set
  return data;
}
```

### 2. Learn (Set.add otomatis prevent duplikat)
```javascript
learn(userQuery, database, success) {
  const words = query.split(/\s+/);
  
  words.forEach(word => {
    this.patterns.keywords.add(word); // Set otomatis skip duplikat!
  });
}
```

### 3. Save Patterns (Convert Set → Array)
```javascript
savePatterns() {
  const data = {
    queries: this.patterns.queries,
    keywords: Array.from(this.patterns.keywords) // Set → Array
  };
  fs.writeFileSync(LEARNING_FILE, JSON.stringify(data, null, 2));
}
```

## 🧪 Testing

### Scenario 1: Query yang Sama
```javascript
queryLearning.learn('Paten ITB', 'itb', true);
queryLearning.learn('Paten ITB', 'itb', true);
queryLearning.learn('Paten ITB', 'itb', true);

// Result:
// - Query count: 3 (increment counter)
// - Keyword "paten": 1 (tidak duplikat!)
// - Keyword "itb": 1 (tidak duplikat!)
```

### Scenario 2: Query Berbeda, Keyword Sama
```javascript
queryLearning.learn('Paten 2019', 'itb', true);
queryLearning.learn('Paten 2020', 'itb', true);
queryLearning.learn('Paten terbaru', 'itb', true);

// Result:
// - 3 queries tersimpan
// - Keyword "paten": 1 (tidak duplikat!)
// - Keyword "2019": 1
// - Keyword "2020": 1
// - Keyword "terbaru": 1
```

## 🚫 Stopwords Filter

Kata-kata umum yang tidak berguna difilter:
```javascript
const stopwords = [
  'dan', 'atau', 'yang', 'dari', 'untuk', 
  'dengan', 'pada', 'ini', 'itu', 'ada',
  'saya', 'mau', 'tentang'
];

// "Saya mau nanya tentang paten"
// → Keywords: ["nanya", "paten"] ✅
// → Stopwords diabaikan: ["saya", "mau", "tentang"] ❌
```

## ✅ Keuntungan

1. **Otomatis** - Set mencegah duplikat tanpa perlu cek manual
2. **Efisien** - O(1) untuk add dan has operations
3. **Clean** - Tidak perlu if statement untuk cek duplikat
4. **Scalable** - Tetap cepat meskipun ribuan keywords

## 📝 Run Tests

```bash
# Test duplicate prevention
node test-duplicate.js

# Expected output:
# ✅ Keyword "paten" appears: 1 time(s)
# ✅ Should be 1, not multiple!
```

## 🎯 Kesimpulan

**Set = No Duplicates Guaranteed!** 🔒

Tidak peduli berapa kali keyword yang sama ditambahkan, Set akan selalu menyimpan hanya 1 instance.
