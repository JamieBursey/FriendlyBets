import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

function UseAuthListener() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = useRef(false);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Only redirect to /FriendlyBets if we're on login/register pages
        if (event === "SIGNED_IN" && session && !hasRedirected.current) {
          const publicPages = ["/login", "/register", "/about", "/contact", "/PasswordReset"];
          if (publicPages.includes(location.pathname)) {
            navigate("/FriendlyBets");
            hasRedirected.current = true;
          }
        } else if (event === "SIGNED_OUT") {
          hasRedirected.current = false;
          navigate("/login");
        }
      }
    );

    // Cleanup the listener when the component unmounts
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate, location]);
}

export default UseAuthListener;
