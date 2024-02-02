import { TodaysGames, LiveGames } from "../Data";
import { NflTodaySchedule, NflWeeklySchedule } from "./nfl.js/NflSchedule";
function Matches() {
  const backgroundColor = {
    backgroundColor: "#0B1305",
    borderRadius: "1rem",
  };

  return (
    <div style={backgroundColor} className="container text-center p-2 ">
      {LiveGames()}
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
