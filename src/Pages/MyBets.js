import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { getAllBets } from "../Data";
import { CheckBetResults, acceptBets, deleteBets } from "../Components";
import 'bootstrap/dist/css/bootstrap.min.css';

const Loader = () => (
  <div className="spinner-border text-primary" role="status">
    <span className="sr-only">Loading...</span>
  </div>
);

const MyBets = () => {
  const [activeBetArr, setActiveBetArr] = useState([]);
  const [settledBetArr, setSettledBetArr] = useState([]);
  const [pendingBetArr, setPendingBetArr] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState(''); // State to toggle between views

  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftBetId, setGiftBetId] = useState(null);
  const [giftRecipient, setGiftRecipient] = useState("");
  const [giftAmount, setGiftAmount] = useState("");
  const [giftVendor, setGiftVendor] = useState("Tim Hortons");

  // Modal handlers
  const handleOpenGiftModal = (betId, friend, wager) => {
    setGiftBetId(betId);
    setGiftRecipient(friend);
    setGiftAmount("");
    setGiftVendor("Tim Hortons");
    setShowGiftModal(true);
  };

  const handleCloseGiftModal = () => setShowGiftModal(false);

  const handleSubmitGiftCard = async () => {
    try {
      const response = await fetch(
        "https://your-backend.com/api/createGiftCardLink",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            betId: giftBetId,
            recipient: giftRecipient,
            amount: giftAmount,
            vendor: giftVendor,
          }),
        }
      );
      const data = await response.json();
      if (data.url) {
        window.open(data.url, "_blank");
        handleCloseGiftModal();
      } else {
        alert("Failed to create gift card link");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating gift card");
    }
  };

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
              <img
                src={awayLogo}
                alt="Away Team"
                style={{ width: "100px", height: "100px" }}
              />
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
               {betcreator !== loggedInUserUsername || betStatus !== "pending" ? (
  <>
    {/* 🟢 Show Results button only if NOT settled */}
    {betStatus !== "settled" && (
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
    )}
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
      Withdraw Bet
    </button>
  </div>
)}

                
              </div>
            )}
          </div>
                {betStatus === "settled" && (
        <div className="mt-3">
          <button
            className="btn btn-success w-100"
            onClick={() => handleOpenGiftModal(betId, friends, wager)}
          >
            Pay with Gift Card
          </button>
        </div>
      )}
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

      let settledBets = allBets.filter(
        (bet) =>
          (bet.creator_id === userData.public_user_id ||
            bet.friend_id === userData.public_user_id) &&
          bet.betstatus === "settled"
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

      let settledBetsCard = settledBets.map((b) => {
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

      setPendingBetArr(pendingBetsCard); // Set pending bets
      setActiveBetArr(activeBetsCard);
      setSettledBetArr(settledBetsCard);
      if (pendingBets.length > 0) {
        setView("pending");
      } else if (activeBets.length > 0) {
        setView("active");
      } else if (settledBets.length>0) {
        setView("settled");
      }
    else {setView("empty")}
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

        {/* Toggle between Pending, Active, and Settled */}
        <div className="btn-group mb-3" role="group" aria-label="Bet View Toggle">
          <button
            type="button"
            className={`btn ${view === 'pending' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setView('pending')}
          >
            Pending
          </button>
          <button
            type="button"
            className={`btn ${view === 'active' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setView('active')}
          >
            Active
          </button>
          <button
            type="button"
            className={`btn ${view === 'settled' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setView('settled')}
          >
            Settled
          </button>
        </div>

        {/* Conditionally render based on selected view */}
        {view === "pending" && (
          <>
            <h3 className="text-white">Pending Bets</h3>
            <div className="row justify-content-center">
              {loading ? (
                <Loader />
              ) : pendingBetArr.length === 0 ? (
                "No Pending Bets"
              ) : (
                pendingBetArr
              )}
            </div>
          </>
        )}

        {view === "active" && (
          <>
            <h3 className="text-white">Active Bets</h3>
            <div className="row justify-content-center">
              {loading ? (
                <Loader />
              ) : activeBetArr.length === 0 ? (
                "No Active Bets"
              ) : (
                activeBetArr
              )}
            </div>
          </>
        )}

        {view === "settled" && (
          <>
            <h3 className="text-white">Settled Bets</h3>
            <div className="row justify-content-center">
              {loading ? (
                <Loader />
              ) : settledBetArr.length === 0 ? (
                "No Settled Bets"
              ) : (
                settledBetArr
              )}
            </div>
          </>
        )}
        {view==="empty" &&(
          <>
          <h2 className="text-white">You have no bets.</h2></>
        )}
      </div>
    </div>
  );
};

export { MyBets, Loader };
