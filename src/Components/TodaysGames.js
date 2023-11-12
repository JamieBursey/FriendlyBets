import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TodaysGames = () => {
  const navigate = useNavigate();
  const actionBtnOne = (
    game_ID,
    gameTitle,
    gameTime,
    gameDay,
    homeLogo,
    awayLogo
  ) => {
    const gameDetails = {
      game_ID,
      gameTitle,
      gameTime,
      gameDay,
      homeLogo,
      awayLogo,
    };
    localStorage.setItem("selectedGame", JSON.stringify(gameDetails));
    navigate("/betPage");
  };
  const actionBtnTwo = () => {
    navigate("/fullSchedule");
  };
  //create Game Cards
  const createGameCard = (
    game_ID,
    gameTitle,
    gameTime,
    gameDay,
    homeLogo,
    awayLogo
  ) => {
    return (
      <div key={game_ID} className="col-3 card m-1" style={{ width: "18rem" }}>
        <div className="card-body">
          <h5 className="card-title">{gameTitle}</h5>
          <div className="row">
            <div className="col">
              <img src={awayLogo}></img>
            </div>
            <div className="col">
              <img src={homeLogo} />
            </div>
          </div>
          <p>
            {gameDay} at {new Date(gameTime).toLocaleTimeString()}
          </p>

          <div className="row">
            <div className="col">
              <a
                onClick={() =>
                  actionBtnOne(
                    game_ID,
                    gameTitle,
                    gameTime,
                    gameDay,
                    homeLogo,
                    awayLogo
                  )
                }
                className="btn btn-primary w-100"
              >
                Bet Friends
              </a>
            </div>
            <div className="col">
              <a
                onClick={() => actionBtnTwo(game_ID, gameTitle)}
                className="btn btn-primary w-100"
              >
                Full Schedule
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const [todaysGameArr, setTodaysGameArr] = useState([]);
  const fetchData = async () => {
    const apiUrl = `https://api-web.nhle.com/v1/schedule/now`;
    // const corsProxuUrl = `https://cors-anywhere.herokuapp.com/`;
    const finalUrl = apiUrl;
    // const config = Config();
    try {
      // if(config.ENABLE_DUMMY_RESPONSE){

      // }else{

      // }
      const response = await fetch(finalUrl, {});

      const games = await response.json();
      console.log(games);
      let gamesHTMLObj = [];
      const today = new Date().toISOString().slice(0, 10);
      const todaysGames = games.gameWeek.find((day) => day.date === today);

      todaysGames.games.forEach((game) => {
        const awayTeamID = game.awayTeam.abbrev;
        const homeTeamID = game.homeTeam.abbrev;
        const homeLogo = game.homeTeam.logo;
        const awayLogo = game.awayTeam.logo;
        const game_ID = game.gamePk;
        const gameTitle = `${awayTeamID} vs ${homeTeamID}`;
        const gameTime = game.startTimeUTC;
        const gameDay = game.date;
        gamesHTMLObj.push(
          createGameCard(
            game_ID,
            gameTitle,
            gameTime,
            gameDay,
            homeLogo,
            awayLogo
          )
        );
      });

      console.log("htmlAr", gamesHTMLObj);
      setTodaysGameArr(gamesHTMLObj);
    } catch (error) {
      console.log("Fetch Data Error", error);
    }
  };
  useEffect(() => {
    // Whenever the page loads, then this is executed
    fetchData();
  }, []);
  const proxyServer = () => {
    window.location.href = "https://cors-anywhere.herokuapp.com/corsdemo";
  };
  return (
    <div className="text-white text-center">
      <h1>Todays Games</h1>
      <button type="button" className="btn btn-dark" onClick={proxyServer}>
        Go here to activate Games
      </button>
      <div className="row justify-content-center">{todaysGameArr}</div>
    </div>
  );
};

export { TodaysGames };
