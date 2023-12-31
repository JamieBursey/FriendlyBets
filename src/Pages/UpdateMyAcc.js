import {
  MyAccountChanges,
  AboutMeComponent,
  AvatarComponent,
} from "../Components";

function UpdateMyAccount() {
  return (
    <>
      <div>{AvatarComponent()}</div>
      <div>{MyAccountChanges()}</div>
      <div>{AboutMeComponent()}</div>
    </>
  );
}

export { UpdateMyAccount };
