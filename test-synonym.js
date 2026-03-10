const queryLearning = require('./query-learning');

console.log('🧪 Testing Synonym Normalization\n');

// Test 1: Learn with English and Indonesian
console.log('📝 Test 1: Learning "patent" and "paten"');
queryLearning.learn('Show me patent data', 'itb', true);
queryLearning.learn('Tampilkan data paten', 'itb', true);

const keywords1 = queryLearning.getAllKeywords();
const patentCount = keywords1.filter(k => k === 'patent').length;
const patenCount = keywords1.filter(k => k === 'paten').length;

console.log(`   "patent" count: ${patentCount}`);
console.log(`   "paten" count: ${patenCount}`);
console.log(`   ✅ Should have only "paten" (normalized)\n`);

// Test 2: Multiple synonyms
console.log('📝 Test 2: Learning multiple synonyms');
queryLearning.learn('copyright information', 'itb', true);
queryLearning.learn('hak cipta data', 'itb', true);
queryLearning.learn('industrial design', 'itb', true);
queryLearning.learn('desain industri', 'itb', true);

const keywords2 = queryLearning.getAllKeywords();
console.log(`   Has "copyright": ${keywords2.includes('copyright')}`);
console.log(`   Has "hak cipta": ${keywords2.includes('hak cipta')}`);
console.log(`   Has "industrial": ${keywords2.includes('industrial')}`);
console.log(`   Has "desain": ${keywords2.includes('desain')}`);
console.log(`   ✅ All should be normalized to Indonesian\n`);

// Test 3: Keyword detection with synonyms
console.log('📝 Test 3: Keyword detection with synonyms');
const testQueries = [
  'Show me patent',
  'Tampilkan paten',
  'copyright data',
  'hak cipta ITB'
];

testQueries.forEach(q => {
  const hasKw = queryLearning.hasKeyword(q);
  console.log(`   "${q}" → ${hasKw ? '✅ Detected' : '❌ Not detected'}`);
});
console.log();

// Test 4: Verify no duplicates after normalization
console.log('📝 Test 4: No duplicates after normalization');
queryLearning.learn('patent 2019', 'itb', true);
queryLearning.learn('paten 2019', 'itb', true);
queryLearning.learn('patent 2020', 'itb', true);
queryLearning.learn('paten 2020', 'itb', true);

const finalKeywords = queryLearning.getAllKeywords();
const allPatenVariants = finalKeywords.filter(k => k.includes('paten') || k.includes('patent'));
console.log(`   Keywords containing "paten/patent": ${allPatenVariants.join(', ')}`);
console.log(`   ✅ Should only have "paten", not "patent"\n`);

// Final stats
console.log('📊 Final Statistics:');
const stats = queryLearning.getStats();
console.log(`   Total unique keywords: ${stats.totalKeywords}`);
console.log(`   Sample keywords: ${finalKeywords.slice(0, 10).join(', ')}`);

console.log('\n✅ Synonym normalization tests completed!');
console.log('💡 "patent" → "paten", "copyright" → "hak cipta", etc.');
