// src/components/messages/AddPeopleModal.jsx
import React, { useState } from "react";

const AddPeopleModal = ({ open, friends, existing, onCancel, onConfirm }) => {
  const [selected, setSelected] = useState([]);

  if (!open) return null;

  const toggleSelect = (u) => {
    setSelected(prev =>
      prev.includes(u.public_user_id)
        ? prev.filter(id => id !== u.public_user_id)
        : [...prev, u.public_user_id]
    );
  };

  return (
    <div className="msn-modal-backdrop">
      <div className="msn-modal">
        <div className="msn-modal-titlebar">Add People to Chat</div>
<div className="msn-modal-body">
  {friends.length === 0 ? (
    <p>No friends to add.</p>
  ) : (
    <div className="add-people-list">
      {friends.map(f => (
        <div
          key={f.public_user_id}
          className={`friend-select-item ${selected.includes(f.public_user_id) ? "active" : ""}`}
          onClick={() => toggleSelect(f)}
        >
          <span>{f.username}</span>
          <span className="friend-select-check">✔</span>
        </div>
      ))}
    </div>
  )}
</div>
        <div className="msn-modal-actions">
          <button className="msn-btn xp-secondary" onClick={onCancel}>Cancel</button>
          <button className="msn-btn xp-primary" onClick={() => onConfirm(selected)}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default AddPeopleModal;
