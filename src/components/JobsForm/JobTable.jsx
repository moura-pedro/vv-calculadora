import React from 'react';
import { getMinimumWageForDate } from './SalarioMinimo';
import { getTetoForDate } from './Teto';
import GridRow from './GridRow';

const JobTable = ({
    dateRange,
    jobColumns,
    onUpdateCell,
    onRemoveJob,
    onUpdateJobTitle,
    onUpdateJobType,
    inputRefs,
    onKeyDown
}) => {
    const formatMonthYear = (date) => {
        return new Intl.DateTimeFormat('pt-BR', {
            month: 'short',
            year: 'numeric'
        }).format(date);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const getInputId = (rowIndex, colId) => `${rowIndex}-${colId}`;

    return (
        <div className="table-container">
            <table className="grid-table">
                <thead>
                    <tr>
                        <th className="month-column">Mês</th>
                        {jobColumns.map(column => (
                            <th key={column.id} className="job-column">
                                <div className="job-header">
                                    <input
                                        type="text"
                                        className="job-title-input"
                                        value={column.title}
                                        onChange={(e) => onUpdateJobTitle(column.id, e.target.value)}
                                        placeholder="Nome do Trabalho"
                                    />
                                    {jobColumns.length > 1 && (
                                        <button
                                            onClick={() => onRemoveJob(column.id)}
                                            className="remove-job-button"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                                <div className="job-type-controls">
                                    <select
                                        className="job-type-select"
                                        value={column.type}
                                        onChange={(e) => onUpdateJobType(column.id, 'type', e.target.value)}
                                    >
                                        <option value="RGPS">RGPS</option>
                                        <option value="RPPS">RPPS</option>
                                    </select>
                                    <select
                                        className="job-type-select"
                                        value={column.employmentType}
                                        onChange={(e) => onUpdateJobType(column.id, 'employmentType', e.target.value)}
                                    >
                                        <option value="Empregada">Empregada</option>
                                        <option value="CI">CI</option>
                                    </select>
                                </div>
                            </th>
                        ))}
                        <th>Total</th>
                        <th>Teto</th>
                        <th>SM</th>
                    </tr>
                </thead>
                <tbody>
                    {dateRange.map((date, rowIndex) => (
                        <GridRow
                            key={date.toISOString()}
                            date={date}
                            jobColumns={jobColumns}
                            onUpdateCell={onUpdateCell}
                            inputRefs={inputRefs}
                            onKeyDown={onKeyDown}
                            rowIndex={rowIndex}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default JobTable;