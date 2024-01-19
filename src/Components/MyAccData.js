import React from "react";
import Avatar from "react-avatar";
import { LOCALSTORAGE } from "../Config";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { bannerTextStyles } from "./Banner";

const dropDownScroll = {
  maxHeight: "200px",
  overflow: "scroll",
};
const loggedUser = JSON.parse(localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER));
const allUsers = JSON.parse(localStorage.getItem(LOCALSTORAGE.USERS));
const DisplayName = ({ user }) => {
  return (
    <div className="text-center">
      <h6 className="fs-1 text-info">Display Name: {user.username}</h6>
    </div>
  );
};
const AvatarComponent = ({ user }) => {
  const textSize = {
    fontSize: "100px",
    fontWeight: "bold",
  };
  return (
    <div className="row mt-2 align-items-center text-center">
      <div className="text-center" style={bannerTextStyles}>
        <h1>Update Account</h1>
      </div>
      <div className="col ms-5 d-flex justify-content-end">
        <Avatar
          round={true}
          size="150"
          name={user.username}
          textSize={textSize}
        />
      </div>
      <div className="col d-flex justify-content-start">
        {RenderFavoriteTeam({ user })}
      </div>
    </div>
  );
};

const MyAccEmail = ({ user }) => {
  return <div className="text-center text-info fs-2">Email: {user.email}</div>;
};
const RenderAboutMe = ({ user }) => {
  if (user.aboutMe)
    return (
      <div
        className="card text-center mx-auto mt-5 text-bg-secondary mb-3"
        style={{ maxWidth: "18rem" }}
      >
        <div className="card-header">About</div>
        <div className="card-body">
          <p className="card-text">{user.aboutMe}</p>
        </div>
      </div>
    );
};
const RenderFavoriteTeam = ({ user }) => {
  return (
    <div className="text-center text-info fs-2">
      {user.favoriteTeam ? (
        <img
          src={user.favoriteTeam}
          alt="favorite_Team"
          style={{ width: "100px", height: "100px" }}
        />
      ) : (
        <p>Select team in update account</p>
      )}
    </div>
  );
};
const NavigateToUpdate = () => {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate("/UpdateMyAccount");
  };
  return (
    <div className="text-center mt-5">
      <button
        type="button"
        onClick={handleButtonClick}
        className="btn btn-outline-light"
      >
        Update Account
      </button>
    </div>
  );
};

const MyAccountChanges = () => {
  const navigate = useNavigate();
  const loggedUser = JSON.parse(
    localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER)
  );
  const allUsers = JSON.parse(localStorage.getItem(LOCALSTORAGE.USERS) || "[]");

  const [email, setEmail] = useState(loggedUser ? loggedUser.email : "");
  const [displayName, setDisplayName] = useState(
    loggedUser ? loggedUser.username : ""
  );
  const [password, setPassword] = useState(
    loggedUser ? loggedUser.password : ""
  );

  const emailChange = (event) => setEmail(event.target.value);
  const displayNameChange = (event) => setDisplayName(event.target.value);
  const passwordChange = (event) => setPassword(event.target.value);

  const saveChanges = () => {
    // Check if email is already in use
    const emailAlreadyInUse = allUsers.some(
      (user) => user.email === email && user.username !== loggedUser.username
    );
    if (emailAlreadyInUse) {
      alert("Email in Use");
      return;
    }
    const updatedUserInfo = {
      ...loggedUser,
      username: displayName,
      email: email,
      password: password,
    };

    // Update users in allUsers
    const updatedUsers = allUsers.map((user) =>
      user.username === loggedUser.username ? updatedUserInfo : user
    );

    // Save updated info in localStorage
    localStorage.setItem(LOCALSTORAGE.USERS, JSON.stringify(updatedUsers));
    localStorage.setItem(
      LOCALSTORAGE.LOGGEDINUSER,
      JSON.stringify(updatedUserInfo)
    );

    // Navigate to MyAccount page
    navigate("/MyAccount");
  };

  return (
    <>
      <div className="d-flex justify-content-center mt-3">
        <div className="input-group mb-3 w-50">
          <input
            type="text"
            className="form-control"
            placeholder={displayName}
            onChange={displayNameChange}
            aria-label="Recipient's username"
          />
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <div className="input-group mb-3 w-50">
          <input
            type="text"
            className="form-control"
            placeholder={email}
            onChange={emailChange}
            aria-label="Recipient's email"
          />
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <div className="input-group mb-3 w-50">
          <input
            type="text"
            className="form-control"
            placeholder={password}
            onChange={passwordChange}
            aria-label="Recipient's password"
          />
        </div>
      </div>
      <div className="d-flex justify-content-center mb-3">
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={saveChanges}
        >
          Save Changes
        </button>
      </div>
    </>
  );
};

const AboutMeComponent = () => {
  const navigate = useNavigate();
  const [aboutMe, setAboutMe] = useState(loggedUser ? loggedUser.aboutMe : "");

  const addAboutMe = (event) => {
    setAboutMe(event.target.value);
    console.log("render?");
  };

  const updateAboutMe = () => {
    const addNewAboutMe = {
      ...loggedUser,
      aboutMe: aboutMe,
    };

    localStorage.setItem(
      LOCALSTORAGE.LOGGEDINUSER,
      JSON.stringify(addNewAboutMe)
    );

    const updatedUsers = allUsers.map((user) =>
      user.username === loggedUser.username ? addNewAboutMe : user
    );
    localStorage.setItem(LOCALSTORAGE.USERS, JSON.stringify(updatedUsers));
    navigate("/MyAccount");
  };
  return (
    <div className="d-flex justify-content-center my-3">
      <div className="w-25">
        <textarea
          className="form-control"
          placeholder={
            loggedUser.aboutMe ? loggedUser.aboutMe : "Tell us about yourself"
          }
          onChange={addAboutMe}
        />
        <div className="d-flex justify-content-center mt-2">
          <button className="btn btn-outline-secondary" onClick={updateAboutMe}>
            Update About Me
          </button>
        </div>
      </div>
    </div>
  );
};

const UpdateFavTeam = () => {
  const navigate = useNavigate();
  const loggedUser = JSON.parse(
    localStorage.getItem(LOCALSTORAGE.LOGGEDINUSER)
  );
  const allUsers = JSON.parse(localStorage.getItem(LOCALSTORAGE.USERS)) || [];
  const [favTeam, setFavTeam] = useState(loggedUser.favoriteTeam || "");
  const [teamLogos, setTeamLogos] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");

  useEffect(() => {
    const fetchTeam = async () => {
      const response = await fetch(
        "https://friendly-bets-back-end.vercel.app/api/now"
      );
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
      setTeamLogos(teamLogos);
    };

    fetchTeam();
  }, []);

  const newTeamChange = () => {
    const ChangeTeam = {
      ...loggedUser,
      favoriteTeam: favTeam,
    };
    localStorage.setItem(LOCALSTORAGE.LOGGEDINUSER, JSON.stringify(ChangeTeam));
    const updatedUsers = allUsers.map((user) =>
      user.username === loggedUser.username ? ChangeTeam : user
    );
    localStorage.setItem(LOCALSTORAGE.USERS, JSON.stringify(updatedUsers));
    navigate("/MyAccount");
  };
  const handleSelectedTeam = (logo) => {
    setFavTeam(logo);
    setSelectedTeam(logo);
  };

  return (
    <div className="text-center">
      <div
        className="btn-group"
        role="group"
        aria-label="Button group with nested dropdown"
      >
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-secondary dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {selectedTeam ? (
              <img
                src={selectedTeam}
                alt="selected_Team"
                style={{ width: "30px", height: "30px" }}
              />
            ) : (
              "Select Favorite Team"
            )}
          </button>
          <ul className="dropdown-menu" style={dropDownScroll}>
            {teamLogos.map((logo, index) => (
              <li key={index}>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    handleSelectedTeam(logo);
                  }}
                >
                  <img
                    src={logo}
                    alt={`Team ${index}`}
                    style={{ width: "30px", height: "30px" }}
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={newTeamChange}
        >
          Update Favorite Team
        </button>
      </div>
    </div>
  );
};

export default UpdateFavTeam;

export {
  AvatarComponent,
  DisplayName,
  MyAccEmail,
  MyAccountChanges,
  AboutMeComponent,
  RenderAboutMe,
  NavigateToUpdate,
  RenderFavoriteTeam,
  UpdateFavTeam,
};
