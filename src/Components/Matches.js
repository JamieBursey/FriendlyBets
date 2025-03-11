import { TodaysGames, LiveGames } from "../Data";
import { NflTodaySchedule, NflWeeklySchedule } from "./nfl.js/NflSchedule";
import { useTheme } from "./theme/ThemeContext";


function Matches() {
  const { theme } = useTheme();

  const containerStyle = {
    backgroundColor:
      theme === "light"
        ? "#E0E0E0" // Light theme background
        : theme === "dark"
        ? "#1E1E1E" // Dark theme background
        : "transparent", // Transparent for retro theme (gradient will handle the background)
    background:
      theme === "retro"
        ? "linear-gradient(to bottom, #0B1305 0%, #00008B 100%)" // Retro theme gradient
        : theme === "light"
        ? "#E0E0E0" // Light theme background
        : "#1E1E1E", // Dark theme background
    color: theme === "light" ? "#000000" : "#FFFFFF", // Text color
    borderRadius: "5px",
    padding: "20px",
  };

  const hrStyle = {
    backgroundColor: theme === "light" ? "#000000" : "#FFFFFF", 
    height: "2px",
  };

  return (
    <div className="container text-center p-2" style={containerStyle}>
      {LiveGames()}
      <hr style={hrStyle} />
      {TodaysGames()}
    </div>
  );
}

function NflMatches() {
  const { theme } = useTheme();

  const containerStyle = {
    backgroundColor:
      theme === "light"
        ? "#E0E0E0" 
        : theme === "dark"
        ? "#1E1E1E" 
        : "transparent", 
    background:
      theme === "retro"
        ? "linear-gradient(to bottom, #0B1305 0%, #00008B 100%)"
        : "none",
    color: theme === "light" ? "#000000" : "#FFFFFF",
    borderRadius: "1rem",
    padding: "20px",
  };

  return (
    <div style={containerStyle} className="container text-center p-2">
      {<NflTodaySchedule />}
      {<NflWeeklySchedule />}
    </div>
  );
}
export { Matches, NflMatches };
