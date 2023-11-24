import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const FullSchedule = () => {
  const actionBtnOne = (gameId, gameTitle) => {
    console.log("actionBtnOne", gameId, gameTitle);
  };
  const actionBtnTwo = (gameId, gameTitle) => {
    alert("actionBtnOTwo" + gameId + gameTitle);
  };
  const createGameCard = (
    gameId,
    gameTitle,
    gameTime,
    gameDay,
    awayLogo,
    homeLogo
  ) => {
    return (
      <div key={gameId} className="col-3 card m-1" style={{ width: "18rem" }}>
        <div className="card-body">
          <h5 className="card-title text-center">{gameTitle}</h5>
          <p className="text-center">
            {gameDay} at {new Date(gameTime).toLocaleTimeString()}
          </p>
          <div className="card-text text-center">
            <div className="row">
              <div className="col mx-2">
                <img src={awayLogo}></img>
              </div>
              <div className="col mx-2">
                <img src={homeLogo} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const [arr, setArr] = useState([]);
  const fetchData = async () => {
    const response = await fetch("https://api-web.nhle.com/v1/schedule/now");
    const allGames = await response.json();
    console.log("weekly", allGames);
    let arrHTMLObj = [];
    allGames.gameWeek.forEach((week) => {
      const gameDay = week.dayAbbrev;
      week.games.forEach((game) => {
        const gameID = game.id;
        const homeLogo = game.homeTeam.logo;
        const awayLogo = game.awayTeam.logo;
        const gameTitle = `${game.awayTeam.placeName.default} vs ${game.homeTeam.placeName.default}`;
        const gameTime = game.startTimeUTC;

        arrHTMLObj.push(
          createGameCard(
            gameID,
            gameTitle,
            gameTime,
            gameDay,
            awayLogo,
            homeLogo
          )
        );
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
