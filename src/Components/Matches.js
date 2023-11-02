import Calendar from "react-calendar";
import { useState } from "react";

function Matches() {
  //changed render into function to have more visibility of the code when collaples
  function renderGames() {
    if (selectedDateGames.length > 0) {
      return selectedDateGames.map((Item, index) => (
        <div
          key={index}
          style={backgroundColor}
          className="container text-center text-light mt-3"
        >
          <div className="row">
            <div className="col mb-3">{Item.visitor}</div>
            <div style={backgroundColor} className="col">
              {Item.vs}
            </div>
            <div className="col">{Item.home}</div>
          </div>
        </div>
      ));
    } else {
      return <div className="mt-3">No games scheduled.</div>;
    }
  }

  const [value, setValue] = useState(new Date());

  const backgroundColor = {
    backgroundColor: "#0B1305",
    borderRadius: "5px",
  };

  const Games = [
    { date: "2023-11-15", home: "Colorado", vs: "VS", visitor: "Vegas" },
    { date: "2023-11-02", home: "Devils", vs: "VS", visitor: "Wild" },
    { date: "2023-11-17", home: "Toronto", vs: "VS", visitor: "Montreal" },
    { date: "2023-11-18", home: "Boston", vs: "VS", visitor: "Winnipeg" },
  ];
  // compare Games Array to Calendar value
  const selectedDateGames = Games.filter(
    (game) => new Date(game.date).toDateString() === value.toDateString()
  );
  // get game for date
  const gameDates = Games.map((game) => new Date(game.date).toDateString());

  return (
    <div
      style={backgroundColor}
      className="container text-center mt-4 text-light"
    >
      <div>
        <Calendar
          onChange={(date) => setValue(date)}
          value={value}
          tileContent={({ date, view }) =>
            //check if date has game
            view === "month" && gameDates.includes(date.toDateString()) ? (
              //used chatGPT, why span class?
              <span
                style={{
                  borderRadius: "50%",
                  backgroundColor: "red",
                  display: "block",
                  margin: "auto",
                  width: "8px",
                  height: "8px",
                }}
              ></span>
            ) : null
          }
        />
      </div>
      {renderGames()}
    </div>
  );
}

export default Matches;
