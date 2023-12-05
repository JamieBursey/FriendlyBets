import { LOCALSTORAGE } from "../Config";
import { findUser, getAllUsers } from "./RegisteredUser";

const getFriend = (username) => {
  return { username: "", password: "" };
};
const editUser = (username, newUserObj) => {
  let userFound = findUser(username);
  // Get All User Array
  const allUserArray = getAllUsers();
  let temporaryArrayUsers = allUserArray.filter(
    (user) => user.username !== userFound.username
  );
  temporaryArrayUsers.push(newUserObj);
  // Push the new array of users back to the local storage using localStorage.setItem(allUserKey, JSON.stringify(allUsers))
  localStorage.setItem(LOCALSTORAGE.USERS, JSON.stringify(temporaryArrayUsers));
};
const sendFriendRequest = (toUserName) => {
  const loggedInUser = JSON.parse(
    localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER)
  );
  const fromUserName = loggedInUser.username;
  const friendRequests =
    JSON.parse(localStorage.getItem(LOCALSTORAGE.FRIENDREQUEST)) || [];
  const existingRequest = friendRequests.find(
    (request) => request.from === fromUserName && request.to === toUserName
  );
  if (existingRequest) {
    alert("Friend request already sent.");
    return;
  }
  if (loggedInUser.friends.includes(toUserName)) {
    alert("Friend already added");
    return;
  }

  const newRequest = {
    id: `${fromUserName}_${toUserName}`,
    from: fromUserName,
    to: toUserName,
    status: "pending",
  };
  friendRequests.push(newRequest);
  localStorage.setItem(
    LOCALSTORAGE.FRIENDREQUEST,
    JSON.stringify(friendRequests)
  );
};
const addUsersFriend = (username) => {
  const friendUserObj = findUser(username);
  const loggedInUserStr = localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER);
  const loggedInUserObj = JSON.parse(loggedInUserStr);
  sendFriendRequest(friendUserObj, loggedInUserObj);
};
const renderFriends = () => {
  let allUsers = getAllUsers();

  return allUsers.map((player) => (
    <div key={player["username"]} className="col fs-4 text-danger ">
      <div className="row">
        <div className="col">{player["username"]}</div>
        <div className="col">
          <button onClick={() => addUsersFriend(player["username"])}>
            Add Friend
          </button>
        </div>
      </div>
    </div>
  ));
};

const acceptFriendRequest = (requestId) => {
  const friendRequests =
    JSON.parse(localStorage.getItem(LOCALSTORAGE.FRIENDREQUEST)) || [];
  const requestIndex = friendRequests.findIndex(
    (request) => request.id === requestId
  );

  if (requestIndex !== -1) {
    friendRequests[requestIndex].status = "accepted";

    const currentUser = JSON.parse(
      localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER)
    );
    const requestingUser = findUser(friendRequests[requestIndex].from);

    currentUser.friends = [...currentUser.friends, requestingUser.username];
    requestingUser.friends = [...requestingUser.friends, currentUser.username];

    editUser(currentUser.username, currentUser);
    editUser(requestingUser.username, requestingUser);
    friendRequests.splice([requestIndex].from);
    localStorage.setItem(
      LOCALSTORAGE.FRIENDREQUEST,
      JSON.stringify(friendRequests)
    );
    localStorage.setItem(
      LOCALSTORAGE.LOGGEDINUSER,
      JSON.stringify(currentUser)
    );
  }
};

const rejectFriendRequest = (requestId) => {
  const friendRequests =
    JSON.parse(localStorage.getItem(LOCALSTORAGE.FRIENDREQUEST)) || [];
  const updatedRequests = friendRequests.splice(
    (request) => request.id !== requestId
  );

  localStorage.setItem(
    LOCALSTORAGE.FRIENDREQUEST,
    JSON.stringify(updatedRequests)
  );
};

export {
  getFriend,
  renderFriends,
  sendFriendRequest,
  editUser,
  acceptFriendRequest,
  rejectFriendRequest,
};
