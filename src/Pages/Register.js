import { loggedInUserKey, allUsersKey } from "../Data";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [username, setUserName] = useState(null);
  const [password, setPassword] = useState(null);
  const registerUser = () => {
    localStorage.setItem();
  };
  return (
    <div className="bg-dark d-flex justify-content-center p-2 vh-100">
      <div className="card w-75 h-75">
        <div className="card-body">
          <h5 className="card-title">Card title</h5>
          <h6 className="card-subtitle mb-2">Card subtitle</h6>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="RegisterUserName"
              placeholder="name@example.com"
              onChange={(event) => setPassword(event.target.value)}
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
              >
                Register
              </button>
            </div>
            <div className="col-md-12 p-2">
              <Link className="btn btn-success" to="/Login">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Register };
