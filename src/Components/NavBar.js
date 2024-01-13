import { React } from "react";
import Avatar from "react-avatar";
import { Link, useNavigate } from "react-router-dom";
import { LOCALSTORAGE, NAVIGATION } from "../Config";

function NavBar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.setItem(LOCALSTORAGE.LOGGEDINUSER, null);
    navigate("/Login");

    //return to the login page navigate("/login")
  };

  const loggedUser = JSON.parse(
    localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER)
  );
  return (
    <nav className="navbar navbar-expand-sm bg-body-tertiary">
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
              <Link
                className="nav-link active"
                aria-current="page"
                to={NAVIGATION.HOME}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={NAVIGATION.ABOUT}>
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={NAVIGATION.CONTACT}>
                Contact
              </Link>
            </li>

            {loggedUser ? (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link text-success"
                    to={NAVIGATION.MYBETS}
                  >
                    MyBets
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link text-success"
                    to={NAVIGATION.ADDFRIENDS}
                  >
                    Friends
                  </Link>
                </li>
                <div className="nav-bar me-2">
                  <li className="nav-item">
                    <Link
                      className="nav-link text-success"
                      to={NAVIGATION.NOTIFICATIONS}
                    >
                      Notifications
                    </Link>
                  </li>
                </div>
              </>
            ) : null}
          </ul>
          {loggedUser ? (
            <div className="dropdown justify-content-between">
              <a
                className="dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                href="/#"
              >
                <Avatar round={true} size="40" name={loggedUser.username} />
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                {/* <li>
                  <a className="dropdown-item" href="/#"></a>
                </li> */}
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/myAccount")}
                  >
                    My Account
                  </button>
                </li>
                {loggedUser.isAdmin ? (
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => navigate("/UserManagement")}
                    >
                      Update Users
                    </button>
                  </li>
                ) : null}
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/fullSchedule")}
                  >
                    Weekly Schedule
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
              <Link className="btn btn-success" to={NAVIGATION.LOGIN}>
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
