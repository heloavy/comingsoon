import React from 'react';
import WaitlistForm from './WaitlistForm';
import styles from '../styles/overlay.module.css';

const LandingOverlay = ({ onClose }) => {
  return (
    <div className="modal-content">
      <button className="close-btn" onClick={onClose}>&times;</button>
      {/* Removed inline styles for scrollable content */}
      <div>
        <h1 className="modal-header">Be one of the first 200 businesses to sign up and get a free year of Heloavy!</h1>
        <p className="modal-subheader">Heloavy: Your on-demand AI development partner.</p>
        <div className="form-area"> {/* Add a container for the form if needed for specific styling */}
          <WaitlistForm onClose={onClose} />
        </div>
      </div>
 {/* The submit button and status message will be rendered within WaitlistForm */}
 {/* Add a modal-footer div to maintain the structure expected by the CSS */}
    </div>
  );
};

export default LandingOverlay;