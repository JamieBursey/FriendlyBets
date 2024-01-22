import { TodaysGames, LiveGames } from "../Data";
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
export default Matches;
