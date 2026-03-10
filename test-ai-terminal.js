require('dotenv').config();
const ChatbotHandler = require('./chatbot-logic');

async function runTests() {
    const handler = new ChatbotHandler();
    const testCases = [
        "data ki 2018 ada berapa?",
        "tampilkan ki yang 2020 dan ada berapa?",
        "cari data tentang batik dan tampilkan",
        "siapa saja inventor dari fakultas FTTM?",
        "tampilkan 5 paten terbaru",
        "berapa jumlah hak cipta di tahun 2019?"
    ];

    console.log("🚀 MEMULAI TEST AUTOMASI AI CHATBOT (TERMINAL)\n");
    console.log("==================================================\n");

    for (const q of testCases) {
        console.log(`💬 USER: "${q}"`);
        console.log(`⏳ AI Sedang berpikir...`);

        try {
            const result = await handler.processMessage(q, "test-user-1");

            console.log(`\n🤖 RESPON AI:\n`);
            console.log(result.message);

            if (result.data) {
                console.log(`\n📊 DATA DITEMUKAN: ${result.data.length} baris`);
            }

            console.log("\n--------------------------------------------------\n");
        } catch (err) {
            console.error(`❌ ERROR SAAT TESTING:`, err.message);
        }
    }

    console.log("✅ SEMUA TEST SELESAI.");
    process.exit(0);
}

runTests();
