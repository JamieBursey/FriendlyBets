import { LOCALSTORAGE } from "../Config";
import { getAllUsers } from "../Data";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const navigate = useNavigate();
  const editUserAsAdmin = (userData) => {
    localStorage.setItem(
      LOCALSTORAGE.ADMIN_MANAGEMENT,
      JSON.stringify(userData)
    );
    navigate("/editUserAsAdmin"); //react router
  };
  const renderAllUsers = () => {
    const allUsers = getAllUsers();

    // replace
    return allUsers.map((ud, index) => {
      return (
        <tr key={index}>
          <th scope="row">{index + 1}</th>
          <td>{ud.username}</td>
          <td>{ud.password}</td>
          <td>{ud.isAdmin ? "yes" : "No"}</td>
          <td>
            <button className="btn " onClick={() => editUserAsAdmin(ud)}>
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
