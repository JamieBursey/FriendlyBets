import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Logo from "../Components/Logo";
import { TeamDropdown } from "../Data";
import { useTheme } from "../Components/theme/ThemeContext";

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


function Register() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [username, setUserName] = useState(null);
  const [password, setPassword] = useState(null);
  const [email, setEmail] = useState(null);
  const [favoriteTeam, setFavoriteTeam] = useState(null);
  const [hover, setHover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const blueButtonStyle = {
    backgroundColor: hover ? "blue" : "#010286",
    color: "white",
  };
const backgroundColor = {
  light: {
    page: {
      backgroundColor: "#ffffff",
      color: "#000000",
    },
    card: {
      backgroundColor: "#f0f0f0",
      color: "#000000",
      border: "1px solid #ddd",
      borderRadius: "10px",
    },
    button: {
      backgroundColor: "#007bff",
      color: "#ffffff",
    },
  },
  dark: {
    page: {
      backgroundColor: "#1e1e1e",
      color: "#ffffff",
    },
    card: {
      backgroundColor: "#2a2a2a",
      color: "#ffffff",
      border: "1px solid #444",
      borderRadius: "10px",
    },
    button: {
      backgroundColor: "#010286",
      color: "#ffffff",
    },
  },
  retro: {
    page: {
      background: "linear-gradient(boto ttom, #0B1305 0%, #00008B 100%)",
      color: "#2b2b2b",
      fontFamily: "Courier New, monospace",
    },
    card: {
      backgroundColor: "#ffe0b2",
      color: "#2b2b2b",
      border: "2px solid #ff9900",
      borderRadius: "10px",
    },
    button: {
      backgroundColor: "#ff9900",
      color: "#2b2b2b",
    },
  },
};
const togglePasswordVisibility = () => {
  setShowPassword(!showPassword);
};
  const registerUser = async () => {
    if (!username || !password || !email) {
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
const styles=backgroundColor[theme] ||backgroundColor.light;
  return (
    <div style={styles.page}>
      <Logo />
      <div
        className="container mx-auto mt-2 p-3"
        style={styles.card}
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
<div className="position-relative w-75 mx-auto mb-3">
  <input
    type={showPassword ? "text" : "password"}
    className="form-control"
    placeholder="Enter Password"
    onChange={(event) => setPassword(event.target.value)}
  />
  <span
    onClick={togglePasswordVisibility}
    style={{
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      zIndex: 5,
      backgroundColor: "white",
      padding: "0 5px",
    }}
  >
    {showPassword ? "👁️" : "👁️‍🗨️"}
  </span>
</div>
          <TeamDropdown teamSelect={setFavoriteTeam} />
          <button
            className="btn mt-4"
            type="button"
            onClick={registerUser}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={blueButtonStyle}
            disabled={loading} 
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

