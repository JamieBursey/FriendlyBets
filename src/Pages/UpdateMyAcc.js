import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
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
    about_me: "",
    favorite_team: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error fetching session:", sessionError);
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
          setLoggedUser(userData);
          setUserDetails({
            username: userData.username || "",
            email: userData.email || "",
            password: "", // Passwords should not be prefilled
            about_me: userData.about_me || "",
            favorite_team: userData.favorite_team || "",
          });
        }
      }
    };

    fetchUserData();
  }, []);

  const handleUserDetailChange = (field, value) => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handleUpdateAll = async () => {
    const updatedDetails = {
      username: userDetails.username || loggedUser.username,
      email: userDetails.email || loggedUser.email,
      password: userDetails.password,
      about_me: userDetails.about_me || loggedUser.about_me,
      favorite_team: userDetails.favorite_team || loggedUser.favorite_team,
    };

    // Update Supabase user details
    const { error: updateUserError } = await supabase
      .from("users")
      .update({
        username: updatedDetails.username,
        email: updatedDetails.email,
        about_me: updatedDetails.about_me,
        favorite_team: updatedDetails.favorite_team,
      })
      .eq("public_user_id", loggedUser.public_user_id);

    if (updateUserError) {
      console.error("Error updating user details:", updateUserError);
      alert("There was an error updating your details. Please try again.");
      return;
    }

    // Update password if it was changed
    if (updatedDetails.password) {
      const { error: updatePasswordError } = await supabase.auth.updateUser({
        password: updatedDetails.password,
      });

      if (updatePasswordError) {
        console.error("Error updating password:", updatePasswordError);
        alert("There was an error updating your password. Please try again.");
        return;
      }
    }

    // Fetch the updated user data
    const { data: updatedUser, error: fetchUserError } = await supabase
      .from("users")
      .select("*")
      .eq("public_user_id", loggedUser.public_user_id)
      .single();

    if (fetchUserError) {
      console.error("Error fetching updated user data:", fetchUserError);
    } else {
      setLoggedUser(updatedUser);
      alert("Your account has been updated successfully!");
    }

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
          userDetails={userDetails}
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
