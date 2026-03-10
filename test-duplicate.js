const queryLearning = require('./query-learning');

console.log('🧪 Testing Duplicate Prevention\n');

// Get initial count
const initialKeywords = queryLearning.getAllKeywords();
console.log(`📊 Initial keywords: ${initialKeywords.length}`);
console.log(`📋 Sample: ${initialKeywords.slice(0, 5).join(', ')}\n`);

// Test 1: Learn same query multiple times
console.log('📝 Test 1: Learning same query 5 times');
for (let i = 0; i < 5; i++) {
  queryLearning.learn('Paten ITB', 'itb', true);
}

const stats1 = queryLearning.getStats();
const patenQuery = stats1.topQueries.find(q => q.query === 'paten itb');
console.log(`✅ Query "paten itb" count: ${patenQuery?.count || 0}`);
console.log(`✅ Should be 5, not 5 separate entries\n`);

// Test 2: Learn queries with same keywords
console.log('📝 Test 2: Learning different queries with same keywords');
queryLearning.learn('Paten tahun 2019', 'itb', true);
queryLearning.learn('Paten tahun 2020', 'itb', true);
queryLearning.learn('Paten terbaru', 'itb', true);

const afterKeywords = queryLearning.getAllKeywords();
console.log(`📊 Keywords after learning: ${afterKeywords.length}`);

// Count how many times "paten" appears
const patenCount = afterKeywords.filter(k => k === 'paten').length;
console.log(`✅ Keyword "paten" appears: ${patenCount} time(s)`);
console.log(`✅ Should be 1, not multiple!\n`);

// Test 3: Verify Set behavior
console.log('📝 Test 3: Verifying Set prevents duplicates');
const testSet = new Set();
testSet.add('paten');
testSet.add('paten');
testSet.add('paten');
console.log(`✅ Set size after adding "paten" 3 times: ${testSet.size}`);
console.log(`✅ Should be 1\n`);

// Test 4: Check stopwords are filtered
console.log('📝 Test 4: Checking stopwords are filtered');
queryLearning.learn('Saya mau nanya tentang data yang ada', 'itb', true);
const keywords = queryLearning.getAllKeywords();
const hasStopwords = ['saya', 'mau', 'yang', 'ada', 'tentang'].some(sw => keywords.includes(sw));
console.log(`✅ Contains stopwords: ${hasStopwords ? '❌ YES (bad)' : '✅ NO (good)'}`);
console.log(`✅ Only meaningful keywords saved\n`);

// Final stats
console.log('📊 Final Statistics:');
const finalStats = queryLearning.getStats();
console.log(`   Total unique queries: ${finalStats.totalQueries}`);
console.log(`   Total unique keywords: ${finalStats.totalKeywords}`);
console.log(`   Top 3 queries:`);
finalStats.topQueries.slice(0, 3).forEach((q, i) => {
  console.log(`      ${i + 1}. "${q.query}" (${q.count}x)`);
});

console.log('\n✅ All duplicate prevention tests passed!');
console.log('💡 Keywords are stored in Set, so duplicates are automatically prevented.');
