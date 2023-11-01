import React from "react";
import { renderFriends } from "../Data";
import Avatar from "react-avatar";
function buttons(buttonsData) {
  return (
    <div className="App p-3 mb-3">
      <div className="container text-center">
        <div className="row">
          {buttonsData
            ? buttonsData.map((button, index) => (
                <div className="col" key={index}>
                  <Avatar size="100" src={button.imageURL} round={true} />
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
    {
      text: "Fighting",
      imageURL:
        "https://th.bing.com/th/id/R.a0bb7371d003fc78ee0b5897a1f6b2b7?rik=%2b0M6k68PsbCVUw&pid=ImgRaw&r=0",
    },
    {
      text: "Hockey",
      imageURL:
        "https://assets.dragoart.com/images/20841_501/how-to-draw-the-nhl-logo_5e4cd2e0524681.36940192_102529_5_4.png",
    },
    {
      text: "Football",
      imageURL:
        "https://static.vecteezy.com/system/resources/previews/000/246/904/original/american-football-emblems-vector.jpg",
    },
    {
      text: "Baseball",
      imageURL:
        "https://th.bing.com/th/id/R.fb35581771dd8c5b57796a08803b05c6?rik=ShSZHJ6HhQGQsQ&riu=http%3a%2f%2fthebeastbrief.com%2fwp-content%2fuploads%2fmlb-logo.jpg&ehk=uuqTVdWYUq2CEu96Ze6aIGgvSDTYJf9j32csiFd9yRQ%3d&risl=&pid=ImgRaw&r=0",
    },
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
      </div>
    </>
  );
}

export default AddButtons;
