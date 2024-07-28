import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOCALSTORAGE, NAVIGATION } from "../Config";
import { TeamDropdown } from "../Data";
import { supabase } from "../supabaseClient";
import Logo from "../Components/Logo";

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
            betToken: 3,
            hasDonated: false,
            friends: JSON.stringify([]),
            avatar: JSON.stringify([]),
            bets: JSON.stringify([]),
          },
        },
      });

      if (error) {
        throw error;
      }

      if (user) {
        console.log("User registered:", user);
        // Optionally, handle navigation or additional setup here
      }
    } catch (error) {
      console.error("Signup error:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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
            className="btn  mt-4"
            type="button"
            onClick={registerUser}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={blueButtonStyle}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export { Register };
export default backgroundColor;
