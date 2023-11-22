import { LOCALSTORAGE } from "../Config";
import { getAllUsers } from "../Data";

const acceptBets = (betId, friendUserName) => {
  let allUsers = getAllUsers();
  let currentUser = JSON.parse(localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER));

  currentUser.bets.forEach((bet) => {
    if (bet.betId === betId) {
      bet.betStatus = "active";
    }
  });
  localStorage.setItem(LOCALSTORAGE.USERS, JSON.stringify(allUsers));
  localStorage.setItem(LOCALSTORAGE.LOGGEDINUSER, JSON.stringify(currentUser));
};

export { acceptBets };
