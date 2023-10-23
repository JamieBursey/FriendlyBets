import { Banner, Buttons, Matches } from "../Components";
import { loggedInUserKey } from "../Data";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

function Home() {
  const checkIfLoggedInExists = localStorage.getItem(loggedInUserKey);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("checkLogin", checkIfLoggedInExists);
    if (!checkIfLoggedInExists || checkIfLoggedInExists === "null") {
      navigate("/login");
    }
  }, [checkIfLoggedInExists, navigate]);
  return (
    <div>
      <Banner />
      <Buttons />
      <Matches />
    </div>
  );
}

export default Home;
