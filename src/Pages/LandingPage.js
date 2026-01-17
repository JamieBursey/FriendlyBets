import "./LandingPage.css";
import loginImage from "./images/LoginDisplay.png";
import Logo from "../Components/Logo";
import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight, faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const scrollContainerRef = useRef(null);

  const scrollLeft = (scrollOffset) => {
    scrollContainerRef.current.scrollLeft -= 300;
  };
  const scrollRight = () => {
    scrollContainerRef.current.scrollLeft += 300;
  };
  return (
    <div className="landing-page">
      <section className="hero-section text-center text-white p-5">
        <div className="container">
          <Logo />
        </div>
      </section>
      <div className="scroll-buttons left">
        <button onClick={scrollLeft}>
          <FontAwesomeIcon icon={faAnglesLeft} />
        </button>
      </div>
      <div className="scroll-buttons right">
        <button onClick={scrollRight}>
          <FontAwesomeIcon icon={faAnglesRight} />
        </button>
      </div>
      <div className="horizontal-scroll-container" ref={scrollContainerRef}>
        <section className="horizontal-section bg-primary text-white p-5">
          <div className="container">
            <h2>Register</h2>
            <p>Sign up and become part of the Friendly Bets community...</p>
            <img src={loginImage} alt="loginImage" className="img-fluid" />
          </div>
        </section>

        <section className="horizontal-section bg-success text-white p-5">
          <div className="container">
            <h2>Adding Friends</h2>
            <p>Easily connect with friends and start betting together...</p>
            {/* Add image */}
          </div>
        </section>

        <section className="horizontal-section bg-info text-white p-5">
          <div className="container">
            <h2>Making Bets</h2>
            <p>
              Create bets on your favorite games and challenge your friends...
            </p>
            {/* Add image */}
          </div>
        </section>

        <section className="horizontal-section bg-warning text-white p-5">
          <div className="container">
            <h2>Checking Bets</h2>
            <p>Keep track of your bets and see your winning chances...</p>
            {/* Add image */}
          </div>
        </section>
      </div>
      <footer className="footer bg-dark text-center text-white p-4">
        <div className="container">
          <div className="mb-3">
            <Link 
              to="/mini-games" 
              className="btn btn-outline-light btn-lg"
              style={{ 
                textDecoration: 'none',
                borderWidth: '2px',
                fontWeight: 'bold'
              }}
            >
              🎮 Play Mini Games
            </Link>
          </div>
          <p>&copy; 2024 Friendly Bets. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export { LandingPage };
