import React from 'react';

const JobCard = ({ job, index, onRemove, onUpdate, canRemove }) => {
  return (
    <div className="job-card">
      <div className="job-header">
        <h3>Job {index + 1}</h3>
        {canRemove && (
          <button 
            className="remove-button"
            onClick={() => onRemove(job.id)}
          >
            Remove
          </button>
        )}
      </div>

      <div className="form-group">
        <label htmlFor={`name-${job.id}`}>Job Name:</label>
        <input
          id={`name-${job.id}`}
          type="text"
          value={job.name}
          onChange={(e) => onUpdate(job.id, 'name', e.target.value)}
          placeholder="Enter job name"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor={`type-${job.id}`}>Type:</label>
          <select
            id={`type-${job.id}`}
            value={job.type}
            onChange={(e) => onUpdate(job.id, 'type', e.target.value)}
          >
            <option value="">Select Type</option>
            <option value="RGPS">RGPS</option>
            <option value="RPPS">RPPS</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor={`employmentType-${job.id}`}>Employment Type:</label>
          <select
            id={`employmentType-${job.id}`}
            value={job.employmentType}
            onChange={(e) => onUpdate(job.id, 'employmentType', e.target.value)}
          >
            <option value="">Select Employment Type</option>
            <option value="Empregada">Empregada</option>
            <option value="CI">CI</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor={`startDate-${job.id}`}>Start Date:</label>
          <input
            id={`startDate-${job.id}`}
            type="month"
            value={job.startDate}
            onChange={(e) => onUpdate(job.id, 'startDate', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor={`endDate-${job.id}`}>End Date:</label>
          <input
            id={`endDate-${job.id}`}
            type="month"
            value={job.endDate}
            onChange={(e) => onUpdate(job.id, 'endDate', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor={`salary-${job.id}`}>Salary:</label>
        <input
          id={`salary-${job.id}`}
          type="number"
          value={job.salary}
          onChange={(e) => onUpdate(job.id, 'salary', e.target.value)}
          placeholder="Enter salary"
        />
      </div>
    </div>
  );
};

export default JobCard;