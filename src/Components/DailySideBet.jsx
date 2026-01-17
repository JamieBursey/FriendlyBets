import React, { useEffect, useState } from 'react';
import {
  getTodayISODate,
  fetchTodaySidebetQuestion,
  fetchSidebetEntry,
  enterSidebet
} from '../Data/MiniGamesHelpers';

const DailySideBet = ({ userId, onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sideBetQuestion, setSideBetQuestion] = useState(null);
  const [hasEnteredToday, setHasEnteredToday] = useState(false);
  const [previousEntry, setPreviousEntry] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadSideBet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadSideBet = async () => {
    try {
      setLoading(true);
      setError(null);

      const betDate = getTodayISODate();

      // Check if user has already entered today
      const entryData = await fetchSidebetEntry(betDate);

      if (entryData) {
        setHasEnteredToday(true);
        setPreviousEntry(entryData);
        
        // Also fetch the question to show results
        const questionData = await fetchTodaySidebetQuestion(betDate);
        setSideBetQuestion(questionData);
        setLoading(false);
        return;
      }

      // Load today's side bet question
      const questionData = await fetchTodaySidebetQuestion(betDate);
      setSideBetQuestion(questionData);
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
              <p className="mb-0">
                ⏳ This side bet has not been resolved yet. Check back later to see if you won!
              </p>
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
          <label htmlFor="answer-input">
            <strong>Your Answer:</strong>
          </label>
          <input
            id="answer-input"
            type="text"
            className="form-control form-control-lg"
            value={selectedAnswer}
            onChange={(e) => setSelectedAnswer(e.target.value)}
            placeholder="Enter your answer here..."
            disabled={submitting}
          />
          <small className="form-text text-muted">
            Be specific! Your answer will be compared to the correct answer.
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
            disabled={submitting || !selectedAnswer.trim()}
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
      </div>
    </div>
  );
};

export { DailySideBet };
