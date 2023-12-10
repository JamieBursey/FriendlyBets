import { findUser, checkUserPassword, findUserByEmail } from "../Data";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LOCALSTORAGE } from "../Config";

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
        navigate("/");
      } else {
        alert("Incorrect password");
      }
    } else {
      alert("User does not exist");
    }
  };
  return (
    <div className="bg-dark d-flex justify-content-center p-2 vh-100">
      <div className="card w-75 h-75">
        <div className="card-body">
          <h5 className="card-title text-center text-success">
            Lets Get Betting!
          </h5>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="text"
              className="form-control"
              id="userName"
              placeholder="Email"
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="mb-3 row">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter Password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className="row text-center">
            <div className="col-md-12 p-2">
              <button
                className="btn btn-lg btn-primary btn-block"
                type="button"
                onClick={loginHandler}
              >
                Login
              </button>
            </div>
            <div className="col-md-12 p-2">
              <Link className="btn btn-success" to="/register">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Login };
