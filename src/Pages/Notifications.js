import { FriendRequests } from "../Components/NotificationComp";
import { AdminMessages } from "../Components/ContactComponent";

const RenderRequests = () => {
  return (
    <div>
      <FriendRequests />
      <AdminMessages />
    </div>
  );
};

export { RenderRequests };
