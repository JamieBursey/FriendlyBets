import React, { useState, useEffect } from "react";
import { LOCALSTORAGE } from "../Config";

const findMLBPlayerName = (roster, playerId) => {
  const player = roster.find((player) => player.id === playerId);
  return player ? player.firstLastName : "Unknown Player";
};

const generateBettingOptions = (roster, homeTeam, awayTeam, sportType) => {
  const options = {
    gameOutcome: [],
    playerGoals: [],
    playerShots: [],
    playerAssists: [],
    homeRuns: [],
    RBIs: [],
    strikeouts: [],
  };

  options.gameOutcome.push(`${homeTeam} will win`);
  options.gameOutcome.push(`${awayTeam} will win`);

  const selectRandomPlayers = (players, limit) => {
    const shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
    return shuffledPlayers.slice(0, limit);
  };

  if (sportType === "NHL") {
    const goalPlayers = selectRandomPlayers(roster, 5);
    goalPlayers.forEach((player) => {
      const firstName = player.firstName?.default || "Unknown";
      const lastName = player.lastName?.default || "Player";
      const playerName = `${firstName} ${lastName}`;
      options.playerGoals.push(`${playerName} will score the first goal`);
      options.playerGoals.push(`${playerName} will score anytime`);
    });

    const shotPlayers = selectRandomPlayers(roster, 5);
    shotPlayers.forEach((player) => {
      const firstName = player.firstName?.default || "Unknown";
      const lastName = player.lastName?.default || "Player";
      const playerName = `${firstName} ${lastName}`;
      options.playerShots.push(`${playerName} will get 2 shots on net`);
    });

    const assistPlayers = selectRandomPlayers(roster, 5);
    assistPlayers.forEach((player) => {
      const firstName = player.firstName?.default || "Unknown";
      const lastName = player.lastName?.default || "Player";
      const playerName = `${firstName} ${lastName}`;
      options.playerAssists.push(`${playerName} will make an assist`);
    });
  }

  if (sportType === "MLB") {
    const homeRunPlayers = selectRandomPlayers(roster, 5);
    homeRunPlayers.forEach((player) => {
      const playerName = player.firstLastName || "Unknown Player";
      options.homeRuns.push(`${playerName} will hit a home run`);
    });

    const rbiPlayers = selectRandomPlayers(roster, 5);
    rbiPlayers.forEach((player) => {
      const playerName = player.firstLastName || "Unknown Player";
      options.RBIs.push(`${playerName} will hit an RBI`);
    });

    const pitcherPlayers = roster.filter((p) => p.primaryPosition?.code === "1");
    const selectedPitchers = selectRandomPlayers(pitcherPlayers, 5);
    selectedPitchers.forEach((player) => {
      const playerName = player.firstLastName || "Unknown Player";
      options.strikeouts.push(`${playerName} will have over 5 strikeouts`);
    });
  }

  return options;
};

const betTypeLabels = {
  gameOutcome: "Game Outcome",
  playerGoals: "Goals Scored",
  playerShots: "Shots on Goal",
  playerAssists: "Assists",
  homeRuns: "Home Runs",
  RBIs: "RBIs",
  strikeouts: "Strikeouts",
};

export const BettingOptions = ({ updateCheckedBets, sportType }) => {
  const [betOptions, setBetOptions] = useState({
    gameOutcome: [],
    playerGoals: [],
    playerShots: [],
    playerAssists: [],
    homeRuns: [],
    RBIs: [],
    strikeouts: [],
  });

  const [selectedBets, setSelectedBets] = useState({});

  useEffect(() => {
    const playByPlay = async () => {
      const gameID = localStorage.getItem(LOCALSTORAGE.SELECTEDGAME);
      if (!gameID) {
        console.error("No game ID found in local storage.");
        return;
      }

      const gameIDData = JSON.parse(gameID);
      const gameNumber = gameIDData.game_ID;
      const sportType = gameIDData.sportType;

      try {
        if (sportType === "NHL") {
          const response = await fetch(
            `https://friendly-bets-back-end.vercel.app/api/gamecenter/${gameNumber}/play-by-play`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch NHL game data: ${response.statusText}`);
          }

          const liveGameData = await response.json();
          console.log("NHL Live Game Data:", liveGameData);

          const homeTeam = liveGameData.homeTeam?.abbrev || "Unknown Home Team";
          const awayTeam = liveGameData.awayTeam?.abbrev || "Unknown Away Team";
          const roster = liveGameData.rosterSpots || [];
          console.log("Home Team:", homeTeam, "Away Team:", awayTeam, "Roster:", roster);

          const generatedOptions = generateBettingOptions(
            roster,
            homeTeam,
            awayTeam,
            sportType
          );
          setBetOptions(generatedOptions);
        } else if (sportType === "MLB") {
          const response = await fetch(
            `https://statsapi.mlb.com/api/v1.1/game/${gameNumber}/feed/live`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch MLB game data: ${response.statusText}`);
          }

          const gameInfo = await response.json();
          console.log("MLB Game Info:", gameInfo);

          const homeTeam = gameInfo.gameData?.teams?.home?.name || "Unknown Home Team";
          const awayTeam = gameInfo.gameData?.teams?.away?.name || "Unknown Away Team";
          const roster = Object.values(gameInfo.gameData?.players || {});
          console.log("Home Team:", homeTeam, "Away Team:", awayTeam, "Roster:", roster);

          const generatedOptions = generateBettingOptions(
            roster,
            homeTeam,
            awayTeam,
            sportType
          );
          setBetOptions(generatedOptions);
        }
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    };

    playByPlay();
  }, [sportType]);

  const handleBetSelection = (betType, betOption) => {
    const resetBets = {
      gameOutcome: "",
      playerGoals: "",
      playerShots: "",
      playerAssists: "",
      homeRuns: "",
      RBIs: "",
      strikeouts: "",
    };

    setSelectedBets({
      ...resetBets,
      [betType]: betOption,
    });

    updateCheckedBets(betOption);
  };

  return (
    <div className="mb-3">
      {Object.keys(betOptions).map((betType) => {
        if (betOptions[betType].length > 0) {
          return (
            <div className="mb-3" key={betType}>
              <select
                className="form-select custom-select"
                value={selectedBets[betType] || ""}
                onChange={(e) => handleBetSelection(betType, e.target.value)}
              >
                <option value="">{`Select ${betTypeLabels[betType]}`}</option>
                {betOptions[betType].map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export { findMLBPlayerName };
