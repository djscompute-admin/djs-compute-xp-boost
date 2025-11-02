import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './Leaderboard.module.css';

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRtbDJdM5IaEo1nqatV9VmHjOCkfUGZP3plWHbi8iHR0703pm_pg3Z2lmxuqyL3SebvRTqW6del9ar1/pub?gid=0&single=true&output=csv';
const REFRESH_INTERVAL = 10 * 1000; // 10 seconds in milliseconds

const Leaderboard = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch(GOOGLE_SHEET_CSV_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const csvText = await response.text();
      const parsedTeams = parseCsv(csvText);

      // Sort by Total XP in descending order
      const sortedTeams = parsedTeams.sort((a, b) => b.totalXP - a.totalXP);

      setTeams(sortedTeams);
      setError(null);
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

  const parseCsv = (csv) => {
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