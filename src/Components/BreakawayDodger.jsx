import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getTodayISODate, submitBreakawayResult } from '../Data/MiniGamesHelpers';

const BreakawayDodger = ({ userId, onComplete }) => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const touchStartXRef = useRef(null);
  const playerPosRef = useRef({ x: 0, y: 0 });
  const defendersRef = useRef([]);
  const playerImagesRef = useRef({}); // Reference for all player images
  const defenderImagesRef = useRef({}); // Reference for all defender images
  const [gameState, setGameState] = useState('idle'); // idle, countdown, playing, won, lost
  const [countdown, setCountdown] = useState(3);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [defenders, setDefenders] = useState([]);
  const [resultMessage, setResultMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [playerIcon, setPlayerIcon] = useState('🏒'); // Default to hockey stick
  const [defenderIcon, setDefenderIcon] = useState('D'); // Default to 'D' block

  // Detect if mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

  // Game constants - slower on mobile
  const GAME_WIDTH = 300;
  const GAME_HEIGHT = 500;
  const PLAYER_SIZE = 30;
  const DEFENDER_WIDTH = 40;
  const DEFENDER_HEIGHT = 20;
  const PLAYER_SPEED = isMobile ? 1.5 : 3; // Half speed on mobile
  const DEFENDER_SPEED = isMobile ? 1.5 : 2; // Half speed on mobile
  const GOALIE_Y = 50;

  // Load all player images
  useEffect(() => {
    const imagesToLoad = {
      skate: '/miniGamesImages/skates.png',
      girlPlayer: '/miniGamesImages/girlPlayer.png',
      manPlayer: '/miniGamesImages/manPlayer.png'
    };

    Object.keys(imagesToLoad).forEach(key => {
      const img = new Image();
      img.src = imagesToLoad[key];
      img.onload = () => {
        playerImagesRef.current[key] = img;
      };
    });
  }, []);

  // Load all defender images
  useEffect(() => {
    const defenderImagesToLoad = {
      manDefender: '/miniGamesImages/manDefender.png',
      girlDefender: '/miniGamesImages/girlDefender.png'
    };

    Object.keys(defenderImagesToLoad).forEach(key => {
      const img = new Image();
      img.src = defenderImagesToLoad[key];
      img.onload = () => {
        defenderImagesRef.current[key] = img;
      };
    });
  }, []);

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
  }, [gameState, PLAYER_SPEED]);

  // Touch controls for mobile
  const handleTouchStart = useCallback((e) => {
    if (gameState !== 'playing') return;
    e.preventDefault();
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
  }, [gameState]);

  const handleTouchMove = useCallback((e) => {
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
  }, [gameState, GAME_WIDTH, PLAYER_SIZE]);

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    touchStartXRef.current = null;
  }, []);

  // Attach touch listeners with passive: false
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Countdown timer
  useEffect(() => {
    if (gameState !== 'countdown') return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Countdown finished, start game
      setGameState('playing');
    }
  }, [gameState, countdown]);

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

    setResultMessage('');
    setCountdown(3);
    setGameState('countdown'); // Start with countdown
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
        const imageDefenders = ['manDefender', 'girlDefender'];
        if (imageDefenders.includes(defenderIcon) && defenderImagesRef.current[defenderIcon]) {
          // Draw defender image
          const defenderImgSize = 30;
          ctx.drawImage(
            defenderImagesRef.current[defenderIcon],
            defender.x + DEFENDER_WIDTH / 2 - defenderImgSize / 2,
            defender.y + DEFENDER_HEIGHT / 2 - defenderImgSize / 2,
            defenderImgSize,
            defenderImgSize
          );
        } else {
          // Draw default 'D' block
          ctx.fillStyle = '#333';
          ctx.fillRect(defender.x, defender.y, DEFENDER_WIDTH, DEFENDER_HEIGHT);
          ctx.fillStyle = '#fff';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('D', defender.x + DEFENDER_WIDTH / 2, defender.y + DEFENDER_HEIGHT / 2);
        }
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
      
      // Draw player icon
      const imageIcons = ['skate', 'girlPlayer', 'manPlayer'];
      if (imageIcons.includes(playerIcon) && playerImagesRef.current[playerIcon]) {
        // Draw the actual image
        const imgSize = 24;
        ctx.drawImage(
          playerImagesRef.current[playerIcon],
          playerPos.x + PLAYER_SIZE / 2 - imgSize / 2,
          playerPos.y + PLAYER_SIZE / 2 - imgSize / 2,
          imgSize,
          imgSize
        );
      } else {
        // Draw emoji icon
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(playerIcon, playerPos.x + PLAYER_SIZE / 2, playerPos.y + PLAYER_SIZE / 2 + 2);
      }
    }
  }, [gameState, playerPos, defenders, playerIcon, defenderIcon]);

  return (
    <div style={styles.container}>
      <style>{`
        .icon-scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
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
        />

        {gameState === 'idle' && (
          <div style={styles.overlay}>
            <div style={styles.iconSelector}>
              <p style={styles.iconLabel}>Choose Your Icon:</p>
              <div className="icon-scroll-container" style={styles.iconScrollContainer}>
                <div style={styles.iconOptions}>
                  <button
                    style={{
                      ...styles.iconButton,
                      ...(playerIcon === '🏒' ? styles.iconButtonActive : {})
                    }}
                    onClick={() => setPlayerIcon('🏒')}
                    title="Hockey Stick"
                  >
                    🏒
                  </button>
                  <button
                    style={{
                      ...styles.iconButton,
                      ...(playerIcon === '⛸️' ? styles.iconButtonActive : {})
                    }}
                    onClick={() => setPlayerIcon('⛸️')}
                    title="Figure Skate"
                  >
                    ⛸️
                  </button>
                  <button
                    style={{
                      ...styles.iconButton,
                      ...(playerIcon === 'skate' ? styles.iconButtonActive : {})
                    }}
                    onClick={() => setPlayerIcon('skate')}
                    title="Hockey Skate"
                  >
                    <img 
                      src="/miniGamesImages/skates.png" 
                      alt="Hockey Skate"
                      style={{width: '32px', height: '32px', display: 'block'}}
                    />
                  </button>
                  <button
                    style={{
                      ...styles.iconButton,
                      ...(playerIcon === 'girlPlayer' ? styles.iconButtonActive : {})
                    }}
                    onClick={() => setPlayerIcon('girlPlayer')}
                    title="Girl Player"
                  >
                    <img 
                      src="/miniGamesImages/girlPlayer.png" 
                      alt="Girl Player"
                      style={{width: '32px', height: '32px', display: 'block'}}
                    />
                  </button>
                  <button
                    style={{
                      ...styles.iconButton,
                      ...(playerIcon === 'manPlayer' ? styles.iconButtonActive : {})
                    }}
                    onClick={() => setPlayerIcon('manPlayer')}
                    title="Man Player"
                  >
                    <img 
                      src="/miniGamesImages/manPlayer.png" 
                      alt="Man Player"
                      style={{width: '32px', height: '32px', display: 'block'}}
                    />
                  </button>
                </div>
              </div>
            </div>
            
            <div style={styles.iconSelector}>
              <p style={styles.iconLabel}>Choose Defender Style:</p>
              <div className="icon-scroll-container" style={styles.iconScrollContainer}>
                <div style={styles.iconOptions}>
                  <button
                    style={{
                      ...styles.iconButton,
                      ...(defenderIcon === 'D' ? styles.iconButtonActive : {})
                    }}
                    onClick={() => setDefenderIcon('D')}
                    title="Default Block"
                  >
                    <div style={{fontSize: '20px', fontWeight: 'bold'}}>D</div>
                  </button>
                  <button
                    style={{
                      ...styles.iconButton,
                      ...(defenderIcon === 'manDefender' ? styles.iconButtonActive : {})
                    }}
                    onClick={() => setDefenderIcon('manDefender')}
                    title="Man Defender"
                  >
                    <img 
                      src="/miniGamesImages/manDefender.png" 
                      alt="Man Defender"
                      style={{width: '32px', height: '32px', display: 'block'}}
                    />
                  </button>
                  <button
                    style={{
                      ...styles.iconButton,
                      ...(defenderIcon === 'girlDefender' ? styles.iconButtonActive : {})
                    }}
                    onClick={() => setDefenderIcon('girlDefender')}
                    title="Girl Defender"
                  >
                    <img 
                      src="/miniGamesImages/girlDefender.png" 
                      alt="Girl Defender"
                      style={{width: '32px', height: '32px', display: 'block'}}
                    />
                  </button>
                </div>
              </div>
            </div>
            
            <button style={styles.startButton} onClick={startGame}>
              Start Game
            </button>
            <div style={styles.instructions}>
              <p><strong>Desktop:</strong> Arrow keys or WASD</p>
              <p><strong>Mobile:</strong> Swipe left/right</p>
              {isMobile && (
                <p style={styles.mobileNotice}>
                  ⚡ Mobile speed: Slower for easier control
                </p>
              )}
            </div>
          </div>
        )}

        {gameState === 'countdown' && (
          <div style={styles.overlay}>
            <div style={styles.countdownBox}>
              <div style={styles.countdownNumber}>
                {countdown === 0 ? 'GO!' : countdown}
              </div>
              <p style={styles.countdownText}>Get Ready!</p>
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
  mobileNotice: {
    color: '#ffd700',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  countdownBox: {
    backgroundColor: 'rgba(0, 102, 204, 0.95)',
    borderRadius: '20px',
    padding: '40px',
    textAlign: 'center',
    minWidth: '200px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
  },
  countdownNumber: {
    fontSize: '80px',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '10px',
    textShadow: '0 4px 8px rgba(0,0,0,0.5)',
  },
  countdownText: {
    fontSize: '20px',
    color: '#fff',
    margin: 0,
    fontWeight: '500',
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
  iconSelector: {
    marginBottom: '24px',
    textAlign: 'center',
  },
  iconLabel: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '12px',
  },
  iconScrollContainer: {
    width: '240px', // Show 3 icons at a time (60px * 3 + gaps)
    overflowX: 'auto',
    overflowY: 'hidden',
    margin: '0 auto',
    padding: '8px 0',
    WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
    scrollbarWidth: 'none', // Firefox - hide scrollbar
    msOverflowStyle: 'none', // IE and Edge - hide scrollbar
  },
  iconOptions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-start',
    paddingLeft: '8px',
    paddingRight: '8px',
  },
  iconButton: {
    backgroundColor: '#333',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: '#555',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '32px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minWidth: '60px',
    flexShrink: 0, // Prevent buttons from shrinking
  },
  iconButtonActive: {
    backgroundColor: '#0066cc',
    borderColor: '#0099ff',
    transform: 'scale(1.1)',
    boxShadow: '0 4px 12px rgba(0, 102, 204, 0.5)',
  },
};

export default BreakawayDodger;
