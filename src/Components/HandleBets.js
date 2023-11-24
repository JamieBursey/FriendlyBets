import { LOCALSTORAGE } from "../Config";
import { getAllUsers } from "../Data";

const acceptBets = (betId, friendUserName) => {
  let allUsers = getAllUsers();
  let currentUser = JSON.parse(localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER));
  const betIndex = currentUser.bets.findIndex((bet) => bet.betId === betId);
  if (betIndex !== -1) {
    currentUser.bets[betIndex].betStatus = "active";
  }

  let currentUserInAllUsers = allUsers.find(
    (user) => user.username === currentUser.username
  );
  if (currentUserInAllUsers) {
    let currentUserUpdate = currentUserInAllUsers.bets.findIndex(
      (bet) => bet.betId === betId
    );
    if (currentUserUpdate !== -1) {
      currentUserInAllUsers.bets[currentUserUpdate].betStatus = "active";
    }
  }

  let friendUser = allUsers.find((user) => user.username === friendUserName);
  if (friendUser) {
    friendUser.bets.push({ ...currentUser.bets[betIndex] });
  }

  localStorage.setItem(LOCALSTORAGE.USERS, JSON.stringify(allUsers));
  localStorage.setItem(LOCALSTORAGE.LOGGEDINUSER, JSON.stringify(currentUser));
};

export { acceptBets };
