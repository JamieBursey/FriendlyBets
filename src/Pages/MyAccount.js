import React from "react";
import {
  avatarComponent,
  displayName,
  myAccEmail,
  MyAccountChanges,
} from "../Components";

function MyAccount() {
  return (
    <>
      <div>{avatarComponent()}</div>;<div>{displayName()}</div>
      <div>{myAccEmail()}</div>
      <div>{MyAccountChanges()}</div>
    </>
  );
}

export { MyAccount };
