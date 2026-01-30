import { supabase } from '../supabaseClient';

export const fetchSideBetLeaderboardMonthly = async () => {
  const { data, error } = await supabase.rpc('get_daily_sidebet_leaderboard_monthly');
  if (error) throw error;
  return data;
};

/**
 * Fetch all-time leaderboard for daily side bet
 */
export const fetchSideBetLeaderboardAllTime = async () => {
  const { data, error } = await supabase.rpc('get_daily_sidebet_leaderboard_alltime');
  if (error) throw error;
  return data;
};


export const fetchSideBetLeaderboard = async () => {
  const { data, error } = await supabase.rpc('sidebet_leaderboard');
  if (error) throw error;
  return data;
};

/**
 * Fetch the user's most recent daily side bet entry (not just today)
 * Returns the most recent entry and its bet_date, or null if none found
 */
export const fetchMostRecentSidebetEntry = async () => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!sessionData?.session) throw new Error('No active session');
  const authUserId = sessionData.session.user.id;

  const { data, error } = await supabase
    .from('daily_sidebet_entries')
    .select('answer, bet_date, created_at')
    .eq('user_id', authUserId)
    .order('bet_date', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data; // { answer, bet_date, created_at } or null
};

/**
 * Fetch a side bet question by date
 */
export const fetchSidebetQuestionByDate = async (betDate) => {
  const { data, error } = await supabase
    .from('daily_sidebet_questions')
    .select('*')
    .eq('bet_date', betDate)
    .single();
  if (error) throw error;
  return data;
};
