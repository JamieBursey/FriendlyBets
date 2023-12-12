const { LOCALSTORAGE } = require("../Config");

const gameID = localStorage.getItem(LOCALSTORAGE.SELECTEDGAME);
const gameIDData = JSON.parse(gameID);
const gameNumber = gameIDData.game_ID;

const CompareBets = async () => {
  const bets = localStorage.getItem("bets") || [];
  const pendingBetsData = JSON.parse(bets);
  const gameNumber = pendingBetsData.gameId;
  for (const bet of pendingBetsData) {
    try {
      const request = await fetch(
        `https://api-web.nhle.com/v1/gamecenter/${gameNumber}/play-by-play`
      );
      const liveData = await request.json();
      const firstGoal = liveData.plays.find(
        (play) => play.typeDescKey === "goal"
      );
    } catch (error) {
      console.log("error", error);
    }
  }
};
