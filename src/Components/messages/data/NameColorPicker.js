import { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
 // ✅ import the correct context
import "../../../Components/messages/MessengerUI.css";
import { useTheme } from "../../theme/ThemeContext";

const SettingsModal = ({ open, onClose, userId, onColorChange }) => {
  const [color, setColor] = useState("#0078d4");
  const [hexInput, setHexInput] = useState("#0078d4");
  const { theme, toggleTheme } = useTheme(); // ✅ use toggleTheme instead of setTheme

  useEffect(() => {
    if (!userId) return;
    const fetchColor = async () => {
      const { data } = await supabase
        .from("users")
        .select("name_color")
        .eq("public_user_id", userId)
        .single();
      if (data?.name_color) {
        setColor(data.name_color);
        setHexInput(data.name_color);
      }
    };
    fetchColor();
  }, [userId]);

  const updateColor = async (newColor) => {
    setColor(newColor);
    setHexInput(newColor);
    const { error } = await supabase
      .from("users")
      .update({ name_color: newColor })
      .eq("public_user_id", userId);

    if (!error && onColorChange) onColorChange(newColor);
  };

  const handleHexInputChange = (e) => {
    const value = e.target.value;
    setHexInput(value);
    if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(value)) {
      updateColor(value);
    }
  };

  if (!open) return null;

  return (
    <div className="msn-modal-backdrop">
      <div className={`msn-modal msn-modal-card ${theme}`}>
        <h3 className="msn-modal-title">⚙️ Chat Settings</h3>

        {/* Theme Switcher */}
        <div className="theme-section">
          <label className="color-label">Theme:</label>
          <div className="theme-options">
            {["light", "dark", "retro"].map((t) => (
              <button
                key={t}
                className={`theme-btn ${theme === t ? "active" : ""}`}
                onClick={() => toggleTheme(t)} // ✅ use toggleTheme here
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Name Color Picker */}
        <div className="color-picker-section">
          <label htmlFor="nameColor" className="color-label">
            Name Color:
          </label>
          <div className="color-picker-wrapper">
            <input
              type="color"
              id="nameColor"
              value={color}
              onChange={(e) => updateColor(e.target.value)}
              className="color-input"
            />
            <input
              type="text"
              value={hexInput}
              onChange={handleHexInputChange}
              maxLength={7}
              className="hex-input"
            />
            <span className="color-preview" style={{ backgroundColor: color }} />
          </div>
        </div>

        <div className="modal-footer">
          <button className="msn-btn xp-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
