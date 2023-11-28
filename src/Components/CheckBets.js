import { LOCALSTORAGE, NAVIGATION } from "../Config";
import { findPlayerIdByName } from "../Data";

const CheckBetResults = async (betId) => {
  const checkShotsOnNet = (playerId, plays) => {
    const shotsOnGoal = plays.filter(
      (play) =>
        play.typeDescKey === "shot-on-goal" &&
        play.details.shootingPlayerId === playerId
    );
    return shotsOnGoal.length >= 2 ? "Won" : "Loss";
  };

  let allBets = JSON.parse(localStorage.getItem(LOCALSTORAGE.BETS));
  let bet = allBets.find((bet) => bet.betId === betId);
  if (!bet) {
    console.error("Bet not found");
    return;
  }

  const gameNumber = bet.gameId;
  const betIndex = allBets.findIndex((b) => b.betId === betId);

  try {
    const response = await fetch(
      `https://api-web.nhle.com/v1/gamecenter/${gameNumber}/play-by-play`
    );
    const resultsData = await response.json();

    for (const [betDescription, isActive] of Object.entries(
      bet.betDescripston
    )) {
      if (!isActive) continue;

      if (betDescription.includes("will score the first goal")) {
        let firstGoalEvent = resultsData.plays.find(
          (play) => play.typeDescKey === "goal"
        );
        if (firstGoalEvent) {
          const playerName = betDescription.split(
            " will score the first goal"
          )[0];
          const scoringPlayerId = firstGoalEvent.details.scoringPlayerId;
          const player = resultsData.rosterSpots.find(
            (p) => p.playerId === scoringPlayerId
          );
          bet.result =
            player &&
            `${player.firstName.default} ${player.lastName.default}` ===
              playerName
              ? "Won"
              : "Loss";
        } else {
          bet.result = "Loss";
        }
      } else if (betDescription.includes("will get 2 shots on net")) {
        const playerName = betDescription.split(" will get 2 shots on net")[0];
        const playerId = findPlayerIdByName(
          playerName,
          resultsData.rosterSpots
        );
        bet.result = checkShotsOnNet(playerId, resultsData.plays);
      }

      allBets[betIndex] = bet;
      localStorage.setItem(LOCALSTORAGE.BETS, JSON.stringify(allBets));
    }
  } catch (error) {
    console.error("error", error);
  }
};

export { CheckBetResults };
