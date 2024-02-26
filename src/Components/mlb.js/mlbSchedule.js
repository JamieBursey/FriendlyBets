const MlbSchedule = () => {
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
