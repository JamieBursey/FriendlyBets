import React, { useState, useEffect } from "react";
import { LOCALSTORAGE } from "../Config";

const findPlayerID = (roster, sportType) => {
  if (sportType === "NHL") {
    const randomIndex = Math.floor(Math.random() * roster.length);
    return roster[randomIndex].playerId;
  }
};
const findPlayerName = (roster, playerId, sportType) => {
  if (sportType === "NHL") {
    const player = roster.find((player) => player.playerId === playerId);
    return player
      ? `${player.firstName.default} ${player.lastName.default}`
      : "Unknown Player";
  }
};

//MLB info
const findMLBPlayerID = (roster) => {
  const randomIndex = Math.floor(Math.random() * roster.length);
  return roster[randomIndex].id;
};

const findMLBPlayerName = (roster, playerId) => {
  const player = roster.find((player) => player.id === playerId);
  return player ? player.firstLastName : "Unknown Player";
};

const findPitcherID = (roster) => {
  const pitchers = roster.filter(
    (player) => player.primaryPosition.code == "1"
  );
  if (pitchers.length === 0) {
    console.log("No pitchers found");
    return null;
  }
  const randomIndex = Math.floor(Math.random() * pitchers.length);
  return pitchers[randomIndex].id;
};
const generateBettingOptions = (roster, homeTeam, awayTeam, sportType) => {
  const options = [];
  options.push(`${homeTeam} will win`);
  options.push(`${awayTeam} will win`);
  if (sportType === "NHL") {
    if (roster.length > 0) {
      // Generate a separate option for each bet
      const goalPlayerID = findPlayerID(roster);
      const scoringPlayerName = findPlayerName(roster, goalPlayerID);
      options.push(`${scoringPlayerName} will score the first goal`);
      options.push(`${scoringPlayerName} will score anytime`);

      const shotsPlayerID = findPlayerID(roster);
      const ShootingPlayerName = findPlayerName(roster, shotsPlayerID);
      options.push(`${ShootingPlayerName} will get 2 shots on net`);

      const assistPlayerID = findPlayerID(roster);
      const assistPlayerName = findPlayerName(roster, assistPlayerID);
      options.push(`${assistPlayerName} will make an assist`);
    } else {
      return options;
    }
  }
  if (sportType === "MLB") {
    if (roster.length > 0) {
      const homeRunPlayerID = findMLBPlayerID(roster);
      const homeRunPlayerName = findMLBPlayerName(roster, homeRunPlayerID);
      options.push(`${homeRunPlayerName} will hit a home run`);

      const rbiPlayerID = findMLBPlayerID(roster);
      const rbiPlayerName = findMLBPlayerName(roster, rbiPlayerID);
      options.push(`${rbiPlayerName} will hit an RBI`);

      // Player to steal a base
      const stealBasePlayerID = findMLBPlayerID(roster);
      const stealBasePlayerName = findMLBPlayerName(roster, stealBasePlayerID);
      options.push(`${stealBasePlayerName} will steal a base`);

      const pitcherID = findPitcherID(roster);
      const pitcherName = findMLBPlayerName(roster, pitcherID);
      console.log(pitcherName);
      options.push(`${pitcherName} will have over 5 strikeouts`);
    }
  }

  return options;
};

const handleCheckedBet = (option, updateCheckedBets) => {
  updateCheckedBets(option);
};

export const BettingOptions = ({ updateCheckedBets, sportType }) => {
  const [betOptions, setBetOptions] = useState([]);
  const [selectedBet, setSelectedBet] = useState("");

  useEffect(() => {
    const playByPlay = async () => {
      const gameID = localStorage.getItem(LOCALSTORAGE.SELECTEDGAME);
      const gameIDData = JSON.parse(gameID);
      const gameNumber = gameIDData.game_ID;
      const sportType = gameIDData.sportType;
      if (sportType === "NHL") {
        try {
          const response = await fetch(
            `https://friendly-bets-back-end.vercel.app/api/gamecenter/${gameNumber}/play-by-play`
          );
          const liveGameData = await response.json();
          const homeTeam = liveGameData.homeTeam.name.default;
          const awayTeam = liveGameData.awayTeam.name.default;
          console.log("livedata", liveGameData);
          const roster = [
            ...(Array.isArray(liveGameData.rosterSpots) &&
            liveGameData.rosterSpots.length > 0
              ? liveGameData.rosterSpots
              : []),
          ];

          const generatedOptions = generateBettingOptions(
            roster,
            homeTeam,
            awayTeam,
            sportType
          );
          setBetOptions(generatedOptions);
        } catch (error) {
          console.log(error);
        }
      }
      if (sportType === "MLB") {
        const selectedGameApi =
          await fetch(`https://statsapi.mlb.com/api/v1.1/game/${gameNumber}/feed/live
        `);
        const gameInfo = await selectedGameApi.json();
        console.log("games info", gameInfo);
        const homeTeam = gameInfo.gameData.teams.home.name;
        const awayTeam = gameInfo.gameData.teams.away.name;
        const roster = [].concat(...Object.values(gameInfo.gameData.players));
        console.log(gameInfo);

        const generatedOptions = generateBettingOptions(
          roster,
          homeTeam,
          awayTeam,
          sportType
        );
        setBetOptions(generatedOptions);
      }
    };

    playByPlay();
  }, [sportType]);

  return (
    <div className="mb-3">
      <select
        className="form-select custom-select"
        value={selectedBet}
        onChange={(e) => {
          setSelectedBet(e.target.value);
          handleCheckedBet(e.target.value, updateCheckedBets);
        }}
      >
        <option value="">Select a Bet</option>
        {betOptions.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export { findMLBPlayerName };
