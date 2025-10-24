
import "./MessengerUI.css"

export default function LeaveChatModal({ open, chatName, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="msn-modal-backdrop">
      <div className="msn-modal">
        <div className="msn-modal-titlebar">Leave Chat?</div>
        <div className="msn-modal-body">
          <p>
            Are you sure you want to leave <b>{chatName || "this chat"}</b>?
          </p>
        </div>
        <div className="msn-modal-actions">
          <button className="msn-btn xp-secondary" onClick={onCancel}>Cancel</button>
          <button className="msn-btn xp-primary" onClick={onConfirm}>Leave Chat</button>
        </div>
      </div>
    </div>
  );
}
