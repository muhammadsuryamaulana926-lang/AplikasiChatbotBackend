const fs = require('fs');
const path = require('path');

const LEARNING_FILE = path.join(__dirname, 'query-patterns.json');

// Synonym mapping untuk normalisasi
const SYNONYMS = {
  // English → Indonesian
  'patent': 'paten',
  'patents': 'paten',
  'copyright': 'hak cipta',
  'copyrights': 'hak cipta',
  'design': 'desain',
  'designs': 'desain',
  'industrial': 'industri',
  'intellectual': 'intelektual',
  'property': 'kekayaan',
  'inventor': 'inventor',
  'inventors': 'inventor',
  'year': 'tahun',
  'years': 'tahun',
  'information': 'informasi',
  'list': 'daftar',
  'count': 'total',
  'show': 'tampilkan',
  'display': 'tampilkan',
  'search': 'cari',
  'find': 'cari',
  'latest': 'terbaru',
  'newest': 'terbaru',
  'recent': 'terbaru',
  'faculty': 'fakultas',
  'title': 'judul',
  'registration': 'pendaftaran',
  
  // Plural → Singular (Indonesian)
  'paten-paten': 'paten',
  'inventor-inventor': 'inventor',
  
  // Common variations
  'jumlah': 'total',
  'berapa': 'total',
  'how many': 'total',
  'all': 'semua',
  'semua': 'semua'
};

class QueryLearning {
  constructor() {
    this.patterns = this.loadPatterns();
  }

  loadPatterns() {
    try {
      if (fs.existsSync(LEARNING_FILE)) {
        const data = JSON.parse(fs.readFileSync(LEARNING_FILE, 'utf8'));
        // Convert array to Set to ensure uniqueness
        data.keywords = new Set(data.keywords || []);
        return data;
      }
    } catch (e) {}
    return { queries: [], keywords: new Set() };
  }

  savePatterns() {
    try {
      const data = {
        queries: this.patterns.queries,
        keywords: Array.from(this.patterns.keywords)
      };
      fs.writeFileSync(LEARNING_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error('Error saving patterns:', e.message);
    }
  }

  learn(userQuery, detectedDatabase, wasSuccessful) {
    const query = userQuery.toLowerCase().trim();
    
    // Update atau tambah query (tidak duplikat)
    const existing = this.patterns.queries.find(p => p.query === query);
    if (existing) {
      existing.count++;
      existing.lastUsed = Date.now();
      if (wasSuccessful) existing.successCount++;
    } else {
      this.patterns.queries.push({
        query,
        database: detectedDatabase,
        count: 1,
        successCount: wasSuccessful ? 1 : 0,
        firstSeen: Date.now(),
        lastUsed: Date.now()
      });
    }

    // Extract keywords dengan normalisasi
    const words = query
      .split(/\s+/)
      .filter(w => w.length > 2 && !['dan', 'atau', 'yang', 'dari', 'untuk', 'dengan', 'pada', 'ini', 'itu', 'ada', 'saya', 'mau', 'tentang'].includes(w))
      .map(w => SYNONYMS[w] || w); // Normalisasi: patent → paten
    
    words.forEach(word => this.patterns.keywords.add(word));

    // Keep only top 1000 queries
    if (this.patterns.queries.length > 1000) {
      this.patterns.queries.sort((a, b) => b.count - a.count);
      this.patterns.queries = this.patterns.queries.slice(0, 1000);
    }

    this.savePatterns();
  }

  getSimilarQueries(userQuery) {
    const query = userQuery.toLowerCase();
    return this.patterns.queries
      .filter(p => p.successCount > 0)
      .filter(p => {
        const words = query.split(/\s+/);
        return words.some(w => p.query.includes(w));
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  getAllKeywords() {
    return Array.from(this.patterns.keywords);
  }

  hasKeyword(query) {
    const qLower = query.toLowerCase();
    const words = qLower.split(/\s+/).map(w => SYNONYMS[w] || w); // Normalisasi
    return this.getAllKeywords().some(kw => words.includes(kw));
  }

  getStats() {
    return {
      totalQueries: this.patterns.queries.length,
      totalKeywords: this.patterns.keywords.size,
      topQueries: this.patterns.queries
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
    };
  }

  getSynonyms() {
    return SYNONYMS;
  }

  addSynonym(from, to) {
    SYNONYMS[from.toLowerCase()] = to.toLowerCase();
  }
}

module.exports = new QueryLearning();
