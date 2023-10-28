import { React } from "react";
import Avatar from "react-avatar";
import { Link, useNavigate } from "react-router-dom";
import { loggedInUserKey } from "../Data";

function NavBar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.setItem(loggedInUserKey, null);
    navigate("/Login");

    //return to the login page navigate("/login")
  };

  const loggedUser = JSON.parse(localStorage.getItem(loggedInUserKey));
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
          {loggedUser ? (
            <div className="dropdown justify-content-between">
              <a
                className="dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <Avatar round={true} size="40" name={loggedUser.username} />
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <a className="dropdown-item" href="#"></a>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/myAccount")}
                  >
                    My Account
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/addFriends")}
                  >
                    Add Friends
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={logout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
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
