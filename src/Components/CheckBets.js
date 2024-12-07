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

      const checkShotsOnNet = (playerId, plays, isGameFinished) => {
        if (!isGameFinished) {
          return "Waiting game to finish";
        }

        const shotsOnGoal = plays.filter(
          (play) =>
            (play.typeDescKey === "shot-on-goal" &&
              play.details.shootingPlayerId === playerId) ||
            (play.typeDescKey === "goal" &&
              play.details.scoringPlayerId === playerId)
        );

        return shotsOnGoal.length >= 2
          ? `${betCreator} Wins`
          : `${betCreator} Lost`;
      };

      const checkAnytimeGoal = (playerId, plays, isGameFinished) => {
        if (isGameFinished) {
          return "Waiting";
        }
        const scoredAtLeastOnce = plays.some(
          (play) =>
            play.typeDescKey === "goal" &&
            play.details.scoringPlayerId === playerId
        );
        return scoredAtLeastOnce ? `${betCreator} Wins` : `${betCreator} Lost`;

      };

      const checkAssistPlayer = (playerId, plays, isGameFinished) => {
        if (isGameFinished) {
          return "Game not over";
        }
        const assists = plays.filter(
          (play) =>
            play.typeDescKey === "goal" &&
            (play.details.assist1PlayerId === playerId ||
              play.details.assist2PlayerId === playerId)
        );
        return assists.length > 1 ? `${betCreator} Wins` : `${betCreator} Lost`;
      };

      // Fetch game data
      const response = await fetch(
        `https://friendly-bets-back-end.vercel.app/api/gamecenter/${gameNumber}/play-by-play`
      );
      const resultsData = await response.json();
      
      const isGameFinished =
        resultsData.gameState === "OFF" ||
        (resultsData.clock.timeRemaining === "00:00" &&
          resultsData.period === 3);

      for (const [betDescription, isActive] of Object.entries(
        bet.betdescription
      )) {
        if (!isActive) continue;

        if (betDescription.includes("will score the first goal")) {
          let firstGoalEvent = resultsData.plays.find(
            (play) => play.typeDescKey === "goal"
          );
          if (firstGoalEvent) {
            const playerName = betDescription.split(
              " will score the first goal"
            )[0];
            const scoringPlayerId = firstGoalEvent.details.scoringPlayerId;
            const player = resultsData.rosterSpots.find(
              (p) => p.playerId === scoringPlayerId
            );
            bet.result =
              player &&
              `${player.firstName.default} ${player.lastName.default}` ===
                playerName
                ? `${betCreator} Wins`
                : `${betCreator} Lost`;
          } else {
            bet.result = "Loss";
          }
          
        }
        if (betDescription.includes("will score anytime")) {
          const playerName = betDescription.split(" will score anytime")[0];
          const playerId = findPlayerIdByName(
            playerName,
            resultsData.rosterSpots
          );
          const scoreingResults = checkAnytimeGoal(playerId, resultsData.plays);
          bet.result = scoreingResults;
        }
        if (betDescription.includes("will get 2 shots on net")) {
          const playerName = betDescription.split(
            " will get 2 shots on net"
          )[0];
          const playerId = findPlayerIdByName(
            playerName,
            resultsData.rosterSpots
          );
          const shotsResult = checkShotsOnNet(
            playerId,
            resultsData.plays,
            isGameFinished
          );

          bet.result = shotsResult;
        }
        if (betDescription.includes("will make an assist")) {
          const playerName = betDescription.split(" Will make an assist")[0];
          const playerId = findPlayerIdByName(
            playerName,
            resultsData.rosterSpots
          );
          const playerAssist = checkAssistPlayer(playerId, resultsData.plays);
          bet.result = playerAssist;
        }

        if (isGameFinished) {
          const homeScore = resultsData.homeTeam.score;
          const awayScore = resultsData.awayTeam.score;

          if (
            betDescription === `${resultsData.homeTeam.abbrev} will win`
          ) {
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
          bet.result = "Game not Finished";
        }
        if (bet.result && (bet.result.includes("Wins") || bet.result.includes("Lost"))) {
          // Update bet status to 'settled' if the result is determined --Jamie--
          bet.betstatus = "settled";
        }
        // Update the bet in Supabase --Jamie--
        const { error: updateError } = await supabase
          .from("bets")
          .update({ result: bet.result,betstatus: bet.betstatus })
          .eq("betid", betId);

        if (updateError) {
          console.error("Error updating bet result:", updateError);
        }
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
