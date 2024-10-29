import React, { useState, useEffect } from "react";
import {
  AvatarComponent,
  DisplayName,
  MyAccEmail,
  RenderAboutMe,
  NavigateToUpdate,
  RenderPhoneNumber,
} from "../Components";
import { supabase } from "../supabaseClient";

function MyAccount() {
  const [loggedUser, setLoggedUser] = useState({});

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
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      <AvatarComponent user={loggedUser} />
      <DisplayName user={loggedUser} />
      <MyAccEmail user={loggedUser} />
      <RenderPhoneNumber user={loggedUser}/>
      <RenderAboutMe user={loggedUser} />
      <NavigateToUpdate />
    </>
  );
}

export { MyAccount };
