import { loggedInUserKey, allUsersKey } from "../Data";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="bg-dark" style={{ minHeight: "100vh" }}>
      <div className="card" style={{ width: "18rem", height: "100%" }}>
        <div className="card-body">
          <h5 className="card-title">Card title</h5>
          <h6 className="card-subtitle mb-2">Card subtitle</h6>
          <p className="card-text">
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </p>
          <button className="btn btn-lg btn-primary btn-block" type="button">
            Login
          </button>
          <Link className="btn btn-success" to="/">
            Login/Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export { Login };
