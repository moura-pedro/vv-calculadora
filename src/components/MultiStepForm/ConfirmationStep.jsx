import React from 'react';
import './ConfirmationStep.css';

const ConfirmationStep = () => {
  return (
    <div className="confirmation-step">
      <div className="confirmation-content">
        <h2>Success!</h2>
        <p>Your information has been submitted successfully.</p>
        {/* Add any additional confirmation details or next steps here */}
      </div>
    </div>
  );
};

export default ConfirmationStep;