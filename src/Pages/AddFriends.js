import { LOCALSTORAGE } from "../Config";
import { useState } from "react";
import { getAllUsers, sendFriendRequest } from "../Data";
const AddFriends = () => {
  const loggedInStr = localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER);
  const loggedInUser = JSON.parse(loggedInStr);
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

  return (
    <div>
      <input
        type="email"
        placeholder="Friends Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSendFriendRequest}>Send Friend Request</button>
    </div>
  );
};

export { AddFriends };
