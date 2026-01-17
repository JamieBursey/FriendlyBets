import { AddSportButtons, Matches, NflMatches } from "../Components";
import React, { useEffect,useState } from "react";
import { MlbSchedule } from "../Components/mlb.js";
import Logo from "../Components/Logo.js";
import { supabase } from "../supabaseClient.js";
import { checkAndUpdateTokens } from "../Data/betdata/CheckAndUpdateTokens.js";
import { useTheme } from "../Components/theme/ThemeContext.js";
import SeasonalStart from "../Components/theme/SeasonalStart.js";
import { Link } from "react-router-dom";

function Home() {
  const [selectedMatchType, setSelectMatchesUI] = useState("Hockey");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showseasonTheme, setShowSeasonTheme] = useState(true);
  const { theme } = useTheme();
  const backgroundColor = {
    backgroundColor:
      theme === "light"
        ? "#FFFFFF" 
        : theme === "dark"
        ? "#1E1E1E" 
        : "transparent", 
    background:
      theme === "retro"
        ? "linear-gradient(to bottom, #0B1305 0%, #00008B 100%)" 
        : theme === "light"
        ? "#FFFFFF" 
        : "#1E1E1E", 
    color: theme === "light" ? "#000000" : "#FFFFFF",
    minHeight: "100vh", 
  };
    useEffect(() => {
    const timer = setTimeout(() => setShowSeasonTheme(false), 4000); // 4 seconds
    return () => clearTimeout(timer);
  }, []);

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
<>
  <div style={backgroundColor}>
    <Logo />
    <AddSportButtons setSelectMatchesType={setSelectMatchesUI} />
    {selectMatchesUI()}
    
    {/* Footer */}
    <footer className="footer bg-dark text-center text-white p-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-12 mb-3">
            <Link 
              to="/mini-games" 
              className="btn btn-outline-light btn-lg"
              style={{ 
                textDecoration: 'none',
                borderWidth: '2px',
                fontWeight: 'bold'
              }}
            >
              🎮 Play Mini Games
            </Link>
          </div>
          <div className="col-md-12">
            <p className="mb-0">&copy; 2026 Friendly Bets. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  </div>

  {showseasonTheme && <SeasonalStart onFinish={() => setShowSeasonTheme(false)} />}
</>
  );
}

export default Home;
