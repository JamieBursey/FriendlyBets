import React, { useState, useEffect } from "react";

export const BettingOptions = async (game) => {
  const homeTeam = game.teams.home.team.id;
  const awayTeam = game.teams.away.team.id;

  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);

  const homeRoster = await fetch(
    `https://statsapi.web.nhl.com/api/v1/teams/${homeTeam}/roster`
  );
  const awayRoster = await fetch(
    `https://statsapi.web.nhl.com/api/v1/teams/${awayTeam}/roster`
  );
  console.log("awayRoser", awayRoster);
};
