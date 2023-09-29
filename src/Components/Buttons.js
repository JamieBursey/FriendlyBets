import React from "react";
import { renderFriends } from "../Data";
function buttons(buttonsData) {
    return (
        <div className="App p-3 mb-3">
            <div className="container text-center">
                <div className="row">
                    {buttonsData ? (
                        buttonsData.map((button, index) => (
                            <div className="col" key={index}>
                                <button type="button" className={`btn ${button.color}`}>
                                    {button.text}
                                </button>
                            </div>
                        ))
                    ) : null}
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
        borderRadius: "5px"
    }
    const ButtonsStyle = {
        width: "120px",
        height: "35px",
        fontSize: ".7em",
        fontWeight: "bold"
    }
    return (
        <>
            <div style={ButtonsBackground} className="App p-3 mb-3">
                <div className="container text-center">
                    {buttons(sportButtons)}
                </div>
            </div>
            <div style={ButtonsBackground} className="App p-3">
                <div className="container text-center">
                    <div className="d-grid gap-2 col-3 mx-auto">

                        <div className="d-flex col-6 col-md-3">
                            <input
                                className=""
                                type="text"
                                placeholder="Add Friend"
                            // value={playerName}
                            // onChange={(event) => setPlayerName(event.target.value)}
                            ></input>
                            <button
                                style={ButtonsStyle}
                                className="btn btn-primary"
                                type="button"
                            >
                                Add Friend
                            </button>
                        </div>
                        <div className="d-flex col-6 col-md-3">
                            <input
                                className=""
                                type="text"
                                placeholder="Remove Friend"
                            // value={playerRemoved}
                            // onChange={(event) => setPlayerRemoved(event.target.value)}
                            ></input>
                            <button
                                style={ButtonsStyle}
                                className="btn btn-primary"
                                type="button"
                            // onClick={deletePlayer}
                            >
                                Remove Friend
                            </button>
                        </div>
                    </div>

                    <div className="row mb-3">{renderFriends()}</div>
                </div>
            </div>
        </>
    );
}

export default AddButtons;


