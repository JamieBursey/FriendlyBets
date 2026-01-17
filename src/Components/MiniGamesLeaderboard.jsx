import React, { useEffect, useState } from 'react';
import {
  fetchTriviaLeaderboardMonthly,
  fetchTriviaLeaderboardAllTime,
  fetchBreakawayLeaderboardMonthly,
  fetchBreakawayLeaderboardAllTime
} from '../Data/MiniGamesHelpers';

const MiniGamesLeaderboard = () => {
  const [activeTab, setActiveTab] = useState('trivia'); // 'trivia' | 'breakaway'
  const [monthlyLeaders, setMonthlyLeaders] = useState([]);
  const [allTimeLeaders, setAllTimeLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLeaderboards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadLeaderboards = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === 'trivia') {
        const [monthly, allTime] = await Promise.all([
          fetchTriviaLeaderboardMonthly(),
          fetchTriviaLeaderboardAllTime()
        ]);
        setMonthlyLeaders(monthly);
        setAllTimeLeaders(allTime);
      } else {
        const [monthly, allTime] = await Promise.all([
          fetchBreakawayLeaderboardMonthly(),
          fetchBreakawayLeaderboardAllTime()
        ]);
        setMonthlyLeaders(monthly);
        setAllTimeLeaders(allTime);
      }
    } catch (err) {
      console.error('Error loading leaderboards:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '';
    }
  };

  const LeaderboardSection = ({ title, leaders }) => (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {leaders.length === 0 ? (
        <p style={styles.noData}>No data yet. Be the first to play!</p>
      ) : (
        <div style={styles.leaderList}>
          {leaders.map((leader) => (
            <div key={leader.user_id} style={styles.leaderItem}>
              <div style={styles.rankBadge}>
                <span style={styles.medal}>{getMedalEmoji(leader.rank)}</span>
                <span style={styles.rankNumber}>#{leader.rank}</span>
              </div>
              <div style={styles.leaderInfo}>
                <div style={styles.username}>{leader.username}</div>
                <div style={styles.stats}>
                  {activeTab === 'trivia' ? (
                    <>
                      {leader.total_correct} correct answers
                      <span style={styles.statDivider}>•</span>
                      {leader.total_attempts} {leader.total_attempts === 1 ? 'game' : 'games'}
                    </>
                  ) : (
                    <>
                      {leader.total_wins} {leader.total_wins === 1 ? 'win' : 'wins'}
                      <span style={styles.statDivider}>•</span>
                      {leader.total_attempts} {leader.total_attempts === 1 ? 'attempt' : 'attempts'}
                      <span style={styles.statDivider}>•</span>
                      {leader.win_rate}% win rate
                    </>
                  )}
                </div>
              </div>
              <div style={styles.scoreBox}>
                <div style={styles.scoreNumber}>
                  {activeTab === 'trivia' ? leader.total_correct : leader.total_wins}
                </div>
                <div style={styles.scoreLabel}>
                  {activeTab === 'trivia' ? 'points' : 'wins'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading leaderboards...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          Error loading leaderboards: {error}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🏆 Mini Games Leaderboard</h2>
        <p style={styles.subtitle}>Top performers across all mini games</p>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'trivia' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('trivia')}
        >
          📚 Daily Trivia
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'breakaway' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('breakaway')}
        >
          🏒 Breakaway Dodger
        </button>
      </div>

      <LeaderboardSection 
        title="📅 This Month"
        leaders={monthlyLeaders}
      />

      <LeaderboardSection 
        title="⭐ All Time"
        leaders={allTimeLeaders}
      />
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    borderBottom: '2px solid #e0e0e0',
  },
  tab: {
    flex: 1,
    padding: '12px 20px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    color: '#666',
    transition: 'all 0.3s',
  },
  activeTab: {
    color: '#1976d2',
    borderBottomColor: '#1976d2',
    fontWeight: 'bold',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#666',
  },
  error: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#fee',
    color: '#c33',
    borderRadius: '8px',
    fontSize: '14px',
  },
  section: {
    marginBottom: '32px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '16px',
    marginTop: 0,
  },
  noData: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    padding: '20px',
    margin: 0,
  },
  leaderList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  leaderItem: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'default',
  },
  rankBadge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '50px',
    marginRight: '16px',
  },
  medal: {
    fontSize: '28px',
    marginBottom: '4px',
  },
  rankNumber: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#666',
  },
  leaderInfo: {
    flex: 1,
  },
  username: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: '4px',
  },
  stats: {
    fontSize: '13px',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  statDivider: {
    color: '#ccc',
  },
  scoreBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: '8px 16px',
    borderRadius: '6px',
    minWidth: '60px',
  },
  scoreNumber: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1976d2',
  },
  scoreLabel: {
    fontSize: '11px',
    color: '#666',
    textTransform: 'uppercase',
  },
};

export default MiniGamesLeaderboard;
