import { LOCALSTORAGE, NAVIGATION } from "../Config";

const CheckBetResults = async (betId) => {
  let allBets = JSON.parse(localStorage.getItem(LOCALSTORAGE.BETS));
  let bet = allBets.find((bet) => bet.betId === betId);
  if (!bet) {
    console.error("Bet not found");
    return;
  }
  console.log("bet", bet);
  const gameNumber = bet.gameId;

  const betIndex = allBets.findIndex((b) => b.betId === betId);

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
        bet.result = "Won";
      } else {
        bet.result = "Loss";
      }
      allBets[betIndex] = bet;
      localStorage.setItem(LOCALSTORAGE.BETS, JSON.stringify(allBets));

      //   window.location.reload();
    } else {
      bet.result = "Loss";
      allBets[betIndex] = bet;
      localStorage.setItem(LOCALSTORAGE.BETS, JSON.stringify(allBets));
      console.log("loss");
    }
  } catch (error) {
    console.error("error", error);
  }
};

export { CheckBetResults };
