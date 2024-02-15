import { findUser, checkUserPassword, findUserByEmail } from "../Data";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LOCALSTORAGE } from "../Config";
import { Banner } from "../Components";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

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
    <div className="d-flex flex-column align-items-center p-2 vh-100 w-75 mx-auto">
      <Banner />
      <div className="bg-secondary bg-gradient card w-100 w-md-50 w-lg-25 p-4 shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-center mb-4 login-text mx-auto">
            Lets Get Betting!
          </h3>
          <div className="mb-3">
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
          <div className="mb-3">
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
          <button
            className="btn btn-primary mt-4 w-100"
            type="button"
            onClick={loginHandler}
          >
            Login
          </button>
          <Link
            to="/register"
            className="btn btn-success bg-gradient w-100 mt-2"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export { Login };
