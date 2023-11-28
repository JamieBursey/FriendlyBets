import React, { useState, useEffect } from "react";

export const BettingOptions = ({ updateCheckedBets, selectedBets }) => {
  const [betOptions, setBetOptions] = useState([]);
  const [selectedBet, setSelectedBet] = useState("");

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
  const generateBettingOptions = (roster) => {
    const options = [];

    if (roster.length > 0) {
      // Generate a separate option for each bet
      const option1PlayerID = findPlayerID(roster);
      const option1PlayerName = findPlayerName(roster, option1PlayerID);
      options.push(`${option1PlayerName} will score the first goal`);

      const option2PlayerID = findPlayerID(roster);
      const option2PlayerName = findPlayerName(roster, option2PlayerID);
      options.push(`${option2PlayerName} will get 2 shots on net`);
    } else {
      options.push("Roster update at puck drop");
    }

    return options;
  };

  useEffect(() => {
    const playByPlay = async () => {
      const gameID = localStorage.getItem("selectedGame");
      const gameIDData = JSON.parse(gameID);
      const gameNumber = gameIDData.game_ID;

      try {
        const response = await fetch(
          `https://api-web.nhle.com/v1/gamecenter/${gameNumber}/play-by-play`
        );
        const liveGameData = await response.json();

        const roster = [
          ...(Array.isArray(liveGameData.rosterSpots) &&
          liveGameData.rosterSpots.length > 0
            ? liveGameData.rosterSpots
            : []),
        ];

        const generatedOptions = generateBettingOptions(roster);
        setBetOptions(generatedOptions);
      } catch (error) {
        console.log(error);
      }
    };

    playByPlay();
  }, []);

  const handleCheckedBet = (option) => {
    updateCheckedBets(option);
  };
  return (
    <div className="mb-3">
      <select
        className="form-select"
        value={selectedBet}
        onChange={(e) => {
          setSelectedBet(e.target.value);
          handleCheckedBet(e.target.value);
        }}
      >
        <option selected>Select a Bet</option>
        {betOptions.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
