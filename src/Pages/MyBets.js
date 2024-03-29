import React, { useEffect, useState } from "react";
import { LOCALSTORAGE } from "../Config";
import { getAllBets } from "../Data";
import {
  CheckBetResults,
  acceptBets,
  bannerTextStyles,
  deleteBets,
} from "../Components";
const Loader = () => (
  <div class="spinner-border text-primary" role="status">
    <span class="sr-only">Loading...</span>
  </div>
);

const MyBets = () => {
  const [betsArr, setBetsArr] = useState([]);
  const [activeBetArr, setActiveBetArr] = useState([]);

  const backgroundColor = {
    background: "linear-gradient(to bottom, #0B1305 0%, #00008B 100%)",
  };

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
              <img
                src={homeLogo}
                style={{ width: "100px", height: "100px" }}
              ></img>
            </div>
            <div className="col">
              <img src={awayLogo} style={{ width: "100px", height: "100px" }} />
            </div>
          </div>
          <p>
            {betCreator} bets {friends}: {wager}
          </p>
          {betDescriptions.map((desc, index) => (
            <p key={index}>{desc}</p>
          ))}
          <p>Result: {result}</p>
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
                {betCreator !== loggedInUserUsername ||
                betStatus !== "pending" ? (
                  <>
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
                  </>
                ) : (
                  <div className="col-12">
                    <button
                      onClick={() => {
                        deleteBets(betId, fetchBetData);
                      }}
                      className="btn btn-outline-danger w-100"
                    >
                      Rescind Bet
                    </button>
                  </div>
                )}
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
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={backgroundColor}
    >
      <div
        className="container rounded p-3 text-center"
        style={{ backgroundColor: "#1E1E1E", borderRadius: "5px" }}
      >
        <h1 className="login-text w-50 mx-auto">My Bets</h1>
        <h3 className="text-white ">Pending Bets</h3>
        <div className="row justify-content-center">
          {betsArr.length === 0 ? "No Pending Bets" : betsArr}
        </div>
        <hr style={{ backgroundColor: "white", height: "2px" }} />
        <h2 className="text-white">Active Bets</h2>
        <div className="row justify-content-center">
          {activeBetArr.length === 0 ? "No Active Bets" : activeBetArr}
        </div>
      </div>
    </div>
  );
};
export { MyBets, Loader };
