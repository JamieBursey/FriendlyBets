import { supabase } from "../../supabaseClient";

export const checkAndUpdateTokens = async (user) => {
  if (!user) return;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 1); // 12:01 AM today

  const lastUpdate = new Date(user.last_token_update);

  if (user.betToken === 0 && lastUpdate < startOfToday) {
    // Add one token and update the last_token_update timestamp
    const { error } = await supabase
      .from("users")
      .update({
        betToken: 1,
        last_token_update: new Date().toISOString(),
      })
      .eq("public_user_id", user.public_user_id);

    if (error) {
      console.error("Error updating tokens:", error);
      return;
    }

    // Return the updated user
    return {
      ...user,
      betToken: 1,
      last_token_update: new Date().toISOString(),
    };
  }

  return user;
};
