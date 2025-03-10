import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NAVIGATION } from "../Config";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useTheme } from "./theme/ThemeContext";
import ThemeModal from "./theme/ThemeModal";

function NavBar() {
  const navigate = useNavigate();
  const [loggedUser, setLoggedUser] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {theme}=useTheme()

  async function fetchUserDetails(userId) {
    if (!userId) {

      return; // Skip fetching if no userId is provided
    }
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("public_user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching user details:", error);
    } else {
      setUserDetails(data);
    }
  }

  useEffect(() => {
    const init = async () => {
      const user = await supabase.auth.getUser();
      if (user.data) {
        setLoggedUser(user.data);
        fetchUserDetails(user.data.id);
      } else {
        setLoggedUser(null);
        setUserDetails({});
      }
    };

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setLoggedUser(session.user);
          fetchUserDetails(session.user.id);
        } else {
          setLoggedUser(null);
          setUserDetails({});
        }
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setLoggedUser(null);
    setUserDetails({});
    navigate("/login");
  };
  const handleNavLinkClick = () => {
    const navbarCollapse = document.getElementById("navbarSupportedContent");
    if (navbarCollapse.classList.contains("show")) {
      // Manually remove the 'show' class to collapse the navbar
      navbarCollapse.classList.remove("show");
    }
  };

  return (
    <nav className="navbar navbar-expand-sm bg-body-tertiary">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className="nav-link active"
                aria-current="page"
                to={NAVIGATION.HOME}
                onClick={handleNavLinkClick}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to={NAVIGATION.ABOUT}
                onClick={handleNavLinkClick}
              >
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to={NAVIGATION.CONTACT}
                onClick={handleNavLinkClick}
              >
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <button
                className="btn"
                onClick={() => setIsModalOpen(true)}
              >
              Theme
              </button>
            </li>
            {loggedUser && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link text-success"
                    to={NAVIGATION.MYBETS}
                    onClick={handleNavLinkClick}
                  >
                    MyBets
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link text-success"
                    to={NAVIGATION.ADDFRIENDS}
                    onClick={handleNavLinkClick}
                  >
                    Friends
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link text-success"
                    to={NAVIGATION.NOTIFICATIONS}
                    onClick={handleNavLinkClick}
                  >
                    Notifications
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="d-flex align-items-center ms-auto">
          {loggedUser ? (
            <div className="dropdown">
              <a
                className="dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                href="a"
              >
                <Avatar round={true} size="40" name={userDetails.username} />
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/myAccount")}
                  >
                    My Account
                  </button>
                </li>
                {userDetails.is_admin && (
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => navigate("/UserManagement")}
                    >
                      Update Users
                    </button>
                  </li>
                )}
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/fullSchedule")}
                  >
                    Weekly Schedule
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={logout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link className="btn btn-success ms-2" to={NAVIGATION.LOGIN}>
              Login
            </Link>
          )}
        </div>
      </div>
      <ThemeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

    </nav>
  );
}

export default NavBar;
