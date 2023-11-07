import { useEffect } from "react";
import { BettingOptions } from "../Data";
import { useLocation, useNavigate } from "react-router-dom";
import { loggedInUserKey } from "../Data";

const BetPage = () => {
  const navigate = useNavigate();
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
  const loggedInUserData = localStorage.getItem(loggedInUserKey);
  const LoggedInUsr = loggedInUserData ? JSON.parse(loggedInUserData) : null;
  console.log(LoggedInUsr);
  const usersFriendList = LoggedInUsr.friends;
  console.log(usersFriendList);
  return (
    <div className="card mt-3" style={{ width: "90%" }}>
      <div className="card-body">
        <h5 className="card-title">Team vs Team</h5>
        <p className="card-text">{usersFriendList}</p>
        <a href="#" className="btn btn-primary mx-1">
          Place Bet
        </a>
        <a href="#" className="btn btn-primary" onClick={() => navigate("/")}>
          Go Back
        </a>
      </div>
    </div>
  );
};

export { BetPage };
