import { LOCALSTORAGE } from "../Config";

const getAllUsers = () => {
  const allUsersStr = localStorage.getItem(LOCALSTORAGE.USERS);
  let allUsers = JSON.parse(allUsersStr);
  if (allUsersStr === "" || allUsers == null) {
    allUsers = [];
  }
  return allUsers;
};
const findUser = (username) => {
  const allUsers = getAllUsers(); // [{id: "", ....} , {}]
  const foundUser = allUsers.find((user) => user.username === username);
  if (foundUser == null) {
    return null;
  } else {
    return foundUser;
  }
};
const findUserByEmail = (email) => {
  const allUsers = getAllUsers(); // [{id: "", ....} , {}]
  const foundUser = allUsers.find((user) => user.email === email);
  if (foundUser == null) {
    return null;
  } else {
    return foundUser;
  }
};

const checkUserPassword = (userPassword, inputPassword) => {
  if (userPassword === inputPassword) {
    return true;
  } else {
    return false;
  }
};

const deleteFriend = (friendUsername, currentUser, setLoggedInUser) => {
  // Get all users
  const allUsers = getAllUsers();
  //fetch friend
  let friendUser = allUsers.filter(
    (user) => user.username == friendUsername
  )[0];

  // modify currentUser friend list
  const updatedFriends = (currentUser.friends = currentUser.friends.filter(
    (username) => username != friendUser.username
  ));
  const currenUserUpdate = {
    ...currentUser,
    friends: updatedFriends,
  };

  // modify friendUser friend list
  friendUser.friends = friendUser.friends.filter(
    (username) => username != currentUser.username
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
  return currentUser.friends.map((friendUsername) => {
    let friendUser = allUsers.filter(
      (user) => user.username == friendUsername
    )[0];
    return friendUser ? (
      <div key={friendUser.email} className="bg-white w-25">
        <div className="bg-white">
          <p>Username: {friendUser.username}</p>
          <p>Email: {friendUser.email}</p>
        </div>
        <button
          onClick={() =>
            deleteFriend(friendUser.username, currentUser, setLoggedInUser)
          }
          className="delete-friend-btn"
        >
          Delete
        </button>
      </div>
    ) : null;
  });
};

export {
  getAllUsers,
  checkUserPassword,
  findUser,
  findUserByEmail,
  renderFriendList,
};
