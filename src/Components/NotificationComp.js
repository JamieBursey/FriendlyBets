import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { acceptFriendRequest, rejectFriendRequest } from "../Data";

const FriendRequests = () => {
  const [requests, setRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        return;
      }
      if (sessionData && sessionData.session) {
        const authUser = sessionData.session.user;

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("email", authUser.email)
          .single();

        if (userError) {
          console.error("Error fetching user from users table:", userError);
          return;
        }


        setCurrentUser(userData);
        fetchFriendRequests(userData.id);
      } else {
       return
      }
    };

    fetchCurrentUser();
  }, []);

  const fetchFriendRequests = async (userId) => {

    const { data: friendRequests, error } = await supabase
      .from("friend_requests")
      .select(
        `
        id,
        from_user,
        to_user,
        status,
        users!friend_requests_from_user_fkey (username)
      `
      )
      .eq("to_user", userId)
      .eq("status", "pending");

    if (error) {
      console.error("Error fetching friend requests:", error);
    } else {

      setRequests(friendRequests);
    }
  };

  const handleAccept = async (requestId) => {
    await acceptFriendRequest(requestId, async () => {
      setRequests(requests.filter((request) => request.id !== requestId));
      const { data: updatedUser, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching updated user:", error);
      } else {
        setCurrentUser(updatedUser.user);
      }
    });
  };

  const handleRejectFriend = async (requestId) => {
    await rejectFriendRequest(requestId);
    setRequests(requests.filter((request) => request.id !== requestId));
  };

  return (
    <div className="container mt-3">
      <div className="row">
        {requests.length > 0 ? (
          requests.map((request) => (
            <div key={request.id} className="col-md-4 mb-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title text-info">
                    {request.users.username}
                  </h5>
                  <p className="card-text">Would like to be your friend</p>
                  <button
                    onClick={() => handleAccept(request.id)}
                    className="btn btn-primary mr-2"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectFriend(request.id)}
                    className="btn btn-secondary mx-2"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>
            <h2 className="text-center text-info">
              Sorry, it seems you have no friend requests
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export { FriendRequests };
