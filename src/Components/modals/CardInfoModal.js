import { supabase } from "../../supabaseClient";
import { useState } from "react";
import PopUpMessages from "./PopUpMessages";

const CardInfoModal = ({ show, onClose,onDonationSuccess }) => {
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
  
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
 <div
  className="modal show d-flex align-items-center justify-content-center"
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1050,
  }}
>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Enter Payment Information</h5>
              <h4>No payment system yet. just click comeplete purchase and enjoy the free VIP</h4>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="cardNumber" className="form-label">Card Number</label>
                  <input type="text" className="form-control" id="cardNumber" placeholder="1234 5678 9012 3456" />
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
  