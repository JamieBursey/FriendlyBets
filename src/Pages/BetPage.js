import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { LOCALSTORAGE, NAVIGATION } from "../Config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { handleSendFriendRequest } from "./AddFriends";
import { BettingOptions } from "../Data";

const betsGradient = {
  background: "linear-gradient(to bottom, #0B1305 60%, #1e90ff 100%)",
  borderRadius: "1rem",
};

const BetPage = () => {
  const gameInfo = localStorage.getItem(LOCALSTORAGE.SELECTEDGAME);
  const selectedGame = JSON.parse(gameInfo);

  const navigate = useNavigate();
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [usersFriendList, setUsersFriendList] = useState([]);
  const [selectedBets, setSelectedBets] = useState({});
  const [wager, setWager] = useState("");
  const [email, setEmail] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error fetching session:", sessionError);
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
        } else {
          setLoggedInUser(userData);
          setUsersFriendList(userData.friends || []);
        }
      }
    };

    fetchLoggedInUser();
  }, []);

  const onSuccess = () => {
    setEmail("");
  };

  const updateCheckedBets = (betOption) => {
    setSelectedBets({ [betOption]: true });
  };

  const placeBet = async () => {
    if (!selectedFriend) {
      alert("Please select a friend to bet with.");
      return;
    }

    if (!loggedInUser) {
      alert("User not logged in.");
      return;
    }

    let allUsers = JSON.parse(localStorage.getItem(LOCALSTORAGE.USERS)) || [];

    if (!loggedInUser.hasDonated) {
      let betTokenCount = loggedInUser.betToken
        ? loggedInUser.betToken
        : parseInt(loggedInUser.betToken);

      if (betTokenCount > 0 || betTokenCount === "unlimited") {
        console.log(betTokenCount);
        if (betTokenCount !== "unlimited") {
          betTokenCount -= 1;
        }
        loggedInUser.betToken = betTokenCount.toString();
      } else {
        alert(
          "You do not have enough bet tokens to place a bet. Please wait 24 hours or donate for unlimited tokens."
        );
        return;
      }
    }

    const userIndex = allUsers.findIndex(
      (user) => user.email === loggedInUser.email
    );
    if (userIndex !== -1) {
      allUsers[userIndex] = { ...allUsers[userIndex], ...loggedInUser };
    }

    // Debugging: Log selectedFriend to ensure it has the correct data
    console.log("Selected Friend:", selectedFriend);

    const newBet = {
      betid: new Date().getTime().toString(),
      gameid: selectedGame.game_ID,
      gametitle: selectedGame.gameTitle,
      homelogo: selectedGame.homeLogo,
      awaylogo: selectedGame.awayLogo,
      betdescription: selectedBets,
      betcreator: loggedInUser.username,
      creator_id: loggedInUser.public_user_id,
      wager: wager,
      result: "Waiting",
      friends: selectedFriend.username,
      friend_id: selectedFriend.public_user_id,
      betstatus: "pending",
      sporttype: selectedGame.sportType,
    };

    const { error } = await supabase.from("bets").insert([newBet]);
    if (error) {
      console.error("Error placing bet:", error);
      alert("There was an error placing your bet. Please try again.");
      return;
    }

    localStorage.setItem(LOCALSTORAGE.USERS, JSON.stringify(allUsers));
    navigate(NAVIGATION.MYBETS);
  };

  return (
    <div
      className="container mt-2 text-center p-2 rounded"
      style={betsGradient}
    >
      <div className="set-bet-div text-center">
        <span className="straight-line"></span>
        <p className="set-bet-text">Set Your Bet</p>
        <span className="straight-line"></span>
      </div>
      <div className="card-body">
        <h5 className="card-title text-center text-info">
          {selectedGame.gameTitle}
        </h5>
        <p className="text-center text-info">
          {new Date(selectedGame.gameTime).toLocaleTimeString()}
        </p>
        <div className="row">
          <div className="col d-flex justify-content-center align-items-center">
            <img
              src={selectedGame.awayLogo}
              className="img-fluid"
              style={{ width: "100px", height: "100px" }}
            />
          </div>
          <div className="col d-flex justify-content-center align-items-center">
            <span className="vs-text">VS</span>
          </div>
          <div className="col d-flex justify-content-center align-items-center">
            <img
              src={selectedGame.homeLogo}
              className="img-fluid"
              style={{ width: "100px", height: "100px" }}
            />
          </div>
        </div>

        {usersFriendList.length >= 1 ? (
          <p className="friends-number">
            <FontAwesomeIcon icon={faUserGroup} /> {usersFriendList.length}
          </p>
        ) : (
          <div className="mb-3 mt-3 w-50 mx-auto d-flex align-items-center">
            <input
              style={{ backgroundColor: "#f2f2f2", borderColor: "gray" }}
              type="email"
              className="form-control me-1 custom-input"
              placeholder="AddFriend@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              style={{ height: "3rem", width: "6rem" }}
              className="btn btn-outline-info ms-2"
              onClick={() => handleSendFriendRequest(email, onSuccess)}
              type="button"
            >
              Send
            </button>
          </div>
        )}

        <div className="mb-3">
          <select
            className="form-select custom-select"
            value={selectedFriend ? selectedFriend.public_user_id : ""}
            onChange={(e) => {
              const friend = usersFriendList.find(
                (friend) => friend.public_user_id === e.target.value
              );
              setSelectedFriend(friend);
            }}
          >
            <option value="">Select a Friend</option>
            {usersFriendList.map((friend, index) => (
              <option key={index} value={friend.public_user_id}>
                {friend.username}
              </option>
            ))}
          </select>
        </div>
        <input
          style={{ backgroundColor: "#f2f2f2", borderColor: "gray" }}
          className="mb-3 custom-input w-50 text-center"
          type="text"
          placeholder="Type Your Wager"
          onChange={(event) => setWager(event.target.value)}
        ></input>
        <>
          <BettingOptions
            game_ID={selectedGame}
            updateCheckedBets={updateCheckedBets}
            selectedBets={selectedBets}
          />
        </>
        <button className="btn custom-button mx-1" onClick={placeBet}>
          Place Bet
        </button>
        <button
          className="btn custom-button"
          onClick={() => navigate("/MyBets")}
        >
          Check Bets
        </button>
      </div>
    </div>
  );
};

export { BetPage };
