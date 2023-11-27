import { LOCALSTORAGE } from "../Config";

const acceptBets = (betId, friendUserName) => {
  let allBets = JSON.parse(localStorage.getItem(LOCALSTORAGE.BETS));

  let betIndex = allBets.findIndex((bet) => bet.betId === betId);
  if (betIndex !== -1) {
    allBets[betIndex].betStatus = "active";
  }
  localStorage.setItem(LOCALSTORAGE.BETS, JSON.stringify(allBets));
};

export { acceptBets };
