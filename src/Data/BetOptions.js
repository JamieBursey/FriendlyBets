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
const generateBettingOptions = (roster, homeTeam, awayTeam) => {
  const options = [];

  if (roster.length > 0) {
    // Generate a separate option for each bet
    const goalPlayerID = findPlayerID(roster);
    const scoringPlayerName = findPlayerName(roster, goalPlayerID);
    options.push(`${scoringPlayerName} will score the first goal`);

    const shotsPlayerID = findPlayerID(roster);
    const ShootingPlayerName = findPlayerName(roster, shotsPlayerID);
    options.push(`${ShootingPlayerName} will get 2 shots on net`);

    const assistPlayerID = findPlayerID(roster);
    const assistPlayerName = findPlayerName(roster, assistPlayerID);
    options.push(`${assistPlayerName} will make an assist`);

    options.push(`${homeTeam} will win`);
    options.push(`${awayTeam} will win`);
  } else {
    options.push("Game Not Started");
  }

  return options;
};

const handleCheckedBet = (option, updateCheckedBets) => {
  updateCheckedBets(option);
};

export const BettingOptions = ({ updateCheckedBets, selectedBets }) => {
  const [betOptions, setBetOptions] = useState([]);
  const [selectedBet, setSelectedBet] = useState("");

  useEffect(() => {
    const playByPlay = async () => {
      const gameID = localStorage.getItem(LOCALSTORAGE.SELECTEDGAME);
      const gameIDData = JSON.parse(gameID);
      const gameNumber = gameIDData.game_ID;

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
          awayTeam
        );
        setBetOptions(generatedOptions);
      } catch (error) {
        console.log(error);
      }
    };

    playByPlay();
  }, []);

  return (
    <div className="mb-3">
      <select
        className="form-select"
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
