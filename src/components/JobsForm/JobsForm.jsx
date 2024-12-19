import React, { useState, useMemo } from 'react';
import JobCard from './JobCard';
import SummaryTable from './SummaryTable';
import { getMinimumWageForDate } from './MinimumWage';
import { getMonthsBetweenDates } from './utils';
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
          <JobCard
            key={job.id}
            job={job}
            index={index}
            onRemove={removeJob}
            onUpdate={updateJob}
            canRemove={jobs.length > 1}
          />
        ))}

        <button className="add-button" onClick={addJob}>
          Add Another Job
        </button>

        <SummaryTable summary={monthlySummary} />
      </div>
    </div>
  );
};

export default JobsForm;