const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const axios = require('axios');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const corsOptions = require('./cors-config');
const authRouter = require('./auth');
const profileRouter = require('./profile');
const databaseConfigRouter = require('./database-config');
const dbHelper = require('./db-helper');
const apiKeysHelper = require('./api-keys-helper');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Initialize Middleware FIRST
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ==================== HIGH PRIORITY ADMIN ROUTES ====================
app.get('/api/api-keys', (req, res) => {
  try {
    const helper = require('./api-keys-helper');
    res.json({ success: true, apiKeys: helper.getAllApiKeys() });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.get('/api/chat-history', async (req, res) => {
  try {
    const mysql = require('mysql2/promise');
    const pool = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'chatbot_db'
    });
    const [rows] = await pool.execute('SELECT id, user_email, judul, dibuat_pada FROM pesan_chat ORDER BY dibuat_pada DESC');
    res.json(rows);
    await pool.end();
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// REMOVED - This endpoint is handled by chat-history.js
// app.get('/api/chat/history/:email', async (req, res) => {
//   try {
//     const mysql = require('mysql2/promise');
//     const pool = await mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: '',
//       database: 'chatbot_db'
//     });
//     const [rows] = await pool.execute('SELECT * FROM riwayat_chat WHERE user_email = ? ORDER BY dibuat_pada DESC', [req.params.email]);
//     res.json(rows);
//     await pool.end();
//   } catch (e) {
//     res.status(500).json({ success: false, error: e.message });
//   }
// });
// ==================== END HIGH PRIORITY ROUTES ====================

const io = new Server(server, {
  cors: corsOptions,
  pingTimeout: 180000, // 3 menit - lebih panjang untuk AI processing
  pingInterval: 10000, // Ping setiap 10 detik
  connectTimeout: 90000, // 90 detik untuk connect
  transports: ['websocket', 'polling'],
  allowUpgrades: true,
  maxHttpBufferSize: 1e8,
  perMessageDeflate: false
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  // Track jika sedang processing
  socket.isProcessing = false;

  // Heartbeat untuk keep connection alive
  const heartbeatInterval = setInterval(() => {
    if (socket.connected) {
      socket.emit('heartbeat', { timestamp: Date.now() });
    } else {
      clearInterval(heartbeatInterval);
    }
  }, 25000);

  // Handle client pong response
  socket.on('pong', () => {
    socket.lastPong = Date.now();
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Client disconnected:', socket.id, 'Reason:', reason);
    if (socket.isProcessing) {
      console.log('⚠️ Client disconnected saat processing - ini normal jika response sudah dikirim');
    }
    clearInterval(heartbeatInterval);
  });

  socket.on('error', (error) => {
    console.error('❌ Socket error:', socket.id, error.message);
  });
});

// Export io untuk digunakan di module lain
app.set('io', io);

// Serve static files untuk images
app.use('/images', express.static('images'));
app.use('/uploads', express.static('uploads'));

// Download endpoint agar mobile (WPS Office/Browser HP) mendownload file asli, bukan malah index.html front-end
app.get('/api/download/:filename', (req, res) => {
  const file = req.params.filename;
  const filePath = path.join(process.cwd(), 'uploads', file);

  if (require('fs').existsSync(filePath)) {
    const ext = path.extname(file).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.xlsx') contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    else if (ext === '.pdf') contentType = 'application/pdf';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';

    res.download(filePath, file, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${file}"`
      }
    });
  } else {
    res.status(404).send('File tidak ditemukan.');
  }
});

// Auth routes
app.use('/api/auth', authRouter);

// Profile routes
app.use('/api', profileRouter);

// Database config routes
app.use('/api', databaseConfigRouter);

// ==================== IMPORT DATABASE FROM API V2 (FLEXIBLE HEADERS) ====================

// Preview API data dengan custom headers
app.post('/api/databases/preview-api-v2', async (req, res) => {
  let { apiUrl, headers: customHeaders } = req.body;

  try {
    apiUrl = apiUrl.replace(/&amp;/g, '&');

    const headers = {
      'Accept': 'application/json',
      ...customHeaders
    };

    console.log('🔍 Fetching API:', apiUrl);
    console.log('📋 Headers:', Object.keys(headers));

    const apiResponse = await axios.get(apiUrl, {
      headers,
      timeout: 30000
    });
    const apiData = apiResponse.data;

    if (typeof apiData === 'string' && apiData.includes('<html')) {
      return res.json({
        success: false,
        error: 'API mengembalikan HTML, bukan JSON',
        hint: 'Pastikan API key valid dan headers sudah benar'
      });
    }

    let dataArray = null;
    let detectedField = null;

    if (Array.isArray(apiData)) {
      dataArray = apiData;
      detectedField = 'root';
    } else if (apiData.data && Array.isArray(apiData.data)) {
      dataArray = apiData.data;
      detectedField = 'data';
    } else if (apiData.result && Array.isArray(apiData.result)) {
      dataArray = apiData.result;
      detectedField = 'result';
    } else if (apiData.items && Array.isArray(apiData.items)) {
      dataArray = apiData.items;
      detectedField = 'items';
    } else if (typeof apiData === 'object' && apiData !== null) {
      dataArray = [apiData];
      detectedField = 'single_object';
    }

    if (!dataArray || dataArray.length === 0) {
      return res.json({
        success: false,
        error: 'Format API tidak valid atau data kosong',
        receivedData: apiData
      });
    }

    const sample = dataArray.slice(0, 5);
    const columns = Object.keys(dataArray[0]).map(key => ({
      name: key,
      type: typeof dataArray[0][key]
    }));

    res.json({
      success: true,
      detectedField,
      totalRecords: dataArray.length,
      columns,
      sample
    });

  } catch (error) {
    console.error('❌ Error previewing API:', error.message);
    res.json({
      success: false,
      error: error.response?.data?.message || error.message
    });
  }
});

// Import API data dengan custom headers
app.post('/api/databases/import-from-api-v2', async (req, res) => {
  let { apiUrl, databaseName, headers: customHeaders } = req.body;
  let connection;

  try {
    apiUrl = apiUrl.replace(/&amp;/g, '&');

    const headers = {
      'Accept': 'application/json',
      ...customHeaders
    };

    console.log('🔍 Fetching from:', apiUrl);
    const apiResponse = await axios.get(apiUrl, {
      headers,
      timeout: 30000
    });
    const apiData = apiResponse.data;

    let dataArray = null;
    if (Array.isArray(apiData)) {
      dataArray = apiData;
    } else if (apiData.data && Array.isArray(apiData.data)) {
      dataArray = apiData.data;
    } else if (apiData.result && Array.isArray(apiData.result)) {
      dataArray = apiData.result;
    } else if (apiData.items && Array.isArray(apiData.items)) {
      dataArray = apiData.items;
    } else if (typeof apiData === 'object' && apiData !== null) {
      dataArray = [apiData];
    }

    if (!dataArray || dataArray.length === 0) {
      return res.json({
        success: false,
        error: 'Format API tidak valid atau data kosong'
      });
    }

    console.log(`✅ Found ${dataArray.length} records`);

    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306,
      waitForConnections: true,
      connectionLimit: 10
    });

    connection = await pool.getConnection();
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`);
    await connection.query(`USE ${databaseName}`);

    const firstItem = dataArray[0];
    const flattenObject = (obj, prefix = '') => {
      const flattened = {};
      for (const key in obj) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}_${key}` : key;
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          Object.assign(flattened, flattenObject(value, newKey));
        } else if (Array.isArray(value)) {
          flattened[newKey] = JSON.stringify(value);
        } else {
          flattened[newKey] = value;
        }
      }
      return flattened;
    };

    const flatFirstItem = flattenObject(firstItem);
    const sanitizeColumnName = (name) => name.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();

    const columnDefs = [];
    const seenColumns = new Set(['id']);
    const columnMaxLengths = {};

    for (const item of dataArray) {
      const flatItem = flattenObject(item);
      for (const key in flatItem) {
        const value = flatItem[key];
        if (typeof value === 'string') {
          columnMaxLengths[key] = Math.max(columnMaxLengths[key] || 0, value.length);
        }
      }
    }

    for (const key of Object.keys(flatFirstItem)) {
      const sanitizedKey = sanitizeColumnName(key);
      if (seenColumns.has(sanitizedKey)) continue;

      const value = flatFirstItem[key];
      let type = 'TEXT';

      if (typeof value === 'number') {
        type = Number.isInteger(value) ? 'INT' : 'DECIMAL(10,2)';
      } else if (typeof value === 'string') {
        const maxLen = columnMaxLengths[key] || value.length;
        if (maxLen > 1000) {
          type = 'LONGTEXT';
        } else if (maxLen > 255) {
          type = 'TEXT';
        } else {
          type = 'VARCHAR(255)';
        }
      }

      columnDefs.push({ original: key, sanitized: sanitizedKey, type });
      seenColumns.add(sanitizedKey);
    }

    const columns = columnDefs.map(col => `\`${col.sanitized}\` ${col.type}`).join(', ');
    const tableName = 'data_import';

    await connection.query(`DROP TABLE IF EXISTS \`${tableName}\``);
    await connection.query(`CREATE TABLE \`${tableName}\` (id INT AUTO_INCREMENT PRIMARY KEY, ${columns})`);

    let insertedCount = 0;
    const columnNames = columnDefs.map(c => c.sanitized);
    const originalNames = columnDefs.map(c => c.original);
    const placeholders = columnNames.map(() => '?').join(', ');

    for (const item of dataArray) {
      const flatItem = flattenObject(item);
      const values = originalNames.map(col => flatItem[col] || null);
      await connection.execute(
        `INSERT INTO ${tableName} (${columnNames.map(c => `\`${c}\``).join(', ')}) VALUES (${placeholders})`,
        values
      );
      insertedCount++;
    }

    const dbConfigData = {
      name: databaseName,
      host: 'localhost',
      port: '3306',
      database: databaseName,
      username: 'root',
      password: ''
    };

    dbHelper.addDatabase(dbConfigData);

    // Save API database metadata
    const fs = require('fs');
    const apiDbFile = path.join(__dirname, 'api-databases.json');
    let apiDatabases = [];
    if (fs.existsSync(apiDbFile)) {
      apiDatabases = JSON.parse(fs.readFileSync(apiDbFile, 'utf8'));
    }

    apiDatabases.push({
      name: databaseName,
      apiUrl: apiUrl,
      records: insertedCount,
      importedAt: new Date().toLocaleString('id-ID'),
      createdAt: new Date().toISOString()
    });

    fs.writeFileSync(apiDbFile, JSON.stringify(apiDatabases, null, 2));

    res.json({
      success: true,
      message: `Database berhasil dibuat dan ${insertedCount} data diimport`,
      database: databaseName,
      table: tableName,
      imported: insertedCount,
      columns: columnNames
    });

  } catch (error) {
    console.error('❌ Error importing:', error.message);
    res.json({
      success: false,
      error: error.message
    });
  } finally {
    if (connection) connection.release();
  }
});

// Get API imported databases
app.get('/api/databases/api-imports', (req, res) => {
  try {
    const fs = require('fs');
    const apiDbFile = path.join(__dirname, 'api-databases.json');

    if (fs.existsSync(apiDbFile)) {
      const apiDatabases = JSON.parse(fs.readFileSync(apiDbFile, 'utf8'));
      res.json({ success: true, databases: apiDatabases });
    } else {
      res.json({ success: true, databases: [] });
    }
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Save API import metadata
app.post('/api/databases/save-api-import', (req, res) => {
  try {
    const { name, apiUrl, apiKey, records, importedAt } = req.body;
    const fs = require('fs');
    const apiDbFile = path.join(__dirname, 'api-databases.json');

    let apiDatabases = [];
    if (fs.existsSync(apiDbFile)) {
      apiDatabases = JSON.parse(fs.readFileSync(apiDbFile, 'utf8'));
    }

    // Check if already exists
    const existingIndex = apiDatabases.findIndex(db => db.name === name);
    if (existingIndex >= 0) {
      // Update existing
      apiDatabases[existingIndex] = {
        name,
        apiUrl,
        apiKey: apiKey || apiDatabases[existingIndex].apiKey,
        records,
        importedAt,
        createdAt: apiDatabases[existingIndex].createdAt
      };
    } else {
      // Add new
      apiDatabases.push({ name, apiUrl, apiKey, records, importedAt, createdAt: new Date().toISOString() });
    }

    fs.writeFileSync(apiDbFile, JSON.stringify(apiDatabases, null, 2));
    res.json({ success: true, message: 'Metadata saved' });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Update API import metadata
app.put('/api/databases/update-api-import', (req, res) => {
  try {
    const { name, apiUrl, apiKey } = req.body;
    const fs = require('fs');
    const apiDbFile = path.join(__dirname, 'api-databases.json');

    if (!fs.existsSync(apiDbFile)) {
      return res.json({ success: false, error: 'File tidak ditemukan' });
    }

    let apiDatabases = JSON.parse(fs.readFileSync(apiDbFile, 'utf8'));
    const existingIndex = apiDatabases.findIndex(db => db.name === name);

    if (existingIndex < 0) {
      return res.json({ success: false, error: 'Database tidak ditemukan' });
    }

    // Update data
    apiDatabases[existingIndex] = {
      ...apiDatabases[existingIndex],
      apiUrl: apiUrl || apiDatabases[existingIndex].apiUrl,
      apiKey: apiKey || apiDatabases[existingIndex].apiKey,
      updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(apiDbFile, JSON.stringify(apiDatabases, null, 2));
    res.json({ success: true, message: 'Database berhasil diupdate' });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// ==================== END IMPORT DATABASE FROM API V2 ====================

// ==================== IMPORT DATABASE FROM API ====================

// Preview API data sebelum import
app.post('/api/databases/preview-api', async (req, res) => {
  let { apiUrl, apiKey, cookie } = req.body;

  try {
    // Fix HTML entities in URL
    apiUrl = apiUrl.replace(/&amp;/g, '&');

    const headers = {
      'Accept': 'application/json',
      'X-Request-Source': 'postman'
    };

    if (apiKey) {
      headers['Authorization'] = apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`;
    }

    if (cookie) {
      headers['Cookie'] = cookie;
    }

    console.log('🔍 Fetching API:', apiUrl);
    const apiResponse = await axios.get(apiUrl, {
      headers,
      timeout: 30000 // 30 detik timeout
    });
    const apiData = apiResponse.data;

    // Check if response is HTML instead of JSON
    if (typeof apiData === 'string' && apiData.includes('<html')) {
      return res.json({
        success: false,
        error: 'API mengembalikan HTML, bukan JSON. Kemungkinan butuh autentikasi.',
        hint: 'Pastikan API key valid dan memiliki akses ke endpoint ini'
      });
    }

    console.log('📦 API Response:', JSON.stringify(apiData).substring(0, 200));

    // Auto-detect array data
    let dataArray = null;
    let detectedField = null;

    if (Array.isArray(apiData)) {
      dataArray = apiData;
      detectedField = 'root';
    } else if (apiData.members && Array.isArray(apiData.members)) {
      dataArray = apiData.members;
      detectedField = 'members';
    } else if (apiData.result && Array.isArray(apiData.result)) {
      dataArray = apiData.result;
      detectedField = 'result';
    } else if (apiData.data && Array.isArray(apiData.data)) {
      dataArray = apiData.data;
      detectedField = 'data';
    } else if (apiData.items && Array.isArray(apiData.items)) {
      dataArray = apiData.items;
      detectedField = 'items';
    } else if (typeof apiData === 'object' && apiData !== null) {
      // Single object, wrap in array
      dataArray = [apiData];
      detectedField = 'single_object';
    }

    if (!dataArray || dataArray.length === 0) {
      return res.json({
        success: false,
        error: 'Format API tidak valid atau data kosong',
        receivedData: apiData,
        hint: 'API harus mengembalikan array atau object dengan field: members/result/data/items'
      });
    }

    // Ambil sample data dan struktur
    const sample = dataArray.slice(0, 5);
    const columns = Object.keys(dataArray[0]).map(key => ({
      name: key,
      type: typeof dataArray[0][key],
      sample: dataArray[0][key]
    }));

    res.json({
      success: true,
      detectedField,
      totalRecords: dataArray.length,
      columns,
      sample
    });

  } catch (error) {
    console.error('❌ Error previewing API:', error.message);

    let userFriendlyError = error.message;
    let hint = '';

    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        userFriendlyError = 'API Key tidak valid atau sudah expired';
        hint = 'Periksa API key Anda atau daftar ulang';
      } else if (status === 404) {
        userFriendlyError = 'Endpoint API tidak ditemukan';
        hint = 'Periksa URL API Anda';
      } else if (status === 429) {
        userFriendlyError = 'Terlalu banyak request';
        hint = 'Tunggu beberapa saat';
      }
    }

    res.json({
      success: false,
      error: userFriendlyError,
      hint: hint
    });
  }
});

app.post('/api/databases/import-from-api', async (req, res) => {
  let { apiUrl, apiKey, databaseName, cookie } = req.body;
  let connection;

  try {
    // Fix HTML entities in URL
    apiUrl = apiUrl.replace(/&amp;/g, '&');

    // 1. Fetch data dari API
    const headers = {
      'Accept': 'application/json',
      'X-Request-Source': 'postman'
    };

    if (apiKey) {
      headers['Authorization'] = apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`;
    }

    if (cookie) {
      headers['Cookie'] = cookie;
    }

    console.log('🔍 Fetching from:', apiUrl);
    const apiResponse = await axios.get(apiUrl, {
      headers,
      timeout: 30000
    });
    const apiData = apiResponse.data;

    console.log('📦 Received data, checking format...');

    // 2. Auto-detect array data (fleksibel untuk berbagai format)
    let dataArray = null;
    if (Array.isArray(apiData)) {
      dataArray = apiData;
    } else if (apiData.members && Array.isArray(apiData.members)) {
      dataArray = apiData.members;
    } else if (apiData.result && Array.isArray(apiData.result)) {
      dataArray = apiData.result;
    } else if (apiData.data && Array.isArray(apiData.data)) {
      dataArray = apiData.data;
    } else if (apiData.items && Array.isArray(apiData.items)) {
      dataArray = apiData.items;
    } else if (typeof apiData === 'object' && apiData !== null) {
      // Jika single object, wrap dalam array
      console.log('📦 Single object detected, wrapping in array');
      dataArray = [apiData];
    }

    if (!dataArray || dataArray.length === 0) {
      return res.json({
        success: false,
        error: 'Format API tidak valid atau data kosong',
        receivedData: apiData,
        hint: 'API harus mengembalikan array atau object dengan field: members/result/data/items'
      });
    }

    console.log(`✅ Found ${dataArray.length} records`);

    // 3. Koneksi ke MySQL - gunakan pool untuk DDL operations
    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306,
      waitForConnections: true,
      connectionLimit: 10
    });

    connection = await pool.getConnection();

    // 4. Buat database baru - gunakan query() bukan execute()
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`);
    await connection.query(`USE ${databaseName}`);

    console.log(`📦 Database ${databaseName} created and selected`);

    // 5. Deteksi struktur data otomatis dan flatten nested objects
    const firstItem = dataArray[0];

    // Flatten nested objects
    const flattenObject = (obj, prefix = '') => {
      const flattened = {};
      for (const key in obj) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}_${key}` : key;

        if (value && typeof value === 'object' && !Array.isArray(value)) {
          Object.assign(flattened, flattenObject(value, newKey));
        } else if (Array.isArray(value)) {
          flattened[newKey] = JSON.stringify(value);
        } else {
          flattened[newKey] = value;
        }
      }
      return flattened;
    };

    const flatFirstItem = flattenObject(firstItem);

    // Sanitize column names (remove special chars, handle reserved keywords)
    const sanitizeColumnName = (name) => {
      return name.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
    };

    // Filter dan map columns, skip yang sanitized jadi 'id'
    const columnDefs = [];
    const seenColumns = new Set(['id']); // Reserve 'id' untuk AUTO_INCREMENT

    // Scan semua data untuk deteksi tipe yang tepat
    const columnMaxLengths = {};
    const columnTypes = {};

    for (const item of dataArray) {
      const flatItem = flattenObject(item);
      for (const key in flatItem) {
        const value = flatItem[key];
        if (typeof value === 'string') {
          columnMaxLengths[key] = Math.max(columnMaxLengths[key] || 0, value.length);
        }
        if (!columnTypes[key]) {
          columnTypes[key] = typeof value;
        }
      }
    }

    for (const key of Object.keys(flatFirstItem)) {
      const sanitizedKey = sanitizeColumnName(key);

      // Skip jika sudah ada atau 'id'
      if (seenColumns.has(sanitizedKey)) {
        console.log(`⚠️ Skipping duplicate column: ${key} -> ${sanitizedKey}`);
        continue;
      }

      const value = flatFirstItem[key];
      let type = 'TEXT';

      if (typeof value === 'number') {
        type = Number.isInteger(value) ? 'INT' : 'DECIMAL(10,2)';
      } else if (typeof value === 'string') {
        const maxLen = columnMaxLengths[key] || value.length;
        // Gunakan panjang maksimal dari semua data
        if (maxLen > 1000) {
          type = 'LONGTEXT';
        } else if (maxLen > 255) {
          type = 'TEXT';
        } else {
          type = 'VARCHAR(255)';
        }
      } else if (value === null || value === undefined) {
        type = 'TEXT';
      }

      columnDefs.push({ original: key, sanitized: sanitizedKey, type });
      seenColumns.add(sanitizedKey);
    }

    const columns = columnDefs.map(col => `\`${col.sanitized}\` ${col.type}`).join(', ');

    // 6. Buat tabel dinamis - simplified version
    // 6. Buat tabel dinamis — Gunakan nama database agar AI lebih mudah mengenali konteksnya
    const tableName = databaseName.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();

    console.log('🔧 Creating table...');
    console.log('SQL:', `CREATE TABLE IF NOT EXISTS ${tableName} (id INT AUTO_INCREMENT PRIMARY KEY, ${columns.substring(0, 100)}...)`);

    try {
      // Drop table if exists
      await connection.query(`DROP TABLE IF EXISTS \`${tableName}\``);
      console.log('✅ Old table dropped');

      // Create new table
      await connection.query(`CREATE TABLE \`${tableName}\` (id INT AUTO_INCREMENT PRIMARY KEY, ${columns})`);
      console.log('✅ New table created');
    } catch (createError) {
      console.error('❌ Create table error:', createError.message);
      throw createError;
    }

    console.log(`📋 Table ${tableName} created with ${columnDefs.length} columns`);
    console.log('Column types:', columnDefs.slice(0, 5).map(c => `${c.sanitized}:${c.type}`));

    // 7. Insert data dari API dengan flatten
    let insertedCount = 0;
    const columnNames = columnDefs.map(c => c.sanitized);
    const originalNames = columnDefs.map(c => c.original);
    const placeholders = columnNames.map(() => '?').join(', ');

    for (const item of dataArray) {
      const flatItem = flattenObject(item);
      const values = originalNames.map(col => flatItem[col] || null);
      await connection.execute(
        `INSERT INTO ${tableName} (${columnNames.map(c => `\`${c}\``).join(', ')}) VALUES (${placeholders})`,
        values
      );
      insertedCount++;
    }

    console.log(`✅ Inserted ${insertedCount} records`);

    // 8. Simpan konfigurasi database
    const dbConfigData = {
      name: databaseName,
      host: 'localhost',
      port: '3306',
      database: databaseName,
      username: 'root',
      password: ''
    };

    dbHelper.addDatabase(dbConfigData);

    res.json({
      success: true,
      message: `Database berhasil dibuat dan ${insertedCount} data diimport`,
      database: databaseName,
      table: tableName,
      imported: insertedCount,
      columns: columnNames
    });

  } catch (error) {
    console.error('❌ Error importing from API:', error.message);

    let userFriendlyError = error.message;
    let hint = '';

    // Detect common API errors
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        userFriendlyError = 'API Key tidak valid atau sudah expired';
        hint = 'Silakan periksa API key Anda atau daftar ulang untuk mendapatkan key baru';
      } else if (status === 403) {
        userFriendlyError = 'Akses ditolak - API key tidak memiliki izin';
        hint = 'Periksa subscription atau upgrade plan API Anda';
      } else if (status === 404) {
        userFriendlyError = 'Endpoint API tidak ditemukan';
        hint = 'Periksa URL API Anda. Pastikan endpoint dan parameter sudah benar';
      } else if (status === 429) {
        userFriendlyError = 'Terlalu banyak request - Rate limit exceeded';
        hint = 'Tunggu beberapa saat atau upgrade plan API Anda';
      } else if (status >= 500) {
        userFriendlyError = 'Server API sedang bermasalah';
        hint = 'Coba lagi nanti atau hubungi penyedia API';
      }
    } else if (error.code === 'ENOTFOUND') {
      userFriendlyError = 'URL API tidak dapat diakses';
      hint = 'Periksa koneksi internet atau URL API Anda';
    } else if (error.code === 'ETIMEDOUT') {
      userFriendlyError = 'Request timeout - API terlalu lama merespon';
      hint = 'Coba lagi atau gunakan API yang lebih cepat';
    }

    res.json({
      success: false,
      error: userFriendlyError,
      hint: hint,
      technicalDetails: error.response?.status ? `HTTP ${error.response.status}` : error.code
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// ==================== END IMPORT DATABASE FROM API ====================

// ==================== API KEYS MANAGEMENT ====================

// Sync API keys from .env to JSON file
app.post('/api/api-keys/sync-from-env', (req, res) => {
  try {
    const apiKeysFromEnv = [
      {
        name: 'Groq Primary',
        provider: 'groq',
        apiKey: process.env.GROQ_API_KEY || '',
        model: 'llama-3.3-70b-versatile',
        url: 'https://api.groq.com/openai/v1/chat/completions',
        enabled: !!process.env.GROQ_API_KEY
      },
      {
        name: 'Gemini Backup',
        provider: 'gemini',
        apiKey: process.env.GEMINI_API_KEY || '',
        model: 'gemini-1.5-flash',
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        enabled: !!process.env.GEMINI_API_KEY
      },
      {
        name: 'Mistral Backup',
        provider: 'mistral',
        apiKey: process.env.MISTRAL_API_KEY || '',
        model: 'mistral-small-latest',
        url: 'https://api.mistral.ai/v1/chat/completions',
        enabled: !!process.env.MISTRAL_API_KEY
      },
      {
        name: 'Cohere Backup',
        provider: 'cohere',
        apiKey: process.env.COHERE_API_KEY || '',
        model: 'command',
        url: 'https://api.cohere.ai/v1/chat',
        enabled: !!process.env.COHERE_API_KEY
      },
      {
        name: 'HuggingFace Backup',
        provider: 'huggingface',
        apiKey: process.env.HUGGINGFACE_API_KEY || '',
        model: 'meta-llama/Meta-Llama-3-8B-Instruct',
        url: 'https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct',
        enabled: !!process.env.HUGGINGFACE_API_KEY
      },
      {
        name: 'OpenRouter Backup',
        provider: 'openrouter',
        apiKey: process.env.OPENROUTER_API_KEY || '',
        model: 'google/gemini-2.0-flash-exp:free',
        url: 'https://openrouter.ai/api/v1/chat/completions',
        enabled: !!process.env.OPENROUTER_API_KEY
      }
    ];

    // Get existing API keys
    const existingKeys = apiKeysHelper.getAllApiKeys();
    let syncedCount = 0;

    // Add only if not exists
    for (const apiKey of apiKeysFromEnv) {
      if (apiKey.apiKey && !existingKeys.find(k => k.name === apiKey.name)) {
        apiKeysHelper.addApiKey(apiKey);
        syncedCount++;
      }
    }

    res.json({
      success: true,
      message: `${syncedCount} API keys synced from .env`,
      synced: syncedCount
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Get all API keys
app.get('/api/api-keys', (req, res) => {
  try {
    if (!apiKeysHelper) throw new Error('apiKeysHelper is not initialized');
    const apiKeys = apiKeysHelper.getAllApiKeys();
    res.json({ success: true, apiKeys: apiKeys || [] });
  } catch (error) {
    console.error('❌ Error fetching API keys:', error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error: ' + error.message });
  }
});

// Add new API key
app.post('/api/api-keys', (req, res) => {
  try {
    const result = apiKeysHelper.addApiKey(req.body);
    res.json(result);
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Update API key
app.put('/api/api-keys/:name', (req, res) => {
  try {
    const result = apiKeysHelper.updateApiKey(req.params.name, req.body);
    res.json(result);
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Delete API key
app.delete('/api/api-keys/:name', (req, res) => {
  try {
    const result = apiKeysHelper.deleteApiKey(req.params.name);
    res.json(result);
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Toggle API key enabled status
app.patch('/api/api-keys/:name/toggle', (req, res) => {
  try {
    const { enabled } = req.body;
    const result = apiKeysHelper.updateApiKey(req.params.name, { enabled });
    res.json(result);
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// ==================== END API KEYS MANAGEMENT ====================

// ==================== LEARNING SYSTEM V2 STATS ====================
const learningSystem = require('./learning-system-v2');
const queryLearning = require('./query-learning');

// Get query learning statistics
app.get('/api/learning/query-stats', (req, res) => {
  try {
    const stats = queryLearning.getStats();
    res.json({ success: true, stats });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Get all learned keywords
app.get('/api/learning/keywords', (req, res) => {
  try {
    const keywords = queryLearning.getAllKeywords();
    res.json({ success: true, keywords, total: keywords.length });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Get synonym mappings
app.get('/api/learning/synonyms', (req, res) => {
  try {
    const synonyms = queryLearning.getSynonyms();
    res.json({ success: true, synonyms, total: Object.keys(synonyms).length });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Get learning statistics for user
app.get('/api/learning/stats/:userId', (req, res) => {
  try {
    const stats = learningSystem.getUserStats(req.params.userId);
    res.json({ success: true, stats });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Submit feedback for query
app.post('/api/learning/feedback', (req, res) => {
  try {
    const { userId, query, database, rating, comment } = req.body;
    learningSystem.learnFromFeedback(userId, query, database, rating, comment);
    res.json({ success: true, message: 'Feedback recorded' });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Get preferred database for query
app.post('/api/learning/preferred-database', (req, res) => {
  try {
    const { userId, query } = req.body;
    const preferred = learningSystem.getPreferredDatabase(userId, query);
    res.json({ success: true, preferred });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Get shortcut for query
app.post('/api/learning/shortcut', (req, res) => {
  try {
    const { userId, query } = req.body;
    const shortcut = learningSystem.getShortcut(userId, query);
    res.json({ success: true, shortcut });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Get context suggestion
app.post('/api/learning/context-suggestion', (req, res) => {
  try {
    const { userId, currentQuery, previousQuery } = req.body;
    const suggestion = learningSystem.getContextSuggestion(userId, currentQuery, previousQuery);
    res.json({ success: true, suggestion });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Detect multi-intent
app.post('/api/learning/multi-intent', (req, res) => {
  try {
    const { userId, query } = req.body;
    const multiIntent = learningSystem.detectMultiIntent(userId, query);
    res.json({ success: true, multiIntent });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Validate learning data
app.post('/api/learning/validate/:userId', (req, res) => {
  try {
    const validation = learningSystem.validateLearning(req.params.userId);
    res.json({ success: true, validation });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// ==================== KEKAYAAN INTELEKTUAL API ====================
const kiHelper = require('./ki-helper');

// Get all kekayaan intelektual
app.get('/api/kekayaan-intelektual', (req, res) => {
  try {
    const filters = {
      tahun_pendaftaran: req.query.tahun_pendaftaran,
      jenis_ki: req.query.jenis_ki,
      inventor: req.query.inventor,
      fakultas_inventor: req.query.fakultas_inventor
    };

    const data = kiHelper.queryKekayaanIntelektual(filters);

    res.json({
      status: 'success',
      message: 'Permintaan berhasil diproses',
      data: data,
      meta: {
        jumlah: data.length
      }
    });
  } catch (error) {
    res.json({
      status: 'error',
      message: error.message
    });
  }
});

// Get statistics kekayaan intelektual
app.get('/api/kekayaan-intelektual/stats', (req, res) => {
  try {
    const stats = kiHelper.getKIStatistics();
    res.json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    res.json({
      status: 'error',
      message: error.message
    });
  }
});

// Registration of routers with specific prefixes first to avoid conflicts
// Chat history routes (More specific prefix or registered first)
try {
  const chatHistoryRouter = require('./chat-history');
  app.use('/api', chatHistoryRouter); // /api/chat-history, etc.
  console.log('✅ Chat history routes loaded');
} catch (error) {
  console.error('❌ Failed to load chat history routes:', error.message);
}

// History dropdown routes
try {
  const historyDropdownRouter = require('./history-dropdown');
  app.use('/api/history', historyDropdownRouter); // Changed from /api/chat to /api/history to avoid overlap
  console.log('✅ History dropdown routes loaded');
} catch (error) {
  console.error('❌ Failed to load history dropdown routes:', error.message);
}

// Chatbot routes
try {
  const chatbotRouter = require('./chatbot-routes');
  app.use('/api', chatbotRouter);
  console.log('Chatbot routes loaded successfully');
} catch (error) {
  console.error('Failed to load chatbot routes:', error.message);
}

// Voice to text routes
try {
  const voiceToTextRouter = require('./voice-to-text');
  app.use('/api', voiceToTextRouter);
  console.log('Voice-to-text routes loaded successfully');
} catch (error) {
  console.error('Failed to load voice-to-text routes:', error.message);
}

// Load active database config using helper
const activeDatabase = dbHelper.getActiveDatabase();
const dbConfig = dbHelper.getDbConfig();

console.log('📊 Active database:', activeDatabase);
console.log('🔌 Database config:', { ...dbConfig, password: '***' });

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.ping();
    await connection.end();

    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message
    });
  }
});

// ==================== USER MANAGEMENT (ADMIN) ====================

// Inisialisasi ChatbotHandler
const ChatbotHandler = require('./chatbot-logic');
const chatbotHandler = new ChatbotHandler();

// Get all users endpoint
app.get('/api/users', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'chatbot_db',
      port: 3306
    });

    const [users] = await connection.execute(
      'SELECT id, email, nama, telepon, status, dibuat_pada FROM users ORDER BY dibuat_pada DESC'
    );

    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.json({ success: false, error: 'Gagal mengambil data pengguna' });
  } finally {
    if (connection) await connection.end();
  }
});

// Add user endpoint
app.post('/api/users', async (req, res) => {
  const { nama, email, phone } = req.body;
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'chatbot_db',
      port: 3306
    });

    const [result] = await connection.execute(
      'INSERT INTO users (nama, email, telepon, status) VALUES (?, ?, ?, ?)',
      [nama, email, phone, 'active']
    );

    const [newUser] = await connection.execute(
      'SELECT id, email, nama, telepon, status, dibuat_pada FROM users WHERE id = ?',
      [result.insertId]
    );

    // Emit ke semua client
    io.emit('user_added', newUser[0]);

    res.json({ success: true, message: 'Pengguna berhasil ditambahkan' });
  } catch (error) {
    console.error('Error adding user:', error);
    res.json({ success: false, error: 'Gagal menambahkan pengguna' });
  } finally {
    if (connection) await connection.end();
  }
});

// Update user endpoint
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { nama, email, phone, status } = req.body;
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'chatbot_db',
      port: 3306
    });

    await connection.execute(
      'UPDATE users SET nama = ?, email = ?, telepon = ?, status = ? WHERE id = ?',
      [nama, email, phone, status, id]
    );

    const [updatedUser] = await connection.execute(
      'SELECT id, email, nama, telepon, status, dibuat_pada FROM users WHERE id = ?',
      [id]
    );

    // Emit ke semua client
    io.emit('user_updated', updatedUser[0]);

    res.json({ success: true, message: 'Pengguna berhasil diupdate' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.json({ success: false, error: 'Gagal mengupdate pengguna' });
  } finally {
    if (connection) await connection.end();
  }
});

// Delete user endpoint
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'chatbot_db',
      port: 3306
    });

    await connection.execute('DELETE FROM users WHERE id = ?', [id]);

    // Emit ke semua client
    io.emit('user_deleted', parseInt(id));

    res.json({ success: true, message: 'Pengguna berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.json({ success: false, error: 'Gagal menghapus pengguna' });
  } finally {
    if (connection) await connection.end();
  }
});

// Toggle user status endpoint
app.patch('/api/users/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'chatbot_db',
      port: 3306
    });

    await connection.execute(
      'UPDATE users SET status = ? WHERE id = ?',
      [status, id]
    );

    // Emit ke semua client
    io.emit('user_status_changed', { userId: parseInt(id), status });

    res.json({ success: true, message: 'Status berhasil diupdate' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.json({ success: false, error: 'Gagal mengupdate status' });
  } finally {
    if (connection) await connection.end();
  }
});

app.post('/api/query', async (req, res) => {
  const { question, userId, userEmail } = req.body;

  if (!question || question.trim() === '') {
    return res.json({
      success: false,
      error: 'Pertanyaan tidak boleh kosong'
    });
  }

  console.log('📩 Pertanyaan diterima:', question);
  console.log('👤 User ID:', userId || 'default');
  console.log('📧 User Email:', userEmail || 'tidak ada');

  // Set timeout yang lebih panjang untuk response
  req.setTimeout(120000); // 120 detik
  res.setTimeout(120000);

  try {
    // Emit progress ke client via Socket.IO
    const io = req.app.get('io');
    const socketId = req.body.socketId;

    // Progress callback function dengan keepalive
    const progressCallback = (message) => {
      if (socketId && io) {
        const targetSocket = io.sockets.sockets.get(socketId);
        if (targetSocket && targetSocket.connected) {
          try {
            targetSocket.emit('processing', {
              status: 'processing',
              message: message,
              timestamp: Date.now()
            });
          } catch (err) {
            console.log('⚠️ Error emit processing:', err.message);
          }
        }
      }
    };

    if (socketId && io) {
      const targetSocket = io.sockets.sockets.get(socketId);
      if (targetSocket && targetSocket.connected) {
        targetSocket.isProcessing = true; // Set flag processing
        try {
          targetSocket.emit('processing', {
            status: 'processing',
            message: 'Memulai pemrosesan...'
          });
        } catch (err) {
          console.log('⚠️ Socket error saat emit:', err.message);
        }
      }
    }

    // Gunakan userId untuk context conversation dengan progress callback
    const result = await chatbotHandler.processMessage(
      question,
      userId || userEmail || 'default',
      progressCallback
    );

    // Emit completion (jika socket masih terhubung)
    if (socketId && io) {
      const targetSocket = io.sockets.sockets.get(socketId);
      if (targetSocket && targetSocket.connected) {
        targetSocket.isProcessing = false; // Clear flag
        try {
          targetSocket.emit('completed', {
            status: 'completed',
            result: result
          });
        } catch (err) {
          console.log('⚠️ Socket error saat emit completed:', err.message);
        }
      }
    }

    // Kirim response hanya jika belum dikirim
    if (!res.headersSent) {
      res.json({
        success: true,
        result: result,
        source: 'chatbot-logic'
      });
    }

  } catch (error) {
    console.error('❌ Server Error:', error);

    // Emit error (jika socket masih terhubung)
    const io = req.app.get('io');
    const socketId = req.body.socketId;
    if (socketId && io) {
      const targetSocket = io.sockets.sockets.get(socketId);
      if (targetSocket && targetSocket.connected) {
        try {
          targetSocket.emit('error', {
            status: 'error',
            error: error.message
          });
        } catch (err) {
          console.log('⚠️ Socket error saat emit error:', err.message);
        }
      }
    }

    // Kirim response hanya jika belum dikirim
    if (!res.headersSent) {
      res.json({
        success: false,
        error: 'Terjadi kesalahan pada server',
        details: error.message
      });
    }
  }
});

// Chat history endpoints sudah dihandle oleh chat-history.js dan history-dropdown.js

app.get('/api/health', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.ping();
    await connection.end();

    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message
    });
  }
});

// ==================== SERVER START ====================

const PORT = process.env.PORT || 3000;

// Handle port already in use
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} sudah digunakan!`);
    console.log('\n💡 Solusi:');
    console.log('   1. Matikan proses lain: taskkill /F /IM node.exe');
    console.log('   2. Atau cari PID: netstat -ano | findstr :' + PORT);
    console.log('   3. Lalu matikan: taskkill /PID <PID> /F\n');
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

server.listen(PORT, '0.0.0.0', async () => {
  console.log(`\n🚀 Server berjalan di:`);
  console.log(`   - Local: http://localhost:${PORT}`);
  console.log(`   - Network: http://0.0.0.0:${PORT}`);
  console.log(`   - DevTunnel: https://jstlmtmc-3000.asse.devtunnels.ms`);
  console.log('\n📧 Email OTP: chatbotaiasistent@gmail.com');
  console.log('✅ OTP System: Active');
  console.log('✅ Chatbot System: Active');
  console.log('✅ WebSocket: Active');
  console.log('✅ Voice-to-Text: Active (Deepgram)\n');
});

// === GRACEFUL SHUTDOWN ===
// Berfungsi agar port 3000 langsung dilepas saat process di-stop
const shutdown = () => {
  console.log('\n🛑 Menutup server secara aman...');

  // 1. Matikan WebSocket
  if (io) {
    io.close();
    console.log('✅ WebSocket ditutup.');
  }

  // 2. Matikan Server HTTP
  server.close(() => {
    console.log('✅ Server HTTP ditutup.');
    process.exit(0);
  });

  // 3. Paksa keluar dalam 500ms jika masih nyangkut
  setTimeout(() => {
    console.log('⚠️ Shutdown lambat, memaksa keluar...');
    process.exit(1);
  }, 500);
};

process.on('SIGINT', shutdown);  // Ctrl+C
process.on('SIGTERM', shutdown); // kill command
process.on('SIGHUP', shutdown);  // Terminal ditutup