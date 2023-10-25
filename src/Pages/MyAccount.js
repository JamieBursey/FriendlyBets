import React from "react";
import { allUsersKey } from "../Data";
import { useState } from "react";
import { getAllFriends } from "../Data";

function MyAccount() {
  const [friendName, setFriendName] = useState(null);
  const [removeName, setRemoveName] = useState(null);

  const friendsData = () => {
    const allUsers = JSON.parse(localStorage.getItem(allUsersKey));
    const userToAdd = allUsers.find((user) => user.username === friendName);
    if (userToAdd) {
      getAllFriends.push(userToAdd);
      console.log("test", getAllFriends);
    }
  };
  const removeFriend = () => {
    const userToRemove = getAllFriends.findIndex(
      (user) => user.username === removeName
    );
    getAllFriends.splice(userToRemove, 1);
  };
  const renderFriends = () => {
    return (
      <>
        <div className="text-center fs-1 text-danger">Friends</div>
        <div className="App p-3 mb-3"></div>
        <div className="App p-3">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-6 col-md-3 py-.2">
                <input
                  type="text"
                  placeholder="Add Friend"
                  className="w-100"
                  onChange={(event) => setFriendName(event.target.value)}
                ></input>
              </div>
              <div className="col-xs-12 col-sm-6 col-md-3 py-.2">
                <button
                  className="w-100 btn btn-primary btn-sm"
                  onClick={friendsData}
                >
                  Submit
                </button>
              </div>
              <div className="col-xs-12 col-sm-6 col-md-3 py-.2">
                <input
                  type="text"
                  placeholder="Remove Friend"
                  className="w-100"
                  onChange={(event) => setRemoveName(event.target.value)}
                ></input>
              </div>
              <div className="col-xs-12 col-sm-6 col-md-3 py-.2">
                <button
                  className="w-100 btn btn-primary btn-sm"
                  onClick={removeFriend}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const bets = () => {
    return (
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Handle</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td colSpan="2">Larry the Bird</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </table>
    );
  };
  const owing = () => {
    return (
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Handle</th>
          </tr>
        </thead>
        <tbody>
          <tr className="table-danger">
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr className="table-danger">
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr className="table-danger">
            <th scope="row">3</th>
            <td colSpan="2">Larry the Bird</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </table>
    );
  };
  return (
    <div>
      {renderFriends()}
      {bets()}
      {owing()}
    </div>
  );
}

export { MyAccount };
