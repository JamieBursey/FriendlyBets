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

const TeamDropdown = ({ teamSelect }) => {
  const [team, setTeam] = useState([]); // will hold objects { name, logo }
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [league, setLeague] = useState("NHL");

  useEffect(() => {
    const fetchMLBTeams = async () => {
      // Future addition
    };

    const fetchTeam = async () => {
      try {
      if (league === "NHL") {
        const response = await fetch(
          "https://friendly-bets-back-end.vercel.app/api/now"
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const teamData = await response.json();
        const teamsArr = [];

        teamData.gameWeek.forEach((week) => {
          week.games.forEach((game) => {
            const homeTeam = { name: game.homeTeam.abbrev, logo: game.homeTeam.logo };
            const awayTeam = { name: game.awayTeam.abbrev, logo: game.awayTeam.logo };

            if (!teamsArr.find((t) => t.name === homeTeam.name)) teamsArr.push(homeTeam);
            if (!teamsArr.find((t) => t.name === awayTeam.name)) teamsArr.push(awayTeam);
          });
        });

        setTeam(teamsArr);
      } else if (league === "MLB") {
        await fetchMLBTeams();
      }
    } catch (err) {
      console.error("Failed to fetch teams:", err);
    }
  };

  fetchTeam();
}, [league]);

  const handleSelectedTeam = (teamObj) => {
    setSelectedTeam(teamObj);
    teamSelect(teamObj); // pass the whole object or just name/logo as needed
  };

  const handleLeagueChange = (newLeague) => {
    setLeague(newLeague);
    setSelectedTeam(null);
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="d-flex flex-column align-items-center w-100">
        {/* League Selector */}
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

        {/* Team Selector */}
        <div className="dropdown w-75">
          <button
            className="btn favorite-team-btn dropdown-toggle text-secondary"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {selectedTeam ? (
              <span className="d-flex align-items-center">
                <img
                  src={selectedTeam.logo}
                  alt={selectedTeam.name}
                  style={{ width: "30px", height: "30px", marginRight: "10px" }}
                />
                {selectedTeam.name}
              </span>
            ) : (
              "Select Favorite Team"
            )}
          </button>
          <ul className="dropdown-menu">
            {league === "MLB" ? (
              <li>
                <span className="dropdown-item-text">
                  MLB teams not available yet.
                </span>
              </li>
            ) : (
              team.map((teamObj, index) => (
                <li key={index}>
                  <button
                    className="dropdown-item d-flex align-items-center"
                    type="button"
                    onClick={() => handleSelectedTeam(teamObj)}
                  >
                    <img
                      src={teamObj.logo}
                      alt={teamObj.name}
                      style={{ width: "30px", height: "30px", marginRight: "10px" }}
                    />
                    {teamObj.name}
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
