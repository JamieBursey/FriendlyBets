import React, { useEffect, useState } from 'react';
import {
  getTodayISODate,
  generateDailySidebet,
  fetchTodaySidebetQuestion,
  fetchSidebetEntry,
  enterSidebet,
  checkSidebetStatus,
  checkGameResult,
  updateSidebetResult
} from '../Data/MiniGamesHelpers';
import { fetchMostRecentSidebetEntry, fetchSidebetQuestionByDate } from '../Data/SideBetHelpers';
import SideBetLeaderboard from './SideBetLeaderboard';

const DailySideBet = ({ userId, onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sideBetQuestion, setSideBetQuestion] = useState(null);
  const [hasEnteredToday, setHasEnteredToday] = useState(false);
  const [previousEntry, setPreviousEntry] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [checkingResults, setCheckingResults] = useState(false);
  const [recentEntry, setRecentEntry] = useState(null);
  const [recentQuestion, setRecentQuestion] = useState(null);

  useEffect(() => {
    loadSideBet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadSideBet = async () => {
    try {
      setLoading(true);
      setError(null);

      const betDate = getTodayISODate();

      // First, try to generate today's side bet (lazy generation)
      try {
        await generateDailySidebet();
      } catch (genError) {
        console.warn('Edge function call failed (may not be deployed):', genError);
        // Continue even if edge function fails
      }

      // Load today's side bet question
      const questionData = await fetchTodaySidebetQuestion(betDate);
      
      // Auto-check and resolve bet if game is finished (like your CheckBets system)
      if (questionData && !questionData.resolved_at && questionData.game_id) {
        try {
          console.log('Checking if game is finished:', questionData.game_id);
          
          // Check the game result from YOUR API
          const gameResult = await checkGameResult(questionData.game_id);
          
          if (gameResult.isFinished) {
            console.log('Game is finished! Resolving bet...');
            
            // Determine winner
            let winner;
            if (gameResult.homeScore > gameResult.awayScore) {
              winner = questionData.home_team_abbrev;
            } else if (gameResult.awayScore > gameResult.homeScore) {
              winner = questionData.away_team_abbrev;
            } else {
              winner = 'TIE';
            }
            
            // Update the bet result in database (awards tokens to winners)
            const winnersCount = await updateSidebetResult(
              betDate,
              winner,
              gameResult.homeScore,
              gameResult.awayScore,
              gameResult.gameState
            );
            
            console.log(`Bet resolved! Winner: ${winner}, ${winnersCount} users won tokens`);
            
            // Re-fetch question to get updated data
            const updatedQuestion = await fetchTodaySidebetQuestion(betDate);
            setSideBetQuestion(updatedQuestion);
          } else {
            console.log('Game not finished yet, showing as pending');
            setSideBetQuestion(questionData);
          }
        } catch (checkError) {
          console.warn('Failed to check game result:', checkError);
          // Still show the question even if check fails
          setSideBetQuestion(questionData);
        }
      } else {
        setSideBetQuestion(questionData);
      }

      // Check if user has already entered today
      const entryData = await fetchSidebetEntry(betDate);

      if (entryData) {
        setHasEnteredToday(true);
        setPreviousEntry(entryData);
      } else {
        // If user hasn't entered today, fetch their most recent entry
        const mostRecent = await fetchMostRecentSidebetEntry();
        if (mostRecent) {
          setRecentEntry(mostRecent);
          // Fetch the question for that date
          const q = await fetchSidebetQuestionByDate(mostRecent.bet_date);
          setRecentQuestion(q);
        } else {
          setRecentEntry(null);
          setRecentQuestion(null);
        }
      }
    } catch (err) {
      console.error('Error loading side bet:', err);
      setError(err.message || 'Failed to load side bet');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAnswer.trim()) {
      setError('Please enter your answer');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const betDate = getTodayISODate();

      // Call RPC function to enter side bet (server deducts token and creates entry)
      await enterSidebet(betDate, selectedAnswer.trim());

      setSubmitted(true);
      setHasEnteredToday(true);
      setPreviousEntry({ answer: selectedAnswer.trim() });
    } catch (err) {
      console.error('Error submitting side bet:', err);
      setError(err.message || 'Failed to submit side bet');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinish = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const handleCheckResults = async () => {
    if (!sideBetQuestion || !sideBetQuestion.game_id) {
      console.error('Missing question or game_id:', { sideBetQuestion });
      setError('Cannot check results - missing game information');
      return;
    }
    
    try {
      setCheckingResults(true);
      setError(null);
      
      const betDate = getTodayISODate();
      console.log('Checking results for:', { betDate, gameId: sideBetQuestion.game_id });
      
      // Check the game result
      const gameResult = await checkGameResult(sideBetQuestion.game_id);
      console.log('Game result:', gameResult);
      
      if (gameResult.isFinished) {
        // Determine winner
        let winner;
        if (gameResult.homeScore > gameResult.awayScore) {
          winner = sideBetQuestion.home_team_abbrev;
        } else if (gameResult.awayScore > gameResult.homeScore) {
          winner = sideBetQuestion.away_team_abbrev;
        } else {
          winner = 'TIE';
        }
        
        console.log('Winner determined:', winner);
        
        // Update the bet result
        const winnersCount = await updateSidebetResult(
          betDate,
          winner,
          gameResult.homeScore,
          gameResult.awayScore,
          gameResult.gameState
        );
        
        console.log('Bet resolved, winners:', winnersCount);
        
        // Re-fetch question to get updated data
        const updatedQuestion = await fetchTodaySidebetQuestion(betDate);
        setSideBetQuestion(updatedQuestion);
      } else {
        console.log('Game not finished yet:', gameResult.gameState);
        setError('Game is not finished yet. Please check back later!');
      }
    } catch (err) {
      console.error('Error checking results:', err);
      setError(err.message || 'Failed to check results');
    } finally {
      setCheckingResults(false);
    }
  };

  // Handler to check results for previous bet
  const handleCheckPreviousResults = async () => {
    if (!recentQuestion || !recentQuestion.game_id) {
      setError('Cannot check results - missing game information');
      return;
    }
    try {
      setCheckingResults(true);
      setError(null);
      // Use the previous bet's game_id
      const gameResult = await checkGameResult(recentQuestion.game_id);
      if (gameResult.isFinished) {
        // Determine winner
        let winner;
        if (gameResult.homeScore > gameResult.awayScore) {
          winner = recentQuestion.home_team_abbrev;
        } else if (gameResult.awayScore > gameResult.homeScore) {
          winner = recentQuestion.away_team_abbrev;
        } else {
          winner = 'TIE';
        }
        // Update the bet result for the previous date
        await updateSidebetResult(
          recentQuestion.bet_date,
          winner,
          gameResult.homeScore,
          gameResult.awayScore,
          gameResult.gameState
        );
        // Re-fetch the question to get updated data
        const updatedQ = await fetchSidebetQuestionByDate(recentQuestion.bet_date);
        setRecentQuestion(updatedQ);
      } else {
        setError('Game is not finished yet. Please check back later!');
      }
    } catch (err) {
      setError(err.message || 'Failed to check results');
    } finally {
      setCheckingResults(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="spinner-border text-success" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-3">Loading Daily Side Bet...</p>
        </div>
      </div>
    );
  }

  if (error && !sideBetQuestion) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <button className="btn btn-secondary" onClick={onComplete}>
            Back to Mini Games
          </button>
        </div>
      </div>
    );
  }

  if (hasEnteredToday && previousEntry && sideBetQuestion) {
    const isResolved = sideBetQuestion.resolved_at !== null;
    const isCorrect = isResolved && 
      previousEntry.answer.toLowerCase() === sideBetQuestion.correct_answer?.toLowerCase();

    return (
      <div className="card">
        <div className="card-body text-center">
          <h3 className="text-success mb-4">🎯 Daily Side Bet</h3>

          {submitted && !isResolved && (
            <div className="alert alert-success mb-4">
              <strong>✅ Entry Submitted!</strong>
              <p className="mb-0">1 Mini Game Token has been deducted.</p>
            </div>
          )}

          <div className="alert alert-info">
            <h5 className="mb-3">Today's Question:</h5>
            <p className="lead">{sideBetQuestion.question}</p>
          </div>

          <div className="card bg-light mt-4">
            <div className="card-body">
              <h6 className="text-muted">Your Answer:</h6>
              <h4 className="text-primary mb-0">{previousEntry.answer}</h4>
            </div>
          </div>

          {isResolved ? (
            <div className={`alert ${isCorrect ? 'alert-success' : 'alert-warning'} mt-4`}>
              <h5>Results:</h5>
              <p className="mb-2">
                Correct Answer: <strong>{sideBetQuestion.correct_answer}</strong>
              </p>
              <p className="mb-0">
                {isCorrect ? (
                  <>
                    <strong>🎉 Congratulations!</strong>
                    <br />
                    You won 1 Bet Token!
                  </>
                ) : (
                  <>
                    <strong>Better luck next time!</strong>
                    <br />
                    Your answer was incorrect.
                  </>
                )}
              </p>
            </div>
          ) : (
            <div className="alert alert-warning mt-4">
              <p className="mb-2">
                ⏳ This side bet has not been resolved yet. Check back later to see if you won!
              </p>
              <button 
                className="btn btn-outline-primary btn-sm mt-2"
                onClick={handleCheckResults}
                disabled={checkingResults}
              >
                {checkingResults ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Checking Game...
                  </>
                ) : (
                  '🔄 Check Results Now'
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="alert alert-danger mt-3">
              {error}
            </div>
          )}

          <button className="btn btn-primary btn-lg mt-4" onClick={handleFinish}>
            Back to Mini Games
          </button>
        </div>
      </div>
    );
  }

  if (!sideBetQuestion) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-warning" role="alert">
            No side bet available at this time.
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h3 className="text-center text-success mb-4">🎯 Daily Side Bet</h3>
          <div className="alert alert-warning">
            <strong>⚠️ Entry Cost:</strong> 1 Mini Game Token
          </div>
          <div className="alert alert-info mb-4">
            <h5 className="mb-3">Today's Question:</h5>
            <p className="lead mb-0">{sideBetQuestion.question}</p>
          </div>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <div className="form-group">
            <label>
              <strong>Your Answer:</strong>
            </label>
            <div className="d-flex gap-3 mt-2 mb-2">
              <div
                className={`btn btn-lg btn-outline-primary flex-fill${selectedAnswer === sideBetQuestion.home_team_abbrev ? ' active' : ''}`}
                style={{ cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.6 : 1 }}
                onClick={() => !submitting && setSelectedAnswer(sideBetQuestion.home_team_abbrev)}
              >
                {sideBetQuestion.home_team_abbrev}
              </div>
              <div
                className={`btn btn-lg btn-outline-primary flex-fill${selectedAnswer === sideBetQuestion.away_team_abbrev ? ' active' : ''}`}
                style={{ cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.6 : 1 }}
                onClick={() => !submitting && setSelectedAnswer(sideBetQuestion.away_team_abbrev)}
              >
                {sideBetQuestion.away_team_abbrev}
              </div>
            </div>
            <small className="form-text text-muted">
              Click a team to select your answer.
            </small>
          </div>
          <div className="d-flex justify-content-between mt-4">
            <button
              className="btn btn-secondary"
              onClick={onComplete}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              className="btn btn-success btn-lg"
              onClick={handleSubmit}
              disabled={submitting || !selectedAnswer}
            >
              {submitting ? 'Submitting...' : 'Submit Entry (1 Token)'}
            </button>
          </div>
          <div className="alert alert-info mt-4 mb-0">
            <small>
              <strong>How it works:</strong> Submit your answer to enter. If correct when resolved, 
              you'll earn 1 Bet Token that can be used for regular bets!
            </small>
          </div>
          {recentEntry && recentQuestion && (
            <div className="alert alert-secondary mb-4">
              <h5 className="mb-2">Your Previous Side Bet</h5>
              <div><strong>Date:</strong> {recentEntry.bet_date}</div>
              <div><strong>Question:</strong> {recentQuestion.question}</div>
              <div><strong>Your Answer:</strong> {recentEntry.answer}</div>
              {recentQuestion.resolved_at ? (
                <div className={`mt-2 ${recentEntry.answer.toLowerCase() === recentQuestion.correct_answer?.toLowerCase() ? 'text-success' : 'text-danger'}`}>
                  <strong>Result:</strong> {recentEntry.answer.toLowerCase() === recentQuestion.correct_answer?.toLowerCase() ? 'Correct! 🎉' : 'Incorrect'}
                  <br/>
                  <span>Correct Answer: <strong>{recentQuestion.correct_answer}</strong></span>
                </div>
              ) : (
                <div className="mt-2 text-warning">
                  <strong>Result:</strong> Pending (game not finished)
                  <br/>
                  <button 
                    className="btn btn-outline-primary btn-sm mt-2"
                    onClick={handleCheckPreviousResults}
                    disabled={checkingResults}
                  >
                    {checkingResults ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Checking Game...
                      </>
                    ) : (
                      '🔄 Check Results Now'
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <SideBetLeaderboard />
    </>
  );
};

export { DailySideBet };
