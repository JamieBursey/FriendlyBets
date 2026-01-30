import React, { useEffect, useState } from 'react';
import { DailyTriviaGame } from '../Components/DailyTriviaGame';
import { DailySideBet } from '../Components/DailySideBet';
import MiniGamesLeaderboard from '../Components/MiniGamesLeaderboard';
import BreakawayDodger from '../Components/BreakawayDodger';
import GuessWhoGame from '../Components/GuessWhoGame';
import { fetchUserTokens } from '../Data/MiniGamesHelpers';

const MiniGamesPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeGame, setActiveGame] = useState(null); // 'trivia' | 'sidebet' | 'leaderboard' | 'breakaway' | 'guesswho' | null

  useEffect(() => {
    fetchCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      setError(null);

      const userData = await fetchUserTokens();

      setCurrentUser(userData);
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err.message || 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const refreshUserTokens = async () => {
    try {
      const userData = await fetchUserTokens();
      setCurrentUser(userData);
    } catch (err) {
      console.error('Error refreshing tokens:', err);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-3">Loading Mini Games...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          Please log in to access Mini Games
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="text-center text-primary mb-4">🎮 Mini Games</h1>
          
          {/* Token Display */}
          <div className="card bg-dark text-white mb-4">
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6">
                  <h5 className="text-info">🎟️ Mini Game Tokens</h5>
                  <h2 className="text-warning">{currentUser.miniGameToken || 0}</h2>
                  <small className="text-muted">Earn by completing trivia</small>
                </div>
                <div className="col-6">
                  <h5 className="text-info">🎲 Bet Tokens</h5>
                  <h2 className="text-success">{currentUser.betToken || 0}</h2>
                  <small className="text-muted">Win from side bets</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Selection or Active Game */}
      {!activeGame ? (
        <div className="row">
          {/* Daily Trivia Card */}
          <div className="col-md-6 mb-4">
            <div className="card h-100 shadow-sm border-primary">
              <div className="card-body text-center">
                <h3 className="card-title text-primary">📚 Daily Trivia</h3>
                <p className="card-text">
                  Answer 5 questions correctly (3/5 to pass) and earn a <strong className="text-warning">Mini Game Token</strong>!
                </p>
                <ul className="text-left">
                  <li>Free to play once per day</li>
                  <li>Pass with 3+ correct answers</li>
                  <li>Earn 1 Mini Game Token when you pass</li>
                </ul>
                <button 
                  className="btn btn-primary btn-lg mt-3"
                  onClick={() => setActiveGame('trivia')}
                >
                  Play Trivia
                </button>
              </div>
            </div>
          </div>

          {/* Daily Side Bet Card */}
          <div className="col-md-6 mb-4">
            <div className="card h-100 shadow-sm border-success">
              <div className="card-body text-center">
                <h3 className="card-title text-success">🎯 Daily Side Bet</h3>
                <p className="card-text">
                  Predict the answer and win a <strong className="text-success">Bet Token</strong>!
                </p>
                <ul className="text-left">
                  <li>Costs 1 Mini Game Token to enter</li>
                  <li>Make your prediction</li>
                  <li>Correct answer earns 1 Bet Token</li>
                  <li className="text-info">Free to check your results!</li>
                </ul>
                <button 
                  className="btn btn-success btn-lg mt-3"
                  onClick={() => setActiveGame('sidebet')}
                >
                  {(currentUser.miniGameToken || 0) < 1 ? 'View Side Bet' : 'Place Side Bet'}
                </button>
                {(currentUser.miniGameToken || 0) < 1 && (
                  <small className="d-block mt-2 text-muted">
                    (You can still check results!)
                  </small>
                )}
              </div>
            </div>
          </div>

          {/* Leaderboard Card */}
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm border-warning">
              <div className="card-body text-center">
                <h3 className="card-title text-warning">🏆 Leaderboard</h3>
                <p className="card-text">
                  See who's dominating mini games!
                </p>
                <ul className="text-left">
                  <li>Trivia & Breakaway stats</li>
                  <li>Top 3 this month</li>
                  <li>Top 3 all-time champions</li>
                </ul>
                <button 
                  className="btn btn-warning btn-lg mt-3"
                  onClick={() => setActiveGame('leaderboard')}
                >
                  View Leaderboard
                </button>
              </div>
            </div>
          </div>

          {/* Breakaway Dodger Card */}
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm border-info">
              <div className="card-body text-center">
                <h3 className="card-title text-info">🏒 Breakaway Dodger</h3>
                <p className="card-text">
                  Dodge defenders and score!
                </p>
                <ul className="text-left">
                  <li>FREE unlimited plays</li>
                  <li>First win each day: +1 token</li>
                  <li>Swipe or arrow keys</li>
                </ul>
                <button 
                  className="btn btn-info btn-lg mt-3"
                  onClick={() => setActiveGame('breakaway')}
                >
                  Play Now
                </button>
              </div>
            </div>
          </div>

          {/* Guess Who Card */}
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm border-pink">
              <div className="card-body text-center">
                <h3 className="card-title" style={{color:'#e75480'}}>🕵️‍♂️ Guess Who?</h3>
                <p className="card-text">
                  Can you guess the athlete or celebrity from 5 fun hints?
                </p>
                <ul className="text-left">
                  <li>5 hints per round</li>
                  <li>Includes NHL stars & actors</li>
                  <li>New challenge every play</li>
                </ul>
                <button 
                  className="btn btn-pink btn-lg mt-3"
                  style={{background:'#e75480',color:'#fff'}} 
                  onClick={() => setActiveGame('guesswho')}
                >
                  Play Guess Who
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            <button 
              className="btn btn-secondary mb-3"
              onClick={() => setActiveGame(null)}
            >
              ← Back to Mini Games
            </button>

            {activeGame === 'trivia' && (
              <DailyTriviaGame 
                userId={currentUser.public_user_id}
                onComplete={() => {
                  refreshUserTokens();
                  setActiveGame(null);
                }}
              />
            )}

            {activeGame === 'sidebet' && (
              <DailySideBet 
                userId={currentUser.public_user_id}
                onComplete={() => {
                  refreshUserTokens();
                  setActiveGame(null);
                }}
              />
            )}

            {activeGame === 'leaderboard' && (
              <MiniGamesLeaderboard />
            )}

            {activeGame === 'breakaway' && (
              <BreakawayDodger 
                userId={currentUser.public_user_id}
                onComplete={() => {
                  refreshUserTokens();
                  setActiveGame(null);
                }}
              />
            )}

            {activeGame === 'guesswho' && (
              <GuessWhoGame />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniGamesPage;
