// Quick test script for Google Sheets API
const SPREADSHEET_ID = '18RRVK9JJ__Ybdku1XNY5WodzppT0SeoI2op4I8e_Ls0';
const API_KEY = 'AIzaSyCpzV8aLx9kDCvJ1H4-8AzKmj9_tMAcLw4';
const SHEET_NAME = 'XP BOOST 2025 - Sheet1.csv'; // Exact sheet tab name
const RANGE = `${SHEET_NAME}!A:C`;

// Encode the range to handle spaces
const encodedRange = encodeURIComponent(RANGE);
const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodedRange}?key=${API_KEY}`;

console.log('Testing Google Sheets API...\n');
console.log('Sheet Name:', SHEET_NAME);
console.log('Range:', RANGE);
console.log('Encoded Range:', encodedRange);
console.log('\nFull URL:');
console.log(url);
console.log('\n' + '='.repeat(60) + '\n');

fetch(url)
  .then(response => {
    console.log('Response Status:', response.status, response.statusText);
    if (!response.ok) {
      return response.json().then(errData => {
        throw new Error(`${response.status}: ${errData.error?.message || response.statusText}`);
      });
    }
    return response.json();
  })
  .then(data => {
    console.log('\n✅ SUCCESS!\n');
    console.log('Spreadsheet Range:', data.range);
    console.log('Total Rows:', data.values ? data.values.length : 0);
    
    if (data.values && data.values.length > 0) {
      console.log('\nHeaders:', data.values[0].join(' | '));
      console.log('\nFirst 5 data rows:');
      data.values.slice(1, 6).forEach((row, i) => {
        console.log(`  ${i + 1}. ${row.join(' | ')}`);
      });
    }
    
    console.log('\n✅ Your configuration is working correctly!');
    console.log('You can now run: npm run dev');
  })
  .catch(error => {
    console.error('\n❌ ERROR:\n');
    console.error(error.message);
    console.error('\nTroubleshooting:');
    
    if (error.message.includes('404')) {
      console.error('- Sheet is not publicly readable or wrong Spreadsheet ID');
      console.error('- Make sure sheet is shared as "Anyone with the link can view"');
    } else if (error.message.includes('403')) {
      console.error('- API key restrictions might be blocking localhost');
      console.error('- Try removing HTTP referrer restrictions temporarily');
      console.error('- Ensure Google Sheets API is enabled');
    } else if (error.message.includes('400')) {
      console.error('- Check if sheet name matches exactly (case-sensitive)');
      console.error('- Verify the sheet tab exists in your spreadsheet');
    }
  });
