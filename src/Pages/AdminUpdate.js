import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const EditUserAsAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.user?.id;

  const [userToUpdate, setUserToUpdate] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if the logged-in user is an admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error fetching session:", sessionError);
        navigate("/"); // Redirect to home if there's an error fetching the session
        return;
      }

      if (sessionData && sessionData.session) {
        const user = sessionData.session.user;

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("public_user_id", user.id)
          .single();

        if (userError || !userData.is_admin) {
          console.error(
            "User is not an admin or error fetching user:",
            userError
          );
          navigate("/FriendlyBets"); // Redirect to home if user is not an admin
          return;
        }
      } else {
        navigate("/FriendlyBets"); // Redirect to home if no session
      }
    };

    checkAdminStatus();
  }, [navigate]);

  // Fetch the user data to update
  useEffect(() => {
    const fetchUserToUpdate = async () => {
      if (!userId) return;

      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
        return;
      }

      if (user) {
        setUserToUpdate(user);
        setUsername(user.username);
        setPassword(user.password); // Be careful with handling passwords
        setEmail(user.email);
        setIsAdmin(user.is_admin);
      }
    };

    fetchUserToUpdate();
  }, [userId]);

  const handleUpdateUsers = async () => {
    if (!userToUpdate) return;

    const { data, error } = await supabase
      .from("users")
      .update({
        username: username,
        password: password,
        email: email,
        is_admin: isAdmin,
      })
      .eq("id", userToUpdate.id);

    if (error) {
      console.error("Error updating user:", error);
      return;
    }

    navigate("/UserManagement"); // Redirect to an admin dashboard or another page
  };

  return (
    <div className="container mt-3 text-center">
      <h1 className="text-info">Update User</h1>
      <h5>Username Change</h5>
      <div className="input-group mb-3">
        <span className="input-group-text" id="inputGroup-sizing-default">
          Username
        </span>
        <input
          type="text"
          className="form-control bg-secondary border-secondary text-info"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-default"
        />
      </div>
      <h5>Email Change</h5>
      <div className="input-group mb-3">
        <span className="input-group-text" id="inputGroup-sizing-default">
          Email
        </span>
        <input
          type="text"
          className="form-control bg-secondary border-secondary text-info"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-default"
        />
      </div>
      <h5>Password Change</h5>
      <div className="input-group mb-3">
        <span className="input-group-text " id="inputGroup-sizing-default">
          Password
        </span>
        <input
          type="text"
          className="form-control bg-secondary border-secondary text-info"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-default"
        />
      </div>
      <div className="d-flex justify-content-center mb-3">
        <div className="input-group-text">
          <input
            className="form-check-input mt-0"
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            aria-label="Checkbox for admin status"
          />
          <span className="ms-2">Is Admin?</span>
        </div>
      </div>
      <button className="btn btn-danger" onClick={handleUpdateUsers}>
        Save Changes
      </button>
    </div>
  );
};

export { EditUserAsAdmin };
