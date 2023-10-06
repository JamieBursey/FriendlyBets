import React from "react";
import { renderFriends } from "../Data";
function buttons(buttonsData) {
  return (
    <div className="App p-3 mb-3">
      <div className="container text-center">
        <div className="row">
          {buttonsData
            ? buttonsData.map((button, index) => (
                <div className="col" key={index}>
                  <button type="button" className={`btn ${button.color}`}>
                    {button.text}
                  </button>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

function AddButtons() {
  const sportButtons = [
    { text: "Fighting", color: "btn-danger" },
    { text: "Hockey", color: "btn-light" },
    { text: "Football", color: "btn-warning" },
    { text: "Baseball", color: "btn-primary" },
  ];
  // const [playerName, setPlayerName] = useState("");

  // const [newPlayer, setNewPlayer] = useState([]);
  // const [playerRemoved, setPlayerRemoved] = useState("");

  // const addPlayer = () => {
  //     if (playerName.trim() !== "") {
  //         setNewPlayer([...newPlayer, playerName]);
  //         setPlayerName("");
  //         console.log(newPlayer);
  //     }
  // };

  // const deletePlayer = () => {
  //     const updatePlayers = newPlayer.filter(
  //         (person) => person !== playerRemoved
  //     );
  //     setNewPlayer(updatePlayers);
  //     setPlayerRemoved("");
  // };

  // const PlayerElement = () => {
  //     return newPlayer.map((person) => (
  //         <div key={person} className="col fs-4 text-danger">
  //             {person}
  //         </div>
  //     ));
  // };
  const ButtonsBackground = {
    backgroundColor: "#0B1305",
    borderRadius: "5px",
  };
  const ButtonsStyle = {
    marginRight: "5px",
  };
  return (
    <>
      <div style={ButtonsBackground} className="App p-3 mb-3">
        <div className="container text-center">{buttons(sportButtons)}</div>
      </div>
      <div style={ButtonsBackground} className="App p-3">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-md-3 py-.2">
              <input
                type="text"
                placeholder="Add Friend"
                className="w-100"
              ></input>
            </div>
            <div className="col-xs-12 col-sm-6 col-md-3 py-.2">
              <button className="w-100 btn btn-primary btn-sm">Submit</button>
            </div>
            <div className="col-xs-12 col-sm-6 col-md-3 py-.2">
              <input
                type="text"
                placeholder="Remove Friend"
                className="w-100"
              ></input>
            </div>
            <div className="col-xs-12 col-sm-6 col-md-3 py-.2">
              <button className="w-100 btn btn-primary btn-sm">Submit</button>
            </div>
          </div>
        </div>
        <div className="row mb-3">{renderFriends()}</div>
      </div>
    </>
  );
}

export default AddButtons;
