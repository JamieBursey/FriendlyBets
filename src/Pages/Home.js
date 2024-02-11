import { Banner, Buttons, Matches, NflMatches } from "../Components";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { LOCALSTORAGE } from "../Config";

function Home() {
  const checkIfLoggedInExists = localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER);
  const navigate = useNavigate();

  const [selectedMatchType, setSelectMatchesUI] = useState("Hockey");

  const selectMatchesUI = () => {
    if (selectedMatchType == "Hockey") {
      return <Matches />;
    }
    if (selectedMatchType == "Football") {
      return <NflMatches />;
    } else {
      return (
        <div className="text-center text-white">Feature not yet Added</div>
      );
    }
  };
  return (
    <div>
      {/* <Dropdown onChange={(e) => setSelectMatchesUI(e.target.value)} /> */}
      <Banner />
      <Buttons setSelectMatchesType={setSelectMatchesUI} />
      {selectMatchesUI()}
    </div>
  );
}

export default Home;
