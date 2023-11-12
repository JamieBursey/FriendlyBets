import React, { useState, useEffect } from "react";

export const BettingOptions = () => {
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);
  const teamsRosters = async () => {
    const homeRoster = await fetch();
    const awayRoster = await fetch();
    const homeRosterData = await homeRoster.json();
    const awayRosterData = await awayRoster.json();
  };
};
