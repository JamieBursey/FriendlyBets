import { LOCALSTORAGE } from "../Config";

const getAllBets = () => {
  const Bets = localStorage.getItem(LOCALSTORAGE.BETS); // "[{"id": 11}, {"id": 22}]"
  let allUsers = JSON.parse(Bets);
  if (Bets === "" || allUsers == null) {
    allUsers = [];
  }
  return allUsers;
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
export { getAllBets, findPlayerIdByName };
