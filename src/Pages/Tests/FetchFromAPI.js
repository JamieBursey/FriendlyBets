import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function FetchFromAPI() {
  const actionBtnOne = (gameId, gameTitle) => {
    console.log("actionBtnOne", gameId, gameTitle);
  };
  const actionBtnTwo = (gameId, gameTitle) => {
    alert("actionBtnOTwo" + gameId + gameTitle);
  };
  const createGameCard = (gameId, gameTitle) => {
    return (
      <div key={gameId} className="col-3 card m-1" style={{ width: "18rem" }}>
        <div className="card-body">
          <h5 className="card-title">{gameTitle}</h5>
          <p className="card-text">
            With supporting text below as a natural lead-in to additional
            content.
          </p>
          <a
            onClick={() => actionBtnOne(gameId, gameTitle)}
            className="btn btn-primary"
          >
            Go somewhere
          </a>
          <a
            onClick={() => actionBtnTwo(gameId, gameTitle)}
            className="btn btn-primary"
          >
            Go somewhere 2
          </a>
        </div>
      </div>
    );
  };
  const [arr, setArr] = useState([]);
  const fetchData = async () => {
    const response = await fetch(
      "https://statsapi.web.nhl.com/api/v1/schedule"
    );
    const games = await response.json();
    console.log("games", games.dates[0].games);
    let arrHTMLObj = [];
    games.roster.forEach((game) => {
      arrHTMLObj.push(createGameCard(game.person.id, game.person.fullName));
    });
    console.log("htmlAr", arrHTMLObj);
    setArr(arrHTMLObj);
  };
  useEffect(() => {
    // Whenever the page loads, then this is executed
    fetchData();
  }, []);

  return (
    <div className="text-white">
      <h1>Fetch From API</h1>
      <div className="row">{arr}</div>
    </div>
  );
}

export { FetchFromAPI };
