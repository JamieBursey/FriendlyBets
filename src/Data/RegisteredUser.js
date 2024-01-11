import { useEffect, useState } from "react";
import { LOCALSTORAGE } from "../Config";

const getAllUsers = () => {
  const allUsersStr = localStorage.getItem(LOCALSTORAGE.USERS);
  let allUsers = JSON.parse(allUsersStr);
  if (allUsersStr === "" || allUsers == null) {
    allUsers = [];
  }
  return allUsers;
};
const findUser = (username) => {
  const allUsers = getAllUsers(); // [{id: "", ....} , {}]
  const foundUser = allUsers.find((user) => user.username === username);
  if (foundUser == null) {
    return null;
  } else {
    return foundUser;
  }
};
const findUserByEmail = (email) => {
  const allUsers = getAllUsers(); // [{id: "", ....} , {}]
  const foundUser = allUsers.find((user) => user.email === email);
  if (foundUser == null) {
    return null;
  } else {
    return foundUser;
  }
};

const checkUserPassword = (userPassword, inputPassword) => {
  if (userPassword === inputPassword) {
    return true;
  } else {
    return false;
  }
};

const adminUser = () => {
  const allUsers = getAllUsers();
  const adminCheck = allUsers.find((user) => user.username === "Admin");
  if (!adminCheck) {
    const admin = {
      username: "Admin",
      password: "admin",
      email: "admin@email.com",
      favoriteTeam: "https://assets.nhle.com/logos/nhl/svg/COL_light.svg",
      bets: [],
      friends: [],
      avatar: [],
    };
    allUsers.push(admin);
  }
  localStorage.setItem(LOCALSTORAGE.USERS, JSON.stringify(allUsers));
};
// const deleteFriend = (friendUsername, currentUser, setLoggedInUser) => {
//   // Get all users
//   const allUsers = getAllUsers();
//   //fetch friend
//   let friendUser = allUsers.filter(
//     (user) => user.username === friendUsername
//   )[0];

//   // modify currentUser friend list
//   const updatedFriends = (currentUser.friends = currentUser.friends.filter(
//     (username) => username !== friendUser.username
//   ));
//   const currenUserUpdate = {
//     ...currentUser,
//     friends: updatedFriends,
//   };

//   // modify friendUser friend list
//   friendUser.friends = friendUser.friends.filter(
//     (username) => username !== currentUser.username
//   );

//   // Get rid of the original currentUser and friendUser
//   let temporaryArrayUsers = allUsers.filter(
//     (user) =>
//       user.username !== currentUser.username &&
//       user.username !== friendUser.username
//   );

//   //push back the new values
//   temporaryArrayUsers.push(currenUserUpdate);
//   temporaryArrayUsers.push(friendUser);

//   // Push the new array of users back to the local storage using localStorage.setItem(allUserKey, JSON.stringify(allUsers))
//   localStorage.setItem(LOCALSTORAGE.USERS, JSON.stringify(temporaryArrayUsers));
//   localStorage.setItem(LOCALSTORAGE.LOGGEDINUSER, JSON.stringify(currentUser));

//   console.log("modifying LoggedInUser to rerender list of cards", currentUser);
//   setLoggedInUser(currenUserUpdate);
// }; //moved to friends.js

// const renderFriendList = (currentUser, setLoggedInUser) => {
//   const allUsers = getAllUsers();
//   return (
//     <div className="row">
//       {currentUser.friends.map((friendUsername) => {
//         let friendUser = allUsers.find(
//           (user) => user.username === friendUsername
//         );
//         return friendUser ? (
//           <div
//             key={friendUser.email}
//             className="col-sm-12 col-md-6 col-lg-4 mb-3"
//           >
//             <div className="card bg-white">
//               <div className="card-body text-center">
//                 <h5 className="card-title">{friendUser.username}</h5>
//                 <p className="card-text">{friendUser.email}</p>
//                 <div
//                   className="card text-center mx-auto mt-2 mb-3"
//                   style={{ maxWidth: "18rem", backgroundColor: "#d6d6d6" }}
//                 >
//                   <div className="card-header">About</div>
//                   <div className="card-body">
//                     <p className="card-text">{friendUser.aboutMe}</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() =>
//                     deleteFriend(
//                       friendUser.username,
//                       currentUser,
//                       setLoggedInUser
//                     )
//                   }
//                   className="btn btn-outline-danger"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         ) : null;
//       })}
//     </div>
//   );
// }; //moved to friends.js

const TeamDropdown = ({ teamSelect }) => {
  const [team, setTeam] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");

  useEffect(() => {
    const fetchTeam = async () => {
      const response = await fetch("https://api-web.nhle.com/v1/schedule/now");
      const teamData = await response.json();
      const teamLogos = [];

      teamData.gameWeek.forEach((week) => {
        week.games.forEach((game) => {
          const homeLogo = game.homeTeam.logo;
          const awayLogo = game.awayTeam.logo;
          if (!teamLogos.includes(homeLogo)) {
            teamLogos.push(homeLogo);
          }
          if (!teamLogos.includes(awayLogo)) {
            teamLogos.push(awayLogo);
          }
        });
      });
      setTeam(teamLogos);
    };
    fetchTeam();
  }, []);
  const handleSelectedTeam = (logo) => {
    setSelectedTeam(logo);
    teamSelect(logo);
  };
  return (
    <div className="dropdown ">
      <button
        className="btn btn-outline-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {selectedTeam ? (
          <img src={selectedTeam} style={{ width: "30px", height: "30px" }} />
        ) : (
          "Select Favorite Team"
        )}
      </button>
      <ul className="dropdown-menu">
        {team.map((logo, index) => {
          return (
            <li key={index}>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => handleSelectedTeam(logo)}
              >
                <img src={logo} style={{ width: "30px", height: "30px" }} />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export {
  getAllUsers,
  checkUserPassword,
  findUser,
  findUserByEmail,
  TeamDropdown,
  adminUser,
};
