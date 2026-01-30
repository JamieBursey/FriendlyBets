import React, { useEffect, useState } from 'react';
import { fetchSideBetLeaderboard } from '../Data/SideBetHelpers';

const SideBetLeaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchSideBetLeaderboard();
        setLeaders(data);
      } catch (err) {
        setError(err.message || 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };
    loadLeaderboard();
  }, []);

  if (loading) return <div>Loading leaderboard...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h4 className="mb-3">🏆 Side Bet Leaderboard</h4>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Correct</th>
              <th>Attempts</th>
              <th>Win %</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((row, i) => (
              <tr key={row.user_id}>
                <td>{i + 1}</td>
                <td>{row.username || row.user_id}</td>
                <td>{row.correct_count}</td>
                <td>{row.total_count}</td>
                <td>{row.total_count ? ((row.correct_count / row.total_count) * 100).toFixed(1) + '%' : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SideBetLeaderboard;
