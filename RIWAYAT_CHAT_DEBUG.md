# 🔍 Debugging Riwayat Chat - Panduan Lengkap

## Masalah
Riwayat pesan di frontend tidak muncul meskipun backend sudah ada endpoint.

## Penyebab Kemungkinan

### 1. **Database Kosong** ❌
Belum ada data chat yang tersimpan di database `chatbot_db`.

### 2. **Email User Tidak Cocok** ❌
Email yang digunakan untuk login berbeda dengan email yang tersimpan di riwayat chat.

### 3. **Endpoint Tidak Terpanggil** ❌
Frontend tidak memanggil endpoint `/api/chat/history/:email`.

## Solusi & Cara Cek

### ✅ Langkah 1: Cek Database
```sql
-- Cek apakah ada data di tabel riwayat_chat
SELECT * FROM chatbot_db.riwayat_chat;

-- Cek apakah ada pesan di tabel pesan_chat
SELECT * FROM chatbot_db.pesan_chat;

-- Cek riwayat untuk email tertentu
SELECT * FROM chatbot_db.riwayat_chat WHERE user_email = 'email@example.com';
```

### ✅ Langkah 2: Cek Log Backend
Setelah update, backend akan menampilkan log seperti ini:
```
📥 Loading chat history for email: user@example.com
✅ Found 3 chat sessions for user@example.com
  Chat #1: "Halo, apa kabar?" - 4 messages
  Chat #2: "Tampilkan data mahasiswa" - 6 messages
  Chat #3: "Berapa jumlah dosen?" - 2 messages
📤 Sending 3 chat sessions to frontend
```

Jika tidak ada log ini, berarti:
- Frontend tidak memanggil endpoint
- Email user salah
- Backend tidak berjalan

### ✅ Langkah 3: Test Endpoint Manual
```bash
# Test dengan curl atau Postman
curl -X GET "http://localhost:3000/api/chat/history/user@example.com" \
  -H "ngrok-skip-browser-warning: true"
```

Response yang diharapkan:
```json
{
  "success": true,
  "chatHistory": [
    {
      "id": "session_1",
      "title": "Halo, apa kabar?",
      "preview": "Halo, apa kabar?...",
      "timestamp": "2025-01-20T10:30:00.000Z",
      "unread": false,
      "messages": [...]
    }
  ]
}
```

### ✅ Langkah 4: Cek Frontend Console
Buka DevTools di browser atau React Native Debugger, cari log:
```
📥 Loading chat history for: user@example.com
📦 Chat history response: {success: true, chatHistory: [...]}
✅ Found 3 chat sessions
```

Jika tidak ada log, berarti `loadChatHistory()` tidak dipanggil.

## Cara Memastikan Data Tersimpan

### 1. Kirim Pesan di Chat
- Buka aplikasi frontend
- Login dengan email Anda
- Kirim beberapa pesan ke chatbot
- Pesan akan otomatis tersimpan ke database

### 2. Cek Apakah Tersimpan
```sql
-- Cek data terbaru
SELECT 
  rc.id,
  rc.user_email,
  rc.judul,
  COUNT(pc.id) as jumlah_pesan,
  rc.dibuat_pada
FROM riwayat_chat rc
LEFT JOIN pesan_chat pc ON rc.id = pc.riwayat_chat_id
GROUP BY rc.id
ORDER BY rc.dibuat_pada DESC;
```

## Troubleshooting

### ❌ Masalah: "No user email found"
**Solusi:**
- Pastikan user sudah login
- Cek AsyncStorage: `await AsyncStorage.getItem("userEmail")`
- Re-login jika perlu

### ❌ Masalah: "Found 0 chat sessions"
**Solusi:**
- Kirim pesan baru di chat
- Cek apakah `autoSaveToHistory()` dipanggil
- Cek log backend saat kirim pesan

### ❌ Masalah: Frontend tidak load history
**Solusi:**
- Cek apakah `loadChatHistory()` dipanggil di `useEffect`
- Cek network tab di DevTools
- Pastikan API_CONFIG.BACKEND_URL benar

### ❌ Masalah: Data ada tapi tidak muncul
**Solusi:**
- Cek format response dari backend
- Cek apakah `setChatHistory()` dipanggil
- Restart aplikasi frontend

## Struktur Database

```sql
-- Tabel riwayat_chat
CREATE TABLE riwayat_chat (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  judul VARCHAR(255) NOT NULL,
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel pesan_chat
CREATE TABLE pesan_chat (
  id INT AUTO_INCREMENT PRIMARY KEY,
  riwayat_chat_id INT NOT NULL,
  peran ENUM('user', 'assistant') NOT NULL,
  konten TEXT NOT NULL,
  sumber VARCHAR(50) DEFAULT 'gemini',
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (riwayat_chat_id) REFERENCES riwayat_chat(id) ON DELETE CASCADE
);
```

## Endpoint API

### GET `/api/chat/history/:email`
Mengambil semua riwayat chat untuk user tertentu.

**Response:**
```json
{
  "success": true,
  "chatHistory": [
    {
      "id": "session_1",
      "title": "Judul Chat",
      "preview": "Preview pesan...",
      "timestamp": "2025-01-20T10:30:00.000Z",
      "unread": false,
      "messages": [
        {
          "id": "user_1_0",
          "text": "Halo",
          "sender": "user",
          "timestamp": "2025-01-20T10:30:00.000Z"
        }
      ]
    }
  ]
}
```

### POST `/api/chat/save`
Menyimpan chat baru.

### PUT `/api/chat/update`
Update chat yang sudah ada dengan pesan baru.

## Kesimpulan

Setelah update ini, backend akan menampilkan log lengkap untuk membantu debugging. Jika masih tidak muncul:

1. ✅ Cek log backend - apakah endpoint dipanggil?
2. ✅ Cek database - apakah ada data?
3. ✅ Cek frontend console - apakah response diterima?
4. ✅ Kirim pesan baru untuk test

**Jika semua sudah benar tapi masih tidak muncul, kemungkinan besar database masih kosong. Kirim beberapa pesan untuk membuat data baru.**
