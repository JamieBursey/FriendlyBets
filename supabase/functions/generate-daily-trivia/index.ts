/* eslint-disable no-undef */
// Deno global is available in Supabase Edge Functions runtime
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Decode HTML entities
function decodeHTMLEntities(text) {
  const entities = {
    "&quot;": '"',
    "&#039;": "'",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&apos;": "'",
    "&rsquo;": "'",
    "&ldquo;": '"',
    "&rdquo;": '"',
  };
  
  return text.replace(/&[#\w]+;/g, (entity) => {
    return entities[entity] || entity;
  });
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get today's date in YYYY-MM-DD format
function getTodayDateUTC() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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

    // Get today's date
    const playDate = getTodayDateUTC();

    // Check if today's trivia already exists (lazy generation)
    const { data: existingTrivia, error: checkError } = await supabase
      .from("daily_trivia_sets")
      .select("play_date")
      .eq("play_date", playDate)
      .maybeSingle();

    if (checkError) {
      throw checkError;
    }

    // If today's trivia already exists, return skipped
    if (existingTrivia) {
      return new Response(
        JSON.stringify({
          ok: true,
          skipped: true,
          play_date: playDate,
          message: "Trivia already exists for today",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Fetch 5 sports multiple-choice questions from Open Trivia DB
    const triviaResponse = await fetch(
      "https://opentdb.com/api.php?amount=5&category=21&type=multiple"
    );

    if (!triviaResponse.ok) {
      throw new Error("Failed to fetch trivia from Open Trivia DB");
    }

    const triviaData = await triviaResponse.json();

    if (triviaData.response_code !== 0 || !triviaData.results) {
      throw new Error(`Open Trivia DB error: ${triviaData.response_code}`);
    }

    // Transform API format to DB format
    const questions = triviaData.results.map((item) => {
      // Decode HTML entities
      const question = decodeHTMLEntities(item.question);
      const correctAnswer = decodeHTMLEntities(item.correct_answer);
      const incorrectAnswers = item.incorrect_answers.map((ans) =>
        decodeHTMLEntities(ans)
      );

      // Combine correct and incorrect answers
      const allAnswers = [...incorrectAnswers, correctAnswer];

      // Shuffle answers
      const shuffledAnswers = shuffleArray(allAnswers);

      // Find the index of the correct answer after shuffling
      const correctIndex = shuffledAnswers.indexOf(correctAnswer);

      return {
        question,
        answers: shuffledAnswers,
        correctIndex,
      };
    });

    // Upsert into daily_trivia_sets (only one set per day)
    const { error: insertError } = await supabase
      .from("daily_trivia_sets")
      .upsert(
        {
          play_date: playDate,
          questions: questions,
        },
        {
          onConflict: "play_date",
        }
      );

    if (insertError) {
      throw insertError;
    }

    // Return success response
    return new Response(
      JSON.stringify({
        ok: true,
        skipped: false,
        play_date: playDate,
        count: questions.length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error generating daily trivia:", error);
    
    return new Response(
      JSON.stringify({
        ok: false,
        error: error.message || "Failed to generate daily trivia",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
