import React, { useState, useEffect } from "react";
import { LOCALSTORAGE } from "../Config";

const findMLBPlayerName = (roster, playerId) => {
  const player = roster.find((player) => player.id === playerId);
  return player ? player.firstLastName : "Unknown Player";
};

// --- Generate MLB / future random options only ---
const generateBettingOptions = (roster, homeTeam, awayTeam, sportType) => {
  const options = {
    gameOutcome: [],
    homeRuns: [],
    RBIs: [],
    strikeouts: [],
  };

  if (homeTeam && awayTeam) {
    options.gameOutcome.push(`${homeTeam} will win`);
    options.gameOutcome.push(`${awayTeam} will win`);
  }

  const selectRandomPlayers = (players, limit) => {
    const shuffled = [...players].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  };

  if (sportType === "MLB") {
    const homeRunPlayers = selectRandomPlayers(roster, 5);
    homeRunPlayers.forEach((player) => {
      const name = player.firstLastName || "Unknown Player";
      options.homeRuns.push(`${name} will hit a home run`);
    });

    const rbiPlayers = selectRandomPlayers(roster, 5);
    rbiPlayers.forEach((player) => {
      const name = player.firstLastName || "Unknown Player";
      options.RBIs.push(`${name} will get an RBI`);
    });

    const pitchers = roster.filter((p) => p.primaryPosition?.code === "1");
    const selectedPitchers = selectRandomPlayers(pitchers, 3);
    selectedPitchers.forEach((player) => {
      const name = player.firstLastName || "Unknown Player";
      options.strikeouts.push(`${name} will have over 5 strikeouts`);
    });
  }

  return options;
};

const betTypeLabels = {
  gameOutcome: "Game Outcome",
  playerGoals: "Goals",
  playerShots: "Shots on Goal",
  playerAssists: "Assists",
  homeRuns: "Home Runs",
  RBIs: "RBIs",
  strikeouts: "Strikeouts",
};

export const BettingOptions = ({ updateCheckedBets, selectedBets }) => {
  const [sportType, setSportType] = useState("");
  const [roster, setRoster] = useState([]);
  const [teams, setTeams] = useState({ home: "", away: "" });
  const [typedInputs, setTypedInputs] = useState({});
  const [suggestions, setSuggestions] = useState({});
  const [selectedActions, setSelectedActions] = useState({});
  const [betOptions, setBetOptions] = useState({});

  const hasSelectedBet = Object.keys(selectedBets).length > 0;

  const betActions = {
    playerGoals: ["will score first goal", "will score anytime"],
    playerShots: ["will get 2 shots on net", "will get 3+ shots on net"],
    playerAssists: ["will make an assist"],
  };

  // Fetch data on mount
  useEffect(() => {
    const fetchGameData = async () => {
      const storedGame = JSON.parse(localStorage.getItem(LOCALSTORAGE.SELECTEDGAME));
      if (!storedGame) return;

      setSportType(storedGame.sportType);
      const { game_ID, sportType } = storedGame;

      try {
        let rosterData = [];
        let homeTeam = "";
        let awayTeam = "";

        if (sportType === "NHL") {
          const res = await fetch(
            `https://friendly-bets-back-end.vercel.app/api/gamecenter/${game_ID}/play-by-play`
          );
          const data = await res.json();
          rosterData = data.rosterSpots || [];
          homeTeam = data.homeTeam?.abbrev || "";
          awayTeam = data.awayTeam?.abbrev || "";
        } else if (sportType === "MLB") {
          const res = await fetch(
            `https://statsapi.mlb.com/api/v1.1/game/${game_ID}/feed/live`
          );
          const data = await res.json();
          rosterData = Object.values(data.gameData?.players || {});
          homeTeam = data.gameData?.teams?.home?.name || "";
          awayTeam = data.gameData?.teams?.away?.name || "";
        }

        setRoster(rosterData);
        setTeams({ home: homeTeam, away: awayTeam });

        if (sportType === "MLB") {
          const generated = generateBettingOptions(rosterData, homeTeam, awayTeam, sportType);
          setBetOptions(generated);
        }
      } catch (err) {
        console.error("Error fetching game data:", err);
      }
    };

    fetchGameData();
  }, []);

  // --- NHL Autocomplete handler ---
  const handleInputChange = (betType, value) => {
    setTypedInputs((prev) => ({ ...prev, [betType]: value }));

    if (sportType === "NHL" && value.length > 0) {
      const filtered = roster
        .filter((p) =>
          `${p.firstName?.default || ""} ${p.lastName?.default || ""}`
            .toLowerCase()
            .includes(value.toLowerCase())
        )
        .slice(0, 6)
        .map((p) => `${p.firstName.default} ${p.lastName.default}`);

      setSuggestions((prev) => ({ ...prev, [betType]: filtered }));
    } else {
      setSuggestions((prev) => ({ ...prev, [betType]: [] }));
    }
  };

  const handleSelectSuggestion = (betType, name) => {
    setTypedInputs((prev) => ({ ...prev, [betType]: name }));
    setSuggestions((prev) => ({ ...prev, [betType]: [] }));
  };

  const handleActionSelect = (betType, action) => {
    const name = typedInputs[betType];
    if (!name) return;
    const fullBet = `${name} ${action}`;
    setSelectedActions({ [betType]: action });
    updateCheckedBets(fullBet);
  };

  const handleTeamSelect = (value) => updateCheckedBets(value);

  const handleDropdownSelect = (value) => updateCheckedBets(value);

const handleClearBet = () => {
  setTypedInputs({});
  setSelectedActions({});
  setSuggestions({});
  updateCheckedBets(null);

  // Optional feedback
  alert("Bet cleared! You can make a new one.");
};


  return (
    <div className="mb-3">
      {/* 🏒 NHL Typed Mode */}
      {sportType === "NHL" && (
        <>
          {/* Team Outcome */}
          <div className="mb-4">
            <label className="fw-bold text-info mb-2">{betTypeLabels.gameOutcome}</label>
            <select
              className="form-select custom-select w-75 mx-auto"
              onChange={(e) => handleTeamSelect(e.target.value)}
              disabled={hasSelectedBet}
            >
              <option value="">Select Team</option>
              <option value={`${teams.home} will win`}>{teams.home} will win</option>
              <option value={`${teams.away} will win`}>{teams.away} will win</option>
            </select>
          </div>

          {/* Player bets with autocomplete */}
          {["playerGoals", "playerShots", "playerAssists"].map((type) => (
            <div key={type} className="mb-4 position-relative">
              <label className="fw-bold text-info mb-2">{betTypeLabels[type]}</label>
              <input
                type="text"
                className="form-control custom-input w-75 mx-auto mb-2"
                placeholder="Type player name"
                value={typedInputs[type] || ""}
                onChange={(e) => handleInputChange(type, e.target.value)}
                disabled={hasSelectedBet}
              />

              {suggestions[type]?.length > 0 && !hasSelectedBet && (
                <ul
                  className="list-group position-absolute w-75 mx-auto"
                  style={{
                    zIndex: 20,
                    top: "100%",
                    left: "12.5%",
                    maxHeight: "150px",
                    overflowY: "auto",
                  }}
                >
                  {suggestions[type].map((name, i) => (
                    <li
                      key={i}
                      className="list-group-item list-group-item-action"
                      onClick={() => handleSelectSuggestion(type, name)}
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              )}

              <select
                className="form-select custom-select w-75 mx-auto"
                value={selectedActions[type] || ""}
                onChange={(e) => handleActionSelect(type, e.target.value)}
                disabled={hasSelectedBet}
              >
                <option value="">Select Action</option>
                {betActions[type].map((action, i) => (
                  <option key={i} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* 🧹 Clear Selection Button */}
          {hasSelectedBet && (
            <button
              className="btn btn-outline-danger w-50 mx-auto mt-3"
              onClick={handleClearBet}
            >
              Clear Selected Bet
            </button>
          )}
        </>
      )}

      {/* ⚾ MLB Dropdown Style */}
      {sportType === "MLB" &&
        ["gameOutcome", "homeRuns", "RBIs", "strikeouts"].map((type) => (
          <div key={type} className="mb-3">
            <label className="fw-bold text-info mb-2">{betTypeLabels[type]}</label>
            <select
              className="form-select custom-select w-75 mx-auto"
              onChange={(e) => handleDropdownSelect(e.target.value)}
              disabled={hasSelectedBet}
            >
              <option value="">Select {betTypeLabels[type]}</option>
              {betOptions[type]?.map((option, i) => (
                <option key={i} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}

      {/* 🧹 Clear Button for MLB */}
      {sportType === "MLB" && hasSelectedBet && (
        <button
          className="btn btn-outline-danger w-50 mx-auto mt-3"
          onClick={handleClearBet}
        >
          Clear Selected Bet
        </button>
      )}
    </div>
  );
};

export { findMLBPlayerName };
