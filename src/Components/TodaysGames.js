import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TodaysGames = () => {
  const navigate = useNavigate();
  const actionBtnOne = (gamePK, gameTitle, gameID) => {
    console.log("actionBtnOne", gamePK, gameTitle);
    navigate("/betPage");
  };
  const actionBtnTwo = (gamePK, gameTitle) => {
    alert("actionBtnOTwo" + gamePK + gameTitle);
  };
  const createGameCard = (gamePK, gameTitle, gameTime, gameDay) => {
    return (
      <div key={gamePK} className="col-3 card m-1" style={{ width: "18rem" }}>
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
            onClick={() => actionBtnOne(gamePK, gameTitle)}
            className="btn btn-primary"
          >
            Make Bet
          </a>
          <a
            onClick={() => actionBtnTwo(gamePK, gameTitle)}
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
        const awayTeamID = game.teams.away.team.id;
        const homeTeamID = game.teams.away.team.id;
        const gamePK = game.gamePk;
        const gameTitle = `${game.teams.away.team.name} vs ${game.teams.home.team.name}`;
        const gameTime = game.gameDate;
        const gameDay = date.date;
        arrHTMLObj.push(createGameCard(gamePK, gameTitle, gameTime, gameDay));
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
