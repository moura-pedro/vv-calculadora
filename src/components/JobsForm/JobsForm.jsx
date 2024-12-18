// src/components/JobsForm/JobsForm.jsx
import React, { useState, useMemo } from 'react';
import './JobsForm.css';

const JobsForm = () => {
  const [jobs, setJobs] = useState([{
    id: Date.now(),
    name: '',
    type: '',
    employmentType: '',
    startDate: '',
    endDate: '',
    salary: ''
  }]);

  const addJob = () => {
    setJobs([...jobs, {
      id: Date.now(),
      name: '',
      type: '',
      employmentType: '',
      startDate: '',
      endDate: '',
      salary: ''
    }]);
  };

  const removeJob = (jobId) => {
    if (jobs.length > 1) {
      setJobs(jobs.filter(job => job.id !== jobId));
    }
  };

  const updateJob = (jobId, field, value) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, [field]: value } : job
    ));
  };

  // Helper function to generate months between two dates
  const getMonthsBetweenDates = (startDate, endDate) => {
    if (!startDate || !endDate) return [];
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = [];
    
    const current = new Date(start);
    current.setDate(1); // Set to first day of month
    
    while (current <= end) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }
    
    return months;
  };

  // Calculate monthly summary
  const monthlySummary = useMemo(() => {
    const summary = new Map();
    
    jobs.forEach(job => {
      if (job.startDate && job.endDate && job.salary) {
        const months = getMonthsBetweenDates(job.startDate, job.endDate);
        
        months.forEach(date => {
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          if (!summary.has(monthKey)) {
            summary.set(monthKey, {
              total: 0,
              jobs: []
            });
          }
          
          const monthData = summary.get(monthKey);
          monthData.total += Number(job.salary);
          monthData.jobs.push({
            name: job.name,
            type: job.type,
            employmentType: job.employmentType,
            salary: Number(job.salary)
          });
        });
      }
    });
    
    // Convert to array and sort by date
    return Array.from(summary.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month,
        ...data
      }));
  }, [jobs]);

  return (
    <div className="jobs-form">
      <div className="jobs-form-container">
        <h2>Add Jobs</h2>
        
        {jobs.map((job, index) => (
          <div key={job.id} className="job-card">
            <div className="job-header">
              <h3>Job {index + 1}</h3>
              {jobs.length > 1 && (
                <button 
                  className="remove-button"
                  onClick={() => removeJob(job.id)}
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
                onChange={(e) => updateJob(job.id, 'name', e.target.value)}
                placeholder="Enter job name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`type-${job.id}`}>Type:</label>
                <select
                  id={`type-${job.id}`}
                  value={job.type}
                  onChange={(e) => updateJob(job.id, 'type', e.target.value)}
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
                  onChange={(e) => updateJob(job.id, 'employmentType', e.target.value)}
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
                  onChange={(e) => updateJob(job.id, 'startDate', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor={`endDate-${job.id}`}>End Date:</label>
                <input
                  id={`endDate-${job.id}`}
                  type="month"
                  value={job.endDate}
                  onChange={(e) => updateJob(job.id, 'endDate', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor={`salary-${job.id}`}>Salary:</label>
              <input
                id={`salary-${job.id}`}
                type="number"
                value={job.salary}
                onChange={(e) => updateJob(job.id, 'salary', e.target.value)}
                placeholder="Enter salary"
              />
            </div>
          </div>
        ))}

        <button className="add-button" onClick={addJob}>
          Add Another Job
        </button>

        {/* Monthly Summary Table */}
        <div className="summary-table-container">
          <h3>Monthly Summary</h3>
          <table className="summary-table">
            <thead>
              <tr>
                <th>Month/Year</th>
                <th>Jobs</th>
                <th>Total Salary</th>
              </tr>
            </thead>
            <tbody>
              {monthlySummary.map(({ month, jobs, total }) => (
                <tr key={month}>
                  <td>{month.split('-').reverse().join('/')}</td>
                  <td>
                    <ul className="jobs-list">
                      {jobs.map((job, index) => (
                        <li key={index}>
                          {job.name} ({job.type} - {job.employmentType})
                          : R$ {job.salary.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="total-salary">
                    R$ {total.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JobsForm;