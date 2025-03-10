import React from "react";
import { useTheme } from "./ThemeContext";
import "./StyleTheme.css"
const ThemeModal = ({ isOpen, onClose }) => {
  const { theme, toggleTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Select Theme</h3>
        <div className="theme-options">
          <button
            className={`theme-option ${theme === "light" ? "active" : ""}`}
            onClick={() => toggleTheme("light")}
          >
            Light
          </button>
          <button
            className={`theme-option ${theme === "dark" ? "active" : ""}`}
            onClick={() => toggleTheme("dark")}
          >
            Dark
          </button>
          <button
            className={`theme-option ${theme === "retro" ? "active" : ""}`}
            onClick={() => toggleTheme("retro")}
          >
            Retro
          </button>
        </div>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ThemeModal;