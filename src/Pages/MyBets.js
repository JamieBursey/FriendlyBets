import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOCALSTORAGE } from "../Config";
import { loggedInUserKey, all } from "../Data";
const Loader = () => <div> Loading .... </div>;

const MyBets = () => {
  const navigate = useNavigate();
  const [betsArr, setBetsArr] = useState([]);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem(loggedInUserKey))
  );
  //create Game Cards
  const creatBetCard = (
    game_ID,
    gameTitle,
    friends,
    homeLogo,
    awayLogo,
    wager,
    betDes,
    friendReq
  ) => {
    const betDescriptions = Object.keys(betDes).filter(
      (key) => betDes[key] === true
    );
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
          <p>{friends}</p>
          {betDescriptions.map((desc, index) => (
            <p key={index}>{desc}</p>
          ))}
          <p>
            {friendReq} bets {wager}
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

  const fetchData = () => {
    let betsArrString = localStorage.getItem(loggedInUserKey);
    let userBets = betsArrString ? JSON.parse(betsArrString) : [];
    let betsArr = userBets.bets;
    console.log("betsArr", betsArr);
    let betCardArr = betsArr.map((b) => {
      const gameTitle = b.gameTitle;
      const game_ID = b.game_ID;
      const friends = b.friends;
      const homeLogo = b.homeLogo;
      const awayLogo = b.awayLogo;
      const wager = b.wager;
      const betDes = b.betDescripston;
      const friendReq = b.friendReq;
      return creatBetCard(
        game_ID,
        gameTitle,
        friends,
        awayLogo,
        homeLogo,
        wager,
        betDes,
        friendReq
      );
    });
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
