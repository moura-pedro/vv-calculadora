// src/components/JobsForm/JobsForm.jsx
import React, { useState, useMemo } from 'react';
import './JobsForm.css';

const JobsForm = () => {
  // Minimum wage data structure
  const minimumWages = [
    { date: '2024-01', value: 1412.00 },
    { date: '2023-05', value: 1320.00 },
    { date: '2023-01', value: 1302.00 },
    { date: '2022-01', value: 1212.00 },
    { date: '2021-01', value: 1100.00 },
    { date: '2020-02', value: 1045.00 },
    { date: '2020-01', value: 1039.00 },
    { date: '2019-01', value: 998.00 },
    { date: '2018-01', value: 954.00 },
    { date: '2017-01', value: 937.00 },
    { date: '2016-01', value: 880.00 },
    { date: '2015-01', value: 788.00 },
    { date: '2014-01', value: 724.00 },
    { date: '2013-01', value: 678.00 },
    { date: '2012-01', value: 622.00 },
    { date: '2011-03', value: 545.00 },
    { date: '2011-01', value: 540.00 },
    { date: '2010-01', value: 510.00 },
    { date: '2009-02', value: 465.00 },
    { date: '2008-03', value: 415.00 },
    { date: '2007-04', value: 380.00 },
    { date: '2006-04', value: 350.00 },
    { date: '2005-05', value: 300.00 },
    { date: '2004-05', value: 260.00 },
    { date: '2003-06', value: 240.00 },
    { date: '2002-06', value: 200.00 },
    { date: '2001-06', value: 180.00 },
    { date: '2000-06', value: 151.00 },
    { date: '1999-05', value: 136.00 },
    { date: '1998-05', value: 130.00 },
    { date: '1997-05', value: 120.00 },
    { date: '1996-05', value: 112.00 },
    { date: '1995-05', value: 100.00 },
    { date: '1994-09', value: 70.00 },
    { date: '1994-07', value: 64.79 }
  ];

  // State for jobs
  const [jobs, setJobs] = useState([{
    id: Date.now(),
    name: '',
    type: '',
    employmentType: '',
    startDate: '',
    endDate: '',
    salary: ''
  }]);

  // Function to get minimum wage for a specific date
  const getMinimumWageForDate = (dateStr) => {
    const targetDate = dateStr;
    for (const wage of minimumWages) {
      if (targetDate >= wage.date) {
        return wage.value;
      }
    }
    return minimumWages[minimumWages.length - 1].value;
  };

  // Function to add a new job
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

  // Function to remove a job
  const removeJob = (jobId) => {
    if (jobs.length > 1) {
      setJobs(jobs.filter(job => job.id !== jobId));
    }
  };

  // Function to update job fields
  const updateJob = (jobId, field, value) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, [field]: value } : job
    ));
  };

  // Helper function to generate months between two dates
  const getMonthsBetweenDates = (startDate, endDate) => {
    if (!startDate || !endDate) return [];
    
    const start = new Date(startDate + "-01");
    const end = new Date(endDate + "-01");
    const months = [];
    
    const current = new Date(start);
    
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
              jobs: [],
              minimumWage: getMinimumWageForDate(monthKey),
              displayDate: `${String(date.getMonth() + 2).padStart(2, '0')}/${date.getFullYear()}`
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

        <div className="summary-table-container">
          <h3>Monthly Summary</h3>
          <table className="summary-table">
            <thead>
              <tr>
                <th>Month/Year</th>
                <th>Jobs</th>
                <th>Total Salary</th>
                <th>Minimum Wage</th>
              </tr>
            </thead>
            <tbody>
              {monthlySummary.map(({ month, jobs, total, minimumWage, displayDate }) => (
                <tr key={month}>
                  <td className="date-column">{displayDate}</td>
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
                  <td className="minimum-wage">
                    R$ {minimumWage.toLocaleString('pt-BR', {
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