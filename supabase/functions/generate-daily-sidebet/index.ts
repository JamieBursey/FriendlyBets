/* eslint-disable no-undef */
// Edge function to generate daily side bet using friendly-bets API
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Get today's date in YYYY-MM-DD format
// Apply timezone offset to match local time (like frontend does)
function getTodayDate() {
  const now = new Date();
  // Adjust for timezone offset to get local date
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get bet_date from request body (passed from frontend)
    const { bet_date } = await req.json();
    const betDate = bet_date || getTodayDate(); // Fallback to server date if not provided

    // Check if today's side bet already exists (lazy generation)
    const { data: existingSidebet, error: checkError } = await supabase
      .from("daily_sidebet_questions")
      .select("bet_date")
      .eq("bet_date", betDate)
      .maybeSingle();

    if (checkError) {
      throw checkError;
    }

    // If today's side bet already exists, return skipped
    if (existingSidebet) {
      return new Response(
        JSON.stringify({
          ok: true,
          skipped: true,
          bet_date: betDate,
          message: "Side bet already exists for today",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Fetch today's games from YOUR friendly-bets API
    const apiUrl = "https://friendly-bets-back-end.vercel.app/api/now";
    const gamesResponse = await fetch(apiUrl);

    if (!gamesResponse.ok) {
      throw new Error("Failed to fetch games from friendly-bets API");
    }

    const gamesData = await gamesResponse.json();

    // Find today's games
    const todaysGames = gamesData.gameWeek.find((day) => day.date === betDate);
    
    if (!todaysGames || !todaysGames.games || todaysGames.games.length === 0) {
      // No games today
      return new Response(
        JSON.stringify({
          ok: false,
          no_games: true,
          bet_date: betDate,
          message: "No games scheduled for today",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Pick a random game from today
    const randomGame = todaysGames.games[Math.floor(Math.random() * todaysGames.games.length)];
    
    const gameId = String(randomGame.id);
    const homeTeamAbbrev = randomGame.homeTeam.abbrev;
    const awayTeamAbbrev = randomGame.awayTeam.abbrev;
    const homeTeamName = randomGame.homeTeam.placeName?.default || randomGame.homeTeam.commonName?.default || homeTeamAbbrev;
    const awayTeamName = randomGame.awayTeam.placeName?.default || randomGame.awayTeam.commonName?.default || awayTeamAbbrev;

    // Create the question
    const question = `Which team will win: ${awayTeamAbbrev} @ ${homeTeamAbbrev}?`;

    // Insert into database
    const { error: insertError } = await supabase
      .from("daily_sidebet_questions")
      .insert({
        bet_date: betDate,
        question: question,
        game_id: gameId,
        home_team_abbrev: homeTeamAbbrev,
        away_team_abbrev: awayTeamAbbrev,
        home_team_name: homeTeamName,
        away_team_name: awayTeamName,
        game_state: randomGame.gameState || 'FUT'
      });

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({
        ok: true,
        skipped: false,
        bet_date: betDate,
        game_id: gameId,
        question: question,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error generating side bet:", error);
    return new Response(
      JSON.stringify({
        ok: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
