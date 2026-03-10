const ChatbotHandler = require('./chatbot-logic');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const handler = new ChatbotHandler();
const userId = "manual_test_user";
let testResults = [];
let currentCategory = "";

const categories = {
  "1": "KATEGORI 1: SQL KOMPLEKS & AGREGASI",
  "2": "KATEGORI 2: PENCARIAN AMBIGU & CONTEXT",
  "3": "KATEGORI 3: PERTANYAAN JEBAKAN / EDGE CASE",
  "4": "KATEGORI 4: ANALISIS & INSIGHT",
  "5": "KATEGORI 5: MULTI-STEP & FOLLOW-UP CHAIN",
  "6": "KATEGORI 6: PERTANYAAN GABUNGAN / KOMPLEKS"
};

function showMenu() {
  console.log('\n' + '='.repeat(80));
  console.log('🤖 CHATBOT TEST MANUAL');
  console.log('='.repeat(80));
  console.log('\nPilih kategori test:');
  Object.entries(categories).forEach(([key, value]) => {
    console.log(`  ${key}. ${value}`);
  });
  console.log('\n  s. Simpan hasil test');
  console.log('  q. Keluar');
  console.log('='.repeat(80));
}

function askQuestion(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function testQuestion(question) {
  console.log(`\n${'─'.repeat(80)}`);
  console.log(`❓ ${question}`);
  console.log('─'.repeat(80));
  
  try {
    const startTime = Date.now();
    const response = await handler.processMessage(question, userId);
    const duration = Date.now() - startTime;
    
    const answer = response.message || JSON.stringify(response.data) || 'No response';
    
    console.log(`\n✅ Jawaban:\n${answer}`);
    console.log(`\n⏱️  Waktu: ${duration}ms`);
    
    // Save result
    testResults.push({
      category: currentCategory,
      question,
      answer,
      duration,
      timestamp: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    testResults.push({
      category: currentCategory,
      question,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    return false;
  }
}

function saveResults() {
  if (testResults.length === 0) {
    console.log('\n⚠️  Tidak ada hasil untuk disimpan.');
    return;
  }
  
  const outputPath = path.join(__dirname, 'manual-test-results.md');
  
  let markdown = `# Hasil Test Manual Chatbot KI ITB\n\n`;
  markdown += `**Tanggal:** ${new Date().toLocaleString('id-ID')}\n`;
  markdown += `**Total Pertanyaan:** ${testResults.length}\n\n`;
  
  // Group by category
  const grouped = {};
  testResults.forEach(result => {
    if (!grouped[result.category]) grouped[result.category] = [];
    grouped[result.category].push(result);
  });
  
  Object.entries(grouped).forEach(([category, results]) => {
    markdown += `\n## ${category}\n\n`;
    results.forEach((result, i) => {
      markdown += `### ${i + 1}. ${result.question}\n\n`;
      if (result.error) {
        markdown += `**Error:** ${result.error}\n\n`;
      } else {
        markdown += `**Jawaban:**\n${result.answer}\n\n`;
        markdown += `*Waktu: ${result.duration}ms*\n\n`;
      }
    });
  });
  
  fs.writeFileSync(outputPath, markdown, 'utf8');
  console.log(`\n✅ Hasil disimpan di: ${outputPath}`);
}

async function main() {
  console.log('\n🚀 Selamat datang di Chatbot Test Manual!\n');
  
  while (true) {
    showMenu();
    const choice = await askQuestion('\nPilihan Anda: ');
    
    if (choice === 'q') {
      console.log('\n👋 Terima kasih! Sampai jumpa.\n');
      rl.close();
      process.exit(0);
    }
    
    if (choice === 's') {
      saveResults();
      continue;
    }
    
    if (categories[choice]) {
      currentCategory = categories[choice];
      console.log(`\n📋 ${currentCategory}`);
      console.log('Ketik pertanyaan Anda (atau "back" untuk kembali ke menu):\n');
      
      while (true) {
        const question = await askQuestion('❓ ');
        
        if (question.toLowerCase() === 'back') break;
        if (!question) continue;
        
        await testQuestion(question);
        
        const continueTest = await askQuestion('\nLanjut test? (y/n): ');
        if (continueTest.toLowerCase() !== 'y') break;
      }
    } else {
      console.log('\n⚠️  Pilihan tidak valid!');
    }
  }
}

main().catch(console.error);
