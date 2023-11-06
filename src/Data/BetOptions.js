import React, { useState, useEffect } from "react";

export const BettingOptions = () => {
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);
  const teamsRosters = async () => {
    const homeRoster = await fetch(
      `https://statsapi.web.nhl.com/api/v1/teams//roster`
    );
    const awayRoster = await fetch(
      `https://statsapi.web.nhl.com/api/v1/teams//roster`
    );
    const homeRosterData = await homeRoster.json();
    const awayRosterData = await awayRoster.json();
  };
};
