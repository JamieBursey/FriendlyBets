import { LOCALSTORAGE } from "../Config";

const acceptBets = (betId, friendUserName, callback) => {
  let allBets = JSON.parse(localStorage.getItem(LOCALSTORAGE.BETS));

  let betIndex = allBets.findIndex((bet) => bet.betId === betId);
  if (betIndex !== -1) {
    allBets[betIndex].betStatus = "active";
  }
  localStorage.setItem(LOCALSTORAGE.BETS, JSON.stringify(allBets));

  if (callback) {
    callback();
  }
};

export { acceptBets };
