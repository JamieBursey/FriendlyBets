import React, { useEffect, useState } from "react";
import { LOCALSTORAGE } from "../Config";
import { getAllBets } from "../Data";
import { CheckBetResults, acceptBets, deleteBets } from "../Components";
const Loader = () => (
  <div className="spinner-border text-success" role="status">
    <span className="visually-hidden">Loading...</span>
  </div>
);

const MyBets = () => {
  const [betsArr, setBetsArr] = useState([]);
  const [activeBetArr, setActiveBetArr] = useState([]);

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
    betCreator, // TODO: change to betCreator
    loggedInUserUsername,
    betStatus,
    result
  ) => {
    const betDescriptions = Object.entries(betDes)
      .filter(([key, value]) => value)
      .map(([key, value]) => key);
    return (
      <div key={betId} className="col-3 card m-1" style={{ width: "18rem" }}>
        <div className="card-body">
          <div className="position-absolute top-0 end-0 me-1 mt-1">
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => {
                deleteBets(betId, fetchBetData);
              }}
            ></button>
          </div>
          <h5 className="card-title">{gameTitle}</h5>
          <div className="row">
            <div className="col">
              <img src={homeLogo}></img>
            </div>
            <div className="col">
              <img src={awayLogo} />
            </div>
          </div>
          {betDescriptions.map((desc, index) => (
            <p key={index}>{desc}</p>
          ))}
          <p>
            {betCreator} bets {friends}: {wager}
          </p>
          <p>Result:{result}</p>
          <div className="row">
            {betStatus === "pending" && betCreator === loggedInUserUsername ? (
              <p>Awaiting {friends} Confirmation</p>
            ) : null}
            {betStatus === "pending" && betCreator !== loggedInUserUsername ? (
              <>
                <div className="col">
                  <button
                    className="btn btn-primary w-100 mb-1"
                    onClick={() => acceptBets(betId, betCreator, fetchBetData)}
                  >
                    Accept
                  </button>
                </div>
                <div className="col">
                  <button
                    className="btn btn-secondary w-100"
                    onClick={() => deleteBets(betId, fetchBetData)}
                  >
                    Decline
                  </button>
                </div>
              </>
            ) : (
              <div className="row">
                <div className="col">
                  <button
                    onClick={() => {
                      CheckBetResults(betId, fetchBetData);
                    }}
                    className="btn btn-primary w-100"
                  >
                    Results
                  </button>
                </div>
                <div className="col">
                  <button
                    onClick={() => {
                      deleteBets(betId, fetchBetData);
                    }}
                    className="btn btn-primary w-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const fetchBetData = () => {
    let betsArrString = localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER);
    let allBets = getAllBets();
    let userBets = betsArrString ? JSON.parse(betsArrString) : [];
    let betsArr = userBets.bets;
    let currentUser = JSON.parse(
      localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER)
    );
    let pendingBets = allBets.filter(
      (bet) =>
        (bet.betCreator === currentUser.username ||
          bet.friends.includes(currentUser.username)) &&
        bet.betStatus === "pending"
    );
    let activeBets = allBets.filter(
      (bet) =>
        (bet.betCreator === currentUser.username ||
          bet.friends.includes(currentUser.username)) &&
        bet.betStatus === "active"
    );

    let pendingBetsCard = pendingBets.map((b) => {
      const betId = b.betId;
      const gameTitle = b.gameTitle;
      const game_ID = b.game_ID;
      const friends = b.friends;
      const homeLogo = b.homeLogo;
      const awayLogo = b.awayLogo;
      const wager = b.wager;
      const betDes = b.betDescripston;
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
        b.betCreator,
        currentUser.username,
        betStatus,
        b.result
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
        b.betCreator,
        currentUser.username,
        betStatus,
        b.result
      );
    });
    setBetsArr(pendingBetsCard);
    setActiveBetArr(activeBetsCard);
  };
  useEffect(() => {
    // Whenever the page loads, then this is executed
    fetchBetData();
  }, []);

  return (
    <div className="text-white text-center">
      <h1> My Bets </h1>

      <div>
        <h2>Pending Bets</h2>
        <div className="row justify-content-center">
          {betsArr.length === 0 ? "No Pending Bets" : betsArr}
        </div>
      </div>

      <div>
        <h2>Active Bets</h2>
        <div className="row justify-content-center">
          {activeBetArr.length === 0 ? "No Pending Bets" : activeBetArr}
        </div>
      </div>
    </div>
  );
};
export { MyBets };
