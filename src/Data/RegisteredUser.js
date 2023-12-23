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
            className="col-sm-12 col-md-6 col-lg-4 mb-3"
          >
            <div className="card bg-success">
              <div className="card-body text-center">
                <h5 className="card-title">{friendUser.username}</h5>
                <p className="card-text">{friendUser.email}</p>
                <button
                  onClick={() =>
                    deleteFriend(
                      friendUser.username,
                      currentUser,
                      setLoggedInUser
                    )
                  }
                  className="btn btn-danger"
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

export {
  getAllUsers,
  checkUserPassword,
  findUser,
  findUserByEmail,
  renderFriendList,
};
