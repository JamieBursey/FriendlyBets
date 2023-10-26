import { getAllUsers, loggedInUserKey } from "./RegisteredUser";
import { findUser, addFriend } from "./RegisteredUser";
const getAllFriends = [
  { username: "Jamie", password: "" },
  { username: "Kelly", password: "" },
  { username: "Paul", password: "" },
  { username: "Danyelle", password: "" },
  { username: "Dawson", password: "" },
];

const getFriend = (username) => {
  return { username: "", password: "" };
};

const setFriend = (username, password) => {
  return { username: username, password: password };
};

const addUsersFriend = (username) => {
  console.log("Adding friend with id", username);
  const friendUserObj = findUser(username);
  const loggedInUserStr = localStorage.getItem(loggedInUserKey);
  const loggedInUserObj = JSON.parse(loggedInUserStr);
  console.log("Adding friend with properties", friendUserObj);
  addFriend(friendUserObj, loggedInUserObj);
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
export { getAllFriends, getFriend, setFriend, renderFriends };
