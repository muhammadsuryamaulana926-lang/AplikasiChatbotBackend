-- ============================================
-- SCRIPT RENAME TABEL CHATBOT_DB
-- ============================================
-- Tujuan: 
--   riwayat_chat -> pesan_chat
--   pesan_chat -> pesan_chat_detail
-- ============================================

USE chatbot_db;

-- Rename tabel (urutan penting!)
RENAME TABLE pesan_chat TO pesan_chat_detail;
RENAME TABLE riwayat_chat TO pesan_chat;

-- Verifikasi hasil
SHOW TABLES;

-- Cek jumlah data
SELECT 'pesan_chat' as tabel, COUNT(*) as jumlah_data FROM pesan_chat
UNION ALL
SELECT 'pesan_chat_detail' as tabel, COUNT(*) as jumlah_data FROM pesan_chat_detail;

-- Cek struktur tabel
DESCRIBE pesan_chat;
DESCRIBE pesan_chat_detail;
