import { supabase } from '../supabaseClient';

/**
 * Get today's date in YYYY-MM-DD format (local timezone)
 */
export const getTodayISODate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Fetch user's token balances (betToken and miniGameToken)
 */
export const fetchUserTokens = async () => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  
  if (!sessionData?.session) {
    throw new Error('No active session');
  }

  const authUserId = sessionData.session.user.id;

  const { data, error } = await supabase
    .from('users')
    .select('public_user_id, username, bettoken, minigametoken')
    .eq('public_user_id', authUserId)
    .single();

  if (error) throw error;
  
  // Map lowercase column names to camelCase for consistency
  return {
    ...data,
    betToken: data.bettoken,
    miniGameToken: data.minigametoken
  };
};

/**
 * Generate today's trivia by calling the edge function
 * This will lazily create trivia if it doesn't exist yet
 */
export const generateDailyTrivia = async () => {
  const { data, error } = await supabase.functions.invoke('generate-daily-trivia', {
    body: {}
  });

  if (error) throw error;
  return data;
};

/**
 * Generate today's side bet by calling the edge function
 * This will lazily create a side bet from NHL games if it doesn't exist yet
 */
export const generateDailySidebet = async () => {
  const betDate = getTodayISODate(); // Get date from frontend
  
  const { data, error } = await supabase.functions.invoke('generate-daily-sidebet', {
    body: { bet_date: betDate } // Pass the date to edge function
  });

  if (error) throw error;
  return data;
};

/**
 * Fetch today's trivia question set
 * @param {string} playDate - Date in YYYY-MM-DD format
 */
export const fetchTodayTriviaSet = async (playDate) => {
  const { data, error } = await supabase
    .from('daily_trivia_sets')
    .select('play_date, questions')
    .eq('play_date', playDate)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('No trivia available for this date');
    }
    throw error;
  }

  return data;
};

/**
 * Fetch user's trivia attempt for a specific date
 * @param {string} playDate - Date in YYYY-MM-DD format
 */
export const fetchTriviaAttempt = async (playDate) => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  
  if (!sessionData?.session) {
    throw new Error('No active session');
  }

  const authUserId = sessionData.session.user.id;

  const { data, error } = await supabase
    .from('daily_trivia_attempts')
    .select('score, total, passed, selected_answers, created_at')
    .eq('user_id', authUserId)
    .eq('play_date', playDate)
    .maybeSingle();

  if (error) throw error;
  return data; // Returns null if no attempt found
};

/**
 * Submit a trivia attempt (calls RPC function that awards tokens)
 * @param {string} playDate - Date in YYYY-MM-DD format
 * @param {number} score - Number of correct answers
 * @param {number} total - Total number of questions
 * @param {object} selectedAnswers - Object mapping question index to selected answer index
 */
export const submitTriviaAttempt = async (playDate, score, total, selectedAnswers) => {
  const { error } = await supabase.rpc('submit_daily_trivia_attempt', {
    p_play_date: playDate,
    p_score: score,
    p_total: total,
    p_selected_answers: selectedAnswers
  });

  if (error) throw error;
  
  // Return success indicator and whether user passed
  return {
    success: true,
    passed: score >= 3,
    score,
    total
  };
};

/**
 * Fetch today's side bet question
 * @param {string} betDate - Date in YYYY-MM-DD format
 */
export const fetchTodaySidebetQuestion = async (betDate) => {
  const { data, error } = await supabase
    .from('daily_sidebet_questions')
    .select('bet_date, game_id, home_team_abbrev, away_team_abbrev, home_team_name, away_team_name, question, correct_answer, resolved_at, game_state, home_score, away_score')
    .eq('bet_date', betDate)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('No side bet available for this date');
    }
    throw error;
  }

  return data;
};

/**
 * Fetch user's side bet entry for a specific date
 * @param {string} betDate - Date in YYYY-MM-DD format
 */
export const fetchSidebetEntry = async (betDate) => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  
  if (!sessionData?.session) {
    throw new Error('No active session');
  }

  const authUserId = sessionData.session.user.id;

  const { data, error } = await supabase
    .from('daily_sidebet_entries')
    .select('answer, created_at')
    .eq('user_id', authUserId)
    .eq('bet_date', betDate)
    .maybeSingle();

  if (error) throw error;
  return data; // Returns null if no entry found
};

/**
 * Enter a side bet (calls RPC function that deducts token)
 * @param {string} betDate - Date in YYYY-MM-DD format
 * @param {string} answer - User's answer
 */
export const enterSidebet = async (betDate, answer) => {
  const { error } = await supabase.rpc('enter_daily_sidebet', {
    p_bet_date: betDate,
    p_answer: answer
  });

  if (error) {
    // Handle specific error cases
    if (error.message.includes('insufficient') || error.message.includes('Insufficient')) {
      throw new Error('You need at least 1 Mini Game Token to enter');
    }
    if (error.message.includes('duplicate') || error.message.includes('already entered')) {
      throw new Error('You have already entered this side bet');
    }
    throw error;
  }

  return {
    success: true,
    answer
  };
};

/**
 * Check if a side bet needs resolution and return game ID if so
 * @param {string} betDate - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} - {needsChecking, gameId, resolved, correctAnswer}
 */
export const checkSidebetStatus = async (betDate) => {
  const { data, error } = await supabase
    .rpc('check_and_resolve_sidebet', {
      p_bet_date: betDate
    });

  if (error) throw error;
  
  // RPC returns an array with one row
  return data && data.length > 0 ? data[0] : null;
};

/**
 * Check game result from YOUR friendly-bets API
 * @param {string} gameId - The game ID
 * @returns {Promise<Object>} - Game result with scores and state
 */
export const checkGameResult = async (gameId) => {
  const apiUrl = `https://friendly-bets-back-end.vercel.app/api/gamecenter/${gameId}/play-by-play`;
  
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch game result');
  }

  const gameData = await response.json();

  // Check if game is finished (same logic as your CheckBets.js)
  const isGameFinished =
    gameData.gameState === "OFF" ||
    gameData.gameState === "FINAL" ||
    (gameData.clock?.timeRemaining === "00:00" && gameData.period >= 3);

  return {
    isFinished: isGameFinished,
    gameState: gameData.gameState,
    homeScore: gameData.homeTeam?.score || 0,
    awayScore: gameData.awayTeam?.score || 0
  };
};

/**
 * Update side bet result after checking game
 * @param {string} betDate - Date in YYYY-MM-DD format
 * @param {string} correctAnswer - Winning team abbrev
 * @param {number} homeScore - Home team score
 * @param {number} awayScore - Away team score
 * @param {string} gameState - Game state from API
 * @returns {Promise<number>} - Number of winners
 */
export const updateSidebetResult = async (betDate, correctAnswer, homeScore, awayScore, gameState) => {
  const { data, error } = await supabase
    .rpc('update_sidebet_result', {
      p_bet_date: betDate,
      p_correct_answer: correctAnswer,
      p_home_score: homeScore,
      p_away_score: awayScore,
      p_game_state: gameState
    });

  if (error) throw error;
  return data; // Returns winner count
};

/**
 * Fetch monthly trivia leaderboard (top 3)
 * @returns {Promise<Array>} - Array of top 3 users with username, total_correct, total_attempts, rank
 */
export const fetchTriviaLeaderboardMonthly = async () => {
  const { data, error } = await supabase
    .rpc('get_trivia_leaderboard_monthly');

  if (error) throw error;
  return data || [];
};

/**
 * Fetch all-time trivia leaderboard (top 3)
 * @returns {Promise<Array>} - Array of top 3 users with username, total_correct, total_attempts, rank
 */
export const fetchTriviaLeaderboardAllTime = async () => {
  const { data, error } = await supabase
    .rpc('get_trivia_leaderboard_alltime');

  if (error) throw error;
  return data || [];
};
