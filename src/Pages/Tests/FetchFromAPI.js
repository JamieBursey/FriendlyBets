import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function FetchFromAPI() {
  const gameID = localStorage.getItem("selectedGame");
  const gameIDData = JSON.parse(gameID);
  const gameNumber = gameIDData.game_ID;

  const CompareBets = async () => {
    const pendingBets = localStorage.getItem("PendingBets") || [];
    const pendingBetsData = JSON.parse(pendingBets);
    const gameNumber = pendingBetsData[0].gameId;
    for (const bet of pendingBetsData) {
      try {
        const request = await fetch(
          `https://api-web.nhle.com/v1/gamecenter/${gameNumber}/play-by-play`
        );
        const liveData = await request.json();
        const firstGoal = liveData.plays.find(
          (play) => play.typeDescKey === "goal"
        );
      } catch (error) {
        console.log("error", error);
      }
    }
  };
  CompareBets();
  //   const actionBtnOne = (gameId, gameTitle) => {
  //     console.log("actionBtnOne", gameId, gameTitle);
  //   };
  //   const actionBtnTwo = (gameId, gameTitle) => {
  //     alert("actionBtnOTwo" + gameId + gameTitle);
  //   };
  //   const createGameCard = (gameId, gameTitle, gameTime, gameDay) => {
  //     return (
  //       <div key={gameId} className="col-3 card m-1" style={{ width: "18rem" }}>
  //         <div className="card-body">
  //           <h5 className="card-title">{gameTitle}</h5>
  //           <p>
  //             {gameDay} at {new Date(gameTime).toLocaleTimeString()}
  //           </p>
  //           <p className="card-text">
  //             With supporting text below as a natural lead-in to additional
  //             content.
  //           </p>
  //           <a
  //             onClick={() => actionBtnOne(gameId, gameTitle)}
  //             className="btn btn-primary"
  //           >
  //             Go somewhere
  //           </a>
  //           <a
  //             onClick={() => actionBtnTwo(gameId, gameTitle)}
  //             className="btn btn-primary"
  //           >
  //             Go somewhere 2
  //           </a>
  //         </div>
  //       </div>
  //     );
  //   };
  //   const [arr, setArr] = useState([]);
  //   const fetchData = async () => {
  //     const response = await fetch(
  //       "https://statsapi.web.nhl.com/api/v1/schedule"
  //     );
  //     const games = await response.json();
  //     let arrHTMLObj = [];
  //     games.dates.forEach((date) => {
  //       date.games.forEach((game) => {
  //         const gameID = game.gamePk;
  //         const gameTitle = `${game.teams.away.team.name} vs ${game.teams.home.team.name}`;
  //         const gameTime = game.gameDate;
  //         const gameDay = date.date;
  //         arrHTMLObj.push(createGameCard(gameID, gameTitle, gameTime, gameDay));
  //       });
  //     });
  //     console.log("htmlAr", arrHTMLObj);
  //     setArr(arrHTMLObj);
  //   };
  //   useEffect(() => {
  //     // Whenever the page loads, then this is executed
  //     fetchData();
  //   }, []);
  //   return (
  //     <div className="text-white">
  //       <h1>Fetch From API</h1>
  //       <div className="row">{arr}</div>
  //     </div>
  //   );
}

export { FetchFromAPI };
