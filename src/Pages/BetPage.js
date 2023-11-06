import { useEffect } from "react";
import { BettingOptions } from "../Data";
import { useLocation } from "react-router-dom";

const BetPage = () => {
  const fetchTest = async () => {
    const fetchGame = await fetch(
      "https://statsapi.web.nhl.com/api/v1/schedule"
    );
    const gameData = await fetchGame.json();
    const homeID = gameData.dates[0].games.map(
      (game) => game.teams.home.team.id
    );
    for (let id of homeID) {
      const teamFetch = await fetch(
        `https://statsapi.web.nhl.com/api/v1/teams/${id}/roster`
      );
      const teamRoster = await teamFetch.json();
      console.log(`Roster`, teamRoster);
    }
  };
  useEffect(() => {
    fetchTest();
  });
  return (
    <div className="text-white">
      <p>Hello</p>
    </div>
  );
};

export { BetPage };
