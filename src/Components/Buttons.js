import React from "react";
import Avatar from "react-avatar";
import { useState } from "react";
import { useTheme } from "./theme/ThemeContext";
import mlbButton from "../Components/buttonImages/mlbButton.jpeg";
import mmaLogo from "../Components/buttonImages/mmaLogo.jpeg";
function Button({ buttonData, onClickCallback }) {
  const [isHovered, setIsHovered] = useState(false);

  const normalStyle = {
    transition: "transform 0.3s ease",
  };

  const hoverStyle = {
    transform: "scale(1.1)",
    cursor: "pointer",
  };

  return (
    <div
      className="col"
      style={isHovered ? hoverStyle : normalStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClickCallback(buttonData.text)}
    >
      <Avatar size="75" src={buttonData.imageURL} round={true} />
    </div>
  );
}

function SportButtons({ buttonsData, onClickCallback }) {
  return (
    <div className="App p-3 mb-3">
      <div className="container text-center">
        <div className="row">
          {buttonsData
            ? buttonsData.map((button, index) => (
                <Button
                  key={index}
                  buttonData={button}
                  onClickCallback={onClickCallback}
                />
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

function AddSportButtons({ setSelectMatchesType }) {
  const sportButtons = [
    {
      text: "Fighting",
      imageURL:
        mmaLogo
    },
    {
      text: "Hockey",
      imageURL:
        "https://th.bing.com/th/id/OIP.OyDSRCeMcmx2QRVzAuJilQHaId?pid=ImgDet&rs=1",
    },
    {
      text: "Football",
      imageURL:
        "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/National_Football_League_logo.svg/380px-National_Football_League_logo.svg.png",
    },
    {
      text: "Baseball",
      imageURL:
        mlbButton
    },
  ];

  const { theme } = useTheme();

  const containerStyle = {
    backgroundColor:
      theme === "light"
        ? "#E0E0E0"
        : theme === "dark"
        ? "#2A2828" 
        : "transparent",
    background:
      theme === "retro"
        ? "linear-gradient(to bottom, #0B1305 0%, #00008B 100%)" 
        : theme === "light"
        ? "#E0E0E0" 
        : "#1E1E1E", 
    color: theme === "light" ? "#000000" : "#FFFFFF",
    borderRadius: "5px",
    padding: "20px",
  };

  return (
    <>
      <div className="container p-2 mb-3" style={containerStyle}>
        <div className="text-center">
          {SportButtons({
            buttonsData: sportButtons,
            onClickCallback: setSelectMatchesType,
          })}
        </div>
      </div>
    </>
  );
}

export default AddSportButtons;