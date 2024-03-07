import { findUser, checkUserPassword, findUserByEmail } from "../Data";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LOCALSTORAGE } from "../Config";
import { Banner } from "../Components";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const backgroundColor = {
    background: "linear-gradient(to bottom, #0B1305 0%, #00008B 100%)",
  };
  const loginHandler = () => {
    const foundUser = findUserByEmail(email);

    // Check if foundUser is not null before trying to access its properties
    if (foundUser != null) {
      const passwordMatches = checkUserPassword(foundUser.password, password);
      if (passwordMatches) {
        localStorage.setItem(
          LOCALSTORAGE.LOGGEDINUSER,
          JSON.stringify(foundUser)
        );
        navigate("/FriendlyBets");
      } else {
        alert("Incorrect password");
      }
    } else {
      alert("User does not exist");
    }
  };
  return (
    <div
      className="d-flex flex-column align-items-center p-2 vh-100 mx-auto"
      style={backgroundColor}
    >
      <div
        className="container p-3 mt-5"
        style={{ backgroundColor: "#1E1E1E", borderRadius: "5px" }}
      >
        <div
          className="card-body"
          style={{ backgroundColor: "#1E1E1E", borderRadius: "5px" }}
        >
          <h3 className="card-title text-center w-50 mb-4 login-text mx-auto">
            Sign In Here!
          </h3>
          <div className="mb-3 w-75 mx-auto">
            <label htmlFor="userName" className="form-label">
              Email address
            </label>
            <input
              type="text"
              className="form-control"
              id="userName"
              placeholder="Email"
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="mb-3 mb-3 w-75 mx-auto">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter Password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className="text-center">
            <button
              className="btn btn-primary mt-3"
              type="button"
              onClick={loginHandler}
            >
              Login
            </button>
          </div>
          <div className="text-center">
            <Link
              to="/register"
              className="btn btn-outline-success bg-gradient mt-2"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Login };
