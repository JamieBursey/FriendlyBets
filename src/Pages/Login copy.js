import { loggedInUserKey, allUsersKey } from "../Data";
import React, { useState } from "react";

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

  const findUserInArray = () => {};

  const loginHandler = () => {
    //getAll Users
    //find the user
    //override loggedInUser
    //use react router to navigate to homepage
  };

  return (
    <div style={loginBackground} className="d-flex mt-4 mx-auto">
      <form className="form-signin mx-auto">
        <h2 className="form-signin-heading text-primary">Please login</h2>
        <input
          type="text"
          style={InputStyle}
          className="form-control"
          id="LoginName"
          placeholder="User Name"
          required=""
        />
        <input
          type="password"
          style={InputStyle}
          className="form-control"
          id="LoginPassword"
          placeholder="Password"
          required=""
        />
        <button
          className="btn btn-lg btn-primary btn-block"
          type="button"
          onClick={LoginHandler}
        >
          Login
        </button>
      </form>

      <form className="form-signin mx-auto">
        <h2 className="form-signin-heading text-primary">Register</h2>
        <input
          type="text"
          style={InputStyle}
          className="form-control"
          id="RegisterUserName"
          placeholder="User Name"
          onChange={(event) => setUserName(event.target.value)}
        />
        <input
          type="password"
          style={InputStyle}
          className="form-control"
          id="RegisterPassword"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn btn-lg btn-primary btn-block"
          type="button"
          onClick={registerHandler}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export { Login };
