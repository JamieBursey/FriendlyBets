import { useEffect, useState } from "react";
import { LOCALSTORAGE } from "../../Config";
import { useNavigate } from "react-router-dom";

const normalizeTeamName = (name) => {
  return name.toLowerCase();
};

const matchGamesWithLogos = (mlbGames, espnGames) => {
  return mlbGames.map((mlbGame) => {
    const homeTeamName = normalizeTeamName(mlbGame.teams.home.team.name);
    const awayTeamName = normalizeTeamName(mlbGame.teams.away.team.name);

    const matchedEspnGame = espnGames.find(
      (espnGame) =>
        normalizeTeamName(
          espnGame.competitions[0].competitors.find(
            (team) => team.homeAway === "home"
          ).team.displayName
        ) === homeTeamName &&
        normalizeTeamName(
          espnGame.competitions[0].competitors.find(
            (team) => team.homeAway === "away"
          ).team.displayName
        ) === awayTeamName
    );

    if (matchedEspnGame) {
      return {
        ...mlbGame,
        gameTitle: matchedEspnGame.shortName,
        homeLogo: matchedEspnGame.competitions[0].competitors.find(
          (team) => team.homeAway === "home"
        ).team.logo,
        awayLogo: matchedEspnGame.competitions[0].competitors.find(
          (team) => team.homeAway === "away"
        ).team.logo,
      };
    }

    return mlbGame;
  });
};
const MlbTodaysGames = () => {
  const [todaysGameArr, setTodaysGameArr] = useState([]);
  const navigate = useNavigate();
  const actionBtnOne = (game) => {
    const gameDetails = {
      game_ID: game.gamePk, // MLB API game ID
      gameTitle: game.gameTitle,
      gameTime: game.gameDate,
      gameDay: new Date(game.gameDate).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      homeLogo: game.homeLogo, // Logo from ESPN API
      awayLogo: game.awayLogo, // Logo from ESPN API
      homeTeam: game.teams.home.team.name,
      awayTeam: game.teams.away.team.name,
      sportType: "MLB",
    };
    localStorage.setItem(
      LOCALSTORAGE.SELECTEDGAME,
      JSON.stringify(gameDetails)
    );
    navigate("/betPage");
  };
  const todaysSchedule = async () => {
    // Fetch data from ESPN API
    const espnResponse = await fetch(
      "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard"
    );
    const espnData = await espnResponse.json();

    // Fetch data from MLB Stats API
    const mlbApiResponse = await fetch(
      "https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1"
    );
    const mlbApiData = await mlbApiResponse.json();

    // Match games and merge logos
    const matchedGames = matchGamesWithLogos(
      mlbApiData.dates[0].games,
      espnData.events
    );
    console.log("mathedGames", matchedGames);
    setTodaysGameArr(matchedGames);
  };

  useEffect(() => {
    todaysSchedule();
  }, []);

  return (
    <div className="text-white text-center">
      <h1>Todays Games</h1>
      <div className="row justify-content-center">
        {todaysGameArr.length > 0 ? (
          todaysGameArr.map((game) => (
            <div
              key={game.gamePk}
              className="col-3 card m-1"
              style={{ width: "20rem" }}
            >
              <div className="card-body">
                <h5 className="card-title">{game.gameTitle}</h5>
                <div className="row">
                  <div className="col">
                    <img
                      src={game.awayLogo}
                      alt={"Home Team Logo"}
                      className="img-fluid"
                    />
                  </div>
                  <div className="col">
                    <img
                      src={game.homeLogo}
                      alt={"Away Team Logo"}
                      className="img-fluid"
                    />
                  </div>
                </div>
                <p>
                  {new Date(game.gameDate).toLocaleString("en-US", {
                    weekday: "long",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </p>
                <button
                  onClick={() => actionBtnOne(game)}
                  className="btn btn-primary w-100"
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
    </div>
  );
};

const MlbSchedule = () => {
  const backgroundColor = {
    background: "linear-gradient(to bottom, #0B1305 60%, #1e90ff 100%)",
    borderRadius: "1rem",
  };
  return (
    <div style={backgroundColor} className="container text-center p-2">
      {MlbTodaysGames()};
    </div>
  );
};
export { MlbTodaysGames, MlbSchedule };
