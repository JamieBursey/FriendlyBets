import React from "react";
import Avatar from "react-avatar";
import { LOCALSTORAGE } from "../Config";
import { useState } from "react";

const loggedUser = JSON.parse(localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER));
const allUsers = JSON.parse(localStorage.getItem(LOCALSTORAGE.USERS));
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
    console.log("change");
  };

  const emailChange = (event) => {
    setEmail(event.target.value);
    console.log("change2");
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

  const updateEmail = () => {
    const checkEmails = allUsers.some((user) => user.email === email);
    if (checkEmails) {
      alert("Email in Use");
      return;
    }

    const newEmail = {
      ...loggedUser,
      email: email,
    };
    const updatedUsers = allUsers.map((user) =>
      user.username === loggedUser.username ? newEmail : user
    );
    localStorage.setItem(LOCALSTORAGE.USERS, JSON.stringify(updatedUsers));
    localStorage.setItem(LOCALSTORAGE.LOGGEDINUSER, JSON.stringify(newEmail));
    console.log(allUsers);
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
            onClick={updateDisplayName}
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
            onChange={emailChange}
            aria-label="Recipient's email"
            aria-describedby="button-addon3"
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={updateEmail}
            id="button-addon3"
          >
            Change Email
          </button>
        </div>
      </div>
    </>
  );
};

const AboutMeComponent = () => {
  const [aboutMe, setAboutMe] = useState(loggedUser.aboutMe || "");
  const addAboutMe = (event) => {
    setAboutMe(event.target.value);
  };
  const updateAboutMe = () => {
    const addNewAboutMe = {
      ...loggedUser,
      aboutMe: aboutMe,
    };
    localStorage.setItem(
      LOCALSTORAGE.LOGGEDINUSER,
      JSON.stringify(addNewAboutMe)
    );
    const updatedUsers = allUsers.map((user) =>
      user.aboutMe === loggedUser.AboutMe ? addNewAboutMe : user
    );
    localStorage.setItem(LOCALSTORAGE.USERS, JSON.stringify(updatedUsers));
  };
};

export { avatarComponent, displayName, myAccEmail, MyAccountChanges };
