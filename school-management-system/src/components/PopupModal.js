import React from 'react';
import '../styles/PopupModal.css';

const PopupModal = ({ config, onClose }) => {
  if (!config.isVisible) {
    return null;
  }

  const { message, type, onConfirm } = config;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="popup-modal-overlay" onClick={onClose}>
      <div className="popup-modal" onClick={(e) => e.stopPropagation()}>
        <div className="popup-modal-header">
          <h5 className="modal-title">{type === 'confirm' ? 'Confirmation' : 'Notification'}</h5>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
        </div>
        <div className="popup-modal-body">
          <p>{message}</p>
        </div>
        <div className="popup-modal-footer">
          {type === 'confirm' ? (
            <>
              <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={handleConfirm}>
                OK
              </button>
            </>
          ) : (
            <button type="button" className="btn btn-primary" onClick={onClose}>
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
