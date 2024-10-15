import { checkUserPassword, findUserByEmail } from "../Data";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOCALSTORAGE, NAVIGATION } from "../Config";
import { supabase } from "../supabaseClient";
import { updateBetTokens } from "../Data";
import Logo from "../Components/Logo";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [loginHover, setLoginHover] = useState(false);
  const [registerHover, setRegisterHover] = useState(false);
  const blueButtonStyle = {
    backgroundColor: loginHover ? "blue" : "#010286",
    color: "white",
  };
  const registerBtn = {
    backgroundColor: registerHover ? "#198754" : "#010286",
    color: "white",
  };

  const backgroundColor = {
    background: "linear-gradient(to bottom, #0B1305 0%, #00008B 100%)",
  };
  const registerHandler = () => {
    navigate(NAVIGATION.REGISTER);
  };
  const loginHandler = async () => {
    if (!email || !password) {
      alert("Please fill in both email and password");
      return;
    }

    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    // Check if the user data is available
    if (user) {

      navigate("/FriendlyBets");
    } else {

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session && session.user) {
        navigate("/FriendlyBets");
      }
    }
  };

  return (
    <div>
      <Logo />
      <div
        className="container p-3 mt-2"
        style={{ backgroundColor: "#1E1E1E", borderRadius: "5px" }}
      >
        <div
          className="card-body"
          style={{ backgroundColor: "#1E1E1E", borderRadius: "5px" }}
        >
          <h3 className="card-title text-center w-50 mb-4 login-text mx-auto">
            Sign In Here!
          </h3>
          <div className="mb-3 w-75 mx-auto">
            <label htmlFor="userName" className="form-label text-white">
              Email address
            </label>
            <input
              type="text"
              className="form-control"
              id="userName"
              placeholder="Email"
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="mb-3 mb-3 w-75 mx-auto">
            <label htmlFor="password" className="form-label text-white">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter Password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className="text-center">
            <button
              className="btn mt-3"
              type="button"
              style={blueButtonStyle}
              onMouseEnter={() => setLoginHover(true)}
              onMouseLeave={() => setLoginHover(false)}
              onClick={loginHandler}
            >
              Login
            </button>
          </div>
          <div className="text-center">
            <button
              className="btn mt-3"
              type="button"
              style={registerBtn}
              onMouseEnter={() => setRegisterHover(true)}
              onMouseLeave={() => setRegisterHover(false)}
              onClick={registerHandler}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Login };
