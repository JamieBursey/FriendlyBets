import React from "react";
import Avatar from "react-avatar";
import { LOCALSTORAGE } from "../Config";

const loggedUser = JSON.parse(localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER));
const avatarComponent = () => {
  const textSize = {
    fontSize: "100px",
    fontWeight: "bold",
  };
  return (
    <div className="text-center mt-3">
      <Avatar
        round={true}
        size="200"
        name={loggedUser.username}
        textSize={textSize}
      />
    </div>
  );
};

export { avatarComponent };
