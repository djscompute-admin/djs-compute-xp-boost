import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

// Fallback published CSV URL
const PUBLISHED_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRtbDJdM5IaEo1nqatV9VmHjOCkfUGZP3plWHbi8iHR0703pm_pg3Z2lmxuqyL3SebvRTqW6del9ar1/pub?gid=0&single=true&output=csv';

// Configure authentication
const auth = new JWT({
  email: 'djs-compute-service-account@aesthetic-petal-477109-r3.iam.gserviceaccount.com',
  keyFile: './app/config/serviceAccount.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Spreadsheet configuration
const SPREADSHEET_ID = '1uKfOgHUhsqhcakvbDLoTshDuZok5vkbokxqzXXHMK4g';
const RANGE = 'Sheet1!A2:C'; // Assuming data starts from A2 with 3 columns

// Helper function to parse CSV data
const parseCSV = (csv) => {
  const lines = csv.split('\n').filter(line => line.trim() !== '');
  return lines.slice(1).map(line => {
    const [teamId, teamName, totalXP] = line.split(',');
    return {
      teamId: teamId ? teamId.trim() : 'N/A',
      teamName: teamName ? teamName.trim() : 'Unknown Team',
      totalXP: parseInt(totalXP, 10) || 0,
    };
  });
};

export async function GET() {
  try {
    // Try using Google Sheets API first if ID is available
    if (SPREADSHEET_ID) {
      try {
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: RANGE,
        });

        const rows = response.data.values || [];
        const teams = rows.map(([teamId, teamName, totalXP]) => ({
          teamId: teamId ? teamId.trim() : 'N/A',
          teamName: teamName ? teamName.trim() : 'Unknown Team',
          totalXP: parseInt(totalXP, 10) || 0,
        }));

        return new Response(JSON.stringify(teams), {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        });
      } catch (error) {
        console.error('Google Sheets API error:', error);
        // Fall through to CSV fallback
      }
    }

    // Fallback to published CSV if API fails or no ID provided
    const response = await fetch(PUBLISHED_CSV_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();
    const teams = parseCSV(csvText);

    return new Response(JSON.stringify(teams), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch leaderboard data' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}