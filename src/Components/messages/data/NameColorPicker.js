import { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import "../../../Components/messages/MessengerUI.css";

const SettingsModal = ({ open, onClose, userId, onColorChange }) => {
  const [color, setColor] = useState("#0078d4");

  useEffect(() => {
    if (!userId) return;
    const fetchColor = async () => {
      const { data } = await supabase
        .from("users")
        .select("name_color")
        .eq("public_user_id", userId)
        .single();
      if (data?.name_color) setColor(data.name_color);
    };
    fetchColor();
  }, [userId]);

  const handleChange = async (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    const { error } = await supabase
      .from("users")
      .update({ name_color: newColor })
      .eq("public_user_id", userId);

    if (!error && onColorChange) {
      onColorChange(newColor); // ✅ updates immediately in UI
    }
  };

  if (!open) return null;

  return (
    <div className="msn-modal-backdrop">
      <div className="msn-modal">
        <h3 style={{ marginBottom: "12px" }}>Chat Settings</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label htmlFor="nameColor">Name Color:</label>
          <input
            type="color"
            id="nameColor"
            value={color}
            onChange={handleChange}
          />
        </div>
        <div style={{ marginTop: "20px", textAlign: "right" }}>
          <button className="msn-btn xp-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
