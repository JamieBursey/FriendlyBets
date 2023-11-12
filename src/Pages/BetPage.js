import { useEffect, useState } from "react";
import { BettingOptions } from "../Data";
import { useNavigate } from "react-router-dom";
import { loggedInUserKey } from "../Data";

const BetPage = () => {
  const gameInfo = localStorage.getItem("selectedGame");
  const selectedGame = JSON.parse(gameInfo);
  console.log("carddetails", selectedGame);
  const navigate = useNavigate();
  const [selectedFriends, setSelectedFriends] = useState({});
  const [usersFriendList, setUsersFriendList] = useState([]);
  const [betPick, setBetPick] = useState([]);
  const [Wager, setWager] = useState([]);
  const fetchPlayByPlay = async () => {
    const response = fetch();
  };
  useEffect(() => {
    const loggedInUserData = localStorage.getItem(loggedInUserKey);
    const loggedInUsr = loggedInUserData ? JSON.parse(loggedInUserData) : null;
    setUsersFriendList(loggedInUsr.friends);
  }, []);

  const handleFriendSelection = (friend) => {
    setSelectedFriends((prevSelectedFriends) => ({
      ...prevSelectedFriends,
      [friend]: !prevSelectedFriends[friend],
    }));
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

        {usersFriendList.map((friend, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`friend${index}`}
              checked={!!selectedFriends[friend]}
              onChange={() => handleFriendSelection(friend)}
            />

            <label className="fs-3 text-success ms-2">{friend}</label>
          </div>
        ))}
        <input
          type="text"
          placeholder="Set Wager"
          onChange={(event) => setWager(event.target.value)}
        ></input>
        <button
          className="btn btn-primary mx-1"
          onClick={() => console.log(selectedFriends)}
        >
          Place Bet
        </button>
        <button
          className="btn btn-primary"
          onClick={() => console.log(setWager)}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export { BetPage };
