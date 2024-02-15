import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOCALSTORAGE } from "../Config";
import { TeamDropdown } from "../Data";
import { bannerTextStyles, Banner } from "../Components";

function Register() {
  const navigate = useNavigate();
  const [username, setUserName] = useState(null);
  const [password, setPassword] = useState(null);
  const [email, setEmail] = useState(null);
  const [favoriteTeam, setFavoriteTeam] = useState(null);
  const registerUser = () => {
    const existingUsers =
      JSON.parse(localStorage.getItem(LOCALSTORAGE.USERS)) || [];
    const isUserExisting = existingUsers.some(
      (user) => user.username === username
    );
    if (isUserExisting) {
      alert("username already exist");
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
      navigate("/FriendlyBets");
    }
  };
  return (
    <div className=" d-flex flex-column justify-content-center align-items-center p-2 vh-100">
      <Banner />
      <div className="card bg-secondary bg-gradient w-100 w-md-50 w-lg-25 p-5 shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-center mb-4 login-text mx-auto ">
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
            className="btn btn-primary mt-4 w-100"
            type="button"
            onClick={registerUser}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export { Register };
