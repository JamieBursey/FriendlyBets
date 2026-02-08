import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOCALSTORAGE } from "../../Config";

const NflTodaySchedule = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

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
      sportType: "NFL",
    };
    localStorage.setItem(
      LOCALSTORAGE.SELECTEDGAME,
      JSON.stringify(gameDetails)
    );
    navigate("/betPage");
  };


  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard"
        );
        const data = await response.json();
        const todayGames = (data.events || []).map((event) => {
          const competition = event.competitions[0];
          const home = competition.competitors.find((c) => c.homeAway === "home");
          const away = competition.competitors.find((c) => c.homeAway === "away");
          return {
            game_ID: event.id,
            gameTitle: `${away.team.abbreviation} vs ${home.team.abbreviation}`,
            gameTime: competition.date,
            gameDay: new Date(competition.date).toLocaleDateString(),
            homeLogo: home.team.logo,
            awayLogo: away.team.logo,
            homeTeam: home.team.displayName,
            awayTeam: away.team.displayName,
            status: competition.status.type.name,
          };
        });
        setGames(todayGames);
      } catch (error) {
        setGames([]);
      }
      setLoading(false);
    };
    fetchGames();
  }, []);

  // Live games: status is IN or not FINAL/OFF
  const liveGames = games.filter(g => g.status === "IN");
  const todayGames = games;

  return (
    <div className="text-white text-center">
      <h1>Live NFL Games</h1>
      <div className="row justify-content-center">
        {liveGames.length === 0 && <p>No live games right now.</p>}
        {liveGames.map((game) => (
          <div key={game.game_ID} className="col-3 card m-1" style={{ width: "20rem" }}>
            <div className="card-body">
              <h5 className="card-title">{game.gameTitle}</h5>
              <div className="row align-items-center">
                <div className="col">
                  <img src={game.awayLogo} alt={game.awayTeam} style={{ width: 60, height: 60 }} />
                  <div style={{ fontSize: 12 }}>{game.awayTeam}</div>
                </div>
                <div className="col">
                  <img src={game.homeLogo} alt={game.homeTeam} style={{ width: 60, height: 60 }} />
                  <div style={{ fontSize: 12 }}>{game.homeTeam}</div>
                </div>
              </div>
              <p>
                {game.gameDay} at {new Date(game.gameTime).toLocaleTimeString()}
              </p>
              <div className="row">
                <div className="col">
                  <button
                    onClick={() =>
                      actionBtnOne(
                        game.game_ID,
                        game.gameTitle,
                        game.gameTime,
                        game.gameDay,
                        game.homeLogo,
                        game.awayLogo
                      )
                    }
                    className="btn btn-primary w-100"
                  >
                    Bet Friends
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <h1 className="mt-4">Today's NFL Games (ESPN)</h1>
      <div className="row justify-content-center">
        {todayGames.length === 0 && <p>No games today.</p>}
        {todayGames.map((game) => (
          <div key={game.game_ID} className="col-3 card m-1" style={{ width: "20rem" }}>
            <div className="card-body">
              <h5 className="card-title">{game.gameTitle}</h5>
              <div className="row align-items-center">
                <div className="col">
                  <img src={game.awayLogo} alt={game.awayTeam} style={{ width: 60, height: 60 }} />
                  <div style={{ fontSize: 12 }}>{game.awayTeam}</div>
                </div>
                <div className="col">
                  <img src={game.homeLogo} alt={game.homeTeam} style={{ width: 60, height: 60 }} />
                  <div style={{ fontSize: 12 }}>{game.homeTeam}</div>
                </div>
              </div>
              <p>
                {game.gameDay} at {new Date(game.gameTime).toLocaleTimeString()}
              </p>
              <div className="row">
                <div className="col">
                  <button
                    onClick={() =>
                      actionBtnOne(
                        game.game_ID,
                        game.gameTitle,
                        game.gameTime,
                        game.gameDay,
                        game.homeLogo,
                        game.awayLogo
                      )
                    }
                    className="btn btn-primary w-100"
                  >
                    Bet Friends
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Weekly schedule (simple version, can be improved)
const NflWeeklySchedule = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard"
        );
        const data = await response.json();
        // For demo, just use all games in the response
        const weekGames = (data.events || []).map((event) => {
          const competition = event.competitions[0];
          const home = competition.competitors.find((c) => c.homeAway === "home");
          const away = competition.competitors.find((c) => c.homeAway === "away");
          return {
            game_ID: event.id,
            gameTitle: `${away.team.abbreviation} vs ${home.team.abbreviation}`,
            gameTime: competition.date,
            gameDay: new Date(competition.date).toLocaleDateString(),
            homeLogo: home.team.logo,
            awayLogo: away.team.logo,
            homeTeam: home.team.displayName,
            awayTeam: away.team.displayName,
            status: competition.status.type.name,
          };
        });
        setGames(weekGames);
      } catch (error) {
        setGames([]);
      }
      setLoading(false);
    };
    fetchGames();
  }, []);

  return (
    <div className="text-white text-center mt-4">
      <h1>This Week's NFL Games</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="row justify-content-center">
          {games.length === 0 && <p>No games this week.</p>}
          {games.map((game) => (
            <div key={game.game_ID} className="col-3 card m-1" style={{ width: "20rem" }}>
              <div className="card-body">
                <h5 className="card-title">{game.gameTitle}</h5>
                <div className="row align-items-center">
                  <div className="col">
                    <img src={game.awayLogo} alt={game.awayTeam} style={{ width: 60, height: 60 }} />
                    <div style={{ fontSize: 12 }}>{game.awayTeam}</div>
                  </div>
                  <div className="col">
                    <img src={game.homeLogo} alt={game.homeTeam} style={{ width: 60, height: 60 }} />
                    <div style={{ fontSize: 12 }}>{game.homeTeam}</div>
                  </div>
                </div>
                <p>
                  {game.gameDay} at {new Date(game.gameTime).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { NflTodaySchedule, NflWeeklySchedule };
