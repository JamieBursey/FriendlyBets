import { getAllUsers } from "../Data";
import { LOCALSTORAGE } from "../Config";

const CheckBetResults = async (betId) => {
  let allUsers = getAllUsers();
  let currentUser = JSON.parse(localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER));
  const betIndex = currentUser.bets.findIndex((bet) => bet.betId === betId);
  const bet = currentUser.bets[betIndex];
  console.log("bet", bet);
  const gameNumber = bet.gameId;

  try {
    const response = await fetch(
      `https://api-web.nhle.com/v1/gamecenter/${gameNumber}/play-by-play`
    );
    const resultsData = await response.json();
    console.log(resultsData);
    let firstGoalEvent = resultsData.plays.find(
      (play) => play.typeDescKey === "goal"
    );

    console.log("first", firstGoalEvent);
    if (firstGoalEvent) {
      const betDescriptionEntries = Object.entries(bet.betDescripston);
      const [betDescriptionKey] = betDescriptionEntries[0];
      const playerName = betDescriptionKey.split(" ");
      console.log("playername", playerName);
      const firstName = playerName[0];
      const scoringPlayerId = firstGoalEvent.details.scoringPlayerId;
      const player = resultsData.rosterSpots.find(
        (p) => p.playerId === scoringPlayerId
      );

      if (player && player.firstName.default === firstName) {
        currentUser.bets[betIndex].result = "Won";
        console.log("won");
      }
    } else {
      return;
    }
  } catch (error) {
    console.log("error", error);
  }
};

export { CheckBetResults };
