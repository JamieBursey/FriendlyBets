import { Banner, Buttons, Matches, NflMatches } from "../Components";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { MlbSchedule } from "../Components/mlb.js";

function Home() {
  const [selectedMatchType, setSelectMatchesUI] = useState("Hockey");
  const backgroundColor = {
    background: "linear-gradient(to bottom, #0B1305 0%, #00008B 100%)",
  };

  const selectMatchesUI = () => {
    if (selectedMatchType == "Hockey") {
      return <Matches />;
    }
    if (selectedMatchType == "Football") {
      return <NflMatches />;
    }
    if (selectedMatchType === "Baseball") {
      return <MlbSchedule />;
    } else {
      return (
        <div className="text-center text-white">Feature not yet Added</div>
      );
    }
  };
  return (
    <div style={backgroundColor}>
      {/* <Dropdown onChange={(e) => setSelectMatchesUI(e.target.value)} /> */}
      <Banner />
      <Buttons setSelectMatchesType={setSelectMatchesUI} />
      {selectMatchesUI()}
    </div>
  );
}

export default Home;
