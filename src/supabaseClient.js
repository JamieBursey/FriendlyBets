import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log("supabase", supabaseAnonKey);
console.log("Supabase URL:", process.env.REACT_APP_SUPABASE_URL);
console.log("Supabase Key:", process.env.REACT_APP_SUPABASE_KEY);
