import { useState, useEffect } from "react";
import { LOCALSTORAGE } from "../Config";
import {
  MyAccountChanges,
  AboutMeComponent,
  AvatarComponent,
  UpdateFavTeam,
} from "../Components";

function UpdateMyAccount() {
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
      <MyAccountChanges />
      <UpdateFavTeam />
      <AboutMeComponent />
    </>
  );
}

export { UpdateMyAccount };
