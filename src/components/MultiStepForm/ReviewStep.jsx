// src/components/MultiStepForm/ReviewStep.jsx
import React from 'react';
import './ReviewStep.css';

const ReviewStep = ({ formData, onSubmit }) => {
  return (
    <div className="review-step">
      <h2 className="review-title">Review Your Information</h2>
      <div className="review-content">
        {formData.jobs.map((job, index) => (
          <div key={job.id} className="review-job-card">
            <h3>Job {index + 1}: {job.name}</h3>
            <div className="job-details">
              <p><strong>Type:</strong> {job.type}</p>
              <p><strong>Employment Type:</strong> {job.employmentType}</p>
              <p><strong>Period:</strong> {job.startDate} to {job.endDate}</p>
              <p><strong>Salary:</strong> R$ {Number(job.salary).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={onSubmit} className="submit-button">
        Submit
      </button>
    </div>
  );
};

export default ReviewStep;

