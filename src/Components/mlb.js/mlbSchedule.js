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

    const matchedEspnGame = espnGames.find((espnGame) => {
      const espnHomeTeam = espnGame.competitions[0].competitors.find(
        (team) => team.homeAway === "home"
      ).team.displayName;
      const espnAwayTeam = espnGame.competitions[0].competitors.find(
        (team) => team.homeAway === "away"
      ).team.displayName;

      return (
        normalizeTeamName(espnHomeTeam) === homeTeamName &&
        normalizeTeamName(espnAwayTeam) === awayTeamName
      );
    });

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
        inning: matchedEspnGame.competitions[0].status.type.detail,
      };
    }

    return {
      ...mlbGame,
      gameTitle: `${mlbGame.teams.away.team.name} vs ${mlbGame.teams.home.team.name}`,
      homeLogo: null, // Set to null if not found
      awayLogo: null, // Set to null if not found
      inning: mlbGame.status.detailedState, // Fallback to MLB's game state
    };
  });
};

const MlbTodaysGames = () => {
  const [todaysGameArr, setTodaysGameArr] = useState([]);
  const navigate = useNavigate();

  const actionBtnOne = (game) => {
    const gameDetails = {
      game_ID: game.gamePk,
      gameTitle: game.gameTitle,
      gameTime: game.gameDate,
      gameDay: new Date(game.gameDate).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      homeLogo: game.homeLogo,
      awayLogo: game.awayLogo,
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
    // Get the current date in the correct format
    const today = new Date();
    const currentDate = today.toISOString().split("T")[0];

    // Fetch data from ESPN API
    const espnResponse = await fetch(
      "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard"
    );
    const espnData = await espnResponse.json();

    // Fetch data from MLB Stats API
    const mlbApiResponse = await fetch(
      `https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1&date=${currentDate}`
    );
    const mlbApiData = await mlbApiResponse.json();

    // Match games and merge logos
    const matchedGames = matchGamesWithLogos(
      mlbApiData.dates[0]?.games || [],
      espnData.events || []
    );

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
                    {game.awayLogo ? (
                      <img
                        src={game.awayLogo}
                        alt="Away Team Logo"
                        className="img-fluid"
                      />
                    ) : (
                      <p>{game.teams.away.team.name}</p>
                    )}
                  </div>
                  <div className="col">
                    {game.homeLogo ? (
                      <img
                        src={game.homeLogo}
                        alt="Home Team Logo"
                        className="img-fluid"
                      />
                    ) : (
                      <p>{game.teams.home.team.name}</p>
                    )}
                  </div>
                </div>
                <p>
                  {new Date(game.gameDate).toLocaleString("en-US", {
                    weekday: "long",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </p>
                <p>{game.inning}</p>
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
