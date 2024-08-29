import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { RenderFriendList } from "../Data";

const HeaderStyle = {
  fontSize: "3rem",
  fontWeight: "bold",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  letterSpacing: "0.1em",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  background: "linear-gradient(45deg, #00b4d8, #90e0ef)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  display: "inline",
};

const handleSendFriendRequest = async (email, onSuccess) => {
  console.log("Searching for user with email:", email);
  const { data: userToRequest, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (userError || !userToRequest) {
    console.error("Error fetching user to request:", userError);
    alert("User Not Found");
    return;
  }

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError || !sessionData || !sessionData.session) {
    console.error("Error fetching session:", sessionError);
    alert("Error fetching session");
    return;
  }

  const currentUser = sessionData.session.user;
  const { data: currentUserData, error: currentUserError } = await supabase
    .from("users")
    .select("*")
    .eq("public_user_id", currentUser.id)
    .single();

  if (currentUserError || !currentUserData) {
    console.error(
      "Error fetching current user from users table:",
      currentUserError
    );
    alert("Error fetching current user");
    return;
  }

  console.log("Current User Data from users table:", currentUserData);

  const userId = currentUserData.id;

  console.log("Current User ID:", userId);
  console.log("User to request ID:", userToRequest.id);

  const { error: friendRequestError } = await supabase
    .from("friend_requests")
    .insert([
      {
        from_user: userId,
        to_user: userToRequest.id,
        status: "pending",
      },
    ]);

  if (friendRequestError) {
    console.error("Error sending friend request:", friendRequestError);
    alert("Error sending friend request");
  } else {
    alert("Friend request sent");
    onSuccess();
  }
};

const fetchFriends = async (userId, setFriends) => {
  if (!userId) {
    console.error("fetchFriends called with undefined userId");
    return;
  }

  const { data, error } = await supabase
    .from("users")
    .select("friends")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching friends:", error);
  } else {
    const friends = data.friends || [];
    setFriends(friends);
  }
};

const AddFriends = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [email, setEmail] = useState("");
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        return;
      }
      if (sessionData && sessionData.session) {
        const user = sessionData.session.user;
        console.log("Fetched session user:", user);

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("public_user_id", user.id)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError);
        } else {
          console.log("Fetched user:", userData);
          setCurrentUser(userData);
          fetchFriends(userData.id, setFriends);
        }
      }
    };

    fetchCurrentUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session && session.user) {
          console.log("Auth state change detected, updating user data");
          const fetchUserData = async () => {
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("*")
              .eq("public_user_id", session.user.id)
              .single();

            if (userError) {
              console.error("Error fetching user data:", userError);
            } else {
              console.log("Fetched user on auth change:", userData);
              setCurrentUser(userData);
              fetchFriends(userData.id, setFriends);
            }
          };
          fetchUserData();
        } else {
          console.log("Auth state change detected, no user");
          setCurrentUser(null);
          setFriends([]);
        }
      }
    );

    return () => {
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const onSuccess = () => {
    setEmail("");
    if (currentUser) {
      fetchFriends(currentUser.id, setFriends);
    }
  };

  return (
    <div>
      <div className="text-center">
        <p style={HeaderStyle}>Friends</p>
      </div>
      <div className="input-group mb-3 mx-auto" style={{ maxWidth: "90%" }}>
        <input
          type="email"
          className="form-control form-control-sm"
          placeholder="Friends Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ flex: "1 1 auto" }}
        />
        <div className="input-group-append">
          <button
            className="btn btn-outline-success btn-sm"
            onClick={() => handleSendFriendRequest(email, onSuccess)}
            type="button"
            style={{ flex: "0 0 auto" }}
          >
            Add Friend
          </button>
        </div>
      </div>
      {currentUser && (
        <div>
          <p className="container text-white fs-6 w-75">
            <FontAwesomeIcon icon={faUserGroup} /> {friends.length}
          </p>
          <div className="container p-2">
            <RenderFriendList
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              setFriends={setFriends}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export { AddFriends, handleSendFriendRequest };
