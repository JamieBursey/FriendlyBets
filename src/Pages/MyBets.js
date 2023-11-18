import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOCALSTORAGE } from "../Config";

const Loader = () => <div> Loading .... </div>;

const MyBets = () => {
  const navigate = useNavigate();

  //create Game Cards
  const creatBetCard = (
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
                onClick={() => console.log("Action btn clicked.")}
                className="btn btn-primary w-100"
              >
                Bet Friends
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const [betsArr, setBetsArr] = useState(null);
  const fetchData = () => {
    let betsArrString = localStorage.getItem(LOCALSTORAGE.BETS);
    console.log("betsString", betsArrString);
    let betsArr =
      betsArrString == "" || betsArrString == null
        ? []
        : JSON.parse(betsArrString);
    console.log("betsArr", betsArr);
    let betCardArr = betsArr.map((b) =>
      creatBetCard(null, null, null, null, null, null)
    );
    setBetsArr(betCardArr);
  };
  useEffect(() => {
    // Whenever the page loads, then this is executed
    fetchData();
  }, []);

  return (
    <div className="text-white text-center">
      <h1> My Bets </h1>

      <div className="row justify-content-center">
        {betsArr == null ? <Loader /> : betsArr}
      </div>
    </div>
  );
};
export { MyBets };
