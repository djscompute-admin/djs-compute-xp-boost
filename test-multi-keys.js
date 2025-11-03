// Test script for multiple API keys
// Usage: Update API_KEYS array with your keys, then run: node test-multi-keys.js

const SPREADSHEET_ID = '18RRVK9JJ__Ybdku1XNY5WodzppT0SeoI2op4I8e_Ls0';
const SHEET_NAME = 'XP BOOST 2025 - Sheet1.csv';

// Add your API keys here (get from .env.local)
const API_KEYS = [
  'AIzaSyCpzV8aLx9kDCvJ1H4-8AzKmj9_tMAcLw4', // Key 1
  // 'AIzaSyD-your_second_key',  // Key 2 (add when you create it)
  // 'AIzaSyD-your_third_key',   // Key 3 (add when you create it)
];

const RANGE = `${SHEET_NAME}!A:C`;
const encodedRange = encodeURIComponent(RANGE);

console.log('🧪 Testing Multiple API Keys\n');
console.log('=' .repeat(60));
console.log(`Testing ${API_KEYS.length} API key(s)\n`);

async function testApiKey(apiKey, index) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodedRange}?key=${apiKey}`;
  const keyPreview = apiKey.substring(0, 15) + '...';
  
  console.log(`\n🔑 Testing Key ${index + 1}: ${keyPreview}`);
  console.log('-'.repeat(60));
  
  try {
    const startTime = Date.now();
    const response = await fetch(url);
    const duration = Date.now() - startTime;
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Response time: ${duration}ms`);
    
    if (response.status === 200) {
      const data = await response.json();
      const rowCount = data.values ? data.values.length : 0;
      console.log(`✅ SUCCESS - Retrieved ${rowCount} rows`);
      return true;
    } else if (response.status === 429) {
      console.log(`⚠️  RATE LIMITED - This key has hit its quota`);
      return false;
    } else if (response.status === 403) {
      const errorData = await response.json().catch(() => ({}));
      console.log(`❌ FORBIDDEN - ${errorData.error?.message || 'Check API restrictions'}`);
      return false;
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.log(`❌ ERROR - ${errorData.error?.message || response.statusText}`);
      return false;
    }
  } catch (e) {
    console.log(`❌ NETWORK ERROR - ${e.message}`);
    return false;
  }
}

async function testAllKeys() {
  const results = [];
  
  for (let i = 0; i < API_KEYS.length; i++) {
    const success = await testApiKey(API_KEYS[i], i);
    results.push(success);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Summary:');
  console.log(`Total keys: ${API_KEYS.length}`);
  console.log(`Working keys: ${results.filter(r => r).length}`);
  console.log(`Failed keys: ${results.filter(r => !r).length}`);
  
  if (results.every(r => r)) {
    console.log('\n✅ All API keys are working correctly!');
    console.log('Your fallback system is ready for production.');
  } else if (results.some(r => r)) {
    console.log('\n⚠️  Some keys are working, others need attention.');
    console.log('The system will work but verify all keys for maximum capacity.');
  } else {
    console.log('\n❌ All API keys failed!');
    console.log('Check your API keys and Google Cloud Console settings.');
  }
  
  console.log('\n💡 Next steps:');
  if (API_KEYS.length === 1) {
    console.log('- Create 1-2 more API keys for better capacity');
    console.log('- Add them to your .env.local (comma-separated)');
  }
  console.log('- Update .env.local with working keys');
  console.log('- Run: npm run dev');
  console.log('- Test with multiple browser tabs\n');
}

// Run the test
testAllKeys().catch(console.error);
