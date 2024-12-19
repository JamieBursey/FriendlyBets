import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setMessage("Error resetting password. Please try again.");
        console.error("Password reset error:", error);
      } else {
        setMessage("Password reset successful!");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Reset Password</h2>
      <p>Enter your new password below:</p>
      <input
        type="password"
        className="form-control mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter new password"
      />
      <input
        type="password"
        className="form-control mb-3"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm new password"
      />
      <button className="btn btn-primary" onClick={handleResetPassword}>
        Reset Password
      </button>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
};

export default ResetPassword;
