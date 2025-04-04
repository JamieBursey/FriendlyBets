import { useEffect, useState } from "react";
import { useNavigate, } from "react-router-dom";
import { LOCALSTORAGE } from "../Config";
import { supabase } from "../supabaseClient";

const getAllUsers = () => {
  const allUsersStr = localStorage.getItem(LOCALSTORAGE.USERS);
  let allUsers = JSON.parse(allUsersStr);
  if (allUsersStr === "" || allUsers == null) {
    allUsers = [];
  }
  return allUsers;
};

const updateBetTokens = (user) => {
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  const now = Date.now();
  const allUsers = JSON.parse(localStorage.getItem(LOCALSTORAGE.USERS));

  const userIndex = allUsers.findIndex((u) => u.email === user.email);
  if (userIndex !== -1) {
    allUsers[userIndex] = { ...allUsers[userIndex], ...user };
  }

  if (user.hasDonated) {
    user.betToken = "Unlimited";
  } else if (now - user.lastTokenUpdate > oneDay) {
    user.betToken = 3; // reset to 3 tokens every day
    user.lastTokenUpdate = now;
  }
};
const findUser = (username) => {
  const allUsers = getAllUsers();
  const foundUser = allUsers.find((user) => user.username === username);
  if (foundUser == null) {
    return null;
  } else {
    return foundUser;
  }
};
const findUserByEmail = (email) => {
  const allUsers = getAllUsers();
  const foundUser = allUsers.find((user) => user.email === email);
  if (foundUser == null) {
    return null;
  } else {
    return foundUser;
  }
};

const checkUserPassword = (userPassword, inputPassword) => {
  if (userPassword === inputPassword) {
    return true;
  } else {
    return false;
  }
};

// const deleteFriend = (friendUsername, currentUser, setLoggedInUser) => {
//   // Get all users
//   const allUsers = getAllUsers();
//   //fetch friend
//   let friendUser = allUsers.filter(
//     (user) => user.username === friendUsername
//   )[0];

//   // modify currentUser friend list
//   const updatedFriends = (currentUser.friends = currentUser.friends.filter(
//     (username) => username !== friendUser.username
//   ));
//   const currenUserUpdate = {
//     ...currentUser,
//     friends: updatedFriends,
//   };

//   // modify friendUser friend list
//   friendUser.friends = friendUser.friends.filter(
//     (username) => username !== currentUser.username
//   );

//   // Get rid of the original currentUser and friendUser
//   let temporaryArrayUsers = allUsers.filter(
//     (user) =>
//       user.username !== currentUser.username &&
//       user.username !== friendUser.username
//   );

//   //push back the new values
//   temporaryArrayUsers.push(currenUserUpdate);
//   temporaryArrayUsers.push(friendUser);

//   // Push the new array of users back to the local storage using localStorage.setItem(allUserKey, JSON.stringify(allUsers))
//   localStorage.setItem(LOCALSTORAGE.USERS, JSON.stringify(temporaryArrayUsers));
//   localStorage.setItem(LOCALSTORAGE.LOGGEDINUSER, JSON.stringify(currentUser));

//   console.log("modifying LoggedInUser to rerender list of cards", currentUser);
//   setLoggedInUser(currenUserUpdate);
// }; //moved to friends.js

// const renderFriendList = (currentUser, setLoggedInUser) => {
//   const allUsers = getAllUsers();
//   return (
//     <div className="row">
//       {currentUser.friends.map((friendUsername) => {
//         let friendUser = allUsers.find(
//           (user) => user.username === friendUsername
//         );
//         return friendUser ? (
//           <div
//             key={friendUser.email}
//             className="col-sm-12 col-md-6 col-lg-4 mb-3"
//           >
//             <div className="card bg-white">
//               <div className="card-body text-center">
//                 <h5 className="card-title">{friendUser.username}</h5>
//                 <p className="card-text">{friendUser.email}</p>
//                 <div
//                   className="card text-center mx-auto mt-2 mb-3"
//                   style={{ maxWidth: "18rem", backgroundColor: "#d6d6d6" }}
//                 >
//                   <div className="card-header">About</div>
//                   <div className="card-body">
//                     <p className="card-text">{friendUser.aboutMe}</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() =>
//                     deleteFriend(
//                       friendUser.username,
//                       currentUser,
//                       setLoggedInUser
//                     )
//                   }
//                   className="btn btn-outline-danger"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         ) : null;
//       })}
//     </div>
//   );
// }; //moved to friends.js

const TeamDropdown = ({ teamSelect }) => {
  const [team, setTeam] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [league, setLeague] = useState("NHL");

  useEffect(() => {
    const fetchMLBTeams = async () => {
      //copy nhl fetch logic
      // setTeams(mlbTeamLogos);
    };
    const fetchTeam = async () => {
      if (league === "NHL") {
        const response = await fetch(
          "https://friendly-bets-back-end.vercel.app/api/now"
        );
        const teamData = await response.json();
        const teamLogos = [];

        teamData.gameWeek.forEach((week) => {
          week.games.forEach((game) => {
            const homeLogo = game.homeTeam.logo;
            const awayLogo = game.awayTeam.logo;
            if (!teamLogos.includes(homeLogo)) {
              teamLogos.push(homeLogo);
            }
            if (!teamLogos.includes(awayLogo)) {
              teamLogos.push(awayLogo);
            }
          });
        });
        setTeam(teamLogos);
      } else if (league === "MLB") {
        // Future addition
        await fetchMLBTeams();
      }
    };
    fetchTeam();
  }, [league]);
  const handleSelectedTeam = (logo) => {
    setSelectedTeam(logo);
    teamSelect(logo);
  };
  const handleLeagueChange = (newLeague) => {
    setLeague(newLeague);
    setSelectedTeam("");
  };
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="d-flex flex-column align-items-center w-100">
        <div className="dropdown w-75 mb-3">
          <button
            className="btn favorite-team-btn dropdown-toggle text-secondary"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {league ? league : "Select League"}
          </button>
          <ul className="dropdown-menu">
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => handleLeagueChange("NHL")}
              >
                NHL
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => handleLeagueChange("MLB")}
              >
                MLB
              </button>
            </li>
          </ul>
        </div>

        <div className="dropdown w-75">
          {/* Dropdown button */}
          <button
            className="btn favorite-team-btn dropdown-toggle text-secondary"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {selectedTeam ? (
              <img
                src={selectedTeam}
                style={{ width: "30px", height: "30px" }}
                alt="Selected Team"
              />
            ) : (
              "Select Favorite Team"
            )}
          </button>
          {/* Dropdown menu */}
          <ul className="dropdown-menu">
            {league === "MLB" ? (
              <li>
                <span className="dropdown-item-text">
                  MLB teams not available yet.
                </span>
              </li>
            ) : (
              team.map((logo, index) => (
                <li key={index}>
                  <button
                    className="dropdown-item"
                    type="button"
                    onClick={() => handleSelectedTeam(logo)}
                  >
                    <img
                      src={logo}
                      style={{ width: "30px", height: "30px" }}
                      alt="Team Logo"
                    />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

const RedirectBasedOnLogin = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log("Checking user authentication...");
        const { data: sessionData, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error fetching session:", error);
          navigate("/");
          return;
        }

        if (sessionData?.session?.user) {
          console.log("User authenticated:", sessionData.session.user);
          setIsAuthenticated(true);
        } else {
          console.warn("No active session. Redirecting to /about.");
          navigate("/about");
        }
      } catch (err) {
        console.error("Error in authentication check:", err);
        navigate("/about");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? <>{children}</> : null;
};

const ForgotPasswordPopup = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://friendly-bets.vercel.app/PasswordReset",
      });
  
      if (error) {
        console.error("Error sending reset email:", error);
        alert("There was an error sending the reset email. Please try again.");
      } else {
        alert("Password reset email sent! Check your inbox.");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong. Please try again.");
    }
  };
  

  return (
    <div className="modal show d-block" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Forgot Password</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>Enter your email to reset your password.</p>
            <input
              type="email"
              className="form-control mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <button className="btn btn-primary" onClick={handleForgotPassword}>
              Send Reset Email
            </button>
            {message && <p className="mt-3">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
export {
  getAllUsers,
  checkUserPassword,
  findUser,
  findUserByEmail,
  TeamDropdown,
  RedirectBasedOnLogin,
  updateBetTokens,
  ForgotPasswordPopup,

};
