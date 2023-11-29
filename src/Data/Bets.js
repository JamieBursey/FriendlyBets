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
const checkBetType = (betDescriptionObject, resultsData) => {
  const betDescriptions = Object.keys(betDescriptionObject);

  for (const description of betDescriptions) {
    if (
      description.includes("will score the first goal") &&
      betDescriptionObject[description]
    ) {
      const playerName = description.split(" will score the first goal")[0];
      const playerId = getPlayerIdByName(playerName, resultsData);
      const firstGoalEvent = resultsData.plays.find(
        (event) => event.typeDescKey === "goal"
      );

      if (
        firstGoalEvent &&
        firstGoalEvent.details.scoringPlayerId === playerId
      ) {
        return "Won";
      }
    } else if (
      description.includes("will have more than 2 shots on net") &&
      betDescriptionObject[description]
    ) {
      const playerName = description.split(
        " will have more than 2 shots on net"
      )[0];
      const playerId = getPlayerIdByName(playerName, resultsData);
      const shotsOnGoal = resultsData.plays.filter(
        (event) =>
          event.typeDescKey === "shot-on-goal" &&
          event.details.shootingPlayerId === playerId
      );

      if (shotsOnGoal.length > 2) {
        return "Won";
      }
    }
  }
  return "Waiting";
};
const findPlayerIdByName = (playerName, rosterSpots) => {
  const [firstName, lastName] = playerName.split(" ");
  for (const player of rosterSpots) {
    if (
      player.firstName.default === firstName &&
      player.lastName.default === lastName
    ) {
      console.log(player.playerId);
      return player.playerId;
    }
  }
  return null;
};
export { getAllBets, checkBetType, findPlayerIdByName };
