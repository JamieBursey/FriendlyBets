import { useEffect, useState } from "react";
import { BettingOptions } from "../Data";
import { useNavigate } from "react-router-dom";
import { getAllUsers, getAllBets } from "../Data";
import { LOCALSTORAGE, NAVIGATION } from "../Config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { handleSendFriendRequest } from "./AddFriends";

const BetPage = () => {
  const gameInfo = localStorage.getItem(LOCALSTORAGE.SELECTEDGAME);
  const selectedGame = JSON.parse(gameInfo);

  const navigate = useNavigate();
  const [selectedFriends, setSelectedFriends] = useState("");
  const [usersFriendList, setUsersFriendList] = useState([]);
  const [selectedBets, setSelectedBets] = useState({});
  const [Wager, setWager] = useState("");
  const [email, setEmail] = useState("");

  const loggedInUserData = localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER);
  const loggedInUsr = loggedInUserData ? JSON.parse(loggedInUserData) : null;
  useEffect(() => {
    setUsersFriendList(loggedInUsr.friends);
  }, []);
  const onSuccess = () => {
    setEmail("");
  };
  const updateCheckedBets = (betOption) => {
    setSelectedBets({ [betOption]: true }); //sets just one player to bet against.
  };
  const placeBet = () => {
    if (!selectedFriends || selectedFriends === "") {
      alert("Please select a friend to bet with.");
      return;
    }
    let allBets = getAllBets();
    let currentUser = JSON.parse(
      localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER)
    );

    const generateBetId = () => {
      const randomId = new Date().getTime(); //uses a time stamp to generate a uniqe id.
      return randomId;
    };
    const newBet = {
      betId: generateBetId(),
      gameId: selectedGame.game_ID,
      gameTitle: selectedGame.gameTitle,
      homeLogo: selectedGame.homeLogo,
      awayLogo: selectedGame.awayLogo,
      betDescripston: selectedBets,
      betCreator: currentUser.username, // TODO: change it to maybe creator? owner?
      wager: Wager,
      result: "Waiting",
      friends: [selectedFriends],
      betStatus: "pending",
    };
    allBets.push(newBet);
    localStorage.setItem(LOCALSTORAGE.BETS, JSON.stringify(allBets));
    navigate(NAVIGATION.MYBETS);
  };
  return (
    <div
      className="container mt-4 text-center bg-secondary bg-gradient p-5 rounded"
      style={{ maxWidth: "1000px" }}
    >
      <div className="set-bet-div text-center">
        <span className="straight-line"></span>
        <p className="set-bet-text">Set Your Bet</p>
        <span className="straight-line"></span>
      </div>
      <div className="card-body">
        <h5 className="card-title text-center">{selectedGame.gameTitle}</h5>
        <p className="text-center">
          {new Date(selectedGame.gameTime).toLocaleTimeString()}
        </p>
        <div className="row">
          <div className="col d-flex justify-content-center align-items-center">
            <img
              src={selectedGame.awayLogo}
              className="img-fluid"
              style={{ width: "150px", height: "150px" }}
            />
          </div>
          <div className="col d-flex justify-content-center align-items-center">
            <span className="vs-text">VS</span>
          </div>
          <div className="col d-flex justify-content-center align-items-center">
            <img
              src={selectedGame.homeLogo}
              className="img-fluid"
              style={{ width: "150px", height: "150px" }}
            />
          </div>
        </div>

        {usersFriendList.length >= 1 ? (
          <p className="friends-number">
            <FontAwesomeIcon icon={faUserGroup} /> {usersFriendList.length}
          </p>
        ) : (
          <div className=" mb-3 mt-3 w-50 mx-auto d-flex align-items-center">
            <input
              style={{ backgroundColor: "#f2f2f2", borderColor: "gray" }}
              type="email"
              className="form-control me-1 custom-input"
              placeholder="FriendRequest@email.com"
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
            value={selectedFriends}
            onChange={(e) => setSelectedFriends(e.target.value)}
          >
            <option value="">Select a Friend</option>
            {usersFriendList.map((friend, index) => (
              <option key={index} value={friend}>
                {friend}
              </option>
            ))}
          </select>
        </div>
        <input
          style={{ backgroundColor: "#f2f2f2", borderColor: "gray" }}
          className="mb-3 custom-input"
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

// const structor=[
//   {
//     "id": 2023020228,
//     "season": 20232024,
//     "gameType": 2,
//     "gameDate": "2023-11-13",
//     "venue": {
//       "default": "Climate Pledge Arena"
//     },
//     "startTimeUTC": "2023-11-14T03:00:00Z",
//     "easternUTCOffset": "-05:00",
//     "venueUTCOffset": "-08:00",
//     "tvBroadcasts": [
//       {
//         "id": 2,
//         "market": "A",
//         "countryCode": "US",
//         "network": "ALT"
//       }
//       // ... more broadcasts
//     ],
//     "gameState": "LIVE",
//     "gameScheduleState": "OK",
//     "period": 1,
//     "periodDescriptor": {
//       "number": 1,
//       "periodType": "REG"
//     },
//     "awayTeam": {
//       "id": 21,
//       "name": {
//         "default": "Avalanche"
//       },
//       "abbrev": "COL",
//       "score": 0,
//       "sog": 1,
//       "logo": "https://assets.nhle.com/logos/nhl/svg/COL_light.svg",
//       "onIce": [
//         {
//           "playerId": 8471677
//         }
//         // ... more players
//       ],
//       "radioLink": "https://d2igy0yla8zi0u.cloudfront.net/col/20232024/col-radio.m3u8"
//     },
//     "homeTeam": {
//       // ... similar structure to awayTeam
//     },
//     "clock": {
//       "timeRemaining": "09:16",
//       "secondsRemaining": 556,
//       "running": true,
//       "inIntermission": false
//     },
//     "rosterSpots": [
//       {
//         "teamId": 21,
//         "playerId": 8471677,
//         "firstName": {
//           "default": "Jack"
//         },
//         "lastName": {
//           "default": "Johnson"
//         },
//         "sweaterNumber": 3,
//         "positionCode": "D",
//         "headshot": "https://assets.nhle.com/mugs/nhl/20232024/COL/8471677.png"
//       }
//       // ... more roster spots
//     ],
//     "displayPeriod": 1,
//     "plays": [
//       {
//         "eventId": 102,
//         "period": 1,
//         // ... more details about the play
//       }
//       // ... more plays
//     ]
//   }
// ]
