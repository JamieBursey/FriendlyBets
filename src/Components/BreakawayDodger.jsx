import React, { useState, useEffect, useRef } from 'react';
import { getTodayISODate, submitBreakawayResult } from '../Data/MiniGamesHelpers';

const BreakawayDodger = ({ userId, onComplete }) => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const touchStartXRef = useRef(null);
  const playerPosRef = useRef({ x: 0, y: 0 });
  const defendersRef = useRef([]);
  const [gameState, setGameState] = useState('idle'); // idle, playing, won, lost
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [defenders, setDefenders] = useState([]);
  const [resultMessage, setResultMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Game constants
  const GAME_WIDTH = 300;
  const GAME_HEIGHT = 500;
  const PLAYER_SIZE = 30;
  const DEFENDER_WIDTH = 40;
  const DEFENDER_HEIGHT = 20;
  const PLAYER_SPEED = 3;
  const DEFENDER_SPEED = 2;
  const GOALIE_Y = 50;

  // Initialize player position
  useEffect(() => {
    const initialPos = {
      x: GAME_WIDTH / 2 - PLAYER_SIZE / 2,
      y: GAME_HEIGHT - 80
    };
    playerPosRef.current = initialPos;
    setPlayerPos(initialPos);
  }, []);

  // Keyboard controls
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        const newX = Math.max(0, playerPosRef.current.x - PLAYER_SPEED * 3);
        playerPosRef.current = { ...playerPosRef.current, x: newX };
        setPlayerPos({ ...playerPosRef.current });
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        const newX = Math.min(GAME_WIDTH - PLAYER_SIZE, playerPosRef.current.x + PLAYER_SPEED * 3);
        playerPosRef.current = { ...playerPosRef.current, x: newX };
        setPlayerPos({ ...playerPosRef.current });
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        const newY = Math.max(0, playerPosRef.current.y - PLAYER_SPEED * 3);
        playerPosRef.current = { ...playerPosRef.current, y: newY };
        setPlayerPos({ ...playerPosRef.current });
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        const newY = Math.min(GAME_HEIGHT - PLAYER_SIZE, playerPosRef.current.y + PLAYER_SPEED * 3);
        playerPosRef.current = { ...playerPosRef.current, y: newY };
        setPlayerPos({ ...playerPosRef.current });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Touch controls for mobile
  const handleTouchStart = (e) => {
    if (gameState !== 'playing') return;
    e.preventDefault();
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
  };

  const handleTouchMove = (e) => {
    if (gameState !== 'playing' || touchStartXRef.current === null) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const touchX = touch.clientX;
    const deltaX = touchX - touchStartXRef.current;
    
    // More responsive - move immediately with any swipe
    if (Math.abs(deltaX) > 2) {
      const newX = Math.max(0, Math.min(GAME_WIDTH - PLAYER_SIZE, playerPosRef.current.x + deltaX * 0.8));
      playerPosRef.current = { ...playerPosRef.current, x: newX };
      setPlayerPos({ ...playerPosRef.current });
      touchStartXRef.current = touchX;
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    touchStartXRef.current = null;
  };

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const checkCollisions = (currentPlayerPos, currentDefenders) => {
      for (let defender of currentDefenders) {
        if (
          currentPlayerPos.x < defender.x + DEFENDER_WIDTH &&
          currentPlayerPos.x + PLAYER_SIZE > defender.x &&
          currentPlayerPos.y < defender.y + DEFENDER_HEIGHT &&
          currentPlayerPos.y + PLAYER_SIZE > defender.y
        ) {
          handleLoss();
          return true;
        }
      }
      return false;
    };

    const gameLoop = () => {
      // Move player forward automatically
      const newPlayerY = playerPosRef.current.y - PLAYER_SPEED;
      
      // Check if reached goalie (WIN)
      if (newPlayerY <= GOALIE_Y) {
        handleWin();
        return;
      }
      
      // Update player position
      playerPosRef.current = { ...playerPosRef.current, y: newPlayerY };
      setPlayerPos({ ...playerPosRef.current });

      // Update defenders
      const newDefenders = defendersRef.current.map(defender => {
        let newX = defender.x + defender.direction * DEFENDER_SPEED;
        let newDirection = defender.direction;

        // Bounce off walls
        if (newX <= 0 || newX >= GAME_WIDTH - DEFENDER_WIDTH) {
          newDirection *= -1;
          newX = Math.max(0, Math.min(GAME_WIDTH - DEFENDER_WIDTH, newX));
        }

        return { ...defender, x: newX, direction: newDirection };
      });
      
      defendersRef.current = newDefenders;
      setDefenders(newDefenders);

      // Check collisions with updated positions
      const collided = checkCollisions(playerPosRef.current, defendersRef.current);
      
      if (!collided) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  const handleWin = async () => {
    setGameState('won');
    setSubmitting(true);

    try {
      const today = getTodayISODate();
      const result = await submitBreakawayResult(today, true);
      setResultMessage(result.message);
    } catch (err) {
      console.error('Error submitting win:', err);
      setResultMessage('Victory! (Error recording result)');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoss = async () => {
    setGameState('lost');
    setSubmitting(true);

    try {
      const today = getTodayISODate();
      const result = await submitBreakawayResult(today, false);
      setResultMessage(result.message || 'Try again!');
    } catch (err) {
      console.error('Error submitting loss:', err);
      setResultMessage('Try again!');
    } finally {
      setSubmitting(false);
    }
  };

  const startGame = () => {
    // Reset player position
    const initialPlayerPos = {
      x: GAME_WIDTH / 2 - PLAYER_SIZE / 2,
      y: GAME_HEIGHT - 80
    };
    playerPosRef.current = initialPlayerPos;
    setPlayerPos(initialPlayerPos);

    // Create defenders at different heights
    const newDefenders = [
      { x: 50, y: 350, direction: 1 },
      { x: 200, y: 280, direction: -1 },
      { x: 100, y: 210, direction: 1 },
      { x: 150, y: 140, direction: -1 },
    ];
    defendersRef.current = newDefenders;
    setDefenders(newDefenders);

    setGameState('playing');
    setResultMessage('');
  };

  const resetGame = () => {
    setGameState('idle');
    setResultMessage('');
    if (onComplete) {
      onComplete();
    }
  };

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw ice rink background
    ctx.fillStyle = '#e8f4f8';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw center line
    ctx.strokeStyle = '#c0d6dd';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(0, GAME_HEIGHT / 2);
    ctx.lineTo(GAME_WIDTH, GAME_HEIGHT / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw goalie zone (top)
    ctx.fillStyle = '#b3d9ff';
    ctx.fillRect(0, 0, GAME_WIDTH, GOALIE_Y + 30);
    ctx.strokeStyle = '#0066cc';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, GAME_WIDTH, GOALIE_Y + 30);

    // Draw goalie
    ctx.fillStyle = '#cc0000';
    ctx.fillRect(GAME_WIDTH / 2 - 20, GOALIE_Y, 40, 20);
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🥅', GAME_WIDTH / 2, GOALIE_Y + 15);

    if (gameState === 'playing') {
      // Draw defenders
      defenders.forEach(defender => {
        ctx.fillStyle = '#333';
        ctx.fillRect(defender.x, defender.y, DEFENDER_WIDTH, DEFENDER_HEIGHT);
        ctx.fillStyle = '#fff';
        ctx.fillText('D', defender.x + DEFENDER_WIDTH / 2, defender.y + 14);
      });

      // Draw player
      ctx.fillStyle = '#0066cc';
      ctx.beginPath();
      ctx.arc(
        playerPos.x + PLAYER_SIZE / 2,
        playerPos.y + PLAYER_SIZE / 2,
        PLAYER_SIZE / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.fillText('⛸️', playerPos.x + PLAYER_SIZE / 2, playerPos.y + PLAYER_SIZE / 2 + 4);
    }
  }, [gameState, playerPos, defenders]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🏒 Breakaway Dodger</h2>
        <p style={styles.subtitle}>Dodge defenders and reach the goalie!</p>
      </div>

      <div style={styles.gameWrapper}>
        <canvas
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          style={styles.canvas}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        {gameState === 'idle' && (
          <div style={styles.overlay}>
            <button style={styles.startButton} onClick={startGame}>
              Start Game
            </button>
            <div style={styles.instructions}>
              <p><strong>Desktop:</strong> Arrow keys or WASD</p>
              <p><strong>Mobile:</strong> Swipe left/right</p>
            </div>
          </div>
        )}

        {(gameState === 'won' || gameState === 'lost') && (
          <div style={styles.overlay}>
            <div style={gameState === 'won' ? styles.winBox : styles.lossBox}>
              <h3 style={styles.resultTitle}>
                {gameState === 'won' ? '🎉 GOAL!' : '💥 BLOCKED!'}
              </h3>
              <p style={styles.resultMessage}>{resultMessage}</p>
              {submitting && <p style={styles.submitting}>Recording result...</p>}
              <button
                style={styles.playAgainButton}
                onClick={startGame}
                disabled={submitting}
              >
                Play Again
              </button>
              <button
                style={styles.backButton}
                onClick={resetGame}
                disabled={submitting}
              >
                Back to Mini Games
              </button>
            </div>
          </div>
        )}
      </div>

      {gameState === 'playing' && (
        <div style={styles.hint}>
          <p>Swipe left/right or use arrow keys to dodge!</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '400px',
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
    color: '#0066cc',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  gameWrapper: {
    position: 'relative',
    width: '300px',
    height: '500px',
    margin: '0 auto',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  canvas: {
    display: 'block',
    width: '100%',
    height: '100%',
    touchAction: 'none',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  startButton: {
    backgroundColor: '#0066cc',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    fontSize: '20px',
    fontWeight: 'bold',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '20px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
  },
  instructions: {
    color: '#fff',
    textAlign: 'center',
    fontSize: '14px',
    lineHeight: 1.6,
  },
  winBox: {
    backgroundColor: '#d4edda',
    border: '2px solid #28a745',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    maxWidth: '280px',
  },
  lossBox: {
    backgroundColor: '#f8d7da',
    border: '2px solid #dc3545',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    maxWidth: '280px',
  },
  resultTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '12px',
    marginTop: 0,
  },
  resultMessage: {
    fontSize: '16px',
    marginBottom: '20px',
    fontWeight: '500',
  },
  submitting: {
    fontSize: '12px',
    color: '#666',
    fontStyle: 'italic',
  },
  playAgainButton: {
    backgroundColor: '#0066cc',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '10px',
    width: '100%',
  },
  backButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    fontSize: '14px',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%',
  },
  hint: {
    textAlign: 'center',
    marginTop: '16px',
    color: '#666',
    fontSize: '14px',
  },
};

export default BreakawayDodger;
