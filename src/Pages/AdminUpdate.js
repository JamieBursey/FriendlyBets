import { useNavigate } from "react-router-dom";
import { LOCALSTORAGE } from "../Config";
import { useState } from "react";
import { getAllUsers, findUserByEmail } from "../Data";

const EditUserAsAdmin = () => {
  const navigate = useNavigate();
  const userToUpdate = JSON.parse(
    localStorage.getItem(LOCALSTORAGE.ADMIN_MANAGEMENT)
  );

  const handleUpdateUsers = () => {
    const allUsers = getAllUsers();
    const selectedUser = allUsers.findIndex(
      (user) => user.email === userToUpdate.email
    );
    allUsers[selectedUser] = {
      ...allUsers[selectedUser],
      username: username,
      password: password,
      email: email,
      isAdmin: isAdmin,
    };

    localStorage.setItem(LOCALSTORAGE.USERS, JSON.stringify(allUsers));
  };
  const [username, setUsername] = useState(userToUpdate.username || "");
  const [password, setPassword] = useState(userToUpdate.password || "");
  const [email, setEmail] = useState(userToUpdate.email || "");
  const [isAdmin, setIsAdmin] = useState(userToUpdate.isAdmin || false);
  return (
    <div className="container mt-3 text-center">
      <h1 className="text-info">Update User</h1>
      <h5>Password Change</h5>
      <div className="input-group mb-3">
        <span className="input-group-text" id="inputGroup-sizing-default">
          {userToUpdate.username}
        </span>
        <input
          type="text"
          className="form-control"
          defaultValue={userToUpdate.username}
          onChange={(event) => setUsername(event.target.value)}
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-default"
        />
      </div>
      <h5>Email Change</h5>
      <div className="input-group mb-3">
        <span className="input-group-text" id="inputGroup-sizing-default">
          {userToUpdate.email}
        </span>
        <input
          type="text"
          className="form-control"
          defaultValue={userToUpdate.email}
          onChange={(event) => setEmail(event.target.value)}
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-default"
        />
      </div>
      <h5>Password Change</h5>
      <div className="input-group mb-3">
        <span className="input-group-text" id="inputGroup-sizing-default">
          {userToUpdate.password}
        </span>
        <input
          type="text"
          className="form-control"
          defaultValue={userToUpdate.password}
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
      <button
        className="btn btn-danger"
        onClick={() => {
          handleUpdateUsers();
        }}
      >
        Save Changes
      </button>
    </div>
  );
};

export { EditUserAsAdmin };
