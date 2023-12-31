import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOCALSTORAGE } from "../Config";

function Register() {
  const navigate = useNavigate();
  const [username, setUserName] = useState(null);
  const [password, setPassword] = useState(null);
  const [email, setEmail] = useState(null);
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
        bets: [],
        friends: [],
        avatar: [],
      };
      existingUsers.push(newUser);
      localStorage.setItem(LOCALSTORAGE.USERS, JSON.stringify(existingUsers));
      localStorage.setItem(LOCALSTORAGE.LOGGEDINUSER, JSON.stringify(newUser));
      navigate("/");
    }
  };
  return (
    <div className="bg-dark d-flex justify-content-center p-2 vh-100">
      <div className="card w-75 h-75">
        <div className="card-body">
          <h5 className="card-title text-center text-primary">
            Time To Register!
          </h5>
          <div className="mb-3">
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                id="RegisterEmail"
                placeholder="Enter Email"
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <input
              type="text"
              className="form-control"
              id="RegisterUserName"
              placeholder="Username"
              onChange={(event) => setUserName(event.target.value)}
            />
          </div>

          <div className="mb-3 row">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="RegisterPassword"
              placeholder="Enter Password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className="row text-center">
            <div className="col-md-12 p-2">
              <button
                className="btn btn-lg btn-primary btn-block"
                type="button"
                onClick={registerUser}
              >
                Register
              </button>
            </div>
            <div className="col-md-12 p-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Register };
