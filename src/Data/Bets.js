
import { supabase } from "../supabaseClient";

const getAllBets = async () => {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) {
    console.error("Error fetching session:", sessionError);
    return [];
  }

  if (sessionData && sessionData.session) {
    const user = sessionData.session.user;
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("public_user_id", user.id)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
      return [];
    }

    const userId = userData.public_user_id;

    const { data: betsData, error: betsError } = await supabase
      .from("bets")
      .select("*")
      .or(`creator_id.eq.${userId},friend_id.eq.${userId}`);

    if (betsError) {
      console.error("Error fetching bets data:", betsError);
      return [];
    }

    return betsData;
  }

  return [];
};

const getPlayerIdByName = (playerName, resultsData) => {
  const player = resultsData.players.find(
    (p) => `${p.firstName} ${p.lastName}` === playerName
  );
  return player ? player.id : null;
};
const findPlayerIdByName = (playerName, rosterSpots) => {
  const [firstName, lastName] = playerName.split(" ");
  for (const player of rosterSpots) {
    if (
      player.firstName.default === firstName &&
      player.lastName.default === lastName
    ) {
      return player.playerId;
    }
  }
  return null;
};
const findMLBPlayerIdByName = (playerName, roster) => {
  const [firstName, lastName] = playerName.split(" ");
  for (const player of roster) {
    if (
      player.fullName.includes(firstName) &&
      player.fullName.includes(lastName)
    ) {
      return player.id;
    }
  }
  return null;
};

export { getAllBets, findPlayerIdByName, findMLBPlayerIdByName };
