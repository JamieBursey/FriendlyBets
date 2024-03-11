import { backgroundGradient } from "../Components";
import { LOCALSTORAGE } from "../Config";
import { findUser, getAllUsers } from "./RegisteredUser";
import backgroundColor from "../Pages/Register";
const friendsGradient = {
  background: "linear-gradient(to bottom, #0B1305 60%, #1e90ff 100%)",
  borderRadius: "1rem",
};
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
  if (!currentUser.friends || currentUser.friends.length === 0) {
    return (
      <div
        className="container p-2"
        style={{
          borderRadius: "5px",
          backgroundColor: "#1E1E1E",
          height: "100vh",
        }}
      >
        <h1 className="text-info text-center">Please Add Friends</h1>
      </div>
    );
  }
  return (
    <div className="container p-2">
      {/* Header Row */}
      <div
        className="row mb-1 align-items-center mx-auto bg-white"
        style={{ borderRadius: "5px", width: "90%" }}
      >
        <div className="col d-flex justify-content-start">
          <h6>Name</h6>
        </div>
        <div className="col d-flex justify-content-center">
          <h6>Email</h6>
        </div>
        <div className="col d-flex justify-content-end">
          <h6 className="me-2">Details</h6>
        </div>
      </div>

      {currentUser.friends.map((friendUsername, index) => {
        let friendUser = allUsers.find(
          (user) => user.username === friendUsername
        );
        return friendUser ? (
          <div
            key={friendUser.email}
            className="row mb-1 align-items-center mx-auto bg-white"
            style={{ borderRadius: "5px", width: "90%" }}
          >
            <div className="col d-flex justify-content-start">
              <h6 className="fw-bold fst-italic">{friendUser.username}</h6>
            </div>

            <div className="col d-flex justify-content-center">
              <p>{friendUser.email}</p>
            </div>

            {/* Details*/}
            <div className="col d-flex justify-content-end">
              <button
                className="btn btn-sm btn-outline-primary"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapseDetail${index}`}
                aria-expanded="false"
                aria-controls={`collapseDetail${index}`}
              >
                Details
              </button>
            </div>

            {/* Dropdown*/}
            <div className="col-12">
              <div className="collapse" id={`collapseDetail${index}`}>
                <div className="card card-body">
                  <div className="mb-2 text-center">
                    <img
                      src={friendUser.favoriteTeam}
                      style={{ maxWidth: "40px", maxHeight: "40px" }}
                    />
                  </div>
                  <div
                    className="card text-center w-50 mx-auto mt-2 mb-3"
                    style={{
                      backgroundColor: "#F7F7F7",
                      boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                      borderRadius: "5px",
                    }}
                  >
                    <div
                      className="card-header"
                      style={{
                        backgroundColor: "#EEEEEE",
                        color: "#333333",
                      }}
                    >
                      About
                    </div>
                    <div className="card-body">
                      <p
                        className="card-text text-black"
                        style={{ overFlow: "auto" }}
                      >
                        {friendUser.aboutMe
                          ? friendUser.aboutMe
                          : `${friendUser.username} has not updated their about section.`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      deleteFriend(
                        friendUser.username,
                        currentUser,
                        setLoggedInUser
                      )
                    }
                    className="btn btn-outline-danger w-25 mx-auto"
                  >
                    Remove Friend
                  </button>
                </div>
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
  alert("Friend request sent.");
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
