import { useEffect, useState } from "react";
import { BettingOptions } from "../Data";
import { useLocation, useNavigate } from "react-router-dom";
import { loggedInUserKey } from "../Data";

const BetPage = () => {
  const navigate = useNavigate();
  const [selectedFriends, setSelectedFriends] = useState({});
  const [usersFriendList, setUsersFriendList] = useState([]);
  const [betPick, setBetPick] = useState([]);
  //   const fetchTest = async () => {
  //     const fetchGame = await fetch(
  //       "https://statsapi.web.nhl.com/api/v1/schedule"
  //     );
  //     const gameData = await fetchGame.json();
  //     const homeID = gameData.dates[0].games.map(
  //       (game) => game.teams.home.team.id
  //     );
  //     for (let id of homeID) {
  //       const teamFetch = await fetch(
  //         `https://statsapi.web.nhl.com/api/v1/teams/${id}/roster`
  //       );
  //       const teamRoster = await teamFetch.json();
  //       console.log(`Roster`, teamRoster);
  //     }
  //   };
  //   useEffect(() => {
  //     fetchTest();
  //   });
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
    <div className="card mt-3" style={{ width: "90%" }}>
      <div className="card-body">
        <h5 className="card-title">Team vs Team</h5>
        {usersFriendList.map((friend, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`friend_${index}`}
              checked={!!selectedFriends[friend]}
              onChange={() => handleFriendSelection(friend)}
            />
            <label htmlFor={`friend_${index}`}>{friend}</label>
          </div>
        ))}
        <button
          className="btn btn-primary mx-1"
          onClick={() => console.log(selectedFriends)}
        >
          Place Bet
        </button>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export { BetPage };
