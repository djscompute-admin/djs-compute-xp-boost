import React, { useEffect, useState, useMemo } from 'react'; // Added useMemo
import Image from 'next/image';
import styles from './Leaderboard.module.css';

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRtbDJdM5IaEo1nqatV9VmHjOCkfUGZP3plWHbi8iHR0703pm_pg3Z2lmxuqyL3SebvRTqW6del9ar1/pub?gid=0&single=true&output=csv';
const REFRESH_INTERVAL = 30 * 1000; // 30 seconds
const TEAMS_PER_PAGE = 7; // Number of teams to display per page in the scrollable section

const Leaderboard = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed page

  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch(GOOGLE_SHEET_CSV_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const csvText = await response.text();
      const parsedTeams = parseCsv(csvText);
      const sortedTeams = parsedTeams.sort((a, b) => b.totalXP - a.totalXP);
      setTeams(sortedTeams);
      setError(null);
      setCurrentPage(0); // Reset to first page on new data fetch
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

  // Memoize the data for the paginated list to avoid re-calculating on every render
  const remainingTeams = useMemo(() => teams.slice(3), [teams]);
  const totalPages = Math.ceil(remainingTeams.length / TEAMS_PER_PAGE);

  const paginatedTeams = useMemo(() => {
    const startIndex = currentPage * TEAMS_PER_PAGE;
    const endIndex = startIndex + TEAMS_PER_PAGE;
    return remainingTeams.slice(startIndex, endIndex);
  }, [remainingTeams, currentPage]);

  // Pad the last page with null placeholders so each page always renders TEAMS_PER_PAGE rows
  const paddedTeams = useMemo(() => {
    const arr = paginatedTeams.slice();
    while (arr.length < TEAMS_PER_PAGE) arr.push(null);
    return arr;
  }, [paginatedTeams]);

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
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
      <div className={styles.top3}>
        {teams[1] && ( // 2nd Place
          <div className={styles.podiumWrapper}>
            <span className={styles.teamNameAbovePodium}>{teams[1].teamName}</span>
            <span className={styles.teamIdAbovePodium}><span className={styles.teamIdHandle}>@{teams[1].teamId}</span></span>
            <div className={`${styles.podiumItem} ${styles.secondPlace}`}>
              <div className={styles.imageWrapper}>
                <Image src="/leaderboard/bae.png" alt="2nd Place Trophy" fill className={styles.podiumIcon} />
              </div>
            </div>
            <div className={styles.points}>
              <span className={styles.pointValue}>{teams[1].totalXP}</span>
              <span className={styles.pointLabel}>points</span>
            </div>
          </div>
        )}
        {teams[0] && ( // 1st Place
          <div className={styles.podiumWrapper}>
            <span className={styles.teamNameAbovePodium}>{teams[0].teamName}</span>
            <span className={styles.teamIdAbovePodium}><span className={styles.teamIdHandle}>@{teams[0].teamId}</span></span>
            <div className={`${styles.podiumItem} ${styles.firstPlace}`}>
              <div className={styles.imageWrapper}>
                <Image src="/leaderboard/ek.png" alt="1st Place Trophy" fill className={styles.podiumIcon} />
              </div>
            </div>
            <div className={styles.points}>
              <span className={styles.pointValue}>{teams[0].totalXP}</span>
              <span className={styles.pointLabel}>points</span>
            </div>
          </div>
        )}
        {teams[2] && ( // 3rd Place
          <div className={styles.podiumWrapper}>
            <span className={styles.teamNameAbovePodium}>{teams[2].teamName}</span>
            <span className={styles.teamIdAbovePodium}><span className={styles.teamIdHandle}>@{teams[2].teamId}</span></span>
            <div className={`${styles.podiumItem} ${styles.thirdPlace}`}>
              <div className={styles.imageWrapper}>
                <Image src="/leaderboard/tran.png" alt="3rd Place Trophy" fill className={styles.podiumIcon} />
              </div>
            </div>
            <div className={styles.points}>
              <span className={styles.pointValue}>{teams[2].totalXP}</span>
              <span className={styles.pointLabel}>points</span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.remainingTeamsContainer}>
        <div className={styles.remainingTeams}>
          {paddedTeams.map((team, index) => {
            const rankNumber = 3 + currentPage * TEAMS_PER_PAGE + index + 1; // rank starts after top 3
            if (team) {
              return (
                <div key={team.teamId} className={styles.teamRow}>
                  <span className={styles.rank}>{rankNumber}</span>
                  <div className={styles.teamInfoDetailed}>
                    <span className={styles.teamNameDetailed}>{team.teamName}</span>
                    <span className={styles.teamIdDetailed}><span className={styles.teamIdHandle}>@{team.teamId}</span></span>
                  </div>
                  <div className={styles.pointsDetailed}>
                    <span className={styles.pointValueDetailed}>{team.totalXP}</span>
                    <span className={styles.pointLabelDetailed}>points</span>
                  </div>
                </div>
              );
            }

            // Empty placeholder row to keep pagination height stable
            return (
              <div key={`empty-${index}`} className={styles.teamRow}>
                <span className={styles.rank}>&nbsp;</span>
                <div className={styles.teamInfoDetailed}>
                  <span className={styles.teamNameDetailed}>&nbsp;</span>
                  <span className={styles.teamIdDetailed}>&nbsp;</span>
                </div>
                <div className={styles.pointsDetailed}>
                  <span className={styles.pointValueDetailed}>&nbsp;</span>
                  <span className={styles.pointLabelDetailed}>&nbsp;</span>
                </div>
              </div>
            );
          })}
        </div>
        {remainingTeams.length > TEAMS_PER_PAGE && ( // Only show pagination if more than one page
          <div className={styles.paginationControls}>
            <button onClick={handlePrevPage} disabled={currentPage === 0} className={styles.paginationButton}>
              Previous
            </button>
            <span className={styles.paginationInfo}>
              Page {currentPage + 1} of {totalPages}
            </span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages - 1} className={styles.paginationButton}>
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Leaderboard;