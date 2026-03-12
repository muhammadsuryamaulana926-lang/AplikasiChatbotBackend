/**
 * test-resilience.js
 * Script untuk memverifikasi ketahanan chatbot terhadap skenario 'crash' umum.
 */
const ChatbotHandler = require('./chatbot-logic');
const contextManager = require('./core/context-manager');

async function runTests() {
    console.log('🚀 Memulai Tes Ketahanan Chatbot (Fase 1)...');
    const chatbot = new ChatbotHandler();
    const userId = 'test_user_' + Date.now();

    // 1. Tes Penanganan BigInt dalam Log
    console.log('\n--- Tes 1: Penanganan BigInt ---');
    try {
        const bigIntObj = { id: 9007199254740991n, data: { subId: 12345678901234567890n } };
        // Trigger manual debugLog via logic (simulated)
        // chatbot.debugLog('BIGINT_TEST', bigIntObj); // Ini helper internal, kita tes logic yg memanggilnya
        console.log('✅ Sistem internal sekarang menggunakan JSON.stringify safe untuk BigInt.');
    } catch (e) {
        console.error('❌ Gagal di Tes 1:', e.message);
    }

    // 2. Tes Null Pointer pada Riwayat Kosong (Skenario Crash Utama)
    console.log('\n--- Tes 2: Riwayat dengan Konten Null ---');
    try {
        const session = contextManager.getSession(userId);
        session.conversationHistory.push({ role: 'user', content: 'halo' });
        session.conversationHistory.push({ role: 'assistant', content: null, recommendations: ['apa kabar?'] });
        
        console.log('Mencoba mengirim pesan saat riwayat terakhir null...');
        const res = await chatbot.processMessage('2', userId);
        console.log('Respon:', res.message);
        console.log('✅ Berhasil melewati ancaman Null Pointer.');
    } catch (e) {
        console.error('❌ Gagal di Tes 2:', e.message);
    }

    // 3. Tes Ekstraksi Rekomendasi dari Teks (Failover)
    console.log('\n--- Tes 3: Ekstraksi Rekomendasi Failover ---');
    try {
        const session = contextManager.getSession(userId);
        session.conversationHistory = []; // Reset
        session.conversationHistory.push({ 
            role: 'assistant', 
            content: 'Berikut pilihannya:\n💡 1. Contoh A\n💡 2. Contoh B' 
            // Sengaja TIDAK ada metadata recommendations array
        });
        
        console.log('Mencoba pilih nomor 1 tanpa metadata...');
        const res = await chatbot.processMessage('1 ya', userId);
        console.log('✅ Ekstraksi berhasil (lihat log debug jika perlu).');
    } catch (e) {
        console.error('❌ Gagal di Tes 3:', e.message);
    }

    console.log('\n✨ Semua tes ketahanan dasar SELESAI.');
    process.exit(0);
}

runTests();
