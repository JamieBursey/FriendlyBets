import React, { useState, useEffect } from "react";
import {
  AvatarComponent,
  DisplayName,
  MyAccEmail,
  RenderAboutMe,
  NavigateToUpdate,
} from "../Components";
import { LOCALSTORAGE } from "../Config";

function MyAccount() {
  const [loggedUser, setLoggedUser] = useState({});

  useEffect(() => {
    const currentLoggedUser = JSON.parse(
      localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER)
    );
    setLoggedUser(currentLoggedUser);
  }, []);

  return (
    <>
      <AvatarComponent user={loggedUser} />
      <DisplayName user={loggedUser} />
      <MyAccEmail user={loggedUser} />
      <RenderAboutMe user={loggedUser} />
      <NavigateToUpdate />
    </>
  );
}

export { MyAccount };
