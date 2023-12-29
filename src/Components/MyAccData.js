import React from "react";
import Avatar from "react-avatar";
import { LOCALSTORAGE } from "../Config";
import { useState } from "react";

const loggedUser = JSON.parse(localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER));

const displayName = () => {
  const name = loggedUser.username;
  return (
    <div className="text-center">
      <h6 className="fs-1 text-info">Display Name: {name}</h6>
    </div>
  );
};
const avatarComponent = () => {
  const textSize = {
    fontSize: "100px",
    fontWeight: "bold",
  };
  return (
    <div className="text-center">
      <Avatar
        round={true}
        size="150"
        name={loggedUser.username}
        textSize={textSize}
      />
    </div>
  );
};

const myAccEmail = () => {
  const userEmail = loggedUser.email;
  return <div className="text-center text-info fs-2">Email: {userEmail}</div>;
};

const MyAccountChanges = () => {
  const [email, setEmail] = useState(loggedUser.email || "");
  const [displayName, setDisplayName] = useState(loggedUser.username || "");
  const [password, setPassword] = useState("");

  const displayNameChange = (event) => {
    setDisplayName(event.target.value);
  };

  const updateDisplayName = () => {
    const updatedUserInfo = {
      ...loggedUser,
      username: displayName,
    };
    localStorage.setItem(
      LOCALSTORAGE.LOGGEDINUSER,
      JSON.stringify(updatedUserInfo)
    );
    console.log("updatedInfo");
  };

  return (
    <>
      <div className="d-flex justify-content-center">
        <div className="input-group mb-3 w-50">
          <input
            type="text"
            className="form-control"
            placeholder="Change Users Display Name"
            onChange={displayNameChange}
            aria-label="Recipient's username"
            aria-describedby="button-addon2"
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            id="button-addon2"
          >
            Change Name
          </button>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <div className="input-group mb-3 w-50">
          <input
            type="text"
            className="form-control "
            placeholder="Change Users email"
            aria-label="Recipient's email"
            aria-describedby="button-addon3"
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            id="button-addon3"
          >
            Change Email
          </button>
        </div>
      </div>
    </>
  );
};

export { avatarComponent, displayName, myAccEmail, MyAccountChanges };
