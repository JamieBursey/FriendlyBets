import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LOCALSTORAGE } from "../Config";
import {
  AvatarComponent,
  MyAccountChanges,
  AboutMeComponent,
  UpdateFavTeam,
} from "../Components";

function UpdateMyAccount() {
  const navigate = useNavigate();
  const [loggedUser, setLoggedUser] = useState({});
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: "",
    aboutMe: "",
    favoriteTeam: "",
  });

  useEffect(() => {
    const currentLoggedUser = JSON.parse(
      localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER)
    );
    if (currentLoggedUser) {
      setLoggedUser(currentLoggedUser);
      setUserDetails({
        username: currentLoggedUser.username || "",
        email: currentLoggedUser.email || "",
        password: currentLoggedUser.password || "",
        aboutMe: currentLoggedUser.aboutMe || "",
        favoriteTeam: currentLoggedUser.favoriteTeam || "",
      });
    }
  }, []);

  const handleUserDetailChange = (field, value) => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handleUpdateAll = () => {
    const updatedDetails = {
      username: userDetails.username || loggedUser.username,
      email: userDetails.email || loggedUser.email,
      password: userDetails.password || loggedUser.password,
      aboutMe: userDetails.aboutMe || loggedUser.aboutMe,
      favoriteTeam: userDetails.favoriteTeam || loggedUser.favoriteTeam,
    };

    // Update LOCALSTORAGE LOGGEDINUSER
    localStorage.setItem(
      LOCALSTORAGE.LOGGEDINUSER,
      JSON.stringify(updatedDetails)
    );

    // Update LOCALSTORAGE all users
    const allUsers = JSON.parse(
      localStorage.getItem(LOCALSTORAGE.USERS) || "[]"
    );
    const updatedUsers = allUsers.map((user) =>
      user.username === updatedDetails.username ? updatedDetails : user
    );
    localStorage.setItem(LOCALSTORAGE.USERS, JSON.stringify(updatedUsers));

    // Navigate to MyAccount page
    navigate("/MyAccount");
  };

  return (
    <>
      <div className="container bg-dark p-3">
        <AvatarComponent user={userDetails} />
        <MyAccountChanges
          userDetails={userDetails}
          onUserDetailChange={handleUserDetailChange}
        />
        <UpdateFavTeam
          favoriteTeam={userDetails}
          onUserDetailChange={handleUserDetailChange}
        />
        <AboutMeComponent
          userDetails={userDetails}
          onUserDetailChange={handleUserDetailChange}
        />
        <button
          onClick={handleUpdateAll}
          className="btn btn-primary d-block mx-auto"
        >
          Save Changes
        </button>
      </div>
    </>
  );
}

export { UpdateMyAccount };
