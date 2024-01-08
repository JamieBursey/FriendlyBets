import React from "react";
import Avatar from "react-avatar";
import { LOCALSTORAGE } from "../Config";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="row">
      <div className="col">
        {" "}
        <Avatar
          round={true}
          size="150"
          name={user.username}
          textSize={textSize}
        />
      </div>
      <div className="col">{RenderFavoriteTeam({ user })}</div>
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
      <img
        src={user.favoriteTeam}
        style={{ width: "100px", height: "100px" }}
      />
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
  const [email, setEmail] = useState(loggedUser.email || "");
  const [displayName, setDisplayName] = useState(loggedUser.username || "");

  const displayNameChange = (event) => {
    setDisplayName(event.target.value);
    console.log("change");
  };

  const emailChange = (event) => {
    setEmail(event.target.value);
    console.log("change2");
  };

  const updateDisplayName = () => {
    const updatedUserInfo = {
      ...loggedUser,
      username: displayName,
    };
    const updatedUsers = allUsers.map((user) =>
      user.username === loggedUser.username ? updatedUserInfo : user
    );
    localStorage.setItem(LOCALSTORAGE.USERS, JSON.stringify(updatedUsers));
    localStorage.setItem(
      LOCALSTORAGE.LOGGEDINUSER,
      JSON.stringify(updatedUserInfo)
    );
    console.log("Navigating to MyAccount");
    navigate("/MyAccount");
  };

  const updateEmail = () => {
    const checkEmails = allUsers.some((user) => user.email === email);
    if (checkEmails) {
      alert("Email in Use");
      return;
    }

    const newEmail = {
      ...loggedUser,
      email: email,
    };
    const updatedUsers = allUsers.map((user) =>
      user.username === loggedUser.username ? newEmail : user
    );

    localStorage.setItem(LOCALSTORAGE.USERS, JSON.stringify(updatedUsers));
    localStorage.setItem(LOCALSTORAGE.LOGGEDINUSER, JSON.stringify(newEmail));
    navigate("/MyAccount");
  };
  return (
    <>
      <div className="d-flex justify-content-center">
        <div className="input-group mb-3 w-50">
          <input
            type="text"
            className="form-control"
            placeholder="Change Users Display Name"
            onChange={displayNameChange}
            aria-label="Recipient's username"
            aria-describedby="button-addon2"
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={updateDisplayName}
            id="button-addon2"
          >
            Change Name
          </button>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <div className="input-group mb-3 w-50">
          <input
            type="text"
            className="form-control "
            placeholder="Change Users email"
            onChange={emailChange}
            aria-label="Recipient's email"
            aria-describedby="button-addon3"
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={updateEmail}
            id="button-addon3"
          >
            Change Email
          </button>
        </div>
      </div>
    </>
  );
};

const AboutMeComponent = () => {
  const navigate = useNavigate();
  const [aboutMe, setAboutMe] = useState(loggedUser.aboutMe || "");

  const addAboutMe = (event) => {
    setAboutMe(event.target.value);
    console.log("render?");
  };

  const updateAboutMe = () => {
    const addNewAboutMe = {
      ...loggedUser,
      aboutMe: aboutMe,
    };
    console.log("test render");

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
      <div className="input-group w-25">
        <textarea
          className="form-control"
          placeholder="Tell us about yourself"
          onChange={addAboutMe}
        />
      </div>
      <div className="d-flex justify-content-center">
        <button className="btn btn-outline-secondary" onClick={updateAboutMe}>
          Update About Me
        </button>
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

  useEffect(() => {
    const fetchTeam = async () => {
      const response = await fetch("https://api-web.nhle.com/v1/schedule/now");
      const teamData = await response.json();
      const teamLogos = [];

      teamData.gameWeek.forEach((week) => {
        week.games.forEach((game) => {
          console.log(teamData);
          const homeLogo = game.homeTeam.logo;
          const awayLogo = game.awayTeam.logo;
          teamLogos.push(homeLogo);
          teamLogos.push(awayLogo);
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
            Select Favorite Team
          </button>
          <ul className="dropdown-menu" style={dropDownScroll}>
            {teamLogos.map((logo, index) => (
              <li key={index}>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={() => {
                    setFavTeam(logo);
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
