require('dotenv').config();
const fs = require('fs');
const ChatbotHandler = require('./chatbot-logic');
const chatbot = new ChatbotHandler();

async function test() {
    try {
        const res = await chatbot.processMessage('saya mau liat data ki paten');
        fs.writeFileSync('trace_paten.txt', JSON.stringify(res, null, 2), 'utf8');
    } catch (e) {
        fs.writeFileSync('trace_paten.txt', String(e.stack || e), 'utf8');
    }
}
test();
