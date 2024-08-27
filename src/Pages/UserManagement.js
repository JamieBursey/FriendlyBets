import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const UserManagement = () => {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const checkAdminStatusAndFetchUsers = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error fetching session:", sessionError);
        navigate("/FriendlyBets");
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

        // Fetch all users if the logged-in user is an admin
        const { data: users, error: usersError } = await supabase
          .from("users")
          .select("*");

        if (usersError) {
          console.error("Error fetching users:", usersError);
        } else {
          setAllUsers(users);
        }
      } else {
        navigate("/FriendlyBets"); // Redirect to home if no session
      }
    };

    checkAdminStatusAndFetchUsers();
  }, [navigate]);

  const editUserAsAdmin = (userData) => {
    // Navigate to the edit page, passing user data as state
    navigate("/editUserAsAdmin", { state: { user: userData } });
  };

  const renderAllUsers = () => {
    return allUsers.map((ud, index) => {
      return (
        <tr key={index}>
          <th scope="row">{index + 1}</th>
          <td>{ud.username}</td>
          <td>{ud.password}</td>
          <td>{ud.is_admin ? "Yes" : "No"}</td>
          <td>
            <button className="btn" onClick={() => editUserAsAdmin(ud)}>
              Edit
            </button>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="mt-2">
      <table className="table table-info table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">User Name</th>
            <th scope="col">Password</th>
            <th scope="col">Is Admin?</th>
            <th scope="col">Edit User</th>
          </tr>
        </thead>
        <tbody>{renderAllUsers()}</tbody>
      </table>
    </div>
  );
};

export { UserManagement };
