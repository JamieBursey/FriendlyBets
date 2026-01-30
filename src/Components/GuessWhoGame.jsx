import React, { useState } from 'react';
import guessWhoPlayers from '../Data/minigames/GuessWho';

const getRandomPlayer = () => {
  const idx = Math.floor(Math.random() * guessWhoPlayers.length);
  return guessWhoPlayers[idx];
};

const GuessWhoGame = () => {
  const [current, setCurrent] = useState(getRandomPlayer());
  const [hintIndex, setHintIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState(null);

  const handleNextHint = () => {
    if (hintIndex < current.hints.length - 1) {
      setHintIndex(hintIndex + 1);
    }
  };

  const handleGuess = () => {
    setRevealed(true);
    setResult(guess.trim().toLowerCase() === current.name.toLowerCase());
  };

  const handleNext = () => {
    setCurrent(getRandomPlayer());
    setHintIndex(0);
    setGuess('');
    setRevealed(false);
    setResult(null);
  };

  return (
    <div className="card mt-4" style={{ maxWidth: 500, margin: '0 auto' }}>
      <div className="card-body text-center">
        <h3 className="mb-3">🤔 Guess Who?</h3>
        <div className="mb-3">
          {current.hints.slice(0, hintIndex + 1).map((hint, i) => (
            <div key={i} className="alert alert-info py-2 my-2">{hint}</div>
          ))}
        </div>
        {!revealed && (
          <>
            {hintIndex < current.hints.length - 1 && (
              <button className="btn btn-outline-secondary mb-2" onClick={handleNextHint}>
                Show Next Hint
              </button>
            )}
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Your guess..."
                value={guess}
                onChange={e => setGuess(e.target.value)}
                disabled={revealed}
              />
              <button className="btn btn-success" onClick={handleGuess} disabled={!guess.trim()}>
                Guess
              </button>
            </div>
          </>
        )}
        {revealed && (
          <div className="mt-3">
            {result ? (
              <div className="alert alert-success">🎉 Correct! It was <strong>{current.name}</strong>!</div>
            ) : (
              <div className="alert alert-danger">❌ Sorry, the answer was <strong>{current.name}</strong>.</div>
            )}
            <button className="btn btn-primary mt-2" onClick={handleNext}>
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuessWhoGame;
