import React from "react";

function NavBar() {
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
              <button className="nav-link active" aria-current="page" href="/">
                Home
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link" href="/about">
                About
              </button>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Dropdown
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                </li>
              </ul>
            </li>
          </ul>
          <form class="d-flex justify-content-between">
            <input
              class="form-control me-2"
              placeholder="User Name"
              aria-label="User Name"
            />
             <input
              class="form-control me-2"
              placeholder="Password"
              aria-label="Password"
            />
            <button class="btn btn-success">
              Login
            </button>
            <button class="btn btn-outline-success">
              Register
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
