import { LOCALSTORAGE } from "../Config";
import { useState } from "react";
import { getAllUsers, sendFriendRequest, renderFriendList } from "../Data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import backgroundColor from "./Register";

const HeaderStyle = {
  fontSize: "3rem",
  fontWeight: "bold",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  letterSpacing: "0.1em",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", // Adding some shadow for depth
  background: "linear-gradient(45deg, #00b4d8, #90e0ef)", // Bright blue gradient
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  display: "inline",
};

const handleSendFriendRequest = (email, onSuccess) => {
  const allUsers = getAllUsers();
  const userToRequest = allUsers.find((user) => user.email === email);

  if (userToRequest) {
    sendFriendRequest(userToRequest.username);
    onSuccess(); // Call the onSuccess callback
  } else {
    alert("User Not Found");
  }
};

const AddFriends = () => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER))
  );
  const [email, setEmail] = useState("");

  const onSuccess = () => {
    setEmail("");
  };
  const renderFriends = () => {
    console.log("renderFriends", currentUser.friends);
    return (
      <>
        <div>
          <p className="container text-white fs-6 w-75">
            <FontAwesomeIcon icon={faUserGroup} /> {currentUser.friends.length}
          </p>
          {currentUser ? renderFriendList(currentUser, setCurrentUser) : null}
        </div>

        <div className="App p-3"></div>
      </>
    );
  };
  return (
    <div>
      <div className="text-center">
        <p style={HeaderStyle}>Friends</p>
      </div>
      <div className="input-group mb-3 w-50 mx-auto">
        <input
          type="email"
          className="form-control me-1"
          placeholder="AddFriend@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="input-group-append">
          <button
            className="btn btn-outline-success"
            onClick={() => handleSendFriendRequest(email, onSuccess)}
            type="button"
          >
            Add Friend
          </button>
        </div>
      </div>
      <div>{renderFriends()}</div>;
    </div>
  );
};

export { AddFriends, handleSendFriendRequest };
