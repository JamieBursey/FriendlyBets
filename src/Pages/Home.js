import { Buttons, Matches, NflMatches } from "../Components";
import React, { useEffect,useState } from "react";
import { MlbSchedule } from "../Components/mlb.js";
import Logo from "../Components/Logo.js";
import { supabase } from "../supabaseClient.js";
import { checkAndUpdateTokens } from "../Data/betdata/CheckAndUpdateTokens.js";

function Home() {
  const [selectedMatchType, setSelectMatchesUI] = useState("Hockey");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const backgroundColor = {
    background: "linear-gradient(to bottom, #0B1305 0%, #00008B 100%)",
  };
  useEffect(() => {
    const fetchLoggedInUser = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
  
      if (sessionError) {
        console.error("Error fetching session:", sessionError);
        return;
      }
  
      if (sessionData && sessionData.session) {
        const user = sessionData.session.user;
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("public_user_id", user.id)
          .single();
  
        if (userError) {
          console.error("Error fetching user data:", userError);
        } else {
          const updatedUser = await checkAndUpdateTokens(userData);
          setLoggedInUser(updatedUser);
        }
      }
    };
  
    fetchLoggedInUser();
  }, []);
  
  const selectMatchesUI = () => {
    if (selectedMatchType === "Hockey") {
      return <Matches />;
    }
    if (selectedMatchType === "Football") {
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
      {/* <Banner /> */}
      <Logo />
      <Buttons setSelectMatchesType={setSelectMatchesUI} />
      {selectMatchesUI()}
    </div>
  );
}

export default Home;
