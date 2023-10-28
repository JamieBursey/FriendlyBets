import { render } from "@testing-library/react";
import {
  findUser,
  addFriend,
  loggedInUserKey,
  getAllUsers,
  editUser,
} from "../Data";

const addUsersFriend = (username) => {
  console.log("Adding friend with id", username);
  const friendUserObj = findUser(username);
  const loggedInUserStr = localStorage.getItem(loggedInUserKey);
  const loggedInUserObj = JSON.parse(loggedInUserStr);
  console.log("Adding friend with properties", friendUserObj);
  addFriend(friendUserObj, loggedInUserObj);
};

const AddFriends = () => {
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
  return <div>{renderFriends()}</div>;
};

export { AddFriends };
