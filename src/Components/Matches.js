import { TodaysGames, LiveGames } from "../Data";
import { NflTodaySchedule, NflWeeklySchedule } from "./nfl.js/NflSchedule";
import { useTheme } from "./theme/ThemeContext";

function Matches() {
  const {theme}=useTheme()
  const containerStyle = {
    backgroundColor:
      theme === "light"
        ? "#E0E0E0"
        : theme === "dark"
        ? "#1E1E1E"
        : "transparent", // Use transparent for retro to allow gradient
    background:
      theme === "retro"
        ? "linear-gradient(to bottom, #0B1305 0%, #00008B 100%)"
        : "none", // Apply gradient for retro theme
    color: theme === "light" ? "#000000" : "#FFFFFF",
    borderRadius: "5px",
    padding: "20px",
  };

  const hrStyle = {
    backgroundColor: theme === "light" ? "#000000" : "#FFFFFF",
    height: "2px",
  };
  return (
    <div
      className="container text-center p-2"
      style={containerStyle}
    >
      {LiveGames()}
      <hr style={hrStyle} />
      {TodaysGames()}
    </div>
  );
}

function NflMatches() {
  const backgroundColor = {
    backgroundColor: "#0B1305",
    borderRadius: "1rem",
  };

  return (
    <div style={backgroundColor} className="container text-center p-2 ">
      {<NflTodaySchedule />}
      {<NflWeeklySchedule />}
    </div>
  );
}
export { Matches, NflMatches };
