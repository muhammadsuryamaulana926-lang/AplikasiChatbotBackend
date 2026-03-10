const ChatbotHandler = require('./chatbot-logic');

async function testKIQueries() {
  const chatbot = new ChatbotHandler();
  
  const testQueries = [
    "Saya mau nanya tentang KI",
    "Paten",
    "Hak Cipta",
    "Ada database apa saja"
  ];

  console.log('🧪 Testing KI Queries...\n');

  for (const query of testQueries) {
    console.log(`\n📝 Query: "${query}"`);
    console.log('⏳ Processing...');
    
    try {
      const result = await chatbot.processMessage(query, 'test-user');
      console.log('✅ Result:', result.type);
      console.log('📄 Message:', result.message.substring(0, 200) + '...');
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
    
    console.log('─'.repeat(80));
  }
}

testKIQueries().then(() => {
  console.log('\n✅ Test completed!');
  process.exit(0);
}).catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
