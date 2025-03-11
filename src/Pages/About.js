import React from "react";
import { RenderContact } from "../Components";
import { useTheme } from "../Components/theme/ThemeContext";
function About() {
  const { theme } = useTheme();

  const containerStyle = {
    backgroundColor:
      theme === "light"
        ? "#FFFFFF"
        : theme === "dark"
        ? "#1E1E1E"
        : "transparent",
    background:
      theme === "retro"
        ? "linear-gradient(to bottom, #0B1305 0%, #00008B 100%)"
        : theme === "light"
        ? "#FFFFFF"
        : theme==="dark"? "#1E1E1E":"#1E1E1E",
    color: theme === "light" ? "#000000" : "#FFFFFF",
    minHeight: "100vh",
    padding: "20px",
  };

  const textColor = theme === "light" ? "#000000" : "#FFFFFF";
  const dividerColor = theme === "light" ? "#000000" : "#FFFFFF";

  return (
    <div style={containerStyle} className="container text-center p-4">
      <div className="container my-4">
        <div className="row">
          <div className="col-md-6">
            <div className="jumbotron text-center" style={{ color: textColor }}>
              <h1 className="display-4">
                Welcome to Friendly Bets – Where Every Game Counts!
              </h1>
              <p className="lead">
                Experience the thrill of friendly betting in a fun, safe, and
                engaging environment.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="line-divider" style={{ borderTop: `1px solid ${dividerColor}` }}></div>

      <div className="container p-4" style={{ color: textColor }}>
        <h2>Our Mission: Enhancing Your Game-Watching Experience</h2>
        <p>
          Here at Friendly Bets, we aim to make sports and games more exciting
          through friendly wagers. Remember the thrill of making playful bets
          with friends while lounging on the couch, watching your favorite game?
          At Friendly Bets, we're reigniting that nostalgic excitement. Our app
          is more than just a betting platform; it's a gateway to reliving those
          carefree moments, regardless of the distance. Whether it's a friendly
          wager of a cup of coffee or something more unique, our custom betting
          options bring the spirit of casual, personal bets into the digital
          age. It's not just about winning or losing; it's about staying
          connected, enjoying the game, and keeping traditions alive with those
          who matter most.
        </p>
      </div>

      <div className="line-divider" style={{ borderTop: `1px solid ${dividerColor}` }}></div>

      {/* How It Works */}
      <div className="container p-5" style={{ color: textColor }}>
        <h2>How Friendly Bets Works:</h2>
        <div className="row">
          <div className="col-md-4">
            <h3>Create a Bet</h3>
            <p>Start by creating a bet on your favorite game...</p>
          </div>
          <div className="col-md-4">
            <h3>Invite Friends</h3>
            <p>Invite your friends to join the bet...</p>
          </div>
          <div className="col-md-4">
            <h3>Track and Win</h3>
            <p>Track the game and see if you win...</p>
          </div>
        </div>
      </div>

      <div className="line-divider" style={{ borderTop: `1px solid ${dividerColor}` }}></div>

      <div
        className="d-flex justify-content-center align-items-center p-5"
        style={{ color: textColor }}
      >
        <div>
          <h2>Features That Make Us Stand Out</h2>
          <ul className="text-center fs-4">
            <li>Real-time updates</li>
            <li>Variety of sports and games</li>
            <li>Honor system betting</li>
            <li>Custom Bets</li>
          </ul>
        </div>
      </div>

      <div className="line-divider" style={{ borderTop: `1px solid ${dividerColor}` }}></div>

      <div className="container p-5" style={{ color: textColor }}>
        <h2>Hear It From Our Community</h2>
      </div>

      <RenderContact />

      <footer className="text-center p-4" style={{ color: textColor }}>
        <p>&copy; 2024 Friendly Bets. All rights reserved.</p>
      </footer>
    </div>
  );
}

export { About };