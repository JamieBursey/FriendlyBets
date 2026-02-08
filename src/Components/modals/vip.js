import CardInfoModal from "./CardInfoModal";
import { useState } from "react";
import { useTheme } from "../theme/ThemeContext";


const VIPModal = ({ show, onClose, onDonationSuccess }) => {
  const [showCardModal, setShowCardModal] = useState(false);
  const { theme } = useTheme();

  if (!show) return null;

  // Theme-based styles for modal content
  const modalStyles = {
    light: {
      backgroundColor: "#fff",
      color: "#000",
      border: "1px solid #ddd",
    },
    dark: {
      backgroundColor: "#222",
      color: "#fff",
      border: "1px solid #444",
    },
    retro: {
      backgroundColor: "#f4e2d8",
      color: "#2b2b2b",
      fontFamily: "Courier New, Courier, monospace",
      border: "2px solid #ff9900",
    },
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1050,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const handlePurchaseClick = () => {
    setShowCardModal(true);
  };

  return (
    <>
      <div style={overlayStyle}>
        <div className="modal-dialog" style={{ maxWidth: 400, width: "90vw" }}>
          <div className="modal-content" style={modalStyles[theme]}>
            <div className="modal-header">
              <h5 className="modal-title">Become a VIP!</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <p>You do not have enough bet tokens to place a bet. Please wait 24 hours or purchase VIP for unlimited bets.
                or play out minigames to earn tokens.
              </p>
              <p>VIP Status: Donation</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handlePurchaseClick}>
                Purchase VIP
              </button>
              <button className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <CardInfoModal
        show={showCardModal}
        onClose={() => {
          setShowCardModal(false); // Only close CardInfoModal
        }}
        onDonationSuccess={onDonationSuccess}
      />
    </>
  );
};

export default VIPModal;
