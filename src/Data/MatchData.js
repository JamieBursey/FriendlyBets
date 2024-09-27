// here will be where sports matches will be collected through the api.
import { supabase } from "../supabaseClient";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOCALSTORAGE } from "../Config";
import { Loader } from "../Pages";

const TodaysGames = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [todaysGameArr, setTodaysGameArr] = useState([]);


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
      sportType: "NHL",
    };
    localStorage.setItem(
      LOCALSTORAGE.SELECTEDGAME,
      JSON.stringify(gameDetails)
    );
    const fetchUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user) {
        navigate("/betPage");
      }
      else{alert("Please login to bet")}
    };
    fetchUser();

  };



  // Create Game Cards
  const createGameCard = (
    game_ID,
    gameTitle,
    gameTime,
    gameDay,
    homeLogo,
    awayLogo
  ) => {
    return (
      <div key={game_ID} className="col-3 card m-1" style={{ width: "20rem" }}>
        <div className="card-body">
          <h5 className="card-title">{gameTitle}</h5>
          <div className="row">
            <div className="col">
              <img src={awayLogo} alt="Away Team Logo"
              className="img-fluid"></img>
            </div>
            <div className="col">
              <img src={homeLogo} alt="Home Team Logo"  className="img-fluid"/>
            </div>
          </div>
          <p>
            {gameDay} at {new Date(gameTime).toLocaleTimeString()}
          </p>

          <div className="row">
            <div className="col">
              <button
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
                className="btn btn-outline-primary w-75"
              >
                Bet Friends
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const fetchData = async () => {
    setLoading(true);
    const apiUrl = `https://friendly-bets-back-end.vercel.app/api/now`;
    try {
      const response = await fetch(apiUrl);
      const games = await response.json();
      let gamesHTMLObj = [];
      const today = new Date();
      today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
      const todayStr = today.toISOString().slice(0, 10);

      const todaysGames = games.gameWeek.find((day) => day.date === todayStr);

      if (todaysGames) {
        todaysGames.games.forEach((game) => {
          const awayTeamID = game.awayTeam.abbrev;
          const homeTeamID = game.homeTeam.abbrev;
          const homeLogo = game.homeTeam.logo;
          const awayLogo = game.awayTeam.logo;
          const game_ID = game.id;
          const gameTitle = `${awayTeamID} vs ${homeTeamID}`;
          const gameTime = game.startTimeUTC;
          const gameDay = todaysGames.dayAbbrev;
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
      }
      setTodaysGameArr(gamesHTMLObj);
    } catch (error) {
      console.error("Error fetching live games:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="text-white text-center">
      <h1>Todays Games</h1>
      {loading ? (
        <Loader />
      ) : todaysGameArr.length > 0 ? (
        <div className="row justify-content-center">{todaysGameArr}</div>
      ) : (
        <div>No games today</div>
      )}
    </div>
  );
};

export default TodaysGames;

const LiveGames = () => {
  const [liveGamesArr, setLiveGamesArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const actionBtnOne = (game) => {
    const gameDetails = {
      game_ID: game.id,
      gameTitle: `${game.awayTeam.abbrev} vs ${game.homeTeam.abbrev}`,
      gameTime: game.startTimeUTC,
      gameDay: game.startTimeUTC,
      homeLogo: game.homeTeam.logo,
      awayLogo: game.awayTeam.logo,
      sportType: "NHL",
    };
    localStorage.setItem(
      LOCALSTORAGE.SELECTEDGAME,
      JSON.stringify(gameDetails)
    );
    navigate("/betPage");
  };

  const fetchLiveGames = async () => {
    setLoading(true);
    const apiUrl = `https://friendly-bets-back-end.vercel.app/api/score`;
    try {
      const response = await fetch(apiUrl);
      const allGames = await response.json();
      const liveGames = allGames.games.filter(
        (game) => game.gameState === "LIVE" || game.gameState === "CRIT"
      );

      if (liveGames.length > 0) {
        setLiveGamesArr(liveGames);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching live games:", error);
    }
  };

  useEffect(() => {
    fetchLiveGames();
  }, []);

  return (
    <div className="text-white text-center">
      <h1>Live Games</h1>
      {loading ? (
        <Loader />
      ) : (
        <div className="row justify-content-center">
          {liveGamesArr.length > 0 ? (
            liveGamesArr.map((game, index) => (
              <div
                key={index}
                className="col-3 card m-1"
                style={{ width: "20rem" }}
              >
                <div className="card-body">
                  <h5 className="card-title">
                    {game.awayTeam.abbrev} vs {game.homeTeam.abbrev}
                  </h5>
                  <div className="row">
                    <div className="col">
                      <img
                        src={game.awayTeam.logo}
                        alt={`${game.awayTeam.abbrev} logo`}
                        className="img-fluid"
                      />
                    </div>
                    <div className="col">
                      <img
                        src={game.homeTeam.logo}
                        alt={`${game.homeTeam.abbrev} logo`}
                        className="img-fluid"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <p>{game.awayTeam.score}</p>
                    </div>
                    <div className="col">
                      <p>{game.homeTeam.score}</p>
                    </div>
                  </div>
                  <p>
                    {game.clock.timeRemaining} Period: {game.period}
                  </p>
                  <button
                    onClick={() => actionBtnOne(game)}
                    className="btn btn-outline-primary w-75"
                  >
                    Bet Friends
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No live games currently.</p>
          )}
        </div>
      )}
    </div>
  );
};
export { LiveGames };
export { TodaysGames };
