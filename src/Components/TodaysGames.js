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

          <a
            onClick={() => actionBtnOne(gamePK, gameTitle)}
            className="btn btn-primary mx-1"
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
    const apiUrl = `https://api-web.nhle.com/v1/schedule/now`;
    const corsProxuUrl = `https://cors-anywhere.herokuapp.com/`;
    const finalUrl = corsProxuUrl + apiUrl;
    const response = await fetch(finalUrl);

    const games = await response.json();

    console.log(games);
    let arrHTMLObj = [];
    games.gameWeek.forEach((week) => {
      week.games.forEach((game) => {
        const awayTeamID = game.awayTeam.abbrev;
        const homeTeamID = game.homeTeam.abbrev;
        const gamePK = game.gamePk;
        const gameTitle = `${awayTeamID} vs ${homeTeamID}`;
        const gameTime = game.startTimeUTC;
        const gameDay = week.date;
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
