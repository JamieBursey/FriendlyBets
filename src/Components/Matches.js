import { TodaysGames } from "./TodaysGames";
function Matches() {
  const backgroundColor = {
    backgroundColor: "#0B1305",
    borderRadius: "5px",
  };

  return (
    <div style={backgroundColor} className="container text-center">
      {TodaysGames()}
    </div>
  );
}

export default Matches;
