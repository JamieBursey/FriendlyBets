const gameID = localStorage.getItem("selectedGame");
const gameIDData = JSON.parse(gameID);
const gameNumber = gameIDData.game_ID;

const CompareBets = async () => {
  const pendingBets = localStorage.getItem("pendingBets") || [];
  const request = await fetch(
    `https://api-web.nhle.com/v1/gamecenter/${gameNumber}/play-by-play`
  );
  const liveData = await request.json();
};
