import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function useAuthListener() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          navigate("/FriendlyBets");
        } else if (event === "SIGNED_OUT") {
          navigate("/login");
        }
      }
    );
  }, [navigate]);

  // Optionally, this custom hook can return auth state or user info if needed elsewhere
}

export default useAuthListener;
