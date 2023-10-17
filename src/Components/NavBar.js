import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loggedInUserKey } from "../Data";

function NavBar() {
  const loggeduser = JSON.parse(localStorage.getItem(loggedInUserKey));
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
            </li>
          </ul>
          {loggeduser && (
            <form className="d-flex justify-content-between">
              <Link className="btn btn-success" to="/myAccount">
                {loggeduser.username}
              </Link>
            </form>
          )}
          {!loggeduser && (
            <form className="d-flex justify-content-between">
              <Link className="btn btn-success" to="/login">
                Login
              </Link>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
