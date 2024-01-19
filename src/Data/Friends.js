import { LOCALSTORAGE } from "../Config";
import { findUser, getAllUsers } from "./RegisteredUser";

const getFriend = (username) => {
  return { username: "", password: "" };
};
const deleteFriend = (friendUsername, currentUser, setLoggedInUser) => {
  // Get all users
  const allUsers = getAllUsers();
  //fetch friend
  let friendUser = allUsers.filter(
    (user) => user.username === friendUsername
  )[0];

  // modify currentUser friend list
  const updatedFriends = (currentUser.friends = currentUser.friends.filter(
    (username) => username !== friendUser.username
  ));
  const currenUserUpdate = {
    ...currentUser,
    friends: updatedFriends,
  };

  // modify friendUser friend list
  friendUser.friends = friendUser.friends.filter(
    (username) => username !== currentUser.username
  );

  // Get rid of the original currentUser and friendUser
  let temporaryArrayUsers = allUsers.filter(
    (user) =>
      user.username !== currentUser.username &&
      user.username !== friendUser.username
  );

  //push back the new values
  temporaryArrayUsers.push(currenUserUpdate);
  temporaryArrayUsers.push(friendUser);

  // Push the new array of users back to the local storage using localStorage.setItem(allUserKey, JSON.stringify(allUsers))
  localStorage.setItem(LOCALSTORAGE.USERS, JSON.stringify(temporaryArrayUsers));
  localStorage.setItem(LOCALSTORAGE.LOGGEDINUSER, JSON.stringify(currentUser));

  console.log("modifying LoggedInUser to rerender list of cards", currentUser);
  setLoggedInUser(currenUserUpdate);
};
const renderFriendList = (currentUser, setLoggedInUser) => {
  const allUsers = getAllUsers();
  return (
    <div className="row">
      {currentUser.friends.map((friendUsername) => {
        let friendUser = allUsers.find(
          (user) => user.username === friendUsername
        );
        return friendUser ? (
          <div
            key={friendUser.email}
            className="col-xs-4 col-sm-4 col-sm-4 col-md col-lg mb-3 ms-2"
          >
            <div className="card bg-white h-100">
              <div className="card-body text-center">
                <h5 className="card-title">{friendUser.username}</h5>
                <p className="card-text">{friendUser.email}</p>
                <div>
                  <img
                    src={friendUser.favoriteTeam}
                    style={{ maxWidth: "40px", maxHeight: "40px" }}
                  />
                </div>
                <div
                  className="card text-center bg-gradient mx-auto mt-2 mb-3"
                  style={{ maxWidth: "18rem", backgroundColor: "#d6d6d6" }}
                >
                  <div className="card-header">About</div>
                  <div className="card-body">
                    <p
                      className="card-text bg-dark text-info"
                      style={{ overFlow: "auto" }}
                    >
                      {friendUser.aboutMe}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <button
                  onClick={() =>
                    deleteFriend(
                      friendUser.username,
                      currentUser,
                      setLoggedInUser
                    )
                  }
                  className="btn btn-outline-danger mb-2 w-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ) : null;
      })}
    </div>
  );
};
const editUser = (username, newUserObj) => {
  // TODO: search all functions that still work based on username and replace them with email
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
  const fromUserEmail = loggedInUser.email;
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
  if (loggedInUser.username === toUserName) {
    alert("Can Not Add yourself");
    return;
  }

  const newRequest = {
    id: `${fromUserName}_${toUserName}`,
    from: fromUserName,
    to: toUserName,
    email: fromUserEmail,
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

const acceptFriendRequest = (requestId, callBack) => {
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

    if (
      !currentUser.friends.some(
        (friend) => friend.username === requestingUser.username
      )
    ) {
      currentUser.friends.push(requestingUser.username);
    }
    if (
      !requestingUser.friends.some(
        (friend) => friend.username === currentUser.username
      )
    ) {
      requestingUser.friends.push(currentUser.username);
    }

    editUser(currentUser.username, currentUser);
    editUser(requestingUser.username, requestingUser);
    friendRequests.splice(requestIndex, 1);
    localStorage.setItem(
      LOCALSTORAGE.FRIENDREQUEST,
      JSON.stringify(friendRequests)
    );
    callBack(currentUser);
  }
};

const rejectFriendRequest = (requestId) => {
  const friendRequests =
    JSON.parse(localStorage.getItem(LOCALSTORAGE.FRIENDREQUEST)) || [];
  const updatedRequests = friendRequests.filter(
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
  renderFriendList,
};
