import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { RenderFriendList } from "../Data";
import { useTheme } from "../Components/theme/ThemeContext"; // Import the useTheme hook

const handleSendFriendRequest = async (email, onSuccess) => {
  const { data: userToRequest, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

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
    console.error("Error fetching current user from users table:", currentUserError);
    alert("Error fetching current user");
    return;
  }

  const userId = currentUserData.id;

  // ✅ CASE 1: User exists → send friend request
  if (userToRequest) {
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
      return;
    }

    alert("Friend request sent");

    // Notify existing user
    await fetch("https://friendly-bets-back-end.vercel.app/api/friendRequest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toUserEmail: email,
        type: "friend_request",
      }),
    });

    onSuccess();
  } 
  // ✅ CASE 2: User not found → send invite
  else {
    console.log("User not found, sending invite email");

    await fetch("https://friendly-bets-back-end.vercel.app/api/inviteFriend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toUserEmail: email,
        type: "invite",  // new type
      }),
    });

    alert("Invitation sent to join FriendlyBets");
  }
};


const AddFriends = () => {
  const { theme } = useTheme(); // Get the current theme from ThemeContext
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

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("public_user_id", user.id)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError);
        } else {
          setCurrentUser(userData);
          fetchFriends(userData.id, setFriends);
        }
      }
    };

    fetchCurrentUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session && session.user) {
          const fetchUserData = async () => {
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("*")
              .eq("public_user_id", session.user.id)
              .single();

            if (userError) {
              console.error("Error fetching user data:", userError);
            } else {
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

  // Define inline styles for the page based on the theme
  const pageStyles = {
    light: {
      backgroundColor: "#ffffff",
      color: "#000000",
    },
    dark: {
      backgroundColor: "#333333",
      color: "#000000",
    },
    retro: {
      backgroundColor: "#f4e2d8",
      color: "#2b2b2b",
      fontFamily: "Courier New, Courier, monospace",
    },
  };

  const headerStyles = {
    light: {
      fontSize: "3rem",
      fontWeight: "bold",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      letterSpacing: "0.1em",
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
      color: "#00b4d8",
    },
    dark: {
      fontSize: "3rem",
      fontWeight: "bold",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      letterSpacing: "0.1em",
      textShadow: "2px 2px 4px rgba(255, 255, 255, 0.5)",
      color: "#90e0ef",
    },
    retro: {
      fontSize: "3rem",
      fontWeight: "bold",
      fontFamily: "'Courier New', Courier, monospace",
      letterSpacing: "0.1em",
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
      color: "#ff9900",
    },
  };

  return (
    <div style={pageStyles[theme]} className="container text-center my-5">
      <div className="text-center">
        <p style={headerStyles[theme]}>Friends</p> {/* Apply dynamic header styles */}
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
          <p className="container fs-6 w-75" style={{ color: pageStyles[theme].color }}>
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
