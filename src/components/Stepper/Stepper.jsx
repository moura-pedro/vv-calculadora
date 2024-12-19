// src/components/Stepper/Stepper.jsx
import React from 'react';
import './Stepper.css';

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="stepper">
      <div className="stepper-container">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step circle */}
            <div className="step-item">
              <div className={`step-circle ${index + 1 <= currentStep ? 'active' : ''}`}>
                <span className="step-number">{index + 1}</span>
              </div>
              <div className="step-label">
                {step.label}
              </div>
            </div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className={`step-connector ${index + 1 < currentStep ? 'active' : ''}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Stepper;