import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { LOCALSTORAGE, NAVIGATION } from "../Config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { handleSendFriendRequest } from "./AddFriends";
import { BettingOptions } from "../Data";
import VIPModal from "../Components/modals/vip";
import { checkAndUpdateTokens } from "../Data/betdata/CheckAndUpdateTokens";
import { useTheme } from "../Components/theme/ThemeContext"; // Import the useTheme hook

// const betsGradient = {
//   background: "linear-gradient(to bottom, #0B1305 60%, #1e90ff 100%)",
//   borderRadius: "1rem",
// };

const BetPage = () => {
  const { theme } = useTheme(); // Get the current theme from ThemeContext
  const gameInfo = localStorage.getItem(LOCALSTORAGE.SELECTEDGAME);
  const selectedGame = JSON.parse(gameInfo);

  const navigate = useNavigate();
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [usersFriendList, setUsersFriendList] = useState([]);
  const [selectedBets, setSelectedBets] = useState({});
  const [wager, setWager] = useState("");
  const [email, setEmail] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showvip, setShowvip] = useState(false);

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
          return;
        }

        if (userData.has_donated && userData.donateDate) {
          const lastDonationDate = new Date(userData.donateDate);
          const currentDate = new Date();
          const timeDiff = currentDate - lastDonationDate;
          const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

          if (daysDiff > 30) {
            // Update `has_donated` to false
            const { error: updateError } = await supabase
              .from("users")
              .update({ has_donated: false })
              .eq("public_user_id", user.id);

            if (updateError) {
              console.error("Error updating donation status:", updateError);
            } else {
              console.log("User's donation status updated to false.");
              userData.has_donated = false; // Update local state
            }
          }
        }

        const updatedUser = await checkAndUpdateTokens(userData);
        setLoggedInUser(updatedUser);
        setUsersFriendList(updatedUser.friends || []);
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
    if (!loggedInUser.has_donated && !loggedInUser.is_admin) {
      let betTokens = loggedInUser.betToken || 0;

      if (betTokens <= 0) {
        setShowvip(true);
        return;
      }

      betTokens -= 1;

      const { error: tokenError } = await supabase
        .from("users")
        .update({ betToken: betTokens })
        .eq("public_user_id", loggedInUser.public_user_id);

      if (tokenError) {
        console.error("Error updating bet tokens:", tokenError);
        alert("An error occurred while placing your bet. Please try again.");
        return;
      }

      // Update the token count in the frontend state
      setLoggedInUser({ ...loggedInUser, betToken: betTokens });
    }

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
    try {
      const response = await fetch(
        "https://friendly-bets-back-end.vercel.app/api/newbet",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            toUserEmail: selectedFriend.email, // Use selected friend's email
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("Bet placed and notification sent successfully");
      } else {
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
    try {
      const response = await fetch(
        "https://friendly-bets-back-end.vercel.app/api/newBet",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            toUserEmail: selectedFriend.email,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Friend request sent and notification email sent successfully");
        onSuccess();
      } else {
        console.error("Error:", result.message);
      }
    } catch (error) {
      return;
    }
    navigate(NAVIGATION.MYBETS);
  };

  const cardStyles = {
    light: {
      backgroundColor: "#ffffff",
      color: "#000000",
      border: "1px solid #ddd",
    },
    dark: {
      backgroundColor: "#1e1e1e",
      color: "#ffffff",
      border: "1px solid #444",
    },
    retro: {
      backgroundColor: "#f4e2d8",
      color: "#2b2b2b",
      fontFamily: "Courier New, Courier, monospace",
      border: "2px solid #ff9900",
    },
  };

  return (
    <div
      className={`container mt-2 text-center p-2 rounded ${theme}`} // Apply the theme class dynamically
    >
      <VIPModal show={showvip} onClose={() => setShowvip(false)} />
      <div className="set-bet-div text-center">
        <span className="straight-line"></span>
        <p className="set-bet-text">Set Your Bet</p>
        <span className="straight-line"></span>
      </div>
      <div className="card-body" style={cardStyles[theme]}> {/* Apply inline styles */}
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
              alt="away logo"
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
              alt="home logo"
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