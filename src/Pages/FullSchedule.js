import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const FullSchedule = () => {
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
          <h5 className="card-title text-center">{gameTitle}</h5>
          <p className="text-center">
            {gameDay} at {new Date(gameTime).toLocaleTimeString()}
          </p>
          <p className="card-text text-center">
            <img
              src="https://assets.dragoart.com/images/20841_501/how-to-draw-the-nhl-logo_5e4cd2e0524681.36940192_102529_5_4.png"
              style={{ maxWidth: "40%" }}
            ></img>
          </p>
          <a
            onClick={() => actionBtnOne(gameId, gameTitle)}
            className="btn btn-primary"
          >
            Go somewhere
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
  const [arr, setArr] = useState([]);
  const fetchData = async () => {
    const response = await fetch(
      "https://statsapi.web.nhl.com/api/v1/schedule?season=20232024"
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
    setArr(arrHTMLObj);
  };
  useEffect(() => {
    // Whenever the page loads, then this is executed
    fetchData();
  }, []);

  return (
    <div className="text-white text-center">
      <h1>NHL Schedule</h1>
      <div className="row">{arr}</div>
    </div>
  );
};

export { FullSchedule };
