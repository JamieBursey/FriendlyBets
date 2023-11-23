import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOCALSTORAGE } from "../Config";
import { loggedInUserKey, all } from "../Data";
import { acceptBets } from "../Components";
const Loader = () => <div> Loading .... </div>;

const MyBets = () => {
  const navigate = useNavigate();
  const [betsArr, setBetsArr] = useState([]);
  const [activeBetArr, setActiveBetArr] = useState([]);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem(loggedInUserKey))
  );

  //create Game Cards
  const creatBetCard = (
    betId,
    game_ID,
    gameTitle,
    friends,
    homeLogo,
    awayLogo,
    wager,
    betDes,
    friendReq,
    betStatus
  ) => {
    const betDescriptions = Object.entries(betDes)
      .filter(([key, value]) => value)
      .map(([key, value]) => key);
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
            {betStatus === "pending" ? (
              <>
                <div className="col">
                  <button
                    className="btn btn-primary w-100 mb-1"
                    onClick={() => acceptBets(betId, friendReq)}
                  >
                    Accept
                  </button>
                </div>
                <div className="col">
                  <button className="btn btn-secondary w-100">Decline</button>
                </div>
              </>
            ) : (
              <button
                onClick={() => console.log("Action btn clicked.")}
                className="btn btn-primary w-100"
              >
                Refresh Bet
              </button>
            )}
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

    let pendingBets = betsArr.filter((bet) => bet.betStatus === "pending");
    let activeBets = betsArr.filter((bet) => bet.betStatus === "active");
    console.log("active bets", activeBetArr);
    let pendingBetsCard = pendingBets.map((b) => {
      const betId = b.betId;
      const gameTitle = b.gameTitle;
      const game_ID = b.game_ID;
      const friends = b.friends;
      const homeLogo = b.homeLogo;
      const awayLogo = b.awayLogo;
      const wager = b.wager;
      const betDes = b.betDescripston;
      const friendReq = b.friendReq;
      const betStatus = b.betStatus;
      return creatBetCard(
        betId,
        game_ID,
        gameTitle,
        friends,
        awayLogo,
        homeLogo,
        wager,
        betDes,
        friendReq,
        betStatus
      );
    });
    let activeBetsCard = activeBets.map((b) => {
      const betId = b.betId;
      const gameTitle = b.gameTitle;
      const game_ID = b.game_ID;
      const friends = b.friends;
      const homeLogo = b.homeLogo;
      const awayLogo = b.awayLogo;
      const wager = b.wager;
      const betDes = b.betDescripston;
      const friendReq = b.friendReq;
      const betStatus = b.betStatus;
      return creatBetCard(
        betId,
        game_ID,
        gameTitle,
        friends,
        awayLogo,
        homeLogo,
        wager,
        betDes,
        friendReq,
        betStatus
      );
    });
    setBetsArr(pendingBetsCard);
    setActiveBetArr(activeBetsCard);
  };
  useEffect(() => {
    // Whenever the page loads, then this is executed
    fetchData();
  }, []);

  return (
    <div className="text-white text-center">
      <h1> My Bets </h1>

      <div>
        <h2>Pending Bets</h2>
        <div className="row justify-content-center">
          {betsArr.length === 0 ? <Loader /> : betsArr}
        </div>
      </div>

      <div>
        <h2>Active Bets</h2>
        <div className="row justify-content-center">
          {activeBetArr.length === 0 ? <Loader /> : activeBetArr}
        </div>
      </div>
    </div>
  );
};
export { MyBets };
