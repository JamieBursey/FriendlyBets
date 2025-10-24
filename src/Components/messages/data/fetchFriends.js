// src/hooks/useFriends.js
import { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";

export const useFriends = (currentUserId) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchFriends = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("users")
        .select("friends") // your JSON column
        .eq("public_user_id", currentUserId)
        .single(); // get only one row

      if (error) {
        console.error("Error fetching friends:", error);
        setError(error);
      } else if (data) {
        setFriends(data.friends || []); // data.friends is an array of friend objects
      }

      setLoading(false);
    };

    fetchFriends();
  }, [currentUserId]);

  return { friends, loading, error };
};
