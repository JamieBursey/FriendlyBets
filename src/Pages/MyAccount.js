import React from "react";
import { LOCALSTORAGE } from "../Config";

function MyAccount() {
  const renderFriends = () => {
    const currentUser = JSON.parse(
      localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER)
    );
    const friendList = currentUser.friends;
    return (
      <>
        <div className="text-center fs-1 text-danger">Friends</div>
        <div className="App p-3 mb-3"></div>
        <div className="App p-3"></div>
      </>
    );
  };
  return <div>{renderFriends()}</div>;
}

export { MyAccount };
