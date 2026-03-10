const axios = require("axios");
const mysql = require("mysql2/promise");
const path = require("path");
const dbHelper = require("./db-helper");
const natural = require("natural");
const apiKeysHelper = require("./api-keys-helper");
const contextManager = require('./core/context-manager');
const learningV2 = require('./learning-system-v2');
const aiOrchestrator = require('./core/ai-orchestrator');
const databaseRouter = require('./core/database-router');
const dbProfiler = require('./core/db-profiler');
const ragPipeline = require('./core/rag-pipeline');

// History Pool for Chat History (Ingatan Waktu)
const historyPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chatbot_db',
  waitForConnections: true,
  connectionLimit: 5
});

let schemaCache = {};
let longTermHistoryFetched = new Set();

const {
  formatDate,
  formatNumber,
  stripEmoji,
  formatSnakeCaseValue,
  formatInventorList,
  formatDbName
} = require('./utils/formatters');

function debugLog(label, content) {
  try {
    const fs = require('fs');
    fs.appendFileSync(
      path.join(__dirname, 'debug_sql_out.txt'),
      `\n[${new Date().toISOString()}] ${label}: ${typeof content === 'object' ? JSON.stringify(content) : content}`
    );
  } catch (e) { }
}

class ChatbotHandler {
  constructor() {
    this.dbConfig = dbHelper.getDbConfig();
    this.initPhase7();
  }

  async initPhase7() {
    databaseRouter.setAIHandler(this.askAI.bind(this));
    const allConfigs = dbHelper.getAllActiveConnectionConfigs();
    dbProfiler.profileDatabases(allConfigs).then(() => {
      console.log('🚀 Phase 7: AI-First Agent is ready.');
    });

    ragPipeline.init({
      askAI: this.askAI.bind(this),
      schemaCache: schemaCache,
      ensureSchemaCache: this.ensureSchemaCache.bind(this)
    });
  }

  async processMessage(question, userId = "default", progressCallback = null, host = null) {
    try {
      await this.syncHistoryFromDB(userId);
      const result = await this._processMessageCore(question, userId, progressCallback, host);

      if (result && result.type === 'answer' && typeof result.message === 'string') {
        const session = contextManager.getSession(userId);
        const lastEntry = session.getLastEntry();

        // Check if we should append recommendations (exclude closing/short thank yous)
        const qTrim = question.trim().toLowerCase();
        const closingKeywords = /\b(cukup|sudah|oke|ok|sip|siap|makasih|terimakasih|thanks|thx|terima kasih|selesai|udahan|bye|dah|sampai jumpa)\b/i;
        const isClosing = (qTrim.length < 30 && closingKeywords.test(qTrim));

        if (!isClosing && !result.message.includes('💡')) {
          const cat = await this.getDatabaseCatalog();
          const recs = await this.generateSmartRecommendations(question, cat, this.getContext(userId));

          if (recs) {
            result.message += `\n\n💡 **Rekomendasi Pertanyaan:**\n${recs}`;
          }

          const hasManyData = (result.data && result.data.length > 1);
          if (hasManyData && !this.isCountResult(result.data)) {
            result.message += `\n\n📊 **Tip:** Ketik **"buat grafik"**, **"dashboard"**, **"cetak pdf"**, atau **"download excel"** untuk mengolah data ini.`;
          }
        }
      }
      return result;
    } catch (err) {
      console.error('Chatbot Error:', err);
      return { type: "answer", message: `Maaf, terjadi kesalahan teknik. Silakan coba lagi.` };
    }
  }

  async _processMessageCore(question, userId, progressCallback, host = null) {
    let q = question.trim();
    if (!q) return { type: "answer", message: "Pertanyaan tidak boleh kosong." };

    const session = contextManager.getSession(userId);
    const context = session.conversationHistory;
    const lastEntry = session.getLastEntry();

    // ════════════════════════════════════════════════════════════════
    // STEP 1: AI-FIRST UNDERSTANDING (Phase 7 Agentic)
    // ════════════════════════════════════════════════════════════════
    if (progressCallback) progressCallback('Memahami maksud Anda...');
    const contextStr = this.buildConversationContext(context);
    const understanding = await ragPipeline.understand(q, contextStr, lastEntry);
    debugLog('AI_UNDERSTANDING', understanding);

    if (!understanding) return { type: "answer", message: "Maaf, saya gagal memahami pertanyaan Anda." };

    // 1. Handle CONVERSATION & AMBIGUOUS
    if (understanding.intent === 'CONVERSATION' || understanding.intent === 'AMBIGUOUS') {
      const msg = understanding.natural_response || "Ada yang bisa saya bantu? 😊";
      this.addToContext(userId, "user", q);
      this.addToContext(userId, "assistant", msg);
      return { type: "answer", message: msg };
    }

    // 2. Handle COMMAND (Export, Chart, Dashboard, Pagination)
    if (understanding.intent === 'COMMAND' || understanding.action) {
      const action = understanding.action || understanding.command;
      debugLog('AI_COMMAND_TRIGGERED', action);

      switch (action) {
        case 'EXPORT_PDF':
          if (lastEntry?.lastData) return await this.generatePDFResponse(lastEntry.lastData, lastEntry.lastQuestion, userId, host);
          break;
        case 'EXPORT_EXCEL':
        case 'EXPORT':
          if (lastEntry?.lastData) return await this.generateExportResponse(lastEntry.lastData, lastEntry.lastQuestion, userId, host);
          break;
        case 'GENERATE_CHART':
        case 'CHART':
          if (lastEntry?.lastData) return await this.generateChartResponse(lastEntry.lastData, lastEntry.lastQuestion, userId, host);
          break;
        case 'OPEN_DASHBOARD':
        case 'DASHBOARD':
          if (lastEntry?.lastData) return await this.generateDashboardResponse(lastEntry.lastData, lastEntry.lastQuestion, userId, host);
          break;
        case 'PAGINATE_NEXT':
          return await this.handlePagination(userId, lastEntry, progressCallback, false);
        case 'PAGINATE_RESET':
          return await this.handlePagination(userId, lastEntry, progressCallback, true);
        case 'DATABASE_LIST':
          return await this.handleDatabaseList(userId);
        case 'SELECT_NUMBER':
          return await this.handleSelectionMode(q, userId, lastEntry, progressCallback);
      }

      if (!lastEntry?.lastData && ['EXPORT_PDF', 'EXPORT', 'CHART', 'DASHBOARD'].includes(action)) {
        return { type: "answer", message: `Maaf, saya butuh data hasil pencarian sebelum bisa menjalankan perintah tersebut. Silakan cari data dulu ya!` };
      }
    }

    // 3. Handle DATABASE_QUERY
    if (understanding.intent === 'DATABASE_QUERY' || (understanding.sql && understanding.sql.length > 10)) {
      const targetDb = understanding.targetDb || lastEntry?.lastDatabase;
      if (!targetDb) return await this.handleDatabaseList(userId);

      if (progressCallback) progressCallback('Mencari data...');
      const retrieval = await ragPipeline.retrieve(understanding.sql, targetDb);

      if (retrieval.error) {
        debugLog('RETRIEVE_FAIL', retrieval.error);
      }

      if (progressCallback) progressCallback('Menyusun jawaban...');

      // Smart total for group-by results
      let displayTotal = retrieval.total;
      const isGroup = this.isGroupByResult(retrieval.data);
      if (isGroup) {
        const valCol = Object.keys(retrieval.data[0]).find(k => ['total', 'jumlah', 'count'].includes(k.toLowerCase()));
        displayTotal = retrieval.data.reduce((sum, row) => sum + (Number(row[valCol]) || 0), 0);
      }

      const naturalResponse = await ragPipeline.generate(q, retrieval.data, displayTotal, targetDb, lastEntry);

      const finalMsg = this.stripPromptLeak(naturalResponse);
      this.addToContext(userId, "user", q);
      this.addToContext(userId, "assistant", finalMsg, {
        lastDatabase: targetDb,
        lastQuestion: q,
        originalQuestion: understanding.transformed_query || q,
        lastOffset: 0,
        lastTotal: retrieval.total,
        lastSqlQuery: understanding.sql,
        lastData: retrieval.data,
        lastDataIsGroup: isGroup,
        lastGrandTotal: displayTotal
      });

      return { type: "answer", message: finalMsg, data: retrieval.data };
    }

    return { type: "answer", message: "Maaf, saya bingung. Coba tanya dengan kalimat lain ya!" };
  }

  buildConversationContext(history) {
    if (!history || !history.length) return "Percakapan baru.";
    return history.slice(-6).map(h => `${h.role === "user" ? "User" : "Asisten"}: ${h.content?.slice(0, 200)}`).join('\n');
  }

  _getBaseUrl(host) {
    if (!host) return '';
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1') ||
      host.startsWith('192.168.') || host.startsWith('10.') || host.startsWith('172.');
    return isLocal ? `http://${host}` : `https://${host}`;
  }

  async syncHistoryFromDB(userId) {
    if (!userId || userId === 'default' || longTermHistoryFetched.has(userId)) return;
    try {
      debugLog('SYNC_HISTORY', `Fetching history for ${userId}`);
      const [chats] = await historyPool.execute(`
        SELECT id FROM riwayat_chat 
        WHERE user_email = ? 
        ORDER BY diperbarui_pada DESC 
        LIMIT 5
      `, [userId]);

      if (chats.length === 0) {
        longTermHistoryFetched.add(userId);
        return;
      }

      const chatIds = chats.map(c => c.id);
      const [messages] = await historyPool.execute(`
        SELECT peran, konten, dibuat_pada 
        FROM pesan_chat 
        WHERE riwayat_chat_id IN (${chatIds.join(',')})
        ORDER BY dibuat_pada ASC
      `);

      if (messages && messages.length > 0) {
        const history = messages.map(msg => ({
          role: msg.peran, content: msg.konten, timestamp: new Date(msg.dibuat_pada).getTime()
        }));
        const session = contextManager.getSession(userId);
        session.conversationHistory = history;
      }
      longTermHistoryFetched.add(userId);
    } catch (err) { console.error('Sync Error:', err); }
  }

  async getDatabaseCatalog() {
    const profiles = dbProfiler.getProfiles();
    const cat = Object.keys(profiles).map(db => ({
      name: db, displayName: formatDbName(db), tables: profiles[db].summary.split(';').map(t => t.match(/\[(.*?)\]/)?.[1]).filter(Boolean)
    }));
    return { catalog: cat, summary: JSON.stringify(profiles) };
  }

  async ensureSchemaCache(conn, db) {
    if (schemaCache[db]) return;
    const [tabs] = await conn.execute("SHOW TABLES");
    schemaCache[db] = {};
    for (const t of tabs) {
      const tName = Object.values(t)[0];
      const [cols] = await conn.execute(`DESCRIBE ${tName}`);
      const [rows] = await conn.execute(`SELECT * FROM ${tName} LIMIT 3`);
      schemaCache[db][tName] = { columns: cols.map(c => c.Field).join(', '), sample_rows: rows };
    }
  }

  addToContext(userId, role, content, metadata = null) {
    contextManager.addToContext(userId, role, content, metadata);
  }

  getContext(userId) {
    return contextManager.getContext(userId);
  }

  getApiConfigs() {
    const saved = apiKeysHelper.getEnabledApiKeys();
    if (saved.length > 0) {
      return saved.map(k => ({
        ...k,
        key: k.apiKey,
        isGemini: k.provider === 'gemini',
        isCohere: k.provider === 'cohere',
        isHF: k.provider === 'huggingface'
      }));
    }
    return [
      {
        name: "Gemini", key: process.env.GEMINI_API_KEY,
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`,
        isGemini: true
      }
    ].filter(api => !!api.key);
  }

  async askAI(prompt, retry = 0, idx = 0, temp = 0.7) {
    const configs = this.getApiConfigs();
    if (!configs || idx >= configs.length) {
      console.error('Semua AI provider gagal');
      return null;
    }
    const api = configs[idx];

    try {
      let res;
      if (api.isGemini) {
        res = await axios.post(api.url, {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: temp }
        }, { headers: { 'Content-Type': 'application/json' }, timeout: 30000 });
        return res.data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
      } else {
        res = await axios.post(api.url, {
          model: api.model,
          messages: [{ role: "user", content: prompt }],
          temperature: temp
        }, { headers: { Authorization: `Bearer ${api.key}` }, timeout: 30000 });
        return res.data?.choices?.[0]?.message?.content || null;
      }
    } catch (e) {
      debugLog(`AI_ERROR[${api.name}]`, e.message);
      if (retry < 1) return this.askAI(prompt, retry + 1, idx, temp);
      return this.askAI(prompt, 0, idx + 1, temp);
    }
  }

  stripPromptLeak(text) {
    if (!text || typeof text !== 'string') return text || '';
    return text.replace(/^(Berikut adalah|Tentu|Silakan).*?:\s*/gi, '').trim();
  }

  isCountResult(data) {
    if (!data || data.length !== 1) return false;
    const keys = Object.keys(data[0]);
    return keys.some(k => ['total', 'jumlah', 'count'].includes(k.toLowerCase()));
  }

  isGroupByResult(data) {
    if (!data || data.length < 1) return false;
    const keys = Object.keys(data[0]);
    return keys.length === 2 && keys.some(k => ['total', 'jumlah', 'count'].includes(k.toLowerCase()));
  }

  async handleDatabaseList(userId) {
    const { catalog } = await this.getDatabaseCatalog();
    const msg = "Tentu! Saat ini saya memiliki akses ke data berikut:\n\n" +
      catalog.map(c => `- **${c.displayName}**`).join('\n') +
      "\n\nAda yang ingin Mas/Mbak cari dari daftar tersebut? Saya bisa membantu mencari detail anggota, status kehadiran, atau data kekayaan intelektual lainnya. 😊";
    return { type: "answer", message: msg };
  }

  async generateSmartRecommendations(q, cat, context) {
    try {
      const history = context?.conversationHistory || [];
      const prompt = `Berdasarkan database yang tersedia dan percakapan terakhir, berikan 3 pertanyaan singkat (maks 6 kata) yang relevan untuk ditanyakan oleh user.
      
DATA DATABASE:
${cat.summary || 'Kekayaan Intelektual, Anggota Ujicoba'}

PERCAKAPAN TERAKHIR:
User bertanya: "${q}"

INSTRUKSI:
1. Jawab HANYA list 1, 2, 3 saja. 
2. Pastikan pertanyaan nyata (bisa dijawab SQL).
3. Buat variatif (misal 1 tentang jumlah, 1 tentang filtering, 1 tentang pencarian nama).

Jawab sekarang:`;

      const aiRes = await this.askAI(prompt, 0, 0, 0.7);
      if (aiRes) return aiRes.trim();

      // Fallback tetap aman
      return "1. Apa saja jenis KI yang tersedia?\n2. Siapa inventor dari FTI?\n3. Berapa total pendaftaran tahun 2024?";
    } catch (e) {
      return "1. Apa saja hobi anggota?\n2. Kapan pendaftaran terbaru?\n3. Berapa total data?";
    }
  }

  async handlePagination(userId, lastEntry, progressCallback, isReset) {
    if (!lastEntry || !lastEntry.lastSqlQuery) return { type: "answer", message: "Maaf, tidak ada riwayat pencarian yang bisa dipagination." };

    const newOffset = isReset ? 0 : (lastEntry.lastOffset || 0) + 10;
    if (!isReset && newOffset >= lastEntry.lastTotal) return { type: "answer", message: "Anda sudah mencapai akhir data." };

    const paginatedSql = lastEntry.lastSqlQuery.replace(/LIMIT \d+ OFFSET \d+/i, '').trim() + ` LIMIT 10 OFFSET ${newOffset}`;

    if (progressCallback) progressCallback('Memuat data berikutnya...');
    const retrieval = await ragPipeline.retrieve(paginatedSql, lastEntry.lastDatabase);
    const naturalResponse = await ragPipeline.generate(lastEntry.lastQuestion, retrieval.data, retrieval.total, lastEntry.lastDatabase, lastEntry);

    const finalMsg = this.stripPromptLeak(naturalResponse);
    this.addToContext(userId, "assistant", finalMsg, {
      ...lastEntry,
      lastOffset: newOffset,
      lastData: retrieval.data
    });
    return { type: "answer", message: finalMsg, data: retrieval.data };
  }

  async handleSelectionMode(q, userId, lastEntry, progressCallback) {
    const match = q.match(/\b(\d+)\b/);
    if (!match || !lastEntry || !lastEntry.lastData) return null;

    const idx = parseInt(match[1]) - 1;
    const item = lastEntry.lastData[idx];
    if (!item) return null;

    if (progressCallback) progressCallback('Menyiapkan detail data lengkap...');

    let detailMsg = `Tentu saja, Mas/Mbak! Berikut adalah detail lengkap untuk data nomor **${match[1]}**:\n\n`;

    detailMsg += Object.entries(item)
      .filter(([k]) => !['database', 'id', 'lastDatabase', 'originalQuestion'].includes(k))
      .map(([k, v]) => {
        const fieldName = k.replace(/_/g, ' ').toUpperCase();
        return `🔹 **${fieldName}**:\n${v || '-'}`;
      })
      .join('\n\n');

    detailMsg += `\n\nAda lagi detail yang ingin Mas/Mbak tanyakan?`;

    this.addToContext(userId, "user", q);
    this.addToContext(userId, "assistant", detailMsg);
    return { type: "answer", message: detailMsg };
  }

  // ================================================================
  // EXPORT & VISUAL SERVICE HANDLERS (Migrated from V6)
  // ================================================================
  async generateChartResponse(data, originalQuestion, userId, host = null) {
    try {
      if (!data || data.length === 0) return { type: "answer", message: "Maaf, tidak ada data untuk dibuat grafik." };
      const valCol = Object.keys(data[0]).find(k => ['total', 'jumlah', 'count', 'rata', 'sum'].includes(k.toLowerCase()));
      const keyCol = Object.keys(data[0]).find(k => k !== valCol);
      if (!keyCol || !valCol) return { type: "answer", message: "Data ini tidak cocok untuk grafik otomatis (butuh angka rekap)." };

      const chartData = data.slice(0, 15);
      const labels = chartData.map(r => String(r[keyCol] || '-').substring(0, 20));
      const values = chartData.map(r => Number(r[valCol]) || 0);

      const chartConfig = {
        type: labels.length <= 5 ? 'pie' : 'bar',
        data: {
          labels: labels,
          datasets: [{ label: valCol.toUpperCase(), data: values, backgroundColor: ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899'] }]
        },
        options: { plugins: { title: { display: true, text: `Grafik: ${originalQuestion.substring(0, 50)}` } } }
      };

      const chartUrl = `https://quickchart.io/chart?v=3&c=${encodeURIComponent(JSON.stringify(chartConfig))}&w=800&h=500&bkg=white`;

      let baseUrl = this._getBaseUrl(host);
      const msg = `Tentu, berikut grafiknya: \n\n![Grafik](${chartUrl})\n\nSemoga membantu!`;

      this.addToContext(userId, "assistant", msg);
      return { type: "answer", message: msg };
    } catch (e) {
      return { type: "answer", message: "Gagal membuat grafik: " + e.message };
    }
  }

  async generateExportResponse(data, originalQuestion, userId, host = null) {
    try {
      if (!data || data.length === 0) return null;
      const XLSX = require('xlsx');
      const fs = require('fs');
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

      const cleanData = data.map(row => {
        const newRow = {};
        for (const [k, v] of Object.entries(row)) {
          newRow[k] = (v && typeof v === 'string') ? v.replace(/<br\s*\/?>/gi, ', ').replace(/<[^>]+>/g, '') : v;
        }
        return newRow;
      });

      const ws = XLSX.utils.json_to_sheet(cleanData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data KI");
      const filename = `Data_KI_${Date.now()}.xlsx`;
      const filepath = path.join(uploadDir, filename);
      XLSX.writeFile(wb, filepath);

      let baseUrl = this._getBaseUrl(host);
      const downloadPath = `${baseUrl}/api/download/${filename}`;
      const msg = `Data berhasil disiapkan! 📥\n\n🔗 **[DOWNLOAD DATA EXCEL](${downloadPath})**`;

      this.addToContext(userId, "assistant", msg);
      return { type: "answer", message: msg };
    } catch (e) {
      return { type: "answer", message: "Gagal export Excel: " + e.message };
    }
  }

  async generatePDFResponse(data, originalQuestion, userId, host = null) {
    try {
      const PDFDocument = require('pdfkit-table');
      const fs = require('fs');
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

      const filename = `Laporan_KI_${Date.now()}.pdf`;
      const filepath = path.join(uploadDir, filename);
      const doc = new PDFDocument({ margin: 30, size: 'A4' });
      doc.pipe(fs.createWriteStream(filepath));

      doc.fontSize(18).text('LAPORAN DATA KEKAYAAN INTELEKTUAL', { align: 'center' });
      doc.fontSize(10).text(`Topik: ${originalQuestion}`, { align: 'center' });
      doc.moveDown();

      const table = {
        headers: Object.keys(data[0]).slice(0, 6).map(k => k.toUpperCase()),
        rows: data.slice(0, 30).map(row => Object.values(row).slice(0, 6).map(v => String(v).substring(0, 50)))
      };
      await doc.table(table);
      doc.end();

      let baseUrl = this._getBaseUrl(host);
      const downloadPath = `${baseUrl}/api/download/${filename}`;
      return { type: "answer", message: `Laporan PDF berhasil disusun! 📄\n\n🔗 **[UNDUH LAPORAN PDF](${downloadPath})**` };
    } catch (e) {
      return { type: "answer", message: "Gagal menyusun PDF: " + e.message };
    }
  }

  async generateDashboardResponse(data, originalQuestion, userId, host = null) {
    try {
      const dashboardService = require('./services/dashboard-service');
      const dashboardId = dashboardService.saveDashboard(data, `Dashboard: ${originalQuestion}`);
      let baseUrl = this._getBaseUrl(host);
      const dashboardLink = `${baseUrl}/dashboard/index.html?id=${dashboardId}`;
      return { type: "answer", message: `Dashboard Visual Interaktif berhasil dibuat! 📊\n\n🔗 **[BUKA DASHBOARD](${dashboardLink})**` };
    } catch (e) {
      return { type: "answer", message: "Gagal membuat dashboard: " + e.message };
    }
  }
}

module.exports = ChatbotHandler;
