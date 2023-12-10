import React from "react";
import { useState, useEffect } from "react";
import { LOCALSTORAGE } from "../Config";
import { renderFriendList } from "../Data";

function MyAccount() {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER))
  );
  const renderFriends = () => {
    console.log("renderFriends", currentUser.friends);
    return (
      <>
        <div className="text-center fs-1 text-danger">Friends</div>
        <div className="App p-3 mb-3">
          {currentUser ? renderFriendList(currentUser, setCurrentUser) : null}
        </div>

        <div className="App p-3"></div>
      </>
    );
  };
  return <div>{renderFriends()}</div>;
}

export { MyAccount };
