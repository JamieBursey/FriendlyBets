// src/components/messages/data/usePublicUserID.js
import { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";

export const usePublicUser = () => {
  const [publicUser, setPublicUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      // get signed-in user
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) {
        setError(authError);
        setLoading(false);
        return;
      }

      const authUser = authData?.user;
      if (!authUser) {
        setPublicUser(null);
        setLoading(false);
        return;
      }

      // FIX: find user by public_user_id, not id
      const { data, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("public_user_id", authUser.id) // ✅ this matches your table
        .single();

      if (userError) {
        setError(userError);
      } else {
        setPublicUser(data);
      }

      setLoading(false);
    };

    load();
  }, []);

  return { publicUser, loading, error };
};
