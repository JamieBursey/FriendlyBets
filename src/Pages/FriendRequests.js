import { useEffect, useState } from "react";
import { LOCALSTORAGE } from "../Config";
import { acceptFriendRequest, rejectFriendRequest } from "../Data";

const FriendRequests = () => {
  const [requests, setRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER))
  );
  useEffect(() => {
    const storedRequests =
      JSON.parse(localStorage.getItem(LOCALSTORAGE.FRIENDREQUEST)) || [];
    const loggedInUser = JSON.parse(
      localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER)
    );
    const filteredRequests = storedRequests.filter(
      (request) =>
        request.to === loggedInUser.username && request.status === "pending"
    );
    setRequests(filteredRequests);
  }, []);

  const handleAccept = (requestId) => {
    acceptFriendRequest(requestId, (updatedCurrentUser) => {
      setCurrentUser(updatedCurrentUser);
      localStorage.setItem(
        LOCALSTORAGE.LOGGEDINUSER,
        JSON.stringify(updatedCurrentUser)
      );

      setRequests(requests.filter((request) => request.id !== requestId));
    });
  };
  const handleRejectFriend = (requestId) => {
    rejectFriendRequest(requestId);
    setRequests(requests.filter((request) => request.id !== requestId));
  };

  return (
    <div className="container mt-3">
      <div className="row">
        {requests.map((request) => (
          <div key={request.id} className="col-md-4 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-info">{request.from}</h5>
                <p className="card-text">Would like to be your friend</p>
                <button
                  onClick={() => handleAccept(request.id)}
                  className="btn btn-primary mr-2"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRejectFriend(request.id)}
                  className="btn btn-secondary mx-2"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { FriendRequests };
