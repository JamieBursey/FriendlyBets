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
    .select('bet_date, question, correct_answer, resolved_at')
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
