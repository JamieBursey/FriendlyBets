import { useEffect, useState } from "react";
import { LOCALSTORAGE } from "../../Config";
import { useNavigate } from "react-router-dom";

const MlbTodaysGames = () => {
  const [todaysGameArr, setTodaysGameArr] = useState([]);
  const navigate = useNavigate();
  const actionBtnOne = (game) => {
    const homeTeamData = game.competitions[0].competitors.find(
      (team) => team.homeAway === "home"
    ).team;
    const awayTeamData = game.competitions[0].competitors.find(
      (team) => team.homeAway === "away"
    ).team;
    const gameDetails = {
      game_ID: game.id,
      gameTitle: game.shortName,
      gameTime: game.competitions[0].date,
      gameDay: new Date(game.competitions[0].date).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      homeLogo: game.competitions[0].competitors[0].team.logo,
      awayLogo: game.competitions[0].competitors[1].team.logo,
      homeTeam: homeTeamData.shortDisplayName,
      awayTeam: awayTeamData.shortDisplayName,
      sportType: "MLB",
    };
    localStorage.setItem(
      LOCALSTORAGE.SELECTEDGAME,
      JSON.stringify(gameDetails)
    );
    navigate("/betPage");
  };
  const todaysSchedule = async () => {
    const response = await fetch(
      "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard"
    );
    const teamData = await response.json();
    console.log(teamData);

    setTodaysGameArr(teamData.events);
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
              key={game.id}
              className="col-3 card m-1"
              style={{ width: "20rem" }}
            >
              <div className="card-body">
                <h5 className="card-title">{game.shortName}</h5>
                <div className="row">
                  <div className="col">
                    <img
                      src={game.competitions[0].competitors[0].team.logo}
                      alt={"logo"}
                      className="img-fluid"
                    />
                  </div>
                  <div className="col">
                    <img
                      src={game.competitions[0].competitors[1].team.logo}
                      alt={"logo"}
                      className="img-fluid"
                    />
                  </div>
                </div>
                <div className="row"></div>
                <div>
                  <p>
                    {new Date(game.competitions[0].date).toLocaleDateString(
                      "en-US",
                      { weekday: "short" }
                    )}{" "}
                    at{" "}
                    {new Date(game.competitions[0].date).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "numeric",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
                <div>
                  <p></p>
                  <p>{game.status.type.detail}</p>
                </div>
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
