import React, { useState, useEffect } from "react";

export const BettingOptions = ({ game_ID }) => {
  const [betOptions, setBetOptions] = useState([]);

  const findPlayerID = (roster) => {
    const randomIndex = Math.floor(Math.random() * roster.length);
    return roster[randomIndex].playerId;
  };
  const findPlayerName = (roster, playerId) => {
    return (
      roster.find((player) => player.playerId === playerId) || {
        firstName: "Unknown",
        lastName: "Player",
      }
    );
  };
  const generateBettingOptions = (roster) => {
    if (roster.length > 0) {
      const randomPlayerID = findPlayerID(roster);
      const player = findPlayerName(roster, randomPlayerID);

      const options = [
        `${player.firstName} ${player.lastName} will score the first goal`,
        `${player.firstName} ${player.lastName} will get 5 shots on net`,
        // more to add later if this works
      ];

      return options;
    } else {
      return ["Roster update at puck drop"];
    }
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
        const playData = await response.json();

        const roster = [
          ...(Array.isArray(playData.homeTeam.rosterSpots) &&
          playData.homeTeam.rosterSpots.length > 0
            ? playData.homeTeam.rosterSpots
            : []),
          ...(Array.isArray(playData.awayTeam.rosterSpots) &&
          playData.awayTeam.rosterSpots.length > 0
            ? playData.awayTeam.rosterSpots
            : []),
        ];

        const generatedOptions = generateBettingOptions(roster);
        setBetOptions(generatedOptions);
      } catch (error) {
        console.log(error);
      }
    };
    if (game_ID) {
      playByPlay();
    }
  }, [game_ID]);
  return (
    <div className="bg-success">
      <h3>Betting Options:</h3>
      <ul>
        {betOptions.map((option, index) => (
          <li key={index}>{option}</li>
        ))}
      </ul>
    </div>
  );
};
