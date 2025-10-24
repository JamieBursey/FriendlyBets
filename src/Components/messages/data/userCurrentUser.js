// src/hooks/useCurrentUser.js
import { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";

export const useCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const {
          data: { user },
          error
        } = await supabase.auth.getUser();

        if (error) throw error;
        setUser(user || null);
      } catch (err) {
        console.error("Error fetching current user:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};
