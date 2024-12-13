
const VIPModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="modal" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Become a VIP!</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
          <p>
              You do not have enough bet tokens to place a bet. Please wait 24
              hours or purchase VIP for unlimited bets.
            </p>
            <p>VIP Status: $9.99/month</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary">Purchase VIP</button>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VIPModal;
