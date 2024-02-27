import { useEffect, useState } from "react";

const MlbTodaysGames = () => {
  const [todaysGameArr, setTodaysGameArr] = useState([]);

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
              key={game.gamePk}
              className="col-3 card m-1"
              style={{ width: "20rem" }}
            >
              <div className="card-body">
                <h5 className="card-title">{game.name}</h5>
                <div className="row">
                  <div className="col">
                    {/* <img
                      src={teamLogos[game.teams.away.team.id]}
                      alt={`${game.teams.away.team.abbreviation} logo`}
                      className="img-fluid"
                    /> */}
                  </div>
                  <div className="col">
                    {/* <img
                      src={game.homeTeam.logo}
                      alt={`${game.homeTeam.abbrev} logo`}
                      className="img-fluid"
                    /> */}
                  </div>
                </div>
                <div className="row"></div>
                <p>{game.gameDate}</p>
                {/* <button
                  onClick={() => actionBtnOne(game)}
                  className="btn btn-primary w-100"
                >
                  Bet Friends
                </button> */}
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
  return MlbTodaysGames();
};
export { MlbTodaysGames, MlbSchedule };
