import React from "react";
import { useTheme } from "./ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme(); // Get the current theme and toggle function

  return (
    <div className="theme-toggle">
      <label>
        <input
          type="radio"
          name="theme"
          value="light"
          checked={theme === "light"}
          onChange={(e) => toggleTheme(e.target.value)}
        />
        Light
      </label>
      <label>
        <input
          type="radio"
          name="theme"
          value="dark"
          checked={theme === "dark"}
          onChange={(e) => toggleTheme(e.target.value)}
        />
        Dark
      </label>
      <label>
        <input
          type="radio"
          name="theme"
          value="retro"
          checked={theme === "retro"}
          onChange={(e) => toggleTheme(e.target.value)}
        />
        Retro
      </label>
    </div>
  );
};

export default ThemeToggle;