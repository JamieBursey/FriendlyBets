import React from "react"
import { Banner } from "../Components";
import "bootstrap/dist/css/bootstrap.min.css";
import { Outlet, Link } from "react-router-dom";

function AboutPage(){
    return(<>

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
                <button className="nav-link active" aria-current="page" Link to="/">
                  Home
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link" href="/about">
                  About
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
<Banner/>
      <div className="container bg-dark">
        <p className="text-danger fs-3">Hello, As a sports enthusiast I have always enjoyed making bets with friends about the outcomes of matches,who will score the first goal or if the fight ends via submission or tko. As we got older and life gets busy it became harder to bet with friends who we see once a week. This app is the solution to friendly betting amongst your small group.</p></div>
        </>
          ) 
}

export {AboutPage}