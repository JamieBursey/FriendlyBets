import { useEffect } from "react";

const MlbSchedule = () => {
  const fetchSchedule = async () => {
    const response = await fetch(
      "https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1"
    );
    const teamData = await response.json();
    const teamLogos = [];
    console.log(teamData);
    console.log(response, "response");
  };
  useEffect(() => {
    fetchSchedule();
  }, []);
  const createGameCard = () => {
    return (
      <div className="col-3 card m-1" style={{ width: "20rem" }}>
        <div className="card-body">
          Game Title {/* <h5 className="card-title">{gameTitle}</h5> */}
          <div className="row">
            <div className="col">{/* <img src= alt=""></img> */}</div>
            <div className="col">{/* <img src= alt="" /> */}</div>
          </div>
          <p>
            Date and time here{" "}
            {/* {gameDay} at {new Date(gameTime).toLocaleTimeString()} */}
          </p>
          <div className="row">
            <div className="col">
              <button
                // onClick={() => actionBtnTwo(game_ID, gameTitle)}
                className="btn btn-primary w-100"
              >
                Bet Friend
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return createGameCard();
};

export { MlbSchedule };
