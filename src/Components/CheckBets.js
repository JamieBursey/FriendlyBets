import { LOCALSTORAGE } from "../Config";
import { findPlayerIdByName } from "../Data";

const CheckBetResults = async (betId, callback) => {
  let allBets = JSON.parse(localStorage.getItem(LOCALSTORAGE.BETS));
  let bet = allBets.find((bet) => bet.betId === betId);
  if (!bet) {
    console.error("Bet not found");
    return;
  }
  const betCreator = bet.betCreator;
  const gameNumber = bet.gameId;
  const betIndex = allBets.findIndex((b) => b.betId === betId);
  const checkShotsOnNet = (playerId, plays) => {
    const shotsOnGoal = plays.filter(
      (play) =>
        play.typeDescKey === "shot-on-goal" &&
        play.details.shootingPlayerId === playerId
    );
    return shotsOnGoal.length >= 2
      ? `${betCreator} Wins`
      : `${betCreator} Lost`;
  };
  const checkAssistPlayer = (playerId, plays) => {
    const assists = plays.filter(
      (play) =>
        play.typeDescKey === "goal" &&
        (play.details.assist1PlayerId === playerId ||
          play.details.assist2PlayerId === playerId)
    );
    return assists.length >= 1 ? `${betCreator} Wins` : `${betCreator} Lost`;
  };
  try {
    const response = await fetch(
      `https://friendly-bets-back-end.vercel.app/api/gamecenter/${gameNumber}/play-by-play`
    );
    const resultsData = await response.json();

    const isGameFinished =
      resultsData.gameState === "OFF" ||
      (resultsData.clock.timeRemaining === "00:00" && resultsData.period === 3);

    const betCreator = bet.betCreator;
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
              ? `${betCreator} Wins`
              : `${betCreator} Lost`;
        } else {
          bet.result = "Loss";
        }
      }
      if (betDescription.includes("will get 2 shots on net")) {
        const playerName = betDescription.split(" will get 2 shots on net")[0];
        const playerId = findPlayerIdByName(
          playerName,
          resultsData.rosterSpots
        );
        const shotsResult = checkShotsOnNet(playerId, resultsData.plays);

        bet.result = shotsResult;
      }
      if (betDescription.includes("will make an assist")) {
        const playerName = betDescription.split(" will get 2 shots on net")[0];
        const playerId = findPlayerIdByName(
          playerName,
          resultsData.rosterSpots
        );
        const playerAssist = checkAssistPlayer(playerId, resultsData.plays);
        bet.result = playerAssist;
      }
      if (
        betDescription === `${resultsData.homeTeam.name.default} will win` &&
        isGameFinished
      ) {
        const homeScore = resultsData.homeTeam.score;
        const awayScore = resultsData.awayTeam.score;
        bet.result =
          homeScore > awayScore ? `${betCreator} Wins` : `${betCreator} Lost`;
      }

      if (
        betDescription === `${resultsData.awayTeam.name.default} will win` &&
        isGameFinished
      ) {
        const homeScore = resultsData.homeTeam.score;
        const awayScore = resultsData.awayTeam.score;
        bet.result =
          awayScore > homeScore ? `${betCreator} Wins` : `${betCreator} Lost`;
      }
      allBets[betIndex] = bet;
      localStorage.setItem(LOCALSTORAGE.BETS, JSON.stringify(allBets));
      if (callback) {
        callback(); // used to re-render the cards in myBets
      }
    }
  } catch (error) {
    console.error("error", error);
  }
};

export { CheckBetResults };
