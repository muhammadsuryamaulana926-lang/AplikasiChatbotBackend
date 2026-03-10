# Synonym Normalization System

## 🔄 Masalah: "paten" vs "patent"

User bisa bertanya dalam bahasa Indonesia atau Inggris:
- "Tampilkan paten" (Indonesian)
- "Show me patent" (English)

Tanpa normalisasi, sistem akan menyimpan 2 keyword berbeda: `paten` dan `patent`

## ✅ Solusi: Synonym Mapping

Semua variasi dinormalisasi ke bentuk standar (Indonesian):

```javascript
const SYNONYMS = {
  'patent': 'paten',      // English → Indonesian
  'patents': 'paten',     // Plural → Singular
  'copyright': 'hak cipta',
  'design': 'desain',
  'inventor': 'inventor',
  'year': 'tahun',
  'show': 'tampilkan',
  'search': 'cari',
  'latest': 'terbaru',
  // ... dan banyak lagi
};
```

## 🎯 Cara Kerja

### 1. Saat Learning
```javascript
// Input: "Show me patent data"
// Split: ["show", "me", "patent", "data"]
// Normalize: ["tampilkan", "me", "paten", "data"]
// Filter stopwords: ["tampilkan", "paten", "data"]
// Save: Set(['tampilkan', 'paten', 'data'])
```

### 2. Saat Detection
```javascript
// Query: "patent 2019"
// Normalize: "paten 2019"
// Check: keywords.has('paten') → ✅ Found!
```

## 📊 Contoh Normalisasi

### Scenario 1: English & Indonesian
```javascript
queryLearning.learn('Show me patent', 'itb', true);
queryLearning.learn('Tampilkan paten', 'itb', true);

// Result keywords: ['tampilkan', 'paten']
// NOT: ['show', 'tampilkan', 'patent', 'paten'] ❌
```

### Scenario 2: Plural & Singular
```javascript
queryLearning.learn('patents list', 'itb', true);
queryLearning.learn('patent data', 'itb', true);

// Result keywords: ['paten', 'daftar', 'data']
// NOT: ['patents', 'patent', 'list', 'data'] ❌
```

### Scenario 3: Variations
```javascript
queryLearning.learn('latest patent', 'itb', true);
queryLearning.learn('newest paten', 'itb', true);
queryLearning.learn('paten terbaru', 'itb', true);

// Result keywords: ['terbaru', 'paten']
// NOT: ['latest', 'newest', 'terbaru', 'patent', 'paten'] ❌
```

## 🗺️ Synonym Mappings

### English → Indonesian
| English | Indonesian |
|---------|-----------|
| patent | paten |
| copyright | hak cipta |
| design | desain |
| industrial | industri |
| intellectual | intelektual |
| inventor | inventor |
| year | tahun |
| show/display | tampilkan |
| search/find | cari |
| latest/newest | terbaru |
| count | total |

### Plural → Singular
| Plural | Singular |
|--------|----------|
| patents | paten |
| copyrights | hak cipta |
| designs | desain |
| inventors | inventor |

### Variations → Standard
| Variation | Standard |
|-----------|----------|
| jumlah | total |
| berapa | total |
| how many | total |

## 🧪 Testing

```bash
# Test synonym normalization
node test-synonym.js

# Expected output:
# ✅ "patent" normalized to "paten"
# ✅ "copyright" normalized to "hak cipta"
# ✅ No duplicates after normalization
```

## 📡 API Endpoints

```bash
# Get all synonyms
GET /api/learning/synonyms

# Response:
{
  "success": true,
  "synonyms": {
    "patent": "paten",
    "copyright": "hak cipta",
    ...
  },
  "total": 35
}
```

## ➕ Menambah Synonym Baru

Jika ada kata baru yang perlu dinormalisasi, tambahkan di `query-learning.js`:

```javascript
const SYNONYMS = {
  // ... existing synonyms
  'new_word': 'normalized_form',
  'another_word': 'normalized_form'
};
```

Atau via code:
```javascript
queryLearning.addSynonym('new_word', 'normalized_form');
```

## ✅ Keuntungan

1. **Konsisten** - Semua variasi → 1 keyword standar
2. **Bilingual** - Support English & Indonesian
3. **Smart** - Handle plural, variations, common terms
4. **Scalable** - Mudah tambah synonym baru
5. **No Duplicates** - Set + Normalization = Perfect! 🎯

## 🎯 Kesimpulan

**"paten" = "patent" = "patents"** → Semua jadi **"paten"**! 🔄

Sistem otomatis normalisasi semua variasi ke bentuk standar, jadi tidak ada duplikat keyword!
