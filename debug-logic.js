const ChatbotHandler = require('./chatbot-logic');
const chatbot = new ChatbotHandler();

async function test() {
    try {
        console.log('Testing "data ki"...');
        const result = await chatbot.processMessage('data ki', 'test-user');
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (e) {
        console.error('CRITICAL ERROR:', e);
    }
}

test();
