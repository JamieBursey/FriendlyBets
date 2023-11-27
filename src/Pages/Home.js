import { Banner, Buttons, Matches } from "../Components";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { LOCALSTORAGE } from "../Config";

function Home() {
  const checkIfLoggedInExists = localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER);
  const navigate = useNavigate();

  useEffect(() => {
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
