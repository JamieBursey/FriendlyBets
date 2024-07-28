import React from "react";
import Avatar from "react-avatar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const dropDownScroll = {
  maxHeight: "200px",
  overflow: "scroll",
};

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
      <div className="mb-3"></div>
      <div className="col ms-5 d-flex justify-content-end">
        <Avatar
          round={true}
          size="150"
          name={user.username}
          textSize={textSize}
        />
      </div>
      <div className="col d-flex justify-content-start">
        <RenderFavoriteTeam user={user} />
      </div>
    </div>
  );
};

const MyAccEmail = ({ user }) => {
  return <div className="text-center text-info fs-2">Email: {user.email}</div>;
};

const RenderAboutMe = ({ user }) => {
  if (user.about_me)
    return (
      <div
        className="card text-center mx-auto mt-5 text-bg-secondary mb-3"
        style={{ maxWidth: "18rem" }}
      >
        <div className="card-header">About</div>
        <div className="card-body">
          <p className="card-text">{user.about_me}</p>
        </div>
      </div>
    );
};

const RenderFavoriteTeam = ({ user }) => {
  return (
    <div className="text-center text-info fs-2">
      {user.favorite_team ? (
        <img
          src={user.favorite_team}
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

const MyAccountChanges = ({ userDetails, onUserDetailChange }) => {
  const [email, setEmail] = useState(userDetails.email);
  const [displayName, setDisplayName] = useState(userDetails.username);
  const [password, setPassword] = useState("");

  return (
    <>
      <div className="d-flex justify-content-center mt-3">
        <div className="input-group mb-3 w-50">
          <input
            type="text"
            className="form-control"
            placeholder={userDetails.email}
            onChange={(e) => onUserDetailChange("username", e.target.value)}
            aria-label="Recipient's username"
          />
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <div className="input-group mb-3 w-50">
          <input
            type="text"
            className="form-control"
            placeholder={userDetails.username}
            onChange={(e) => onUserDetailChange("email", e.target.value)}
            aria-label="Recipient's email"
          />
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <div className="input-group mb-3 w-50">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            onChange={(e) => onUserDetailChange("password", e.target.value)}
            aria-label="Recipient's password"
          />
        </div>
      </div>
    </>
  );
};

const AboutMeComponent = ({ userDetails, onUserDetailChange }) => {
  return (
    <div className="d-flex justify-content-center my-3">
      <div className="w-25">
        <textarea
          className="form-control"
          placeholder={
            userDetails.about_me
              ? userDetails.about_me
              : "Tell us about yourself"
          }
          onChange={(e) => onUserDetailChange("about_me", e.target.value)}
        />
      </div>
    </div>
  );
};

const UpdateFavTeam = ({ userDetails, onUserDetailChange }) => {
  const [teamLogos, setTeamLogos] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(userDetails.favorite_team);

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

  const handleSelectedTeam = (logo) => {
    onUserDetailChange("favorite_team", logo);
    setSelectedTeam(logo);
  };

  return (
    <div className="text-center">
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
                onClick={() => handleSelectedTeam(logo)}
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
    </div>
  );
};

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
