import React from "react";

const PopUpMessages = ({ show, onClose, title, message, onConfirm, confirmText = "Confirm", cancelText = "Close" }) => {
  if (!show) return null;

  return (
    <div className="modal" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title || "Message"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>{message || "This is a pop-up message!"}</p>
          </div>
          <div className="modal-footer">
            {onConfirm && (
              <button className="btn btn-primary" onClick={onConfirm}>
                {confirmText}
              </button>
            )}
            <button className="btn btn-secondary" onClick={onClose}>
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopUpMessages;
