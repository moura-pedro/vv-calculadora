import React from 'react';

const SummaryTable = ({ summary }) => {
  return (
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
          {summary.map(({ month, jobs, total, minimumWage, displayDate }) => (
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
  );
};

export default SummaryTable;