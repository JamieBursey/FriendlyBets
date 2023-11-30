import { useEffect, useState } from "react";
import { BettingOptions } from "../Data";
import { useNavigate } from "react-router-dom";
import { getAllUsers, getAllBets } from "../Data";
import { LOCALSTORAGE, NAVIGATION } from "../Config";

const BetPage = () => {
  const gameInfo = localStorage.getItem("selectedGame");
  const selectedGame = JSON.parse(gameInfo);
  const navigate = useNavigate();
  const [selectedFriends, setSelectedFriends] = useState("");
  const [usersFriendList, setUsersFriendList] = useState([]);
  const [selectedBets, setSelectedBets] = useState({});
  const [Wager, setWager] = useState("");
  const loggedInUserData = localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER);
  const loggedInUsr = loggedInUserData ? JSON.parse(loggedInUserData) : null;
  useEffect(() => {
    setUsersFriendList(loggedInUsr.friends);
  }, []);

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
    <div className="card mt-3" style={{ width: "90%", margin: "auto" }}>
      <div className="card-body">
        <h5 className="card-title text-center">{selectedGame.gameTitle}</h5>
        <p className="text-center">
          {new Date(selectedGame.gameTime).toLocaleTimeString()}
        </p>
        <div className="row">
          <div className="col">
            <img src={selectedGame.awayLogo}></img>
          </div>
          <div className="col">
            <img src={selectedGame.homeLogo} />
          </div>
        </div>

        <div className="mb-3">
          <select
            className="form-select"
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
          type="text"
          placeholder="Set Wager"
          onChange={(event) => setWager(event.target.value)}
        ></input>
        <>
          <BettingOptions
            game_ID={selectedGame}
            updateCheckedBets={updateCheckedBets}
            selectedBets={selectedBets}
          />
        </>
        <button className="btn btn-primary mx-1" onClick={placeBet}>
          Place Bet
        </button>
        <button
          className="btn btn-primary"
          onClick={() => console.log(setWager)}
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

/*
HW
- Update localstorage get/set to use configuration page
- Update navigation to use configuration page
- Update MyBets Cards to show game info and bet status
- Move navbar options from dropdown to navbar
Bonus
- Add a refresh btn, pull the game info, check if it istill pending or not
- If not pending, remove the object from the array, and push it again with the coreect status
- save the array again to the local storage
- Refresh the page: navigate(mybets) or another option is to change the value of the arrayBets using the state function setArrBets
*/
