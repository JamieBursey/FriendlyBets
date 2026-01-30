import { supabase } from "../../supabaseClient";
import { useState } from "react";
import PopUpMessages from "./PopUpMessages";
import { useTheme } from "../theme/ThemeContext";

const CardInfoModal = ({ show, onClose, onDonationSuccess }) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { theme } = useTheme();

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

  const inputStyle = {
    backgroundColor: theme === "retro" ? "#fffbe6" : theme === "dark" ? "#333" : "#fff",
    color: theme === "retro" ? "#2b2b2b" : theme === "dark" ? "#fff" : "#000",
    border: theme === "retro" ? "1px solid #ff9900" : theme === "dark" ? "1px solid #444" : "1px solid #ccc",
    fontFamily: theme === "retro" ? "Courier New, Courier, monospace" : "inherit",
  };

  const handlePurchase = async () => {
    setSuccessMessage("Thank you for your purchase! Your VIP status has been activated.");
    setShowSuccessMessage(true);

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("Error fetching session:", sessionError);
      return;
    }

    if (sessionData?.session?.user) {
      const user = sessionData.session.user;

      const { error: updateError } = await supabase
        .from("users")
        .update({ has_donated: true, donateDate: new Date().toISOString() })
        .eq("public_user_id", user.id);

      if (updateError) {
        console.error("Error updating user donation status:", updateError);
        setSuccessMessage("An error occurred. Please try again.");
        return;
      }
      if (onDonationSuccess) onDonationSuccess();
    }

    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (!show) return null;

  return (
    <div style={overlayStyle}>
      <div className="modal-dialog" style={{ maxWidth: 400, width: "90vw" }}>
        <div className="modal-content" style={modalStyles[theme]}>
          <div className="modal-header">
            <h5 className="modal-title">Enter Payment Information</h5>
            <h4>No payment system yet. just click complete purchase and enjoy the free VIP</h4>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {/* PayPal Donate Button */}
            <div className="mb-3 text-center">
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" style={{ display: 'inline-block' }}>
                <input type="hidden" name="cmd" value="_s-xclick" />
                <input type="hidden" name="hosted_button_id" value="TUXDREB2TUYJG" />
                <input type="hidden" name="currency_code" value="CAD" />
                <input type="hidden" name="return" value="https://www.friendlybets.ca/" />
                <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_paynow_SM.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Buy Now" style={{ margin: '0 auto', display: 'block' }} />
              </form>
              <div style={{ fontSize: 12, marginTop: 8, color: modalStyles[theme].color }}>Powered by PayPal</div>
            </div>
            {/* ...existing card form... */}
            <form>
              <div className="mb-3">
                <label htmlFor="cardNumber" className="form-label">Card Number</label>
                <input type="text" className="form-control" id="cardNumber" placeholder="1234 5678 9012 3456" style={inputStyle} />
              </div>
              <div className="mb-3">
                  <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
                  <input type="text" className="form-control" id="expiryDate" placeholder="MM/YY" />
                </div>
                <div className="mb-3">
                  <label htmlFor="cvv" className="form-label">CVV</label>
                  <input type="text" className="form-control" id="cvv" placeholder="123" />
                </div>
                <button type="button" className="btn btn-primary" onClick={handlePurchase}>
                  Confirm Purchase
                </button>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>Close</button>
            </div>
            <PopUpMessages
              show={showSuccessMessage}
              title="Purchase Status"
              message={successMessage}
              onClose={() => setShowSuccessMessage(false)}
            />
          </div>
        </div>
      </div>
    );
  };
  
  export default CardInfoModal;
  