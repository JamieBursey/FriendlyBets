import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { getAllBets } from "../Data";
import { CheckBetResults, acceptBets, deleteBets } from "../Components";

const Loader = () => (
  <div className="spinner-border text-primary" role="status">
    <span className="sr-only">Loading...</span>
  </div>
);

const MyBets = () => {
  const [betsArr, setBetsArr] = useState([]);
  const [activeBetArr, setActiveBetArr] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const backgroundColor = {
    background: "linear-gradient(to bottom, #0B1305 0%, #00008B 100%)",
  };

  // Create Bet Cards
  const createBetCard = (
    betId,
    game_ID,
    gameTitle,
    friends,
    homeLogo,
    awayLogo,
    wager,
    betDes,
    betcreator,
    loggedInUserUsername,
    betStatus,
    result
  ) => {
    const betDescriptions = betDes
      ? Object.entries(betDes)
          .filter(([key, value]) => value)
          .map(([key, value]) => key)
      : [];

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
                alt="Home Team"
              ></img>
            </div>
            <div className="col">
              <img src={awayLogo} alt="Away Team" style={{ width: "100px", height: "100px" }} />
            </div>
          </div>
          <p>
            {betcreator} bets{" "}
            {Array.isArray(friends) ? friends.join(", ") : friends}: {wager}
          </p>
          {betDescriptions.map((desc, index) => (
            <p key={index}>{desc}</p>
          ))}
          <p>Result: {result}</p>
          <div className="row">
            {betStatus === "pending" && betcreator === loggedInUserUsername ? (
              <p>
                Awaiting {Array.isArray(friends) ? friends.join(", ") : friends}{" "}
                Confirmation
              </p>
            ) : null}
            {betStatus === "pending" && betcreator !== loggedInUserUsername ? (
              <>
                <div className="col">
                  <button
                    className="btn btn-primary w-100 mb-1"
                    onClick={() => acceptBets(betId, fetchBetData)}
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
                {betcreator !== loggedInUserUsername ||
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

  const fetchBetData = async () => {
    setLoading(true);
    const allBets = await getAllBets();


    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError) {
      console.error("Error fetching session:", sessionError);
      setLoading(false);
      return;
    }

    if (sessionData && sessionData.session) {
      const user = sessionData.session.user;
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("public_user_id", user.id)
        .single();

      if (userError) {
        console.error("Error fetching user data:", userError);
        setLoading(false);
        return;
      }

      setCurrentUser(userData);

      let pendingBets = allBets.filter(
        (bet) =>
          (bet.creator_id === userData.public_user_id ||
            bet.friend_id === userData.public_user_id) &&
          bet.betstatus === "pending"
      );

      let activeBets = allBets.filter(
        (bet) =>
          (bet.creator_id === userData.public_user_id ||
            bet.friend_id === userData.public_user_id) &&
          bet.betstatus === "active"
      );
 

      let pendingBetsCard = pendingBets.map((b) => {
        const betId = b.betid;
        const gameTitle = b.gametitle;
        const game_ID = b.gameid;
        const friends = b.friends || [];
        const homeLogo = b.homelogo;
        const awayLogo = b.awaylogo;
        const wager = b.wager;
        const betDes = b.betdescription || {}; // Ensure betDes is an object
        const betStatus = b.betstatus;
        return createBetCard(
          betId,
          game_ID,
          gameTitle,
          friends,
          awayLogo,
          homeLogo,
          wager,
          betDes,
          b.betcreator,
          userData.username,
          betStatus,
          b.result
        );
      });

      let activeBetsCard = activeBets.map((b) => {
        const betId = b.betid;
        const gameTitle = b.gametitle;
        const game_ID = b.gameid;
        const friends = b.friends || [];
        const homeLogo = b.homelogo;
        const awayLogo = b.awaylogo;
        const wager = b.wager;
        const betDes = b.betdescription || {};
        const betStatus = b.betstatus;
        return createBetCard(
          betId,
          game_ID,
          gameTitle,
          friends,
          awayLogo,
          homeLogo,
          wager,
          betDes,
          b.betcreator,
          userData.username,
          betStatus,
          b.result
        );
      });

      setBetsArr(pendingBetsCard);
      setActiveBetArr(activeBetsCard);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBetData();
  }, []);

  return (
    <div
      className="d-flex justify-content-center align-items-center "
      style={backgroundColor}
    >
      <div
        className="container rounded p-3 text-center"
        style={{ backgroundColor: "#1E1E1E", borderRadius: "5px" }}
      >
        <h1 className="login-text w-50 mx-auto">My Bets</h1>
        <h3 className="text-white ">Pending Bets</h3>
        <div className="row justify-content-center">
          {loading ? (
            <Loader />
          ) : betsArr.length === 0 ? (
            "No Pending Bets"
          ) : (
            betsArr
          )}
        </div>
        <hr style={{ backgroundColor: "white", height: "2px" }} />
        <h2 className="text-white">Active Bets</h2>
        <div className="row justify-content-center">
          {loading ? (
            <Loader />
          ) : activeBetArr.length === 0 ? (
            "No Active Bets"
          ) : (
            activeBetArr
          )}
        </div>
      </div>
    </div>
  );
};

export { MyBets, Loader };
