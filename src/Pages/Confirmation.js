import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function ConfirmSignup() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const confirmSignup = async () => {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get("token");

      if (token) {
        const { error } = await supabase.auth.verifyOTP({
          token,
          type: "signup",
        });

        if (error) {
          console.error("Error confirming signup:", error.message);
          navigate("/login"); // Redirect to login on error
        } else {
          console.log("User confirmed successfully!");
          navigate("/login"); // Redirect to login on success
        }
      } else {
        console.error("Confirmation token is missing!");
        navigate("/login");
      }
    };

    confirmSignup();
  }, [location, navigate]);

  return (
    <div>
      <h2>Confirming your signup...</h2>
    </div>
  );
}

export default ConfirmSignup;
