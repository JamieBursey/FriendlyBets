const UserManagement = () => {
  const editUserAsAdmin = (userData) => {
    localStorage.setItem("USER_TO_EDIT_AS_ADMIN", userData);
    navigate("/editUserAsAdmin"); //react router
  };
  const renderAllUsers = () => {
    // Get all users
    let allUsersData = [{ username: "1", isAdmin: true }]; // replace
    return allUsersData.map((ud) => {
      return (
        <tr>
          <th scope="row">1</th>
          <td>{ud.username}</td>
          <td>{ud.isAdmin}</td>
          <td>
            <buttton onClick={() => editUserAsAdmin(ud)}>Edit</buttton>
          </td>
        </tr>
      );
    });
  };
  return (
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">User Name</th>
          <th scope="col">Is Admin?</th>
          <th scope="col">Edit User</th>
        </tr>
      </thead>
      <tbody>{renderAllUsers()}</tbody>
    </table>
  );
};
