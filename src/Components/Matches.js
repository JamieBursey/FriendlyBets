import { TodaysGames, LiveGames } from "../Data";
function Matches() {
  const backgroundColor = {
    backgroundColor: "#0B1305",
    borderRadius: "5px",
  };

  return (
    <div style={backgroundColor} className="container text-center mt-4">
      {LiveGames()}
      {TodaysGames()}
    </div>
  );
}
export default Matches;
