import { loggedInUserKey, allUsersKey } from "../Data";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [username, setUserName] = useState(null);
  const [password, setPassword] = useState(null);

  const getAllUsers = () => {
    const allUsersStr = localStorage.getItem(allUsersKey); // "[{"id": 11}, {"id": 22}]"
    let allUsers = JSON.parse(allUsersStr);
    if (allUsersStr == "" || allUsers == null) {
      allUsers = [];
    }
    return allUsers;
  };

  const findUserInArray = () => {
    const allUsers = getAllUsers();
    return allUsers.find((user) => user.username === username);
  };

  const loginHandler = () => {
    const foundUser = findUserInArray();

    let loggedUser = JSON.parse(localStorage.getItem(loggedInUserKey));
    if (loggedUser == "" || loggedUser == null) {
      loggedUser = [];
    }

    if (foundUser) {
      loggedUser = [];
      loggedUser.push(foundUser);
      localStorage.setItem(loggedInUserKey, JSON.stringify(loggedUser));
    }

    //getAll Users
    //find the user
    //override loggedInUser
    //use react router to navigate to homepage
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
              type="text"
              className="form-control"
              id="userName"
              placeholder="userName"
              onChange={(event) => setUserName(event.target.value)}
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
