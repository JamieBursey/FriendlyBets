import { LOCALSTORAGE } from "../Config";

const getAllBets = () => {
  const Bets = localStorage.getItem(LOCALSTORAGE.BETS); // "[{"id": 11}, {"id": 22}]"
  let allUsers = JSON.parse(Bets);
  if (Bets === "" || allUsers == null) {
    allUsers = [];
  }
  return allUsers;
};

export { getAllBets };
