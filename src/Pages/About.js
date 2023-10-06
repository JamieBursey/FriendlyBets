import React from "react";
import { Banner } from "../Components";
import "bootstrap/dist/css/bootstrap.min.css";
import { Outlet, Link } from "react-router-dom";

function About() {
  return (
    <>
      <Banner />
      <div className="container bg-dark">
        <p className="text-danger fs-3">
          Hello, As a sports enthusiast I have always enjoyed making bets with
          friends about the outcomes of matches,who will score the first goal or
          if the fight ends via submission or tko. As we got older and life gets
          busy it became harder to bet with friends who we see once a week. This
          app is the solution to friendly betting amongst your small group.
        </p>
      </div>
    </>
  );
}

export { About };
