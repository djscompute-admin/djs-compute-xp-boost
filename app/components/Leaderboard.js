import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './Leaderboard.module.css';

// Google Sheets API configuration
const SPREADSHEET_ID = process.env.NEXT_PUBLIC_SPREADSHEET_ID;
const SHEET_NAME = 'XP BOOST 2025 - Sheet1.csv'; // Must match your Google Sheet tab name exactly
const RANGE = `${SHEET_NAME}!A:C`; // Columns A, B, C (Team ID, Team Name, Total XP)

// Multiple API keys for load balancing and fallback
// Add multiple keys separated by commas in your .env.local
const API_KEYS = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  ? process.env.NEXT_PUBLIC_GOOGLE_API_KEY.split(',').map(key => key.trim())
  : [];

const REFRESH_INTERVAL = 10 * 1000; // 10 seconds in milliseconds

// Helper function to build API URL with a specific key
const buildApiUrl = (apiKey) => {
  return `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(RANGE)}?key=${apiKey}`;
};

const Leaderboard = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboardData = async () => {
    try {
      // Check if environment variables are set
      if (!SPREADSHEET_ID || API_KEYS.length === 0) {
        throw new Error('Missing environment variables. Please check your .env.local file.');
      }

      // Try each API key until one works
      let lastError = null;
      for (let i = 0; i < API_KEYS.length; i++) {
        const apiKey = API_KEYS[i];
        const apiUrl = buildApiUrl(apiKey);
        
        try {
          const response = await fetch(apiUrl);
          
          // If rate limited (429), try next key
          if (response.status === 429) {
            console.warn(`API key ${i + 1} rate limited, trying next key...`);
            lastError = new Error(`Rate limit exceeded for API key ${i + 1}`);
            continue;
          }
          
          // If other error, throw
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          // Success! Parse and return data
          const data = await response.json();
          const parsedTeams = parseGoogleSheetsData(data);

          // Sort by Total XP in descending order
          const sortedTeams = parsedTeams.sort((a, b) => b.totalXP - a.totalXP);

          setTeams(sortedTeams);
          setError(null);
          
          // Log which key succeeded (for debugging)
          if (i > 0) {
            console.log(`Successfully fetched data using API key ${i + 1}`);
          }
          
          return; // Exit function on success
          
        } catch (e) {
          lastError = e;
          // If this is the last key, throw the error
          if (i === API_KEYS.length - 1) {
            throw e;
          }
          // Otherwise, try next key
          console.warn(`Error with API key ${i + 1}, trying next key...`, e.message);
        }
      }
      
      // If we get here, all keys failed
      throw lastError || new Error('All API keys failed');
      
    } catch (e) {
      console.error("Failed to fetch leaderboard data:", e);
      setError("Failed to load leaderboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();

    const intervalId = setInterval(fetchLeaderboardData, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  const parseGoogleSheetsData = (data) => {
    // Google Sheets API returns data in format: { values: [["header1", "header2"], ["row1col1", "row1col2"], ...] }
    if (!data.values || data.values.length < 2) {
      return [];
    }

    // Skip the header row (index 0) and map the rest
    return data.values.slice(1).map(row => {
      const [teamId, teamName, totalXP] = row;
      return {
        teamId: teamId ? String(teamId).trim() : 'N/A',
        teamName: teamName ? String(teamName).trim() : 'Unknown Team',
        totalXP: parseInt(totalXP, 10) || 0,
      };
    });
  };

  if (loading && teams.length === 0) {
    return (
      <section className={styles.leaderboardSection}>
        <p className={styles.loadingText}>Loading Leaderboard...</p>
      </section>
    );
  }

  return (
    <section className={styles.leaderboardSection}>
      {error && <p className={styles.errorText}>{error}</p>}
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <div className={styles.top3}>
        {teams[1] && ( // 2nd Place
          <div className={styles.podiumWrapper}> {/* Wrapper for name above box */}
            
            
            <div className={`${styles.podiumItem} ${styles.secondPlace}`}>
            <span className={styles.teamNameAbovePodium}>{teams[1].teamName}</span>
            <span className={styles.teamIdAbovePodium}>@{teams[1].teamId}</span>
              <Image src="/leaderboard/second.png" alt="2nd Place Trophy" width={150} height={150} className={styles.podiumIcon} />
              <div className={styles.points}>
                <span className={styles.pointValue}>{teams[1].totalXP}</span>
                <span className={styles.pointLabel}>XP</span>
              </div>
            </div>
          </div>
        )}
        {teams[0] && ( // 1st Place
          <div className={styles.podiumWrapper}>
        
            <div className={`${styles.podiumItem} ${styles.firstPlace}`}>
                <span className={styles.teamNameAbovePodium}>{teams[0].teamName}</span>
                <span className={styles.teamIdAbovePodium}>@{teams[0].teamId}</span>
              <Image src="/leaderboard/first.png" alt="1st Place Trophy" width={200} height={200} className={styles.podiumIcon} />
              <div className={styles.points}>
                <span className={styles.pointValue}>{teams[0].totalXP}</span>
                <span className={styles.pointLabel}>XP</span>
              </div>
            </div>
          </div>
        )}
        {teams[2] && ( // 3rd Place
          <div className={styles.podiumWrapper}>

            <div className={`${styles.podiumItem} ${styles.thirdPlace}`}>
                <span className={styles.teamNameAbovePodium}>{teams[2].teamName}</span>
                <span className={styles.teamIdAbovePodium}>@{teams[2].teamId}</span>
              <Image src="/leaderboard/third.png" alt="3rd Place Trophy" width={100} height={100} className={styles.podiumIcon} />
              <div className={styles.points}>
                <span className={styles.pointValue}>{teams[2].totalXP}</span>
                <span className={styles.pointLabel}>XP</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.remainingTeamsContainer}>
        <div className={styles.remainingTeams}>
          {/* Display all teams from 4th position onwards */}
          {teams.slice(3).map((team, index) => (
            <div key={team.teamId} className={styles.teamRow}>
              <span className={styles.rank}>{index + 4}</span>
              <div className={styles.teamInfoDetailed}>
                <span className={styles.teamNameDetailed}>{team.teamName}</span>
                <span className={styles.teamIdDetailed}>@{team.teamId}</span>
              </div>
              <div className={styles.pointsDetailed}>
                <span className={styles.pointValueDetailed}>{team.totalXP}</span>
                <span className={styles.pointLabelDetailed}>XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;