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
      <div className="input-group mb-3 mt-3 w-50 mx-auto">
        <input
          type="email"
          className="form-control me-1"
          placeholder="Friends Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="btn btn-outline-success"
          onClick={handleSendFriendRequest}
          type="button"
        >
          Send Friend Request
        </button>
      </div>
      <div>{renderFriends()}</div>;
    </div>
  );
};

export { AddFriends };
