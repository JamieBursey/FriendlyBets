import React, { useEffect, useState } from "react";
const TodaysGames = () => {
  const actionBtnOne = (gameId, gameTitle) => {
    console.log("actionBtnOne", gameId, gameTitle);
  };
  const actionBtnTwo = (gameId, gameTitle) => {
    alert("actionBtnOTwo" + gameId + gameTitle);
  };
  const createGameCard = (gameId, gameTitle, gameTime, gameDay) => {
    return (
      <div key={gameId} className="col-3 card m-1" style={{ width: "18rem" }}>
        <div className="card-body">
          <h5 className="card-title">{gameTitle}</h5>
          <p>
            {gameDay} at {new Date(gameTime).toLocaleTimeString()}
          </p>
          <p className="card-text">
            <img
              src="https://assets.dragoart.com/images/20841_501/how-to-draw-the-nhl-logo_5e4cd2e0524681.36940192_102529_5_4.png"
              style={{ maxWidth: "40%" }}
            ></img>
          </p>
          <a
            onClick={() => actionBtnOne(gameId, gameTitle)}
            className="btn btn-primary"
          >
            Make Bet
          </a>
          <a
            onClick={() => actionBtnTwo(gameId, gameTitle)}
            className="btn btn-primary"
          >
            Go somewhere 2
          </a>
        </div>
      </div>
    );
  };
  const [todaysGameArr, setTodaysGameArr] = useState([]);
  const fetchData = async () => {
    const response = await fetch(
      "https://statsapi.web.nhl.com/api/v1/schedule"
    );
    const games = await response.json();
    let arrHTMLObj = [];
    games.dates.forEach((date) => {
      date.games.forEach((game) => {
        const gameID = game.gamePk;
        const gameTitle = `${game.teams.away.team.name} vs ${game.teams.home.team.name}`;
        const gameTime = game.gameDate;
        const gameDay = date.date;
        arrHTMLObj.push(createGameCard(gameID, gameTitle, gameTime, gameDay));
      });
    });
    console.log("htmlAr", arrHTMLObj);
    setTodaysGameArr(arrHTMLObj);
  };
  useEffect(() => {
    // Whenever the page loads, then this is executed
    fetchData();
  }, []);

  return (
    <div className="text-white text-center">
      <h1>Todays Games</h1>
      <div className="row justify-content-center">{todaysGameArr}</div>
    </div>
  );
};

export { TodaysGames };
