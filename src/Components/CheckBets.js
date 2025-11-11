import { supabase } from "../supabaseClient";
import { findPlayerIdByName, findMLBPlayerIdByName } from "../Data";

const CheckBetResults = async (betId, callback) => {
  try {
    // Fetch the bet from Supabase
    const { data: bet, error: betError } = await supabase
      .from("bets")
      .select("*")
      .eq("betid", betId)
      .single();
    if (betError || !bet) {
      console.error("Error fetching bet:", betError);
      return;
    }
    const betCreator = bet.betcreator;
    const gameNumber = bet.gameid;
 

if (bet.sporttype === "NHL") {
  const response = await fetch(
    `https://friendly-bets-back-end.vercel.app/api/gamecenter/${gameNumber}/play-by-play`
  );
  const resultsData = await response.json();

  const isGameFinished =
    resultsData.gameState === "OFF" ||
    (resultsData.clock?.timeRemaining === "00:00" &&
      resultsData.period >= 3);

  // ---- Helper functions ----
  const checkShotsOnNet = (playerId, plays) => {
    const shotsOnGoal = plays.filter(
      (play) =>
        (play.typeDescKey === "shot-on-goal" &&
          play.details.shootingPlayerId === playerId) ||
        (play.typeDescKey === "goal" &&
          play.details.scoringPlayerId === playerId)
    );
    return shotsOnGoal.length >= 2;
  };

  const checkAnytimeGoal = (playerId, plays) => {
    return plays.some(
      (play) =>
        play.typeDescKey === "goal" &&
        play.details.scoringPlayerId === playerId
    );
  };

  const checkAssistPlayer = (playerId, plays) => {
    const assists = plays.filter(
      (play) =>
        play.typeDescKey === "goal" &&
        (play.details.assist1PlayerId === playerId ||
          play.details.assist2PlayerId === playerId)
    );
    return assists.length >= 1;
  };

  // ---- Loop through each bet ----
  for (const [betDescription, isActive] of Object.entries(bet.betdescription)) {
    if (!isActive) continue;

    // 🏒 FIRST GOAL
if (betDescription.includes("will score first goal")) {
  const firstGoalEvent = resultsData.plays.find(
    (play) => play.typeDescKey === "goal"
  );

  if (!firstGoalEvent) {
    bet.result = !isGameFinished ? "Game not over" : `${betCreator} Lost`;
  } else {
    const playerName = betDescription.split(" will score first goal")[0];
    const scoringPlayerId = firstGoalEvent.details.scoringPlayerId;
    const player = resultsData.rosterSpots.find(
      (p) => p.playerId === scoringPlayerId
    );
    const fullName = `${player.firstName.default} ${player.lastName.default}`;
    bet.result =
      fullName === playerName
        ? `${betCreator} Wins`
        : `${betCreator} Lost`;
  }
}


    // 🏒 ANYTIME GOAL
else if (betDescription.includes("will score anytime")) {
  const playerName = betDescription.split(" will score anytime")[0];
  const playerId = findPlayerIdByName(playerName, resultsData.rosterSpots);

  const hasScored = checkAnytimeGoal(playerId, resultsData.plays);

  if (hasScored) {
    bet.result = `${betCreator} Wins`;
  } else if (!isGameFinished) {
    bet.result = "Game not over";
  } else {
    bet.result = `${betCreator} Lost`;
  }
}


    // 🏒 SHOTS ON NET
else if (betDescription.includes("will get 2 shots on net")) {
  const playerName = betDescription.split(" will get 2 shots on net")[0];
  const playerId = findPlayerIdByName(playerName, resultsData.rosterSpots);

  const hasEnoughShots = checkShotsOnNet(playerId, resultsData.plays);

  if (hasEnoughShots) {
    bet.result = `${betCreator} Wins`;
  } else if (!isGameFinished) {
    bet.result = "Game not over";
  } else {
    bet.result = `${betCreator} Lost`;
  }
}

// 🏒 SHOTS ON NET (3+)
else if (betDescription.includes("will get 3+ shots on net")) {
  const playerName = betDescription.split(" will get 3+ shots on net")[0];
  const playerId = findPlayerIdByName(playerName, resultsData.rosterSpots);

  // We’ll tweak the helper slightly inline for 3+ shots
  const shotsOnGoal = resultsData.plays.filter(
    (play) =>
      (play.typeDescKey === "shot-on-goal" &&
        play.details.shootingPlayerId === playerId) ||
      (play.typeDescKey === "goal" &&
        play.details.scoringPlayerId === playerId)
  );

  const hasEnoughShots = shotsOnGoal.length >= 3;

  if (hasEnoughShots) {
    bet.result = `${betCreator} Wins`;
  } else if (!isGameFinished) {
    bet.result = "Game not over";
  } else {
    bet.result = `${betCreator} Lost`;
  }
}



    // 🏒 ASSIST
else if (betDescription.includes("will make an assist")) {
  const playerName = betDescription.split(" will make an assist")[0];
  const playerId = findPlayerIdByName(playerName, resultsData.rosterSpots);

  const hasAssist = checkAssistPlayer(playerId, resultsData.plays);

  if (hasAssist) {
    bet.result = `${betCreator} Wins`;
  } else if (!isGameFinished) {
    bet.result = "Game not over";
  } else {
    bet.result = `${betCreator} Lost`;
  }
}


    // 🏒 GAME WINNER
    else if (isGameFinished) {
      const homeScore = resultsData.homeTeam.score;
      const awayScore = resultsData.awayTeam.score;
      if (betDescription === `${resultsData.homeTeam.abbrev} will win`) {
        bet.result =
          homeScore > awayScore
            ? `${betCreator} Wins`
            : `${betCreator} Lost`;
      } else if (
        betDescription === `${resultsData.awayTeam.abbrev} will win`
      ) {
        bet.result =
          awayScore > homeScore
            ? `${betCreator} Wins`
            : `${betCreator} Lost`;
      }
    } else {
      bet.result = "Waiting for game to finish";
    }

    // ---- Final update ----
    if (bet.result && (bet.result.includes("Wins") || bet.result.includes("Lost"))) {
      bet.betstatus = "settled";
    }

    const { error: updateError } = await supabase
      .from("bets")
      .update({ result: bet.result, betstatus: bet.betstatus })
      .eq("betid", betId);

    if (updateError) console.error("Error updating bet result:", updateError);
  }
}

    if (bet.sporttype === "MLB") {
      const response = await fetch(
        `https://statsapi.mlb.com/api/v1.1/game/${gameNumber}/feed/live`
      );
      const gameInfo = await response.json();
      const plays = gameInfo.liveData.plays.allPlays;
      const isGameFinished =
        gameInfo.gameData.status.abstractGameState === "Final";
      const homeTeam = gameInfo.gameData.teams.home;
      const awayTeam = gameInfo.gameData.teams.away;

      for (const [betDescription, isActive] of Object.entries(
        bet.betdescription
      )) {
        if (!isActive) continue;

        const roster = Object.values(gameInfo.gameData.players);

        if (betDescription.includes("will hit an RBI")) {
          const playerName = betDescription.split(" will hit an RBI")[0];

          const playerID = findMLBPlayerIdByName(playerName, roster);

          const batterRbi = plays.some(
            (play) => play.result.rbi > 0 && play.matchup.batter.id === playerID
          );

          if (batterRbi) {
            bet.result = `${betCreator} Wins`;
          } else if (!isGameFinished) {
            bet.result = "Game not Finished";
          } else {
            bet.result = `${betCreator} Lost`;
          }
        }
        if (betDescription.includes("will hit a home run")) {
          const playerName = betDescription.split(" will hit a home run")[0];

          const playerID = findMLBPlayerIdByName(playerName, roster);

          const playerHitHomeRun = plays.some(
            (play) =>
              play.result.event === "Home Run" &&
              play.matchup.batter.id === playerID
          );

          if (!isGameFinished && !playerHitHomeRun) {
            bet.result = "Game not Finished";
          } else {
            bet.result = playerHitHomeRun
              ? `${betCreator} Wins`
              : `${betCreator} Lost`;
          }
        }

        const homeScore = gameInfo.liveData.linescore.teams.home.runs;
        const awayScore = gameInfo.liveData.linescore.teams.away.runs;

        if (betDescription === `${homeTeam.name} will win`) {
          if (!isGameFinished) {
            bet.result = "Game Not Finished";
          } else {
            bet.result =
              homeScore > awayScore
                ? `${betCreator} Wins`
                : `${betCreator} Lost`;
          }
        }
        if (betDescription === `${awayTeam.name} will win`) {
          if (!isGameFinished) {
            bet.result = "Game Not Finished";
          } else {
            bet.result =
              awayScore > homeScore
                ? `${betCreator} Wins`
                : `${betCreator} Lost`;
          }
        }
      }
      if (bet.result && (bet.result.includes("Wins") || bet.result.includes("Lost"))) {
        // Update bet status to 'settled' if the result is determined for mlb --Jamie--
        bet.betstatus = "settled";
      }
      // Update the bet in Supabase --jamie--
      const { error: updateError } = await supabase
        .from("bets")
        .update({ result: bet.result,betstatus: bet.betstatus })
        .eq("betid", betId);

      if (updateError) {
        console.error("Error updating bet result:", updateError);
      }
    }

    if (callback) {
      callback();
    }
  } catch (error) {
    console.error("Error checking bet results:", error);
  }
};

export { CheckBetResults };
