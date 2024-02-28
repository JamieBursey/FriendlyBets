import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOCALSTORAGE, NAVIGATION } from "../Config";
import { TeamDropdown } from "../Data";
import { Banner } from "../Components";

function Register() {
  const navigate = useNavigate();
  const [username, setUserName] = useState(null);
  const [password, setPassword] = useState(null);
  const [email, setEmail] = useState(null);
  const [favoriteTeam, setFavoriteTeam] = useState(null);
  const registerUser = () => {
    if (!username || !password || !email || !favoriteTeam) {
      alert("Please submit all fields");
      return;
    }
    const existingUsers =
      JSON.parse(localStorage.getItem(LOCALSTORAGE.USERS)) || [];

    const isUserExisting = existingUsers.some((user) => user.email === email);
    if (isUserExisting) {
      alert("Email already in use");
    } else {
      const newUser = {
        username,
        password,
        email,
        favoriteTeam,
        bets: [],
        friends: [],
        avatar: [],
        isAdmin: false,
      };
      existingUsers.push(newUser);
      localStorage.setItem(LOCALSTORAGE.USERS, JSON.stringify(existingUsers));
      localStorage.setItem(LOCALSTORAGE.LOGGEDINUSER, JSON.stringify(newUser));
      navigate(NAVIGATION.ADDFRIENDS);
    }
  };
  return (
    <div
      className="d-flex flex-column align-items-center p-2 vh-100 mx-auto"
      style={{ width: "95%" }}
    >
      <Banner />
      <div className="card bg-secondary bg-gradient w-100 w-md-50 w-lg-25 p-5 shadow-lg">
        <div className="card-body text-center">
          <h3 className="card-title text-center mb-4 register-text mx-auto ">
            Register Here!
          </h3>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Enter Email"
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Display Name"
            onChange={(event) => setUserName(event.target.value)}
          />
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Enter Password"
            onChange={(event) => setPassword(event.target.value)}
          />
          <TeamDropdown teamSelect={setFavoriteTeam} />
          <button
            className="btn btn-primary mt-4 w-75"
            type="button"
            onClick={registerUser}
          >
            Register and Login
          </button>
        </div>
      </div>
    </div>
  );
}

export { Register };
