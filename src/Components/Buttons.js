import React from "react";
import Avatar from "react-avatar";
import { useState } from "react";

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
function buttons({ buttonsData, onClickCallback }) {
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

function AddButtons({ setSelectMatchesType }) {
  const sportButtons = [
    {
      text: "Fighting",
      imageURL:
        "https://th.bing.com/th/id/R.a0bb7371d003fc78ee0b5897a1f6b2b7?rik=%2b0M6k68PsbCVUw&pid=ImgRaw&r=0",
    },
    {
      text: "Hockey",
      imageURL:
        "https://th.bing.com/th/id/OIP.OyDSRCeMcmx2QRVzAuJilQHaId?pid=ImgDet&rs=1",
    },
    {
      text: "Football",
      imageURL:
        "https://static.vecteezy.com/system/resources/previews/000/246/904/original/american-football-emblems-vector.jpg",
    },
    {
      text: "Baseball",
      imageURL:
        "https://th.bing.com/th/id/R.fb35581771dd8c5b57796a08803b05c6?rik=ShSZHJ6HhQGQsQ&riu=http%3a%2f%2fthebeastbrief.com%2fwp-content%2fuploads%2fmlb-logo.jpg&ehk=uuqTVdWYUq2CEu96Ze6aIGgvSDTYJf9j32csiFd9yRQ%3d&risl=&pid=ImgRaw&r=0",
    },
  ];
  const ButtonsBackground = {
    background: "linear-gradient(to right, #0B1305 50%, #1e90ff 100%)",
    borderRadius: "5px",
  };
  return (
    <>
      <div style={ButtonsBackground} className="App p-3 mb-3">
        <div className="container text-center">
          {buttons({
            buttonsData: sportButtons,
            onClickCallback: setSelectMatchesType,
          })}
        </div>
      </div>
    </>
  );
}

export default AddButtons;
