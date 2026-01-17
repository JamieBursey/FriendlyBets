import React, { useEffect, useState } from 'react';
import {
  getTodayISODate,
  generateDailyTrivia,
  fetchTodayTriviaSet,
  fetchTriviaAttempt,
  submitTriviaAttempt,
  fetchUserTokens
} from '../Data/MiniGamesHelpers';

const DailyTriviaGame = ({ userId, onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [triviaSet, setTriviaSet] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [attempt, setAttempt] = useState(null);
  const [userTokens, setUserTokens] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [today] = useState(getTodayISODate());

  useEffect(() => {
    loadTriviaData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTriviaData = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, try to generate today's trivia (lazy generation)
      try {
        await generateDailyTrivia();
      } catch (genError) {
        console.warn('Edge function call failed (may not be deployed):', genError);
        // Continue even if edge function fails - we might have dummy data
      }

      // Fetch in parallel: trivia set, attempt, and user tokens
      const [triviaData, attemptData, tokensData] = await Promise.allSettled([
        fetchTodayTriviaSet(today),
        fetchTriviaAttempt(today),
        fetchUserTokens()
      ]);

      // Handle trivia set
      if (triviaData.status === 'fulfilled') {
        setTriviaSet(triviaData.value);
        setQuestions(triviaData.value.questions || []);
      } else if (triviaData.reason?.message?.includes('No trivia available')) {
        // No trivia set for today - show message
        setTriviaSet(null);
      } else {
        throw triviaData.reason;
      }

      // Handle attempt
      if (attemptData.status === 'fulfilled' && attemptData.value) {
        setAttempt(attemptData.value);
      }

      // Handle tokens
      if (tokensData.status === 'fulfilled') {
        setUserTokens(tokensData.value);
      }

    } catch (err) {
      console.error('Error loading trivia data:', err);
      setError('Failed to load trivia game. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      // Calculate score
      let score = 0;
      questions.forEach((question, index) => {
        if (selectedAnswers[index] === question.correctIndex) {
          score++;
        }
      });

      const total = questions.length;

      // Call RPC to submit attempt (awards token if passed)
      await submitTriviaAttempt(today, score, total, selectedAnswers);

      // Refetch attempt and tokens
      const [newAttempt, newTokens] = await Promise.all([
        fetchTriviaAttempt(today),
        fetchUserTokens()
      ]);

      setAttempt(newAttempt);
      setUserTokens(newTokens);

    } catch (err) {
      console.error('Error submitting trivia:', err);
      setError('Failed to submit your answers. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const allQuestionsAnswered = questions.length > 0 && 
    questions.every((_, index) => selectedAnswers[index] !== undefined);

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-3">Loading Daily Trivia...</p>
        </div>
      </div>
    );
  }

  if (error) {
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

  // No trivia set available
  if (!triviaSet) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <h3 className="text-info mb-4">📚 Daily Trivia</h3>
          <div className="alert alert-info">
            <h5>Trivia will be available soon</h5>
            <p className="mb-0">Check back later for today's trivia challenge!</p>
          </div>
          {userTokens && (
            <div className="mt-4">
              <p className="text-muted">Your Tokens:</p>
              <p>
                🎟️ Mini Game Tokens: <strong>{userTokens.miniGameToken || 0}</strong>
                {' | '}
                🎲 Bet Tokens: <strong>{userTokens.betToken || 0}</strong>
              </p>
            </div>
          )}
          <button className="btn btn-primary mt-3" onClick={onComplete}>
            Back to Mini Games
          </button>
        </div>
      </div>
    );
  }

  // User already played today
  if (attempt) {
    return (
      <div className="card">
        <div className="card-body">
          <h3 className="text-center text-info mb-4">📚 Daily Trivia - Completed</h3>
          
          {userTokens && (
            <div className="mb-4 p-3 bg-light rounded text-center">
              <p className="mb-1 text-muted">Your Current Tokens:</p>
              <p className="mb-0">
                🎟️ Mini Game Tokens: <strong className="text-warning">{userTokens.miniGameToken || 0}</strong>
                {' | '}
                🎲 Bet Tokens: <strong className="text-success">{userTokens.betToken || 0}</strong>
              </p>
            </div>
          )}

          <div className={`alert ${attempt.passed ? 'alert-success' : 'alert-warning'} text-center`}>
            <h4>Today's Result</h4>
            <h2 className="mb-3">{attempt.score}/{attempt.total}</h2>
            <p className="mb-0">
              {attempt.passed ? (
                <>
                  ✅ <strong>Passed!</strong> You earned 1 Mini Game Token!
                </>
              ) : (
                <>
                  ❌ Did not pass. Need 3/5 to earn a token.
                </>
              )}
            </p>
          </div>

          {/* Show questions with correct answers */}
          <h5 className="mt-4 mb-3">Answer Key:</h5>
          {questions.map((question, qIndex) => {
            // Parse selected answers - could be object or need conversion from string keys
            const selectedAnswers = attempt.selected_answers || {};
            const userSelectedIndex = selectedAnswers[qIndex] !== undefined 
              ? Number(selectedAnswers[qIndex]) 
              : null;
            const correctIndex = question.correctIndex;
            const userWasCorrect = userSelectedIndex !== null && userSelectedIndex === correctIndex;

            return (
              <div key={qIndex} className="card mb-3 border-secondary">
                <div className="card-body">
                  <h6 className="text-muted mb-2">
                    Question {qIndex + 1}
                    {userWasCorrect ? (
                      <span className="badge bg-success ms-2">✓ Correct</span>
                    ) : (
                      <span className="badge bg-danger ms-2">✗ Incorrect</span>
                    )}
                  </h6>
                  <p className="mb-3">{question.question}</p>
                  
                  <div className="row">
                    {question.answers.map((answer, aIndex) => {
                      const isCorrect = aIndex === correctIndex;
                      const userSelected = aIndex === userSelectedIndex;
                      
                      let bgClass = 'bg-light text-muted';
                      let borderStyle = '1px solid #dee2e6';
                      let icon = '';
                      
                      if (isCorrect) {
                        bgClass = 'bg-success text-white';
                        borderStyle = '2px solid #28a745';
                        icon = '✅ ';
                      } else if (userSelected && !isCorrect) {
                        bgClass = 'bg-danger text-white';
                        borderStyle = '2px solid #dc3545';
                        icon = '❌ ';
                      }
                      
                      return (
                        <div key={aIndex} className="col-md-6 mb-2">
                          <div
                            className={`p-2 rounded ${bgClass}`}
                            style={{ border: borderStyle }}
                          >
                            {icon}
                            {String.fromCharCode(65 + aIndex)}. {answer}
                            {userSelected && !isCorrect && <small className="d-block mt-1">(Your answer)</small>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
          
          <p className="text-center text-muted mt-4">Come back tomorrow for a new trivia challenge!</p>
          <div className="text-center">
            <button className="btn btn-primary mt-3" onClick={onComplete}>
              Back to Mini Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Play trivia
  return (
    <div className="card">
      <div className="card-body">
        <h3 className="text-center text-info mb-4">📚 Daily Trivia</h3>

        {userTokens && (
          <div className="mb-4 p-3 bg-light rounded text-center">
            <p className="mb-1 text-muted small">Your Current Tokens:</p>
            <p className="mb-0">
              🎟️ <strong className="text-warning">{userTokens.miniGameToken || 0}</strong>
              {' | '}
              🎲 <strong className="text-success">{userTokens.betToken || 0}</strong>
            </p>
          </div>
        )}

        <div className="alert alert-info mb-4">
          <strong>Instructions:</strong> Answer all 5 questions. Get 3 or more correct to earn 1 Mini Game Token!
        </div>

        {error && (
          <div className="alert alert-danger mb-3">
            {error}
          </div>
        )}

        {/* Render all 5 questions */}
        {questions.map((question, qIndex) => (
          <div key={qIndex} className="card mb-3 border-primary">
            <div className="card-body">
              <h5 className="card-title">
                Question {qIndex + 1} of {questions.length}
              </h5>
              <p className="lead mb-3">{question.question}</p>
              
              <div className="row">
                {question.answers.map((answer, aIndex) => (
                  <div key={aIndex} className="col-md-6 mb-2">
                    <button
                      type="button"
                      className={`btn btn-block w-100 ${
                        selectedAnswers[qIndex] === aIndex 
                          ? 'btn-primary' 
                          : 'btn-outline-primary'
                      }`}
                      onClick={() => handleAnswerSelect(qIndex, aIndex)}
                      disabled={submitting}
                    >
                      {String.fromCharCode(65 + aIndex)}. {answer}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Submit button */}
        <div className="text-center mt-4">
          {!allQuestionsAnswered && (
            <div className="alert alert-warning">
              Please answer all {questions.length} questions before submitting.
            </div>
          )}
          
          <button
            className="btn btn-success btn-lg"
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered || submitting}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                Submitting...
              </>
            ) : (
              'Submit Answers'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export { DailyTriviaGame };
