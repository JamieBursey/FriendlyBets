import React, { useState, useEffect } from "react";
import { LOCALSTORAGE } from "../Config";

const findPlayerID = (roster) => {
  const randomIndex = Math.floor(Math.random() * roster.length);
  return roster[randomIndex].playerId;
};
const findPlayerName = (roster, playerId) => {
  const player = roster.find((player) => player.playerId === playerId);
  return player
    ? `${player.firstName.default} ${player.lastName.default}`
    : "Unknown Player";
};

//MLB info
const findMLBPlayerID = (roster) => {
  const randomIndex = Math.floor(Math.random() * roster.length);
  return roster[randomIndex].athlete.id;
};
const findMLBPlayerName = (roster, playerId) => {
  const player = roster.find((player) => player.athlete.id === playerId);
  return player ? player.athlete.displayName : "Unknown Player";
};
const findPitcherID = (roster) => {
  // Filter roster for pitchers and then select one randomly
  const pitchers = roster.filter((player) => player.position === "Pitcher");
  const randomIndex = Math.floor(Math.random() * pitchers.length);
  return pitchers[randomIndex].playerId;
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
      options.push(`${rbiPlayerName} will get an RBI`);

      // Player to steal a base
      const stealBasePlayerID = findMLBPlayerID(roster);
      const stealBasePlayerName = findPlayerName(roster, stealBasePlayerID);
      options.push(`${stealBasePlayerName} will steal a base`);

      const pitcherID = findPitcherID(roster);
      const pitcherName = findPlayerName(roster, pitcherID);
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
        const rosterFetch =
          await fetch(`https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/summary?event=${gameNumber}
        `);
        const rosterInfo = await rosterFetch.json();
        const awayTeamID = rosterInfo.boxscore.teams[0].team.id;
        console.log("awayTeamID", awayTeamID);
        const homeTeamID = rosterInfo.boxscore.teams[1].team.id;
        const teamID = awayTeamID;
        const awayTeamFetch = await fetch(
          `https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams/${teamID}/roster`
        );
        const awayTeamInfo = await awayTeamFetch.json();
        console.log("awayTeamf", awayTeamInfo);

        const homeRoster = rosterInfo.rosters[0]?.roster ?? [];
        const awayRoster = rosterInfo.rosters[1]?.roster ?? [];
        const combinedRoster = [...homeRoster, ...awayRoster];

        const roster = combinedRoster;
        console.log("roster", roster);
        const selectedGame = JSON.parse(
          localStorage.getItem(LOCALSTORAGE.SELECTEDGAME)
        );
        const homeTeam = selectedGame.homeTeam;
        const awayTeam = selectedGame.awayTeam;
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
