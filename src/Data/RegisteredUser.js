const loggedInUserKey = "LOGGEDIN_USER";
const allUsersKey = "ALL_USERS";

const getAllUsers = () => {
  const allUsersStr = localStorage.getItem(allUsersKey); // "[{"id": 11}, {"id": 22}]"
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
    // if find matches, then single obj [{id: "", ....}] if not []
    return foundUser; // extract single found user obj {id: "", ....}
  }
};

const checkUserPassword = (userPassword, inputPassword) => {
  if (userPassword === inputPassword) {
    return true;
  } else {
    return false;
  }
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
  localStorage.setItem(allUsersKey, JSON.stringify(temporaryArrayUsers));
};

const addFriend = (friendUserObj, loggedInUserObj) => {
  // friendUserObj.username => loggedInUserObj.friends
  // loggedInUserObj => allUsers

  const currentFriendsUsernameList = loggedInUserObj.friends || [];
  let friendAlreadyExist = false;
  currentFriendsUsernameList.forEach((friendUsername) => {
    if (friendUsername === friendUserObj.username) {
      alert("Friend already exist");
      friendAlreadyExist = true;
    }
  });
  if (friendAlreadyExist === false) {
    currentFriendsUsernameList.push(friendUserObj.username);

    let newLoggedInUserObj = loggedInUserObj;
    newLoggedInUserObj.friends = currentFriendsUsernameList;

    editUser(loggedInUserObj.username, newLoggedInUserObj);
  }
};

export {
  loggedInUserKey,
  allUsersKey,
  getAllUsers,
  checkUserPassword,
  findUser,
  addFriend,
  editUser,
};
