import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LOCALSTORAGE } from "../../Config";

const NflTodaySchedule = () => {
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
    localStorage.setItem(
      LOCALSTORAGE.SELECTEDGAME,
      JSON.stringify(gameDetails)
    );
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
      <div key={game_ID} className="col-3 card m-1" style={{ width: "20rem" }}>
        <div className="card-body">
          <h5 className="card-title">{gameTitle}</h5>
          <div className="row">
            <div className="col">
              <img src={awayLogo} alt=""></img>
            </div>
            <div className="col">
              <img src={homeLogo} alt="" />
            </div>
          </div>
          <p>
            {gameDay} at {new Date(gameTime).toLocaleTimeString()}
          </p>

          <div className="row">
            <div className="col">
              <button
                onClick={() => actionBtnTwo(game_ID, gameTitle)}
                className="btn btn-primary w-100"
              >
                Weekly Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const [todaysGameArr, setTodaysGameArr] = useState([]);

  const fetchData = async () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const now = year + month + day;
    const url = `https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLGamesForDate?gameDate=${now}`;

    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "4d936fd439mshf521f0eb6a8ffacp1036efjsnd9795207ffaa",
        "X-RapidAPI-Host":
          "tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log("result", result);
      if (result && result.body) {
        let gamesHTMLObj = result.body.map((game) => {
          return createGameCard(
            game.gameID,
            `${game.away} vs ${game.home}`,
            game.gameTime,
            game.gameDate
            // homeLogo,
            // awayLogo
          );
        });

        setTodaysGameArr(gamesHTMLObj);
      } else {
        console.log("No game data found");
      }
    } catch (error) {
      console.error("Fetch Data Error:", error);
      alert("Fetch Data Error: " + error.message);
    }
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
// weekly schedule
const NflWeeklySchedule = () => {
  const createGameCard = (
    game_ID,
    gameTitle,
    gameTime,
    gameDay,
    homeLogo,
    awayLogo
  ) => {
    const gameDate = new Date(
      gameDay.slice(0, 4),
      gameDay.slice(4, 6) - 1,
      gameDay.slice(6, 8)
    );
    const dayOfWeek = gameDate.toLocaleDateString("en-US", {
      weekday: "short",
    });
    const match = gameTime.match(/(\d+):(\d+)([ap]m)/);
    const date = new Date(gameDate);
    if (match) {
      let [_, hour, minute, ampm] = match;
      hour =
        ampm.toLowerCase() === "p"
          ? (parseInt(hour) % 12) + 12
          : parseInt(hour);
      date.setHours(hour, minute);
    }
    const timeString = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    return (
      <div key={game_ID} className="col-3 card m-1" style={{ width: "20rem" }}>
        <div className="card-body">
          <h5 className="card-title">{gameTitle}</h5>
          <div className="row">
            <div className="col">
              <img src={awayLogo} alt=""></img>
            </div>
            <div className="col">
              <img src={homeLogo} alt="" />
            </div>
          </div>
          <p>
            {dayOfWeek} at {timeString}
          </p>

          <div className="row"></div>
        </div>
      </div>
    );
  };

  const [todaysGameArr, setTodaysGameArr] = useState([]);

  const fetchData = async () => {
    const nflSeasonStartDate = new Date("2024-01-13");
    const currentDate = new Date();
    const currentWeek = Math.floor(
      (currentDate - nflSeasonStartDate) / (7 * 24 * 60 * 60 * 1000) + 1
    );
    console.log(currentWeek);
    // const year = currentDate.getFullYear();
    // const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    // const day = String(currentDate.getDate()).padStart(2, "0");
    // const currentDateString = `${year}${month}${day}`;

    const url = `https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLGamesForWeek?week=all&seasonType=all`;

    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "4d936fd439mshf521f0eb6a8ffacp1036efjsnd9795207ffaa",
        "X-RapidAPI-Host":
          "tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log("result", result);
      if (result && result.body) {
        let gamesHTMLObj = result.body.map((game) => {
          return createGameCard(
            game.gameID,
            `${game.away} vs ${game.home}`,
            game.gameTime,
            game.gameDate
            // homeLogo,
            // awayLogo
          );
        });

        setTodaysGameArr(gamesHTMLObj);
      } else {
        console.log("No game data found");
      }
    } catch (error) {
      console.error("Fetch Data Error:", error);
      alert("Fetch Data Error: " + error.message);
    }
  };
  useEffect(() => {
    // Whenever the page loads, then this is executed
    fetchData();
  }, []);
  return (
    <div className="text-white text-center">
      <h1>Weekly Games</h1>
      <div className="row justify-content-center">{todaysGameArr}</div>
    </div>
  );
};

export { NflTodaySchedule, NflWeeklySchedule };
