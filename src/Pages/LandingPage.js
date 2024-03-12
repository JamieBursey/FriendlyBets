import "./LandingPage.css";
import loginImage from "./images/LoginDisplay.png";
import Logo from "../Components/Logo";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <section className="hero-section text-center text-white p-5">
        <div className="container">
          <Logo />
        </div>
      </section>

      <div className="horizontal-scroll-container">
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
          <p>&copy; 2024 Friendly Bets. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export { LandingPage };
