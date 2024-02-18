import { useState } from "react";

const ShowVideo = ({ video, setVideo }) => {
  if (!video) return null;
  return (
    <div className="bg-info video-container">
      <button className="video-close-button" onClick={() => setVideo(false)}>
        Close Video
      </button>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/YLslsZuEaNE?si=GbKbdYL4kRO-J06p"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

const LandingPage = () => {
  return (
    <div className="mt-4">
      <div className="container my-4">
        <div className="row">
          <div className="col-md-6 text-white">
            <div className="jumbotron text-center text-white">
              <h1 className="display-4">
                Welcome to Friendly Bets – Where Every Game Counts!
              </h1>
              <p className="lead">
                Experience the thrill of friendly betting in a fun, safe, and
                engaging environment.
              </p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="video-container rounded bg-secondary">
              <iframe
                width="100%"
                height="315"
                src="https://www.youtube.com/embed/YLslsZuEaNE"
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <div className="line-divider"></div>
      <div className="container p-4 text-white">
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

      <div className="line-divider"></div>
      {/* How It Works */}
      <div className="container p-5 text-white">
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
      <div className="line-divider"></div>
      <div className="d-flex justify-content-center align-items-center p-5 text-white">
        <div>
          <h2>Features That Make Us Stand Out</h2>
          <ul className=" text-center fs-4">
            <li>Real-time updates</li>
            <li>Variety of sports and games</li>
            <li>Honor system betting</li>
            <li>Custom Bets</li>
          </ul>
        </div>
      </div>

      <div className="container p-5">
        <h2>Hear It From Our Community</h2>
      </div>

      <footer className="text-center p-4 text-white">
        <p>&copy; 2024 Friendly Bets. All rights reserved.</p>
      </footer>
    </div>
  );
};

export { LandingPage };
