import { loggedInUserKey, findUser, checkUserPassword } from "../Data";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [username, setUserName] = useState(null);
  const [password, setPassword] = useState(null);

  //   const checkIfLoggedInExists = localStorage.getItem() // Get LoggedIser
  //   if(){ // check if checkIfLoggedInExists
  //     navigate("/"); //redirect them to the home page
  //   }

  const loginHandler = () => {
    const foundUser = findUser(username);
    console.log("userIsFound", foundUser);
    //check if found User is null to continue
    const passwordMatches = checkUserPassword(foundUser.password, password);
    console.log(
      "passwordmatches",
      passwordMatches,
      foundUser.password,
      password
    );
    if (foundUser != null && passwordMatches === true) {
      localStorage.setItem(loggedInUserKey, JSON.stringify(foundUser));
      navigate("/");
    } else {
      alert("incorrect username or password");
    }
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
