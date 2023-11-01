import { loggedInUserKey, getAllUsers, editUser } from "../Data";

const AddFriends = () => {
  const loggedInStr = localStorage.getItem(loggedInUserKey);
  const loggedInUser = JSON.parse(loggedInStr);
  const addFriend = (friendUserObj, loggedInUserObj) => {
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
  const renderUsers = () => {
    let allUsers = getAllUsers();

    return allUsers.map((player) => (
      <div key={player["username"]} className="col fs-4 text-danger ">
        <div className="row">
          <div className="col">{player["username"]}</div>
          <div className="col">
            <button onClick={() => addFriend(player, loggedInUser)}>
              Add Friend
            </button>
          </div>
        </div>
      </div>
    ));
  };
  return <div>{renderUsers()}</div>;
};

export { AddFriends };
