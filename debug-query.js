require('dotenv').config();
const ChatbotHandler = require('./chatbot-logic');

async function debugQuery() {
    const handler = new ChatbotHandler();
    console.log("Testing: 'data ki 2019 apa saja'");
    const result = await handler.processMessage("data ki 2019 apa saja", "debug-user");
    console.log("\n--- AI RESPONSE ---");
    console.log(result.message);
    if (result.data) console.log("\nData count in result:", result.data.length);
}

debugQuery().catch(console.error);
