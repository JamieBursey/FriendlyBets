import { LOCALSTORAGE } from "../Config";
import { findUser, getAllUsers } from "./RegisteredUser";
import { supabase } from "../supabaseClient";
const getFriend = (username) => {
  return { username: "", password: "" };
};
const deleteFriend = async (friendId, currentUser, setCurrentUser) => {
  if (!friendId || !currentUser.public_user_id) {
    console.error("friendId or currentUser.public_user_id is missing!");
    return;
  }

  try {
    // Fetch current user data
    const { data: currentUserData, error: currentUserError } = await supabase
      .from("users")
      .select("friends")
      .eq("public_user_id", currentUser.public_user_id)
      .single();

    if (currentUserError) {
      console.error("Error fetching current user data:", currentUserError);
      return;
    }

    // Fetch the friend user data
    const { data: friendUserData, error: friendUserError } = await supabase
      .from("users")
      .select("friends")
      .eq("public_user_id", friendId)
      .single();

    if (friendUserError) {
      console.error("Error fetching friend user data:", friendUserError);
      return;
    }

    // Remove the friend from the current user's friends array
    const updatedCurrentUserFriends = currentUserData.friends.filter(
      (friend) => friend.public_user_id !== friendId
    );

    // Remove the current user from the friend's friends array
    const updatedFriendUserFriends = friendUserData.friends.filter(
      (friend) => friend.public_user_id !== currentUser.public_user_id
    );

    // Update the current user's friends array in the database
    const { error: updateCurrentUserError } = await supabase
      .from("users")
      .update({ friends: updatedCurrentUserFriends })
      .eq("public_user_id", currentUser.public_user_id);

    if (updateCurrentUserError) {
      console.error(
        "Error updating current user's friends:",
        updateCurrentUserError
      );
      return;
    }

    // Update the friend's friends array in the database
    const { error: updateFriendUserError } = await supabase
      .from("users")
      .update({ friends: updatedFriendUserFriends })
      .eq("public_user_id", friendId);

    if (updateFriendUserError) {
      console.error("Error updating friend's friends:", updateFriendUserError);
      return;
    }

    // Update the local state
    const updatedCurrentUser = {
      ...currentUser,
      friends: updatedCurrentUserFriends,
    };
    setCurrentUser(updatedCurrentUser);
    alert("Friend removed");
  } catch (error) {
    console.error("Error deleting friend:", error);
  }
};

const RenderFriendList = ({ currentUser, setCurrentUser }) => {
  if (!currentUser.friends || currentUser.friends.length === 0) {
    return (
      <div
        className="container p-2"
        style={{
          borderRadius: "5px",
          backgroundColor: "#1E1E1E",
          height: "100vh",
        }}
      >
        <h1 className="text-info text-center">Please Add Friends</h1>
      </div>
    );
  }
  return (
    <div className="container p-2">
      {/* Header Row */}
      <div
        className="row mb-1 align-items-center mx-auto bg-white"
        style={{ borderRadius: "5px", width: "90%" }}
      >
        <div className="col d-flex justify-content-start">
          <h6>Name</h6>
        </div>
        <div className="col d-flex justify-content-center">
          <h6>Email</h6>
        </div>
        <div className="col d-flex justify-content-end">
          <h6 className="me-2">Details</h6>
        </div>
      </div>

      {currentUser.friends.map((friend) => (
        <div
          key={friend.public_user_id}
          className="row mb-1 align-items-center mx-auto bg-white"
          style={{ borderRadius: "5px", width: "90%" }}
        >
          <div className="col d-flex justify-content-start">
            <h6 className="fw-bold fst-italic">{friend.username}</h6>
          </div>

          <div className="col d-flex justify-content-center">
            <p>{friend.email}</p>
          </div>

          {/* Details */}
          <div className="col d-flex justify-content-end">
            <button
              className="btn btn-sm btn-outline-primary"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#collapseDetail${friend.public_user_id}`}
              aria-expanded="false"
              aria-controls={`collapseDetail${friend.public_user_id}`}
            >
              Details
            </button>
          </div>

          {/* Dropdown */}
          <div className="col-12">
            <div
              className="collapse"
              id={`collapseDetail${friend.public_user_id}`}
            >
              <div className="card card-body">
                <div className="mb-2 text-center">
                  <img
                  alt="Favorite Team Logo"
                    src={friend.favoriteTeam}
                    style={{ maxWidth: "40px", maxHeight: "40px" }}
                  />
                </div>
                <div
                  className="card text-center w-100 mx-auto mt-2 mb-3"
                  style={{
                    backgroundColor: "#F7F7F7",
                    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                    borderRadius: "5px",
                  }}
                >
                  <div
                    className="card-header"
                    style={{
                      backgroundColor: "#EEEEEE",
                      color: "#333333",
                    }}
                  >
                    About
                  </div>
                  <div className="card-body">
                    <p
                      className="card-text text-black"
                      style={{ overflow: "auto" }}
                    >
                      {friend.aboutMe
                        ? friend.aboutMe
                        : `${friend.username} has not updated their about section.`}
                    </p>
                  </div>
                </div>
                <div className="col-12 col-md-4 mx-auto">
                  <button
                    onClick={() =>
                      deleteFriend(
                        friend.public_user_id,
                        currentUser,
                        setCurrentUser
                      )
                    }
                    className="btn btn-outline-danger w-100"
                  >
                    Remove Friend
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const editUser = (username, newUserObj) => {
  // TODO: search all functions that still work based on username and replace them with email
  let userFound = findUser(username);
  // Get All User Array
  const allUserArray = getAllUsers();
  let temporaryArrayUsers = allUserArray.filter(
    (user) => user.username !== userFound.username
  );
  temporaryArrayUsers.push(newUserObj);
  // Push the new array of users back to the local storage using localStorage.setItem(allUserKey, JSON.stringify(allUsers))
  localStorage.setItem(LOCALSTORAGE.USERS, JSON.stringify(temporaryArrayUsers));
};
const sendFriendRequest = async (toUserName) => {
  const { data: loggedInUser, error: currentUserError } =
    await supabase.auth.getUser();

  if (currentUserError) {
    alert("Error fetching current user");
    return;
  }

  const { data: toUser, error: toUserError } = await supabase
    .from("users")
    .select("id")
    .eq("username", toUserName)
    .single();

  if (toUserError) {
    alert("User not found");
    return;
  }

  const { error } = await supabase.from("friend_requests").insert([
    {
      from_user: loggedInUser.id,
      to_user: toUser.id,
      status: "pending",
    },
  ]);

  if (error) {
    alert("Error sending friend request");
  } else {
    alert("Friend request sent");
  }
};

const acceptFriendRequest = async (requestId, callBack) => {
  try {
    // Call the Postgres function to accept the friend request
    const { error } = await supabase
      .rpc('accept_friend_request', { request_id: requestId });

    if (error) {
      console.error("Error accepting friend request:", error);
      alert("Error accepting friend request");
      return;
    }

    callBack();
    alert("Friend request accepted");
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("Error accepting friend request");
  }
};

const rejectFriendRequest = async (requestId) => {
  // Fetch the friend request details
const { error: requestError } = await supabase
  .from("friend_requests")
  .select("*")
  .eq("id", requestId)
  .single();

  if (requestError) {
    console.error("Error fetching friend request:", requestError);
    return;
  }

  // Delete the friend request from the database
  const { error: deleteError } = await supabase
    .from("friend_requests")
    .delete()
    .eq("id", requestId);

  if (deleteError) {
    console.error("Error rejecting friend request:", deleteError);
    return;
  }

  // Call the callback function to update the state
  alert("Friend request rejected");
};

export {
  getFriend,
  sendFriendRequest,
  editUser,
  acceptFriendRequest,
  rejectFriendRequest,
  RenderFriendList,
};
