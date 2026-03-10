const queryLearning = require('./query-learning');

console.log('🧪 Testing Query Learning System\n');

// Test 1: Learn from queries
console.log('📝 Test 1: Learning from queries');
queryLearning.learn('Saya mau nanya tentang KI', 'itb', true);
queryLearning.learn('Paten tahun 2019', 'itb', true);
queryLearning.learn('Hak Cipta ITB', 'itb', true);
queryLearning.learn('Desain Industri terbaru', 'itb', true);
queryLearning.learn('Inventor dari fakultas teknik', 'itb', true);
console.log('✅ Learned 5 queries\n');

// Test 2: Check keywords
console.log('📝 Test 2: Checking learned keywords');
const keywords = queryLearning.getAllKeywords();
console.log(`✅ Total keywords: ${keywords.length}`);
console.log(`📋 Sample keywords: ${keywords.slice(0, 10).join(', ')}\n`);

// Test 3: Find similar queries
console.log('📝 Test 3: Finding similar queries');
const similar = queryLearning.getSimilarQueries('KI ITB');
console.log(`✅ Found ${similar.length} similar queries:`);
similar.forEach((q, i) => {
  console.log(`   ${i + 1}. "${q.query}" (used ${q.count}x, success: ${q.successCount})`);
});
console.log();

// Test 4: Check if has keyword
console.log('📝 Test 4: Keyword detection');
const testQueries = [
  'Saya mau nanya tentang KI',
  'Paten',
  'Hello world',
  'Inventor ITB'
];

testQueries.forEach(q => {
  const hasKw = queryLearning.hasKeyword(q);
  console.log(`   "${q}" → ${hasKw ? '✅ Has keyword' : '❌ No keyword'}`);
});
console.log();

// Test 5: Get statistics
console.log('📝 Test 5: Statistics');
const stats = queryLearning.getStats();
console.log(`✅ Total queries learned: ${stats.totalQueries}`);
console.log(`✅ Total keywords: ${stats.totalKeywords}`);
console.log(`✅ Top 5 queries:`);
stats.topQueries.slice(0, 5).forEach((q, i) => {
  console.log(`   ${i + 1}. "${q.query}" (${q.count}x)`);
});

console.log('\n🎉 All tests completed!');
console.log('\n💡 The system will continue learning from every user query automatically.');
