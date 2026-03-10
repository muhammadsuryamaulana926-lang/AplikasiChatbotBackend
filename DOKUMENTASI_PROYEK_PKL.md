# DOKUMENTASI PROYEK PKL
# SISTEM CHATBOT AI UNTUK MANAJEMEN DATA KEKAYAAN INTELEKTUAL

---

## 1. PENDAHULUAN

### 1.1 Latar Belakang Proyek

Kekayaan Intelektual (KI) merupakan aset penting bagi institusi pendidikan dan penelitian seperti Institut Teknologi Bandung (ITB). Data KI yang meliputi paten, hak cipta, desain industri, dan merek dagang tersimpan dalam database yang kompleks dan memerlukan pengetahuan teknis untuk mengaksesnya.

Permasalahan yang sering dihadapi:
- **Kesulitan Akses Data**: Pengguna non-teknis kesulitan mengakses informasi KI karena harus memahami struktur database dan bahasa SQL
- **Waktu Pencarian Lama**: Proses pencarian data manual memakan waktu dan tidak efisien
- **Informasi Tersebar**: Data KI tersebar di berbagai database yang berbeda
- **Kurangnya Analisis**: Tidak ada sistem yang dapat memberikan analisis dan insight dari data KI secara otomatis

Untuk mengatasi permasalahan tersebut, dikembangkan sistem chatbot berbasis Artificial Intelligence (AI) yang dapat memahami pertanyaan dalam bahasa natural (bahasa sehari-hari) dan mengkonversinya menjadi query database secara otomatis.

### 1.2 Permasalahan yang Ingin Diselesaikan

1. **Barrier Teknis**: Pengguna harus memahami SQL dan struktur database untuk mengakses data
2. **Efisiensi Waktu**: Proses pencarian data manual membutuhkan waktu lama
3. **Aksesibilitas**: Tidak semua pengguna memiliki akses langsung ke database
4. **Analisis Data**: Kesulitan dalam mendapatkan insight dan analisis dari data KI
5. **Multi-Database**: Kesulitan mencari data yang tersebar di berbagai database

### 1.3 Alasan Pemilihan Teknologi

**Backend: Node.js dengan Express.js**
- Performa tinggi untuk operasi I/O (Input/Output) seperti query database
- Ekosistem npm yang luas dengan banyak library pendukung
- Cocok untuk aplikasi real-time dengan WebSocket
- JavaScript di backend dan frontend memudahkan development

**Database: MySQL**
- Database relasional yang stabil dan mature
- Mendukung query kompleks dengan JOIN dan agregasi
- Banyak digunakan di institusi pendidikan
- Kompatibel dengan berbagai sistem

**AI Provider: Multi-Provider (Groq, Gemini, OpenRouter, dll)**
- Groq: Kecepatan inference sangat tinggi (LLaMA 3.3 70B)
- Gemini: Free tier yang generous dengan kemampuan reasoning baik
- Fallback system: Jika satu provider down, otomatis beralih ke provider lain
- Cost-effective: Menggunakan free tier dari berbagai provider

**WebSocket (Socket.io)**
- Real-time communication untuk progress update
- Menghindari timeout pada query yang lama
- Memberikan feedback langsung ke user

**Voice-to-Text: Deepgram**
- Akurasi tinggi untuk bahasa Indonesia
- Latency rendah (real-time transcription)
- API yang mudah diintegrasikan

---

## 2. TUJUAN PEMBUATAN PROYEK

### 2.1 Tujuan Umum

Mengembangkan sistem chatbot berbasis AI yang dapat memudahkan akses dan analisis data Kekayaan Intelektual melalui interaksi bahasa natural, sehingga pengguna non-teknis dapat dengan mudah mendapatkan informasi yang dibutuhkan tanpa harus memahami struktur database atau bahasa SQL.

### 2.2 Tujuan Khusus

1. **Membangun Natural Language Interface**
   - Sistem dapat memahami pertanyaan dalam bahasa Indonesia sehari-hari
   - Mengkonversi pertanyaan natural menjadi SQL query yang akurat
   - Mendukung berbagai variasi pertanyaan untuk intent yang sama

2. **Implementasi Multi-Database Support**
   - Sistem dapat mengakses dan mencari data dari multiple database secara bersamaan
   - Otomatis mendeteksi database yang paling relevan untuk setiap pertanyaan
   - Menangani konflik ketika data ditemukan di beberapa database

3. **Sistem Pembelajaran Adaptif**
   - Chatbot belajar dari pola pertanyaan user
   - Menyimpan preferensi database per user
   - Meningkatkan akurasi response seiring waktu

4. **Fitur Analisis dan Insight**
   - Deteksi anomali data (duplikasi, data kosong, inkonsistensi)
   - Analisis tren dan statistik KI
   - Rekomendasi strategis berdasarkan data

5. **User Management dan Security**
   - Sistem autentikasi dengan OTP email
   - Google OAuth integration
   - Role-based access (admin dan user)
   - Session management dengan JWT token

6. **Voice Input Support**
   - Konversi suara ke teks menggunakan Deepgram API
   - Mendukung bahasa Indonesia
   - Memudahkan input untuk mobile user

---

## 3. MANFAAT PROYEK

### 3.1 Manfaat bagi Pengguna

1. **Kemudahan Akses Informasi**
   - Tidak perlu memahami SQL atau struktur database
   - Cukup bertanya dengan bahasa sehari-hari
   - Mendapat jawaban dalam hitungan detik

2. **Efisiensi Waktu**
   - Pencarian data yang biasanya memakan waktu 10-15 menit, kini hanya 5-10 detik
   - Tidak perlu membuka banyak aplikasi atau dashboard
   - Hasil langsung dalam format yang mudah dibaca

3. **Analisis Mendalam**
   - Mendapat insight dan analisis otomatis dari data
   - Deteksi anomali dan potensi masalah
   - Rekomendasi berbasis data

4. **Fleksibilitas Input**
   - Input teks atau suara
   - Mendukung berbagai variasi pertanyaan
   - Context-aware (memahami pertanyaan lanjutan)

### 3.2 Manfaat bagi Instansi

1. **Peningkatan Produktivitas**
   - Staff tidak perlu menghabiskan waktu untuk query manual
   - Pengambilan keputusan lebih cepat dengan data real-time
   - Mengurangi beban IT support untuk query data

2. **Demokratisasi Data**
   - Semua staff dapat mengakses data KI tanpa training SQL
   - Mengurangi dependency pada tim IT
   - Meningkatkan data literacy di organisasi

3. **Kualitas Data**
   - Deteksi otomatis untuk data duplikat atau tidak konsisten
   - Monitoring kualitas data secara real-time
   - Alert untuk anomali data

4. **Cost Reduction**
   - Mengurangi waktu training untuk staff baru
   - Mengurangi error akibat query manual yang salah
   - Menggunakan AI provider dengan free tier

### 3.3 Manfaat bagi Siswa PKL

1. **Pembelajaran Teknologi Terkini**
   - Pengalaman hands-on dengan AI/LLM integration
   - Pemahaman tentang Natural Language Processing
   - Skill dalam backend development dengan Node.js

2. **Problem Solving Skills**
   - Menghadapi real-world problem: konversi natural language ke SQL
   - Menangani edge cases dan error handling
   - Optimasi performa untuk query kompleks

3. **Portfolio Project**
   - Proyek yang dapat dipresentasikan ke calon employer
   - Demonstrasi kemampuan full-stack development
   - Bukti kemampuan bekerja dengan teknologi AI

4. **Soft Skills**
   - Komunikasi dengan stakeholder untuk requirement gathering
   - Dokumentasi teknis yang baik
   - Time management dalam project development

---

## 4. DESKRIPSI UMUM APLIKASI

### 4.1 Gambaran Singkat Aplikasi

Sistem Chatbot AI untuk Manajemen Data Kekayaan Intelektual adalah aplikasi web-based yang terdiri dari:

**Backend Server (Node.js + Express)**
- REST API untuk autentikasi, query, dan manajemen data
- WebSocket server untuk real-time communication
- AI integration dengan multiple providers
- Database connection pooling untuk performa optimal

**Database Layer (MySQL)**
- Database utama: `chatbot_db` untuk user, chat history, dan OTP
- Database KI: `itb_db` dan database lain yang diimport dari API
- Support untuk multiple database connections

**AI Engine**
- Natural Language Understanding untuk parsing pertanyaan user
- SQL Generation dengan chain-of-thought reasoning
- Response formatting yang user-friendly
- Learning system untuk improvement berkelanjutan

**Authentication System**
- Email + Password dengan OTP verification
- Google OAuth integration
- JWT token untuk session management
- Role-based access control

### 4.2 Cara Kerja Sistem Secara Umum

**Flow Utama Sistem:**

```
User Input (Text/Voice)
    ↓
[Authentication Check]
    ↓
[Natural Language Processing]
    ↓
[Intent Detection & Routing]
    ↓
┌─────────────────┬──────────────────┐
│  CONVERSATION   │  DATABASE_QUERY  │
└─────────────────┴──────────────────┘
         ↓                    ↓
    [AI Response]      [SQL Generation]
                              ↓
                       [Execute Query]
                              ↓
                       [Format Results]
                              ↓
                       [Learning System]
                              ↓
                    [Return to User]
```

**Penjelasan Detail:**

1. **User Input**: User mengetik pertanyaan atau menggunakan voice input
2. **Authentication**: Sistem memverifikasi JWT token user
3. **NLP Processing**: AI memproses pertanyaan untuk memahami intent
4. **Routing**: Sistem memutuskan apakah ini conversation biasa atau butuh query database
5. **SQL Generation**: Jika butuh data, AI generate SQL query yang sesuai
6. **Execution**: Query dijalankan ke database yang relevan
7. **Formatting**: Hasil di-format menjadi response yang mudah dibaca
8. **Learning**: Sistem belajar dari query ini untuk improvement
9. **Response**: Hasil dikirim ke user melalui WebSocket

### 4.3 Alur Penggunaan Aplikasi

**Untuk User Baru:**

1. **Registrasi**
   - User mengisi email dan password
   - Sistem mengirim OTP ke email
   - User memasukkan OTP untuk verifikasi
   - Akun berhasil dibuat

2. **Login**
   - User login dengan email/password atau Google
   - Sistem generate JWT token
   - Token disimpan di browser untuk auto-login

3. **Bertanya ke Chatbot**
   - User mengetik pertanyaan (contoh: "Berapa total paten tahun 2023?")
   - Sistem menampilkan progress indicator
   - Chatbot memberikan jawaban dengan data yang akurat
   - User dapat bertanya lanjutan (pagination, detail, dll)

4. **Melihat History**
   - User dapat melihat riwayat chat sebelumnya
   - Melanjutkan conversation dari session sebelumnya
   - Menghapus chat yang tidak diperlukan

**Untuk Admin:**

1. **Login Admin**
   - Login dengan akun admin
   - Akses dashboard admin

2. **Manajemen User**
   - Melihat daftar semua user
   - Menambah, edit, atau hapus user
   - Mengaktifkan/menonaktifkan akun user

3. **Manajemen Database**
   - Menambah koneksi database baru
   - Import data dari API eksternal
   - Set active databases (maksimal 5)
   - Monitor statistik database

4. **Monitoring Chat**
   - Melihat semua riwayat chat dari semua user
   - Monitoring pertanyaan yang sering ditanyakan
   - Analisis performa sistem

5. **Manajemen API Keys**
   - Menambah/edit API keys untuk AI providers
   - Enable/disable provider tertentu
   - Monitor usage dan fallback

---


## 5. STRUKTUR FOLDER DAN FILE

### 5.1 Struktur Folder Utama

```
chatbot-backend/
├── images/                          # Folder untuk gambar dan logo
├── uploads/                         # Folder untuk file upload (foto profil, audio)
├── server.js                        # Entry point aplikasi
├── package.json                     # Dependencies dan scripts
├── .env                            # Environment variables (API keys)
├── active-db.json                  # Konfigurasi database aktif
├── db-connections.json             # Daftar koneksi database
├── api-keys.json                   # Konfigurasi API keys AI providers
├── query-patterns.json             # Data pembelajaran query patterns
├── learning-data-v2.json           # Data pembelajaran user-specific
└── [File-file modul lainnya]
```

### 5.2 File-File Utama dan Fungsinya

#### **server.js**
**Fungsi**: Entry point dan konfigurasi utama server

**Peran dalam sistem**:
- Inisialisasi Express server dan middleware
- Setup WebSocket (Socket.io) untuk real-time communication
- Registrasi semua routes (auth, chatbot, database, profile, dll)
- Konfigurasi CORS untuk keamanan
- Setup static file serving untuk images dan uploads
- Endpoint untuk user management (CRUD operations)
- Endpoint untuk API database import
- Endpoint untuk API keys management
- Health check endpoint

**Fitur Utama**:
- WebSocket dengan heartbeat untuk keep-alive connection
- Progress callback untuk long-running queries
- Real-time events: user_added, user_updated, user_deleted, new_chat, new_message
- Import database dari API eksternal dengan auto-detection format
- Multi-database support (maksimal 5 database aktif)

---

#### **chatbot-logic.js**
**Fungsi**: Otak utama chatbot - Natural Language Processing dan SQL Generation

**Peran dalam sistem**:
- Memproses pertanyaan user dalam bahasa natural
- Mengkonversi pertanyaan menjadi SQL query
- Menjalankan query ke database
- Memformat hasil query menjadi response yang user-friendly
- Mengelola conversation context per user
- Implementasi guardrails untuk keamanan

**Komponen Utama**:

1. **processMessage()**: Entry point utama
   - Input validation
   - Context management
   - Guardrail checking
   - Intent routing (CONVERSATION vs DATABASE_QUERY)
   - Pagination handling
   - Special intent detection

2. **routeIntent()**: AI-powered intent router
   - Menggunakan AI untuk memutuskan apakah pertanyaan butuh query database atau conversation biasa
   - Schema-aware routing untuk akurasi lebih tinggi
   - Context-aware untuk pertanyaan lanjutan

3. **generateSQL()**: SQL query generator
   - Chain-of-thought reasoning untuk akurasi tinggi
   - Schema-aware generation
   - Support untuk complex queries (JOIN, GROUP BY, aggregation)
   - Automatic column detection
   - Filter dan sorting otomatis

4. **formatResponse()**: Response formatter
   - Deteksi tipe hasil (COUNT, GROUP BY, list, single record)
   - Format yang berbeda untuk setiap tipe
   - Pagination support
   - Formatting tanggal, angka, dan inventor list

5. **Special Intent Handlers**:
   - Duplicate detection
   - Ownership conflict detection
   - Anomaly detection
   - Data quality check
   - Scenario analysis
   - Strategic recommendations

**Fitur Keamanan**:
- SQL injection prevention (hanya SELECT query)
- Guardrails untuk pertanyaan sensitif
- Input validation

---

#### **chatbot-routes.js**
**Fungsi**: Router untuk endpoint chatbot

**Peran dalam sistem**:
- Menyediakan REST API endpoints untuk chatbot
- Wrapper untuk chatbot-logic.js
- Error handling

**Endpoints**:
- `POST /api/query`: Endpoint utama untuk bertanya ke chatbot
- `POST /api/confirmation`: Handle konfirmasi user
- `POST /api/database-selection`: Handle pemilihan database ketika ada multiple results

---

#### **auth.js**
**Fungsi**: Sistem autentikasi dan authorization

**Peran dalam sistem**:
- Registrasi user dengan OTP verification
- Login dengan email/password
- Google OAuth integration
- Forgot password dengan OTP
- JWT token generation dan verification
- Session management

**Endpoints**:

1. **Registrasi**:
   - `POST /api/auth/register/send-code`: Kirim OTP ke email
   - `POST /api/auth/register/verify-code`: Verifikasi OTP (tanpa buat akun)
   - `POST /api/auth/register/verify`: Verifikasi OTP dan buat akun

2. **Login**:
   - `POST /api/auth/login`: Login dengan email/password
   - `POST /api/auth/google-login`: Login dengan Google OAuth
   - `POST /api/auth/verify-token`: Auto-login dengan JWT token

3. **Forgot Password**:
   - `POST /api/auth/forgot-password/send-code`: Kirim OTP reset password
   - `POST /api/auth/forgot-password/verify-code`: Verifikasi OTP
   - `POST /api/auth/reset-password`: Reset password dengan OTP

**Fitur Keamanan**:
- Password hashing dengan bcrypt (8 rounds)
- OTP expiry (5 menit)
- OTP one-time use
- JWT token dengan expiry (30 hari)
- Email validation
- Status user check (active/inactive)

**Email Template**:
- HTML email yang professional
- Responsive design
- OTP dengan format yang jelas
- Security warning

---

#### **database-config.js**
**Fungsi**: Manajemen konfigurasi database

**Peran dalam sistem**:
- CRUD operations untuk database connections
- Set active databases (maksimal 5)
- Test database connection
- Get database statistics

**Endpoints**:
- `GET /api/databases`: Get list semua database
- `GET /api/databases/active`: Get active databases
- `POST /api/databases/set-active`: Set database mana yang aktif
- `POST /api/databases`: Add database connection baru
- `PUT /api/databases/:name`: Update database connection
- `DELETE /api/databases/:name`: Delete database connection
- `POST /api/databases/test`: Test koneksi database
- `GET /api/databases/:name/stats`: Get statistik database
- `POST /api/databases/reload`: Reload konfigurasi

**File Terkait**:
- `active-db.json`: Menyimpan database mana yang aktif
- `db-connections.json`: Menyimpan semua konfigurasi koneksi

---

#### **db-helper.js**
**Fungsi**: Helper functions untuk database operations

**Peran dalam sistem**:
- Abstraction layer untuk database operations
- Load/save database configurations
- Create database connections
- Multi-database support

**Functions**:
- `getActiveDatabases()`: Get array of active databases
- `getActiveDatabase()`: Get first active database (backward compatibility)
- `getAllActiveConnectionConfigs()`: Get connection configs untuk semua active databases
- `getDbConfig()`: Get config untuk active database
- `createConnection()`: Create MySQL connection
- `addDatabase()`: Add database baru ke connections file

---

#### **chat-history.js**
**Fungsi**: Manajemen riwayat chat

**Peran dalam sistem**:
- Menyimpan dan mengambil riwayat chat
- CRUD operations untuk chat history
- Real-time updates via WebSocket

**Endpoints**:
- `GET /api/chat-history`: Get semua chat history (admin)
- `GET /api/chat-history/:id/messages`: Get messages untuk chat tertentu
- `DELETE /api/chat-history/:id`: Hapus chat history
- `POST /api/chat/save`: Simpan chat baru
- `PUT /api/chat/update`: Update chat dengan messages baru
- `GET /api/chat/history/:email`: Get chat history per user

**Database Tables**:
- `riwayat_chat`: Menyimpan metadata chat (id, user_email, judul, timestamps)
- `pesan_chat`: Menyimpan messages (id, riwayat_chat_id, peran, konten, sumber)

**WebSocket Events**:
- `new_chat`: Emit ketika chat baru dibuat
- `new_message`: Emit ketika message baru ditambahkan

---

#### **query-learning.js**
**Fungsi**: Sistem pembelajaran dari query patterns

**Peran dalam sistem**:
- Belajar dari pertanyaan user
- Extract keywords otomatis
- Synonym mapping untuk normalisasi
- Suggest similar queries

**Features**:
- Auto-learning dari setiap query
- Keyword extraction dengan normalisasi (English → Indonesian)
- Synonym mapping (patent → paten, show → tampilkan, dll)
- Query statistics dan analytics
- Top queries tracking

**Data Structure**:
```json
{
  "queries": [
    {
      "query": "tampilkan paten 2023",
      "database": "itb_db",
      "count": 15,
      "successCount": 14,
      "firstSeen": 1234567890,
      "lastUsed": 1234567890
    }
  ],
  "keywords": ["paten", "tampilkan", "2023", "inventor", ...]
}
```

---

#### **learning-system-v2.js**
**Fungsi**: Advanced learning system dengan user-specific learning

**Peran dalam sistem**:
- User-specific learning (setiap user punya preferensi sendiri)
- Confidence scoring untuk shortcuts
- Time-weighted scoring (query terbaru lebih penting)
- Conflict resolution untuk multi-database
- Context-aware learning
- Feedback integration

**Features**:

1. **Database Preference Learning**:
   - Belajar database mana yang user prefer untuk query tertentu
   - Time-weighted scoring
   - Conflict resolution ketika ada multiple databases

2. **Shortcut Detection**:
   - Deteksi query yang sering diulang
   - Confidence threshold (80%) sebelum activate shortcut
   - Time decay untuk data lama

3. **Context Learning**:
   - Belajar dari sequence pertanyaan
   - Linked intent detection
   - Multi-intent support

4. **Feedback Integration**:
   - Belajar dari rating user
   - Adjust confidence based on feedback
   - Error tracking

5. **Data Cleanup**:
   - Auto-cleanup data lama (>30 hari)
   - Limit patterns per user (500 max)
   - Auto-validation setiap 1 jam

**Data Structure**:
```json
{
  "users": [
    {
      "userId": "user@email.com",
      "patterns": [...],
      "shortcuts": [...],
      "preferences": [...],
      "feedback": [...],
      "errors": [...]
    }
  ]
}
```

---

#### **voice-to-text.js**
**Fungsi**: Konversi suara ke teks menggunakan Deepgram API

**Peran dalam sistem**:
- Handle upload audio file
- Transcribe audio menggunakan Deepgram
- Support bahasa Indonesia
- Return transcript dengan confidence score

**Endpoint**:
- `POST /api/voice-to-text`: Upload audio dan get transcript

**Features**:
- Multer untuk handle file upload
- Max file size: 10MB
- Model: Deepgram Nova-2
- Language: Indonesian (id)
- Smart formatting
- Auto-cleanup temporary files

---

#### **profile.js**
**Fungsi**: Manajemen profil user

**Peran dalam sistem**:
- Get dan update profil user
- Upload foto profil
- Update password

**Endpoints**:
- `GET /api/profile/:email`: Get profil user
- `PUT /api/profile/:email`: Update profil user
- `POST /api/profile/upload-photo`: Upload foto profil
- `PUT /api/profile/:email/password`: Update password

---

#### **api-keys-helper.js**
**Fungsi**: Helper untuk manajemen API keys AI providers

**Peran dalam sistem**:
- Load/save API keys dari file
- CRUD operations untuk API keys
- Get enabled API keys untuk fallback system

**Functions**:
- `getAllApiKeys()`: Get semua API keys
- `getEnabledApiKeys()`: Get API keys yang enabled saja
- `addApiKey()`: Add API key baru
- `updateApiKey()`: Update API key
- `deleteApiKey()`: Delete API key

**Data Structure**:
```json
[
  {
    "name": "Groq Primary",
    "provider": "groq",
    "apiKey": "gsk_...",
    "model": "llama-3.3-70b-versatile",
    "url": "https://api.groq.com/...",
    "enabled": true
  }
]
```

---

#### **cors-config.js**
**Fungsi**: Konfigurasi CORS (Cross-Origin Resource Sharing)

**Peran dalam sistem**:
- Allow requests dari frontend
- Security configuration
- Credentials support

**Allowed Origins**:
- http://localhost:5173 (development)
- https://jstlmtmc-5173.asse.devtunnels.ms (DevTunnel)

---

#### **package.json**
**Fungsi**: Konfigurasi project dan dependencies

**Dependencies Utama**:
- `express`: Web framework
- `mysql2`: MySQL client dengan Promise support
- `axios`: HTTP client untuk AI API calls
- `socket.io`: WebSocket untuk real-time
- `bcrypt`: Password hashing
- `jsonwebtoken`: JWT token generation
- `nodemailer`: Email sending
- `multer`: File upload handling
- `@deepgram/sdk`: Voice-to-text
- `google-auth-library`: Google OAuth
- `natural`: NLP library
- `dotenv`: Environment variables
- `cors`: CORS middleware

---

#### **.env**
**Fungsi**: Environment variables untuk API keys

**Isi**:
- `DEEPGRAM_API_KEY`: Untuk voice-to-text
- `GROQ_API_KEY`: Primary AI provider
- `GEMINI_API_KEY`: Backup AI provider
- `MISTRAL_API_KEY`: Backup AI provider
- `COHERE_API_KEY`: Backup AI provider
- `HUGGINGFACE_API_KEY`: Backup AI provider
- `OPENROUTER_API_KEY`: Backup AI provider

**Catatan Keamanan**: File ini tidak boleh di-commit ke Git (ada di .gitignore)

---


## 6. TEKNOLOGI YANG DIGUNAKAN

### 6.1 Bahasa Pemrograman

#### **JavaScript (Node.js)**
**Versi**: Node.js v18+

**Alasan Pemilihan**:
- **Performa Tinggi**: Event-driven, non-blocking I/O cocok untuk aplikasi real-time
- **Ekosistem Luas**: npm memiliki 2+ juta packages
- **Full-Stack JavaScript**: Satu bahasa untuk frontend dan backend
- **Async/Await**: Memudahkan handling operasi asynchronous
- **Community Support**: Komunitas besar dan aktif

**Penggunaan dalam Proyek**:
- Backend server dengan Express.js
- Database operations dengan async/await
- AI API integration
- WebSocket server
- File processing

---

### 6.2 Framework dan Library

#### **Express.js v4.18.2**
**Fungsi**: Web framework untuk Node.js

**Fitur yang Digunakan**:
- Routing untuk REST API
- Middleware untuk authentication, CORS, body parsing
- Static file serving
- Error handling

**Alasan Pemilihan**:
- Minimalist dan flexible
- Middleware ecosystem yang kaya
- Performance yang baik
- Dokumentasi lengkap

---

#### **Socket.io v4.8.3**
**Fungsi**: Real-time bidirectional communication

**Fitur yang Digunakan**:
- WebSocket connection untuk real-time updates
- Progress updates untuk long-running queries
- Heartbeat untuk keep-alive
- Event-based communication

**Alasan Pemilihan**:
- Fallback ke polling jika WebSocket tidak support
- Auto-reconnection
- Room dan namespace support
- Cross-browser compatibility

**Events yang Diimplementasikan**:
- `processing`: Update progress query
- `completed`: Query selesai
- `error`: Error notification
- `heartbeat`: Keep connection alive
- `new_chat`: Chat baru dibuat
- `new_message`: Message baru
- `user_added`, `user_updated`, `user_deleted`: User management events

---

#### **MySQL2 v3.6.5**
**Fungsi**: MySQL client untuk Node.js

**Fitur yang Digunakan**:
- Promise-based API
- Prepared statements untuk security
- Connection pooling
- Multiple database connections

**Alasan Pemilihan**:
- Faster than mysql package
- Promise support (async/await)
- Prepared statements mencegah SQL injection
- Active maintenance

---

#### **Axios v1.13.2**
**Fungsi**: HTTP client untuk API calls

**Fitur yang Digunakan**:
- AI API calls (Groq, Gemini, OpenRouter, dll)
- Timeout configuration
- Error handling
- Request/response interceptors

**Alasan Pemilihan**:
- Promise-based
- Browser dan Node.js support
- Automatic JSON transformation
- Request cancellation

---

#### **Bcrypt v5.1.1**
**Fungsi**: Password hashing

**Fitur yang Digunakan**:
- Hash password sebelum simpan ke database
- Compare password saat login
- Salt rounds: 8

**Alasan Pemilihan**:
- Industry standard untuk password hashing
- Slow by design (mencegah brute force)
- Automatic salt generation

---

#### **JsonWebToken v9.0.3**
**Fungsi**: JWT token generation dan verification

**Fitur yang Digunakan**:
- Generate token saat login
- Verify token untuk authentication
- Token expiry (30 hari)

**Alasan Pemilihan**:
- Stateless authentication
- Secure dan scalable
- Industry standard

---

#### **Nodemailer v7.0.12**
**Fungsi**: Email sending

**Fitur yang Digunakan**:
- Kirim OTP untuk registrasi
- Kirim OTP untuk reset password
- HTML email templates

**Konfigurasi**:
- Service: Gmail
- Email: chatbotaiasistent@gmail.com
- App Password untuk security

---

#### **Multer v1.4.5**
**Fungsi**: File upload handling

**Fitur yang Digunakan**:
- Upload foto profil
- Upload audio untuk voice-to-text
- File size limit
- File type validation

---

#### **Deepgram SDK v3.4.0**
**Fungsi**: Voice-to-text transcription

**Fitur yang Digunakan**:
- Transcribe audio ke text
- Model: Nova-2
- Language: Indonesian
- Smart formatting

**Alasan Pemilihan**:
- Akurasi tinggi untuk bahasa Indonesia
- Latency rendah
- API yang mudah digunakan
- Free tier yang generous

---

#### **Google Auth Library v10.5.0**
**Fungsi**: Google OAuth integration

**Fitur yang Digunakan**:
- Verify Google ID token
- Get user info dari Google
- Secure authentication

---

#### **Natural v8.1.0**
**Fungsi**: Natural Language Processing library

**Fitur yang Digunakan**:
- Tokenization
- Stemming
- String similarity

**Alasan Pemilihan**:
- Pure JavaScript (no Python dependency)
- Lightweight
- Good for basic NLP tasks

---

#### **CORS v2.8.5**
**Fungsi**: Cross-Origin Resource Sharing

**Fitur yang Digunakan**:
- Allow requests dari frontend
- Credentials support
- Preflight handling

---

#### **Dotenv v17.2.3**
**Fungsi**: Environment variables management

**Fitur yang Digunakan**:
- Load API keys dari .env file
- Separate config untuk development dan production

---

### 6.3 Database

#### **MySQL**
**Versi**: MySQL 8.0+

**Database yang Digunakan**:

1. **chatbot_db** (Database Utama)
   - `users`: Data user (id, email, kata_sandi, nama, telepon, status, google_id)
   - `kode_otp`: OTP untuk verifikasi (id, email, kode, tipe, kadaluarsa_pada, digunakan)
   - `riwayat_chat`: Metadata chat history (id, user_email, judul, dibuat_pada, diperbarui_pada)
   - `pesan_chat`: Messages dalam chat (id, riwayat_chat_id, peran, konten, sumber, dibuat_pada)

2. **itb_db** (Database KI)
   - `kekayaan_intelektual`: Data KI ITB
   - Kolom: id, judul, jenis_ki, status_ki, tgl_pendaftaran, tgl_sertifikasi, no_permohonan, id_sertifikat, inventor, fakultas_inventor, pekerjaan_inventor, nama_instansi_inventor, mitra_kepemilikan, abstrak, dll

3. **Database dari API Import**
   - Struktur dinamis sesuai data dari API
   - Auto-generated schema

**Alasan Pemilihan MySQL**:
- Relational database yang mature dan stable
- ACID compliance untuk data integrity
- Support untuk complex queries (JOIN, subquery, aggregation)
- Banyak digunakan di institusi pendidikan
- Free dan open-source
- Tools dan GUI yang lengkap (phpMyAdmin, MySQL Workbench)

---

### 6.4 AI Providers

#### **Groq (Primary)**
**Model**: LLaMA 3.3 70B Versatile

**Keunggulan**:
- Inference speed sangat cepat (500+ tokens/second)
- Free tier generous (14,400 requests/day)
- Kualitas output sangat baik
- Latency rendah

**Penggunaan**:
- SQL generation
- Intent routing
- Response formatting
- Conversation handling

---

#### **Google Gemini (Backup)**
**Model**: Gemini 2.0 Flash Exp

**Keunggulan**:
- Free tier sangat generous
- Reasoning capability baik
- Multimodal support
- Fast inference

**Penggunaan**:
- Fallback ketika Groq down
- Complex reasoning tasks

---

#### **OpenRouter (Backup)**
**Model**: Google Gemini 2.0 Flash (Free)

**Keunggulan**:
- Akses ke multiple models
- Free tier untuk beberapa model
- Unified API

---

#### **Mistral AI (Backup)**
**Model**: Mistral Small Latest

**Keunggulan**:
- Fast inference
- Good for structured output
- European AI provider

---

#### **Cohere (Backup)**
**Model**: Command R+

**Keunggulan**:
- 100 requests/minute free tier
- Good for text generation
- RAG support

---

#### **Hugging Face (Backup)**
**Model**: Mistral 7B Instruct

**Keunggulan**:
- Unlimited free tier
- Open-source models
- Community support

---

### 6.5 Alasan Pemilihan Teknologi Secara Keseluruhan

**1. Cost-Effective**
- Semua teknologi menggunakan free tier atau open-source
- Tidak ada biaya lisensi
- Cocok untuk institusi pendidikan

**2. Scalability**
- Node.js dapat handle ribuan concurrent connections
- MySQL dapat di-scale dengan replication dan sharding
- Multi-provider AI untuk load balancing

**3. Maintainability**
- Kode modular dan terstruktur
- Dokumentasi lengkap
- Active community support

**4. Security**
- JWT untuk stateless authentication
- Bcrypt untuk password hashing
- Prepared statements untuk SQL injection prevention
- CORS untuk cross-origin security
- OTP untuk email verification

**5. Performance**
- Non-blocking I/O dengan Node.js
- Connection pooling untuk database
- WebSocket untuk real-time updates
- Caching untuk schema dan learning data

**6. Developer Experience**
- JavaScript full-stack
- Async/await untuk clean code
- Rich ecosystem dengan npm
- Good debugging tools

---

## 7. FITUR-FITUR APLIKASI

### 7.1 Autentikasi dan Authorization

#### **Registrasi dengan OTP Email**

**Fungsi**: Mendaftarkan user baru dengan verifikasi email

**Cara Kerja**:
1. User mengisi email dan password
2. Sistem generate OTP 6 digit random
3. OTP dikirim ke email user dengan template HTML professional
4. User memasukkan OTP dalam 5 menit
5. Sistem verifikasi OTP dan create akun
6. Password di-hash dengan bcrypt sebelum disimpan

**Output**:
- Akun user baru di database
- JWT token untuk auto-login
- Email konfirmasi terkirim

**Keamanan**:
- OTP expire dalam 5 menit
- OTP hanya bisa digunakan sekali
- Password di-hash dengan bcrypt (8 rounds)
- Email validation

---

#### **Login dengan Email/Password**

**Fungsi**: Login user yang sudah terdaftar

**Cara Kerja**:
1. User input email dan password
2. Sistem cari user di database
3. Compare password dengan bcrypt
4. Generate JWT token (expire 30 hari)
5. Return token dan user info

**Output**:
- JWT token untuk session
- User info (id, email, name)

**Keamanan**:
- Password tidak pernah dikirim dalam plain text
- JWT token dengan expiry
- Status user check (active/inactive)

---

#### **Google OAuth Login**

**Fungsi**: Login menggunakan akun Google

**Cara Kerja**:
1. User klik "Login with Google"
2. Google OAuth popup muncul
3. User authorize aplikasi
4. Sistem verify Google ID token
5. Cek apakah email sudah terdaftar
6. Jika sudah, login. Jika belum, tolak (harus register dulu)
7. Generate JWT token

**Output**:
- JWT token
- User info dari Google

**Catatan**: User harus register dengan email biasa dulu sebelum bisa login dengan Google

---

#### **Forgot Password dengan OTP**

**Fungsi**: Reset password untuk user yang lupa

**Cara Kerja**:
1. User input email
2. Sistem kirim OTP ke email
3. User input OTP dan password baru
4. Sistem verify OTP
5. Update password di database

**Output**:
- Password berhasil direset
- User bisa login dengan password baru

---

#### **Auto-Login dengan JWT Token**

**Fungsi**: Login otomatis tanpa input password

**Cara Kerja**:
1. Saat buka aplikasi, cek apakah ada token di localStorage
2. Kirim token ke server untuk verifikasi
3. Jika valid, auto-login
4. Jika expired, redirect ke login page

**Output**:
- User langsung masuk tanpa login manual

---

### 7.2 Natural Language Query

#### **Pertanyaan dalam Bahasa Natural**

**Fungsi**: User dapat bertanya dengan bahasa sehari-hari tanpa perlu tahu SQL

**Cara Kerja**:
1. User ketik pertanyaan (contoh: "Berapa total paten tahun 2023?")
2. Sistem normalize slang (gak → tidak, yg → yang)
3. AI analyze intent dan extract entities
4. Generate SQL query yang sesuai
5. Execute query ke database
6. Format hasil menjadi response yang mudah dibaca

**Contoh Input dan Output**:

**Input**: "Berapa total paten tahun 2023?"
**SQL Generated**: `SELECT COUNT(*) as total FROM kekayaan_intelektual WHERE jenis_ki LIKE '%Paten%' AND YEAR(tgl_pendaftaran) = 2023`
**Output**: "45"

**Input**: "Tampilkan 5 paten terbaru"
**SQL Generated**: `SELECT * FROM kekayaan_intelektual WHERE jenis_ki LIKE '%Paten%' ORDER BY tgl_pendaftaran DESC LIMIT 5`
**Output**: List 5 paten dengan detail lengkap

**Input**: "Siapa inventor dengan KI terbanyak?"
**SQL Generated**: `SELECT inventor, COUNT(*) as total FROM kekayaan_intelektual GROUP BY inventor ORDER BY total DESC LIMIT 10`
**Output**: Breakdown inventor dengan jumlah KI masing-masing

---

#### **Context-Aware Conversation**

**Fungsi**: Chatbot memahami pertanyaan lanjutan berdasarkan context sebelumnya

**Cara Kerja**:
1. Sistem simpan conversation history per user
2. Saat ada pertanyaan baru, include context dari 6 pertanyaan terakhir
3. AI analyze apakah ini pertanyaan lanjutan atau baru
4. Generate response yang sesuai dengan context

**Contoh**:
```
User: "Berapa total paten 2023?"
Bot: "45"

User: "Tampilkan datanya"  ← Context-aware
Bot: [Menampilkan 10 paten pertama dari 45 paten tahun 2023]

User: "Lanjut"  ← Pagination
Bot: [Menampilkan 10 paten berikutnya]
```

---

#### **Multi-Database Support**

**Fungsi**: Sistem dapat mencari data di multiple database secara bersamaan

**Cara Kerja**:
1. Admin set active databases (maksimal 5)
2. Saat user bertanya, sistem query semua active databases
3. Jika data ditemukan di 1 database, langsung tampilkan
4. Jika data ditemukan di multiple databases, minta user pilih

**Output**:
- Data dari database yang paling relevan
- Atau pilihan database jika ada multiple results

---

### 7.3 SQL Generation dan Execution

#### **Automatic SQL Generation**

**Fungsi**: Generate SQL query dari pertanyaan natural language

**Cara Kerja**:
1. AI analyze pertanyaan user
2. Detect intent (COUNT, LIST, DETAIL, ANALYSIS)
3. Extract entities (tahun, jenis KI, inventor, fakultas)
4. Map entities ke kolom database
5. Generate SQL dengan chain-of-thought reasoning
6. Validate SQL (hanya SELECT, no injection)

**Fitur**:
- Support complex queries (JOIN, GROUP BY, HAVING, subquery)
- Auto-detect column names
- Smart filtering (LIKE, YEAR(), DATE functions)
- Pagination dengan LIMIT dan OFFSET
- Sorting otomatis

**Contoh SQL yang Dihasilkan**:

```sql
-- Pertanyaan: "Paten tahun 2023 yang sudah tersertifikasi"
SELECT * FROM kekayaan_intelektual 
WHERE jenis_ki LIKE '%Paten%' 
  AND YEAR(tgl_pendaftaran) = 2023 
  AND id_sertifikat IS NOT NULL 
LIMIT 10 OFFSET 0

-- Pertanyaan: "Inventor terbanyak per fakultas"
SELECT fakultas_inventor, inventor, COUNT(*) as total 
FROM kekayaan_intelektual 
GROUP BY fakultas_inventor, inventor 
ORDER BY total DESC 
LIMIT 20

-- Pertanyaan: "KI yang paling lama menunggu persetujuan"
SELECT *, DATEDIFF(NOW(), tgl_pendaftaran) as hari_menunggu 
FROM kekayaan_intelektual 
WHERE status_ki LIKE '%Ajuan%' 
ORDER BY hari_menunggu DESC 
LIMIT 10
```

---

#### **Schema-Aware Generation**

**Fungsi**: SQL generation yang aware dengan struktur database

**Cara Kerja**:
1. Saat pertama kali akses database, sistem cache schema
2. Schema include: table names, column names, data types, sample data
3. AI gunakan schema info untuk generate SQL yang akurat
4. Auto-detect kolom yang tepat untuk filter

**Keuntungan**:
- Akurasi SQL lebih tinggi
- Tidak perlu hardcode column names
- Support untuk database dengan struktur berbeda

---

#### **Safe SQL Execution**

**Fungsi**: Execute SQL dengan aman, mencegah SQL injection

**Cara Kerja**:
1. Validate SQL: hanya SELECT query yang diizinkan
2. Block keywords berbahaya (UPDATE, DELETE, DROP, INSERT, ALTER)
3. Use prepared statements untuk parameter
4. Timeout untuk query yang terlalu lama (30 detik)

**Keamanan**:
- SQL injection prevention
- Read-only access
- Query timeout
- Error handling yang aman

---

### 7.4 Response Formatting

#### **Smart Response Formatting**

**Fungsi**: Format hasil query menjadi response yang mudah dibaca

**Cara Kerja**:
1. Detect tipe hasil (COUNT, GROUP BY, LIST, SINGLE RECORD)
2. Apply formatting yang sesuai untuk setiap tipe
3. Format tanggal, angka, dan text
4. Add pagination info jika perlu

**Tipe Formatting**:

**1. COUNT Result**
```
Input: "Berapa total paten?"
Output: "156"
```

**2. GROUP BY Result**
```
Input: "Breakdown KI per jenis"
Output:
Breakdown berdasarkan jenis_ki:

1. Paten: 156
2. Hak Cipta: 89
3. Desain Industri: 34
4. Merek: 23

Total keseluruhan: 302
```

**3. List Result**
```
Input: "Tampilkan paten terbaru"
Output:
Menampilkan 1-10 dari 156 data:

1. **Sistem Monitoring Kualitas Air Berbasis IoT**
   Jenis: Paten
   Status: Tersertifikasi
   Tanggal Pendaftaran: 15 Januari 2024
   No. Sertifikat: P00202400123
   Inventor: Dr. Ahmad Fauzi (FMIPA), dkk
   Fakultas: FMIPA

2. **Metode Deteksi Dini Penyakit Tanaman**
   ...

Masih ada 146 data lagi. Ketik "lanjut" untuk melihat berikutnya.
```

**4. Single Record Detail**
```
Input: "Detail nomor 1"
Output:
**Sistem Monitoring Kualitas Air Berbasis IoT**

Jenis KI: Paten
Status: Tersertifikasi
Tanggal Pendaftaran: 15 Januari 2024
Tanggal Sertifikasi: 20 Maret 2024
No. Permohonan: P00202400123
No. Sertifikat: IDP000067890

Inventor:
- Dr. Ahmad Fauzi (FMIPA)
- Prof. Budi Santoso (FTMD)
- Ir. Citra Dewi (STEI)

Fakultas: FMIPA
Mitra: PT. Teknologi Nusantara

Abstrak:
Sistem monitoring kualitas air real-time menggunakan sensor IoT...
```

---

#### **Inventor List Formatting**

**Fungsi**: Format daftar inventor dengan clean dan deduplicate

**Cara Kerja**:
1. Parse inventor yang di-concat dalam satu cell
2. Split by <br/>, comma, atau newline
3. Clean HTML tags dan metadata (NIP, role)
4. Deduplicate
5. Format dengan numbering

**Contoh**:
```
Input (dari database): 
"Dr. Ahmad<br/>Prof. Budi (FMIPA - Dosen - 123456)<br/>Ir. Citra"

Output:
Daftar inventor (1-3 dari 3):

1. Dr. Ahmad
2. Prof. Budi (FMIPA)
3. Ir. Citra
```

---

### 7.5 Pagination dan Navigation

#### **Automatic Pagination**

**Fungsi**: Handle hasil query yang banyak dengan pagination

**Cara Kerja**:
1. Default LIMIT: 10 records per page
2. Sistem track offset untuk setiap user
3. User bisa ketik "lanjut" untuk page berikutnya
4. User bisa ketik "awal" untuk kembali ke page pertama
5. User bisa request range spesifik: "data 11-20"

**Contoh**:
```
User: "Tampilkan semua paten"
Bot: [Menampilkan 1-10 dari 156 data]
     Masih ada 146 data lagi. Ketik "lanjut" untuk melihat berikutnya.

User: "lanjut"
Bot: [Menampilkan 11-20 dari 156 data]

User: "data 50-60"
Bot: [Menampilkan 50-60 dari 156 data]

User: "awal"
Bot: [Menampilkan 1-10 dari 156 data]
```

---

#### **Detail Selection**

**Fungsi**: User dapat memilih nomor untuk melihat detail

**Cara Kerja**:
1. Setelah list ditampilkan, user bisa ketik nomor
2. Sistem ambil record sesuai nomor
3. Tampilkan detail lengkap

**Contoh**:
```
User: "Tampilkan paten terbaru"
Bot: [List 10 paten dengan nomor 1-10]

User: "3"
Bot: [Detail lengkap paten nomor 3]
```

---

### 7.6 Learning System

#### **Query Pattern Learning**

**Fungsi**: Sistem belajar dari pola pertanyaan user

**Cara Kerja**:
1. Setiap query disimpan dengan metadata (database, success, timestamp)
2. Extract keywords otomatis
3. Track frequency dan success rate
4. Synonym mapping untuk normalisasi

**Data yang Dipelajari**:
- Query yang sering ditanyakan
- Keywords yang sering muncul
- Database preference per query
- Success rate per query pattern

**Manfaat**:
- Improve accuracy seiring waktu
- Faster response untuk query yang sering
- Better intent detection

---

#### **User-Specific Learning**

**Fungsi**: Setiap user punya preferensi dan pattern sendiri

**Cara Kerja**:
1. Track query pattern per user
2. Learn database preference per user
3. Detect shortcuts (query yang sering diulang)
4. Context-aware learning

**Features**:
- **Database Preference**: Belajar database mana yang user prefer untuk query tertentu
- **Shortcut Detection**: Deteksi query yang sering diulang (confidence threshold 80%)
- **Time-Weighted Scoring**: Query terbaru lebih penting
- **Conflict Resolution**: Handle ketika data ada di multiple databases

**Contoh**:
```
User A sering query "paten 2023" dari database itb_db
→ Sistem belajar: untuk User A, "paten 2023" = itb_db

User B sering query "paten 2023" dari database api_import
→ Sistem belajar: untuk User B, "paten 2023" = api_import

Kedua user punya preferensi berbeda untuk query yang sama
```

---

#### **Feedback Integration**

**Fungsi**: Belajar dari feedback user

**Cara Kerja**:
1. User bisa rate response (1-5 stars)
2. User bisa kasih comment
3. Sistem adjust confidence score based on feedback
4. Bad feedback (< 3 stars) → reduce confidence
5. Good feedback (≥ 4 stars) → increase confidence

**Manfaat**:
- Continuous improvement
- Identify problematic queries
- Validate learning accuracy

---


### 7.7 Special Features

#### **Duplicate Detection**

**Fungsi**: Deteksi judul KI yang sama dengan pemilik berbeda (potensi konflik)

**Cara Kerja**:
1. User bertanya: "ada duplikat judul?"
2. Sistem query semua database untuk cari judul yang sama
3. Group by judul, count distinct pemilik
4. Filter yang punya > 1 pemilik berbeda
5. Tampilkan list dengan warning

**Output**:
```
Ditemukan 3 judul dengan pemilik berbeda:

1. **Sistem Monitoring Suhu Real-Time**
   Pemilik: Dr. Ahmad | Prof. Budi
   Jumlah entri: 2
   Database: itb_db

2. **Metode Deteksi Penyakit Tanaman**
   Pemilik: Ir. Citra | Dr. Dewi | Prof. Eko
   Jumlah entri: 3
   Database: api_import

Potensi konflik kepemilikan. Disarankan verifikasi lebih lanjut.
```

---

#### **Anomaly Detection**

**Fungsi**: Deteksi data yang tidak wajar atau tidak konsisten

**Cara Kerja**:
1. User request: "cek anomali data"
2. Sistem jalankan multiple checks:
   - Data kosong (inventor NULL, abstrak NULL)
   - Tanggal tidak valid (tgl_sertifikasi < tgl_pendaftaran)
   - Status tidak konsisten
   - Duplikasi no_permohonan
3. Tampilkan summary anomali

**Jenis Anomali yang Dideteksi**:
- KI tanpa inventor
- KI tanpa abstrak
- Tanggal sertifikasi sebelum tanggal pendaftaran
- No permohonan duplikat
- Status tidak wajar

---

#### **Data Quality Check**

**Fungsi**: Cek kualitas dan kelengkapan data

**Cara Kerja**:
1. User request: "ki tanpa inventor"
2. Sistem query data dengan field kosong
3. Tampilkan list dengan info field yang kosong

**Contoh**:
```
User: "ki tanpa abstrak"
Bot: 
Ditemukan 12 KI tanpa abstrak:

1. Sistem ABC (P00202300456)
2. Metode XYZ (P00202300789)
...

Disarankan untuk melengkapi data abstrak.
```

---

#### **Scenario Analysis**

**Fungsi**: Analisis skenario "what-if"

**Cara Kerja**:
1. User bertanya skenario: "jika ki dijual, apa risikonya?"
2. AI analyze dan berikan analisis komprehensif
3. Include: risiko, dampak, rekomendasi

**Contoh Skenario**:
- "Jika KI dijual"
- "Jika tidak diperpanjang"
- "Jika dilisensikan"

**Output**:
```
Analisis Skenario: Penjualan KI

Risiko yang perlu dipertimbangkan:

1. Status Hukum
   - Pastikan KI sudah tersertifikasi
   - Tidak ada sengketa kepemilikan

2. Risiko Finansial
   - Valuasi yang tepat
   - Biaya transfer kepemilikan

3. Dampak Strategis
   - Kehilangan keunggulan kompetitif
   - Potensi digunakan kompetitor

Disarankan konsultasi dengan ahli valuasi KI dan legal due diligence.
```

---

#### **Strategic Recommendations**

**Fungsi**: Rekomendasi strategis untuk manajemen KI

**Cara Kerja**:
1. User request: "ki yang layak dikomersialisasikan"
2. AI analyze data dengan kriteria:
   - Status tersertifikasi
   - Belum dilisensikan
   - Potensi pasar
   - Kebaruan teknologi
3. Berikan rekomendasi dengan reasoning

---

### 7.8 Voice Input

#### **Voice-to-Text**

**Fungsi**: Konversi suara menjadi teks untuk input query

**Cara Kerja**:
1. User klik tombol microphone
2. Record audio (max 10MB)
3. Upload audio ke server
4. Server kirim ke Deepgram API
5. Deepgram transcribe audio ke text (bahasa Indonesia)
6. Return transcript ke frontend
7. Auto-fill ke input box

**Teknologi**:
- Deepgram Nova-2 model
- Language: Indonesian (id)
- Smart formatting
- Confidence score

**Keuntungan**:
- Lebih cepat untuk mobile user
- Aksesibilitas untuk user dengan keterbatasan
- Natural interaction

---

### 7.9 Database Management

#### **Add Database Connection**

**Fungsi**: Admin dapat menambah koneksi database baru

**Cara Kerja**:
1. Admin input: name, host, port, database, user, password
2. Sistem test connection
3. Jika berhasil, simpan ke db-connections.json
4. Database siap digunakan

---

#### **Import Database from API**

**Fungsi**: Import data dari API eksternal menjadi database MySQL

**Cara Kerja**:
1. Admin input: API URL, API key (optional), database name
2. Sistem preview data dari API
3. Auto-detect format (array, object, nested)
4. Flatten nested objects
5. Auto-detect column types
6. Create database dan table
7. Insert data
8. Save metadata

**Features**:
- Support berbagai format API response (array, object, nested)
- Auto-flatten nested objects
- Smart column type detection (VARCHAR, TEXT, INT, DECIMAL)
- Handle large data (chunked insert)
- Custom headers support

**Contoh**:
```
API URL: https://api.example.com/data
Response: { "data": [ {...}, {...} ] }

→ Sistem detect field "data" berisi array
→ Create table dengan kolom sesuai struktur
→ Insert semua records
→ Database siap digunakan
```

---

#### **Set Active Databases**

**Fungsi**: Admin set database mana yang aktif (maksimal 5)

**Cara Kerja**:
1. Admin pilih database dari list
2. Maksimal 5 database
3. Simpan ke active-db.json
4. Chatbot akan query ke semua active databases

**Alasan Limit 5**:
- Performance: terlalu banyak database akan slow
- Relevance: fokus ke database yang paling sering digunakan
- User experience: terlalu banyak pilihan membingungkan

---

### 7.10 User Management (Admin)

#### **View All Users**

**Fungsi**: Admin melihat semua user yang terdaftar

**Output**:
- List semua user dengan: id, email, nama, telepon, status, tanggal daftar
- Real-time updates via WebSocket

---

#### **Add User**

**Fungsi**: Admin menambah user baru

**Cara Kerja**:
1. Admin input: nama, email, phone
2. Sistem create user dengan status active
3. Emit WebSocket event ke semua admin
4. User baru muncul di list

---

#### **Edit User**

**Fungsi**: Admin edit data user

**Cara Kerja**:
1. Admin klik edit pada user
2. Update: nama, email, phone, status
3. Emit WebSocket event
4. Data terupdate di semua admin yang online

---

#### **Delete User**

**Fungsi**: Admin hapus user

**Cara Kerja**:
1. Admin klik delete
2. Konfirmasi
3. Delete dari database
4. Emit WebSocket event
5. User hilang dari list semua admin

---

#### **Toggle User Status**

**Fungsi**: Admin aktifkan/nonaktifkan user

**Cara Kerja**:
1. Admin toggle status (active/inactive)
2. Update di database
3. Emit WebSocket event
4. User yang inactive tidak bisa login

---

### 7.11 Chat History Management

#### **Save Chat History**

**Fungsi**: Otomatis menyimpan percakapan user

**Cara Kerja**:
1. Setiap kali user bertanya dan dapat jawaban, simpan ke database
2. Create chat history baru jika belum ada
3. Append messages ke chat yang sudah ada
4. Update timestamp

**Data yang Disimpan**:
- User email
- Judul chat (dari pertanyaan pertama)
- Semua messages (user dan bot)
- Timestamp setiap message
- Source (database/gemini/conversation)

---

#### **Load Chat History**

**Fungsi**: User dapat melihat dan melanjutkan chat sebelumnya

**Cara Kerja**:
1. Saat login, load semua chat history user
2. Tampilkan di sidebar dengan preview
3. User klik untuk load messages
4. User dapat melanjutkan conversation

---

#### **Delete Chat History**

**Fungsi**: User atau admin dapat hapus chat

**Cara Kerja**:
1. User/admin klik delete
2. Konfirmasi
3. Delete dari database (CASCADE ke messages)
4. Emit WebSocket event jika admin

---

### 7.12 Real-Time Features

#### **WebSocket Events**

**Fungsi**: Real-time updates tanpa refresh page

**Events yang Diimplementasikan**:

1. **processing**: Update progress saat query sedang diproses
   ```javascript
   { status: 'processing', message: 'Menganalisis pertanyaan...' }
   ```

2. **completed**: Notifikasi saat query selesai
   ```javascript
   { status: 'completed', result: {...} }
   ```

3. **error**: Notifikasi error
   ```javascript
   { status: 'error', error: 'Terjadi kesalahan...' }
   ```

4. **heartbeat**: Keep connection alive
   ```javascript
   { timestamp: 1234567890 }
   ```

5. **new_chat**: Chat baru dibuat (untuk admin)
   ```javascript
   { id: 123, user_email: 'user@email.com', judul: '...' }
   ```

6. **new_message**: Message baru (untuk admin)
   ```javascript
   { id: 456, chat_history_id: 123, peran: 'user', konten: '...' }
   ```

7. **user_added, user_updated, user_deleted**: User management events
   ```javascript
   { userId: 123, ... }
   ```

---

#### **Progress Updates**

**Fungsi**: Memberikan feedback real-time saat query sedang diproses

**Cara Kerja**:
1. Saat user bertanya, emit "processing" event
2. Update progress di setiap step:
   - "Menganalisis pertanyaan..."
   - "Mencari di database..."
   - "Memformat hasil..."
3. Emit "completed" saat selesai

**Manfaat**:
- User tahu sistem sedang bekerja
- Mengurangi anxiety saat waiting
- Better user experience

---

## 8. ALUR SISTEM (WORKFLOW)

### 8.1 Alur Registrasi User

```
[User buka halaman registrasi]
         ↓
[Input email dan password]
         ↓
[Klik "Kirim Kode"]
         ↓
[Backend generate OTP 6 digit]
         ↓
[Kirim OTP ke email via Nodemailer]
         ↓
[User cek email dan copy OTP]
         ↓
[Input OTP di form]
         ↓
[Klik "Verifikasi"]
         ↓
[Backend verify OTP]
    ↓           ↓
[Valid]     [Invalid]
    ↓           ↓
[Hash password] [Show error]
    ↓
[Create user di database]
    ↓
[Generate JWT token]
    ↓
[Return token ke frontend]
    ↓
[Save token di localStorage]
    ↓
[Redirect ke dashboard]
```

---

### 8.2 Alur Login User

```
[User buka halaman login]
         ↓
[Pilih metode login]
    ↓           ↓
[Email/Pass] [Google OAuth]
    ↓           ↓
[Input creds] [Google popup]
    ↓           ↓
[Submit]    [Authorize]
    ↓           ↓
[Backend verify] [Verify token]
    ↓           ↓
[Check password] [Check email terdaftar]
    ↓           ↓
[Generate JWT] [Generate JWT]
         ↓
[Return token]
         ↓
[Save di localStorage]
         ↓
[Redirect ke dashboard]
```

---

### 8.3 Alur Query Database (Detail)

```
[User ketik pertanyaan]
         ↓
[Klik Send atau Enter]
         ↓
[Frontend emit ke WebSocket dengan socketId]
         ↓
[Backend terima di /api/query]
         ↓
[Emit "processing" event]
         ↓
[ChatbotHandler.processMessage()]
         ↓
[Normalize slang (gak→tidak, yg→yang)]
         ↓
[Get conversation context (6 terakhir)]
         ↓
[Check guardrails (sensitive topics)]
    ↓           ↓
[Blocked]   [Pass]
    ↓           ↓
[Return]    [Continue]
         ↓
[Detect special intent?]
    ↓           ↓
[Yes]       [No]
    ↓           ↓
[Handle]    [Continue]
         ↓
[Check pagination/range request?]
    ↓           ↓
[Yes]       [No]
    ↓           ↓
[Handle]    [Continue]
         ↓
[AI Router: CONVERSATION or DATABASE_QUERY?]
    ↓                       ↓
[CONVERSATION]      [DATABASE_QUERY]
    ↓                       ↓
[AI generate]       [Get active databases]
[response]                  ↓
    ↓               [For each database:]
    ↓                       ↓
    ↓               [Get schema cache]
    ↓                       ↓
    ↓               [AI generate SQL]
    ↓                       ↓
    ↓               [Validate SQL (safe?)]
    ↓                       ↓
    ↓               [Execute query]
    ↓                       ↓
    ↓               [Get total count]
    ↓                       ↓
    ↓               [Collect results]
    ↓                       ↓
    ↓               [Multiple databases?]
    ↓                   ↓       ↓
    ↓               [Yes]     [No]
    ↓                   ↓       ↓
    ↓           [Ask user]  [Format]
    ↓           [to choose] [response]
    ↓                   ↓       ↓
    └───────────────────┴───────┘
                    ↓
        [Add to conversation context]
                    ↓
        [Save to learning system]
                    ↓
        [Emit "completed" event]
                    ↓
        [Return response to frontend]
                    ↓
        [Frontend display response]
                    ↓
        [Save to chat history]
```

---

### 8.4 Alur Import Database dari API

```
[Admin buka Database Management]
         ↓
[Klik "Import from API"]
         ↓
[Input API URL dan headers (optional)]
         ↓
[Klik "Preview"]
         ↓
[Backend fetch API]
         ↓
[Auto-detect format]
    ↓           ↓           ↓
[Array]    [Object]   [Nested]
    ↓           ↓           ↓
    └───────────┴───────────┘
                ↓
[Flatten nested objects]
                ↓
[Detect column types]
                ↓
[Show preview: columns, sample data, total records]
                ↓
[Admin review dan input database name]
                ↓
[Klik "Import"]
                ↓
[Backend create database]
                ↓
[Create table dengan auto-generated schema]
                ↓
[Insert data (chunked for large data)]
                ↓
[Save metadata ke api-databases.json]
                ↓
[Add to db-connections.json]
                ↓
[Show success message]
                ↓
[Database siap digunakan]
```

---

### 8.5 Alur Learning System

```
[User bertanya]
         ↓
[Query diproses]
         ↓
[Hasil ditemukan?]
    ↓           ↓
[Yes]       [No]
    ↓           ↓
[Success]   [Failed]
         ↓
[Query Learning System]
         ↓
[Extract keywords]
         ↓
[Normalize dengan synonym mapping]
         ↓
[Save query pattern dengan metadata:]
  - Query text
  - Database used
  - Success/failed
  - Timestamp
  - Frequency
         ↓
[Learning System V2 (User-Specific)]
         ↓
[Learn database preference untuk user ini]
         ↓
[Update confidence score]
         ↓
[Detect shortcut (jika frequency tinggi)]
         ↓
[Save learning data]
         ↓
[Next query akan lebih akurat]
```

---

### 8.6 Alur Voice Input

```
[User klik microphone button]
         ↓
[Browser request microphone permission]
         ↓
[User allow]
         ↓
[Start recording]
         ↓
[User bicara]
         ↓
[Stop recording (auto atau manual)]
         ↓
[Convert audio to blob]
         ↓
[Upload ke /api/voice-to-text]
         ↓
[Backend save temporary file]
         ↓
[Send to Deepgram API]
         ↓
[Deepgram transcribe (Nova-2, Indonesian)]
         ↓
[Return transcript + confidence score]
         ↓
[Delete temporary file]
         ↓
[Frontend receive transcript]
         ↓
[Auto-fill ke input box]
         ↓
[User review dan edit jika perlu]
         ↓
[Send query]
```

---


## 9. KEAMANAN DAN VALIDASI

### 9.1 Keamanan Autentikasi

#### **Password Security**
- **Hashing**: Password di-hash menggunakan bcrypt dengan 8 salt rounds
- **No Plain Text**: Password tidak pernah disimpan atau dikirim dalam plain text
- **Strong Password**: Validasi password minimal 6 karakter (dapat ditingkatkan)

#### **OTP Security**
- **Random Generation**: OTP 6 digit random menggunakan Math.random()
- **Expiry Time**: OTP expire dalam 5 menit
- **One-Time Use**: OTP hanya bisa digunakan sekali (flag `digunakan`)
- **Email Verification**: OTP dikirim ke email yang terdaftar

#### **JWT Token Security**
- **Secret Key**: JWT menggunakan secret key yang aman
- **Expiry**: Token expire dalam 30 hari
- **Stateless**: Tidak perlu session storage di server
- **Verification**: Setiap request verify token validity

#### **Google OAuth Security**
- **Token Verification**: Verify Google ID token dengan Google Auth Library
- **Client ID Validation**: Hanya accept token dari client ID yang terdaftar
- **Email Verification**: Cek apakah email sudah terdaftar sebelum login

---

### 9.2 Keamanan Database

#### **SQL Injection Prevention**
- **Prepared Statements**: Semua query menggunakan prepared statements
- **Query Validation**: Hanya SELECT query yang diizinkan
- **Keyword Blocking**: Block keywords berbahaya (UPDATE, DELETE, DROP, INSERT, ALTER, TRUNCATE, CREATE, GRANT, REVOKE)
- **Input Sanitization**: Clean dan validate input sebelum generate SQL

#### **Read-Only Access**
- Chatbot hanya bisa SELECT (read-only)
- Tidak bisa modify, delete, atau create data
- Mencegah data corruption atau loss

#### **Connection Security**
- **Connection Pooling**: Reuse connections untuk performa dan security
- **Timeout**: Query timeout 30 detik untuk mencegah long-running queries
- **Error Handling**: Error messages tidak expose sensitive info

---

### 9.3 Keamanan API

#### **CORS Configuration**
- **Whitelist Origins**: Hanya allow requests dari frontend yang terdaftar
- **Credentials**: Support credentials untuk cookie/token
- **Methods**: Hanya allow methods yang diperlukan (GET, POST, PUT, DELETE)

#### **Rate Limiting**
- **API Queue**: Rate limiting untuk AI API calls (800ms delay)
- **Prevent Spam**: Mencegah spam requests ke AI providers
- **Cost Control**: Mengontrol usage untuk free tier

#### **API Key Security**
- **Environment Variables**: API keys disimpan di .env file
- **Not in Code**: API keys tidak hardcoded di source code
- **Gitignore**: .env file di-gitignore untuk tidak ter-commit

---

### 9.4 Validasi Input

#### **User Input Validation**
- **Empty Check**: Validasi input tidak boleh kosong
- **Length Check**: Validasi panjang input (min/max)
- **Format Check**: Validasi format email, phone number
- **XSS Prevention**: Sanitize HTML tags dari input

#### **File Upload Validation**
- **File Size**: Max 10MB untuk audio, max 5MB untuk image
- **File Type**: Validasi file type (audio/*, image/*)
- **Virus Scan**: (Dapat ditambahkan) Scan file untuk malware

#### **Query Validation**
- **Intent Detection**: Validasi apakah query valid
- **Guardrails**: Block pertanyaan sensitif atau berbahaya
- **Context Check**: Validasi context conversation

---

### 9.5 Keamanan Data

#### **Data Privacy**
- **User Isolation**: Setiap user hanya bisa akses data mereka sendiri
- **Admin Access**: Admin bisa akses semua data untuk monitoring
- **No Sensitive Data**: Tidak menyimpan data sensitif seperti KTP, credit card

#### **Data Encryption**
- **HTTPS**: (Production) Semua komunikasi via HTTPS
- **Password Hashing**: Password di-hash sebelum disimpan
- **Token Encryption**: JWT token ter-encrypt

#### **Data Backup**
- **Regular Backup**: (Recommended) Backup database secara regular
- **Point-in-Time Recovery**: MySQL support PITR untuk disaster recovery

---

### 9.6 Monitoring dan Logging

#### **Error Logging**
- **Debug Files**: Error dan SQL query di-log ke file untuk debugging
- **Console Logging**: Important events di-log ke console
- **Error Tracking**: Track error patterns untuk improvement

#### **Activity Monitoring**
- **Query Logging**: Semua query di-log untuk analytics
- **User Activity**: Track user activity untuk security monitoring
- **API Usage**: Monitor AI API usage untuk cost control

---

## 10. KELEBIHAN DAN KEKURANGAN SISTEM

### 10.1 Kelebihan Sistem

#### **1. User-Friendly Interface**
- ✅ Tidak perlu pengetahuan SQL atau teknis
- ✅ Pertanyaan dalam bahasa natural (sehari-hari)
- ✅ Response yang mudah dibaca dan dipahami
- ✅ Voice input untuk kemudahan

#### **2. Intelligent dan Adaptive**
- ✅ AI-powered dengan multiple providers
- ✅ Learning system yang improve seiring waktu
- ✅ Context-aware conversation
- ✅ User-specific preferences

#### **3. Multi-Database Support**
- ✅ Dapat query multiple databases sekaligus
- ✅ Auto-detect database yang relevan
- ✅ Conflict resolution untuk multiple results
- ✅ Easy database management

#### **4. Real-Time dan Responsive**
- ✅ WebSocket untuk real-time updates
- ✅ Progress indicator untuk long queries
- ✅ Fast response time (< 5 detik untuk most queries)
- ✅ No page refresh needed

#### **5. Comprehensive Features**
- ✅ Pagination untuk large datasets
- ✅ Detail view untuk single records
- ✅ Duplicate detection
- ✅ Anomaly detection
- ✅ Data quality check
- ✅ Strategic recommendations

#### **6. Secure dan Reliable**
- ✅ Multiple authentication methods
- ✅ SQL injection prevention
- ✅ Read-only database access
- ✅ OTP verification
- ✅ JWT token security

#### **7. Scalable Architecture**
- ✅ Modular code structure
- ✅ Connection pooling
- ✅ Multi-provider AI (fallback system)
- ✅ Horizontal scaling ready

#### **8. Cost-Effective**
- ✅ Menggunakan free tier AI providers
- ✅ Open-source technologies
- ✅ No licensing cost
- ✅ Low infrastructure cost

#### **9. Good Developer Experience**
- ✅ Clean code structure
- ✅ Comprehensive documentation
- ✅ Easy to maintain
- ✅ Modular dan extensible

#### **10. Analytics dan Insights**
- ✅ Query pattern analytics
- ✅ User behavior tracking
- ✅ Database usage statistics
- ✅ Learning system metrics

---

### 10.2 Kekurangan Sistem

#### **1. Dependency pada AI Provider**
- ❌ Jika semua AI providers down, sistem tidak bisa generate SQL
- ❌ Rate limit dari free tier dapat membatasi usage
- ❌ Perubahan API dari provider dapat break system
- **Mitigasi**: Multiple providers dengan fallback, caching untuk common queries

#### **2. Akurasi SQL Generation**
- ❌ Tidak 100% akurat untuk query yang sangat kompleks
- ❌ Dapat salah interpret pertanyaan yang ambigu
- ❌ Butuh schema yang lengkap untuk akurasi tinggi
- **Mitigasi**: Learning system, user feedback, schema caching

#### **3. Performance untuk Large Data**
- ❌ Query ke database besar dapat lambat
- ❌ Formatting response untuk ribuan records butuh waktu
- ❌ WebSocket dapat timeout untuk query sangat lama
- **Mitigasi**: Pagination, query timeout, indexing database

#### **4. Limited Natural Language Understanding**
- ❌ Hanya support bahasa Indonesia dan Inggris
- ❌ Tidak bisa handle typo yang parah
- ❌ Kesulitan dengan pertanyaan yang sangat panjang atau kompleks
- **Mitigasi**: Synonym mapping, slang normalization, context awareness

#### **5. Security Concerns**
- ❌ API keys di .env file dapat ter-expose jika tidak hati-hati
- ❌ WebSocket connection dapat di-hijack jika tidak secure
- ❌ Brute force attack pada login (belum ada rate limiting)
- **Mitigasi**: Environment variables, HTTPS, rate limiting (future)

#### **6. Scalability Limitations**
- ❌ Single server dapat bottleneck untuk banyak concurrent users
- ❌ Database connection pool terbatas
- ❌ Learning data dapat membesar seiring waktu
- **Mitigasi**: Load balancing, database replication, data cleanup

#### **7. User Experience Issues**
- ❌ Tidak ada autocomplete atau suggestion saat mengetik
- ❌ Tidak ada visual query builder untuk user yang prefer GUI
- ❌ Mobile experience belum optimal
- **Mitigasi**: Future improvements

#### **8. Monitoring dan Debugging**
- ❌ Belum ada dashboard untuk monitoring system health
- ❌ Error tracking masih manual via log files
- ❌ Tidak ada alerting untuk critical errors
- **Mitigasi**: Implement monitoring tools (future)

#### **9. Data Privacy**
- ❌ Chat history disimpan di database (privacy concern)
- ❌ Belum ada fitur untuk export atau delete all user data
- ❌ Tidak ada encryption untuk chat content
- **Mitigasi**: Add data export/delete features, encryption (future)

#### **10. Documentation**
- ❌ Belum ada API documentation (Swagger/OpenAPI)
- ❌ Belum ada user manual yang lengkap
- ❌ Komentar kode masih bisa ditingkatkan
- **Mitigasi**: Create comprehensive documentation

---

## 11. KESIMPULAN

### 11.1 Ringkasan Proyek

Sistem Chatbot AI untuk Manajemen Data Kekayaan Intelektual adalah solusi inovatif yang berhasil menjembatani gap antara pengguna non-teknis dengan database kompleks. Dengan memanfaatkan teknologi Artificial Intelligence dan Natural Language Processing, sistem ini memungkinkan pengguna untuk mengakses dan menganalisis data KI hanya dengan bertanya menggunakan bahasa sehari-hari.

**Pencapaian Utama:**

1. **Natural Language Interface yang Powerful**
   - Berhasil mengkonversi pertanyaan bahasa natural menjadi SQL query dengan akurasi tinggi
   - Support untuk berbagai variasi pertanyaan dan intent
   - Context-aware conversation untuk pertanyaan lanjutan

2. **Multi-Database Architecture**
   - Sistem dapat mengakses dan mencari data dari multiple databases secara bersamaan
   - Auto-detection database yang relevan
   - Conflict resolution yang intelligent

3. **Learning System yang Adaptive**
   - Sistem belajar dari pola pertanyaan user
   - User-specific preferences dan shortcuts
   - Continuous improvement dari feedback

4. **Comprehensive Feature Set**
   - Autentikasi multi-method (Email/Password, Google OAuth)
   - Voice input support
   - Real-time updates via WebSocket
   - Advanced analytics (duplicate detection, anomaly detection, dll)
   - User dan database management untuk admin

5. **Production-Ready Architecture**
   - Secure dengan multiple layers of security
   - Scalable dengan modular design
   - Reliable dengan fallback mechanisms
   - Well-documented dan maintainable

**Impact:**

- **Efisiensi**: Mengurangi waktu pencarian data dari 10-15 menit menjadi 5-10 detik
- **Aksesibilitas**: Demokratisasi akses data untuk semua staff tanpa training SQL
- **Kualitas**: Deteksi otomatis untuk anomali dan data quality issues
- **Produktivitas**: Staff dapat fokus pada analisis daripada query manual

---

### 11.2 Pembelajaran yang Didapat

**Teknis:**
- Integrasi AI/LLM untuk real-world applications
- Natural Language Processing dan SQL generation
- WebSocket untuk real-time communication
- Multi-database architecture dan connection pooling
- Security best practices (authentication, authorization, SQL injection prevention)
- Error handling dan fallback mechanisms

**Non-Teknis:**
- Requirement gathering dan stakeholder communication
- Problem-solving untuk complex technical challenges
- Time management dalam project development
- Documentation dan knowledge transfer
- User experience design considerations

---

### 11.3 Kontribusi Proyek

**Untuk Institusi:**
- Meningkatkan efisiensi operasional dalam manajemen data KI
- Mengurangi dependency pada tim IT untuk query data
- Meningkatkan data literacy di organisasi
- Menyediakan insights untuk pengambilan keputusan strategis

**Untuk Pengembangan Teknologi:**
- Demonstrasi praktis penggunaan AI untuk database querying
- Implementasi learning system yang adaptive
- Best practices untuk multi-database architecture
- Open-source contribution potential

**Untuk Pendidikan:**
- Studi kasus untuk pembelajaran AI integration
- Reference implementation untuk similar projects
- Documentation yang dapat digunakan untuk teaching material

---

## 12. SARAN PENGEMBANGAN

### 12.1 Short-Term Improvements (1-3 Bulan)

#### **1. Enhanced Security**
- Implement rate limiting untuk prevent brute force attacks
- Add CAPTCHA untuk login dan registrasi
- Implement refresh token mechanism
- Add IP whitelisting untuk admin access
- Encrypt chat history content

#### **2. Better User Experience**
- Add autocomplete/suggestion saat mengetik
- Implement query templates untuk common questions
- Add visual query builder sebagai alternative
- Improve mobile responsive design
- Add dark mode

#### **3. Performance Optimization**
- Implement Redis caching untuk common queries
- Add database indexing untuk faster queries
- Optimize SQL generation untuk complex queries
- Implement query result caching
- Add lazy loading untuk large datasets

#### **4. Monitoring dan Analytics**
- Implement system health dashboard
- Add error tracking dengan Sentry atau similar
- Create analytics dashboard untuk admin
- Add alerting untuk critical errors
- Implement usage metrics dan reporting

#### **5. Documentation**
- Create API documentation dengan Swagger/OpenAPI
- Write comprehensive user manual
- Add inline code comments
- Create video tutorials
- Write deployment guide

---

### 12.2 Medium-Term Enhancements (3-6 Bulan)

#### **1. Advanced AI Features**
- Implement RAG (Retrieval-Augmented Generation) untuk better context
- Add support untuk chart/graph generation
- Implement predictive analytics
- Add natural language report generation
- Support untuk complex multi-step queries

#### **2. Collaboration Features**
- Add sharing untuk chat sessions
- Implement team workspaces
- Add commenting pada query results
- Create collaborative query building
- Add export results ke various formats (PDF, Excel, CSV)

#### **3. Integration Capabilities**
- REST API untuk external applications
- Webhook support untuk notifications
- Integration dengan BI tools (Tableau, Power BI)
- Email report scheduling
- Slack/Teams integration

#### **4. Advanced Database Features**
- Support untuk NoSQL databases (MongoDB, etc)
- Add database schema visualization
- Implement query optimization suggestions
- Add data lineage tracking
- Support untuk database migrations

#### **5. Multilingual Support**
- Add support untuk bahasa daerah
- Improve English language support
- Add language auto-detection
- Implement translation untuk results

---

### 12.3 Long-Term Vision (6-12 Bulan)

#### **1. AI Model Fine-Tuning**
- Fine-tune custom model untuk SQL generation
- Train model dengan domain-specific data
- Implement on-premise AI model untuk privacy
- Add support untuk custom AI models

#### **2. Enterprise Features**
- Multi-tenancy support
- Advanced role-based access control (RBAC)
- Audit logging dan compliance
- SLA monitoring
- Enterprise SSO integration (SAML, LDAP)

#### **3. Advanced Analytics**
- Implement machine learning untuk anomaly detection
- Add predictive modeling
- Create recommendation engine
- Implement trend analysis
- Add forecasting capabilities

#### **4. Platform Expansion**
- Mobile apps (iOS, Android)
- Desktop application (Electron)
- Browser extension
- API marketplace
- Plugin system untuk extensibility

#### **5. Community dan Ecosystem**
- Open-source release
- Create plugin marketplace
- Build developer community
- Add template library
- Create certification program

---

### 12.4 Rekomendasi Prioritas

**High Priority (Harus Segera):**
1. Rate limiting dan security enhancements
2. Performance optimization untuk large datasets
3. Error monitoring dan alerting
4. API documentation
5. Mobile responsive improvements

**Medium Priority (Penting):**
1. Caching implementation
2. Advanced analytics dashboard
3. Export functionality
4. Query templates
5. Multilingual support

**Low Priority (Nice to Have):**
1. Visual query builder
2. Dark mode
3. Collaboration features
4. Integration dengan external tools
5. Mobile apps

---

### 12.5 Teknologi yang Disarankan untuk Upgrade

**Backend:**
- **NestJS**: Untuk better structure dan TypeScript support
- **GraphQL**: Untuk flexible API queries
- **Redis**: Untuk caching dan session management
- **RabbitMQ**: Untuk message queuing
- **Docker**: Untuk containerization

**Frontend:**
- **React/Vue**: Untuk better UI framework
- **TypeScript**: Untuk type safety
- **TailwindCSS**: Untuk better styling
- **React Query**: Untuk data fetching dan caching

**Database:**
- **PostgreSQL**: Untuk better JSON support dan advanced features
- **Elasticsearch**: Untuk full-text search
- **TimescaleDB**: Untuk time-series data

**Monitoring:**
- **Prometheus + Grafana**: Untuk metrics dan visualization
- **Sentry**: Untuk error tracking
- **ELK Stack**: Untuk log management

**AI/ML:**
- **LangChain**: Untuk better LLM orchestration
- **Vector Database (Pinecone/Weaviate)**: Untuk semantic search
- **Custom Fine-Tuned Model**: Untuk domain-specific tasks

---

## PENUTUP

Proyek Sistem Chatbot AI untuk Manajemen Data Kekayaan Intelektual ini merupakan implementasi nyata dari teknologi Artificial Intelligence untuk memecahkan masalah real-world dalam akses dan analisis data. Dengan menggabungkan Natural Language Processing, database management, dan user experience design, sistem ini berhasil menciptakan solusi yang user-friendly, powerful, dan scalable.

Dokumentasi ini disusun untuk memberikan pemahaman komprehensif tentang sistem, mulai dari konsep, implementasi, hingga rekomendasi pengembangan. Diharapkan dokumentasi ini dapat menjadi referensi yang berguna untuk pengembangan lebih lanjut, pembelajaran, dan implementasi sistem serupa di masa depan.

**Terima kasih kepada:**
- Pembimbing PKL yang telah memberikan guidance
- Tim IT yang telah menyediakan infrastruktur
- Semua pihak yang telah mendukung proyek ini

---

**Disusun oleh:** [Nama Siswa PKL]  
**Instansi:** [Nama Instansi]  
**Periode PKL:** [Tanggal Mulai] - [Tanggal Selesai]  
**Tanggal Dokumentasi:** [Tanggal]

---

## LAMPIRAN

### A. Contoh Pertanyaan yang Dapat Dijawab Sistem

**Pertanyaan Dasar:**
- "Berapa total KI yang ada?"
- "Tampilkan paten terbaru"
- "Daftar hak cipta tahun 2023"
- "Siapa inventor dengan KI terbanyak?"

**Pertanyaan dengan Filter:**
- "Paten tahun 2023 yang sudah tersertifikasi"
- "KI dari fakultas FMIPA"
- "Inventor dari luar ITB"
- "KI yang statusnya masih dalam proses"

**Pertanyaan Analisis:**
- "Breakdown KI per jenis"
- "Tren pendaftaran KI per tahun"
- "Fakultas dengan KI terbanyak"
- "KI yang paling lama menunggu persetujuan"

**Pertanyaan Advanced:**
- "Ada duplikat judul?"
- "KI tanpa inventor"
- "Anomali data apa yang ada?"
- "KI yang layak dikomersialisasikan"

---

### B. Struktur Database

**Database: chatbot_db**

```sql
-- Table: users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  kata_sandi VARCHAR(255) NOT NULL,
  nama VARCHAR(255),
  telepon VARCHAR(20),
  foto_profil VARCHAR(255),
  status ENUM('active', 'inactive') DEFAULT 'active',
  google_id VARCHAR(255),
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: kode_otp
CREATE TABLE kode_otp (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  kode VARCHAR(6) NOT NULL,
  tipe ENUM('signup', 'forgot') NOT NULL,
  digunakan BOOLEAN DEFAULT FALSE,
  kadaluarsa_pada DATETIME NOT NULL,
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: riwayat_chat
CREATE TABLE riwayat_chat (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  judul VARCHAR(255) NOT NULL,
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Table: pesan_chat
CREATE TABLE pesan_chat (
  id INT AUTO_INCREMENT PRIMARY KEY,
  riwayat_chat_id INT NOT NULL,
  peran ENUM('user', 'assistant') NOT NULL,
  konten TEXT NOT NULL,
  sumber VARCHAR(50),
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (riwayat_chat_id) REFERENCES riwayat_chat(id) ON DELETE CASCADE
);
```

---

### C. Environment Variables Template

```env
# Deepgram API Key untuk Voice-to-Text
DEEPGRAM_API_KEY=your_deepgram_api_key_here

# Groq API Key (RECOMMENDED - Super Fast & Free)
GROQ_API_KEY=your_groq_api_key_here

# Gemini API Key (Backup - Generous Free Tier)
GEMINI_API_KEY=your_gemini_api_key_here

# Mistral AI API Key (Backup - Fast & Quality)
MISTRAL_API_KEY=your_mistral_api_key_here

# Cohere API Key (Backup - 100 req/min)
COHERE_API_KEY=your_cohere_api_key_here

# Hugging Face API Key (Backup - Unlimited)
HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# OpenRouter API Key (Backup)
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

---

### D. Cara Instalasi dan Menjalankan Aplikasi

**Prerequisites:**
- Node.js v18 atau lebih tinggi
- MySQL 8.0 atau lebih tinggi
- npm atau yarn

**Langkah Instalasi:**

1. Clone repository
```bash
git clone [repository-url]
cd chatbot-backend
```

2. Install dependencies
```bash
npm install
```

3. Setup database
```bash
# Buat database chatbot_db
mysql -u root -p
CREATE DATABASE chatbot_db;

# Import schema (jika ada file SQL)
mysql -u root -p chatbot_db < schema.sql
```

4. Setup environment variables
```bash
# Copy .env.example ke .env
cp .env.example .env

# Edit .env dan isi API keys
nano .env
```

5. Jalankan aplikasi
```bash
npm start
```

6. Akses aplikasi
```
Backend: http://localhost:3000
Frontend: http://localhost:5173 (jika ada)
```

---

### E. Troubleshooting Common Issues

**Issue 1: "Cannot connect to database"**
- Cek apakah MySQL sudah running
- Cek credentials di db-connections.json
- Cek firewall settings

**Issue 2: "AI API error"**
- Cek apakah API key valid
- Cek quota/rate limit
- Coba provider lain

**Issue 3: "WebSocket connection failed"**
- Cek CORS settings
- Cek firewall
- Cek browser console untuk error details

**Issue 4: "OTP email not received"**
- Cek spam folder
- Cek email credentials di auth.js
- Cek Gmail app password

**Issue 5: "Slow query performance"**
- Add database indexes
- Optimize SQL query
- Implement caching

---

**END OF DOCUMENTATION**
