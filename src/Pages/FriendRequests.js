import { useEffect, useState } from "react";
import { LOCALSTORAGE } from "../Config";
import { acceptFriendRequest, rejectFriendRequest } from "../Data";

const FriendRequests = () => {
  const [requests, setRequests] = useState([]);

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
    acceptFriendRequest(requestId);
    setRequests(requests.filter((request) => request.id !== requestId));
  };

  return (
    <div>
      {requests.map((request) => (
        <div key={request.id}>
          <p>Friend request from {request.from}</p>
          <button onClick={() => handleAccept(request.id)}>Accept</button>
          <button onClick={() => rejectFriendRequest(request.id)}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
};

export { FriendRequests };
