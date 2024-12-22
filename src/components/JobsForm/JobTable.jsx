import React from 'react';
import { getMinimumWageForDate } from './SalarioMinimo';
import { getTetoForDate } from './Teto';

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
                    {dateRange.map((date, rowIndex) => {
                        const dateKey = date.toISOString().slice(0, 7);
                        const rowTotal = jobColumns.reduce((sum, col) =>
                            sum + (Number(col.values[dateKey]) || 0), 0
                        );
                        const minimumWage = getMinimumWageForDate(dateKey);
                        const teto = getTetoForDate(dateKey);

                        return (
                            <tr key={dateKey}>
                                <td className="month-column">
                                    {formatMonthYear(date)}
                                </td>
                                {jobColumns.map(column => {
                                    const inputId = getInputId(rowIndex, column.id);
                                    return (
                                        <td key={`${dateKey}-${column.id}`}>
                                            <input
                                                ref={el => inputRefs.current[inputId] = el}
                                                type="number"
                                                className="salary-input"
                                                value={column.values[dateKey] || ''} // Show empty string if value is 0 or undefined
                                                onChange={(e) => onUpdateCell(dateKey, column.id, e.target.value)}
                                                onKeyDown={(e) => onKeyDown(e, rowIndex, column.id)}
                                            />
                                        </td>
                                    );
                                })}
                                <td className="total-column">{formatCurrency(rowTotal)}</td>
                                <td className="teto-column">{formatCurrency(teto)}</td>
                                <td className="sm-column">{formatCurrency(minimumWage)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default JobTable;