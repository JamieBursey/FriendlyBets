import { LOCALSTORAGE } from "../Config";
import { useState } from "react";
import { getAllUsers, sendFriendRequest, renderFriendList } from "../Data";
const AddFriends = () => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER))
  );
  const [email, setEmail] = useState("");

  const handleSendFriendRequest = () => {
    const allUsers = getAllUsers();
    const userToRequest = allUsers.find((user) => user.email === email);

    if (userToRequest) {
      sendFriendRequest(userToRequest.username);
      setEmail("");
    } else {
      alert("User Not Found");
    }
  };
  const renderFriends = () => {
    console.log("renderFriends", currentUser.friends);
    return (
      <>
        <div className="text-center fs-1 text-danger">Friends</div>
        <div className="">
          {currentUser ? renderFriendList(currentUser, setCurrentUser) : null}
        </div>

        <div className="App p-3"></div>
      </>
    );
  };
  return (
    <div>
      <input
        type="email"
        placeholder="Friends Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="btn btn-success " onClick={handleSendFriendRequest}>
        Send Friend Request
      </button>
      <div>{renderFriends()}</div>;
    </div>
  );
};

export { AddFriends };
