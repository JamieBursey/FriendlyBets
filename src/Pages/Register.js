import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Logo from "../Components/Logo";
import { TeamDropdown } from "../Data";

const RegisterSuccess = ({ message, onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <h4>{message}</h4>
        <p>Please check spam folders</p>
        <button
          className="btn mt-4"
          onClick={onClose}
          style={{ marginTop: "10px", backgroundColor: "blue", color: "white" }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const backgroundColor = {
  background: "linear-gradient(to bottom, #0B1305 0%, #00008B 100%)",
  minHeight: "100vh",
};

function Register() {
  const navigate = useNavigate();
  const [username, setUserName] = useState(null);
  const [password, setPassword] = useState(null);
  const [email, setEmail] = useState(null);
  const [favoriteTeam, setFavoriteTeam] = useState(null);
  const [hover, setHover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const blueButtonStyle = {
    backgroundColor: hover ? "blue" : "#010286",
    color: "white",
  };

  const registerUser = async () => {
    if (!username || !password || !email || !favoriteTeam) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);

    try {
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            favoriteTeam,
            betToken: 5,
            hasDonated: false,
            friends: JSON.stringify([]),
            avatar: JSON.stringify([]),
            bets: JSON.stringify([]),
          },
          redirectTo: "https://jamiebursey.github.io/FriendlyBets/#/login",
        },
      });

      if (error) {
        throw error;
      }

      if (user) {
        // Show the custom popup
        console.log(user);
      }
    } catch (error) {
      console.error("Signup error:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
      setShowPopup(true);
    }
  };

  return (
    <div style={backgroundColor}>
      <Logo />
      <div
        className="container mx-auto mt-2 p-3"
        style={{ backgroundColor: "#1E1E1E", borderRadius: "5px" }}
      >
        <div className="card-body text-center">
          <h3 className="card-title text-center w-50 mb-4 register-text mx-auto ">
            Register Here!
          </h3>
          <input
            type="email"
            className="form-control mb-3 w-75 mx-auto"
            placeholder="Enter Email"
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            type="text"
            className="form-control mb-3 w-75 mx-auto"
            placeholder="Display Name"
            onChange={(event) => setUserName(event.target.value)}
          />
          <input
            type="password"
            className="form-control mb-3 w-75 mx-auto"
            placeholder="Enter Password"
            onChange={(event) => setPassword(event.target.value)}
          />
          <TeamDropdown teamSelect={setFavoriteTeam} />
          <button
            className="btn mt-4"
            type="button"
            onClick={registerUser}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={blueButtonStyle}
            disabled={loading} // Disable button when loading
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </div>
      {showPopup && (
        <RegisterSuccess
          message="Registration Successful! Please check Email for Verification."
          onClose={() => {
            setShowPopup(false);
            navigate("/login");
          }}
        />
      )}
    </div>
  );
}

export { Register };
export default backgroundColor;
