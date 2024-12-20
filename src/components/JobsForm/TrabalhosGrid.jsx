import React, { useState, useEffect, useRef } from 'react';
import { getMinimumWageForDate } from './SalarioMinimo';
import { getTetoForDate } from './Teto';
import './TrabalhosGrid.css'

const TrabalhosGrid = () => {
    const [dateRange, setDateRange] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [activeCell, setActiveCell] = useState(null);
    const [jobColumns, setJobColumns] = useState([
        {
            id: 1,
            title: '',
            type: 'RGPS',
            employmentType: 'Empregada',
            values: {}
        }
    ]);

    const inputRefs = useRef({});

    useEffect(() => {
        if (startDate && endDate) {
            const dates = generateDateRange(startDate, endDate);
            setDateRange(dates);
        }
    }, [startDate, endDate]);

    const generateDateRange = (start, end) => {
        const dates = [];
        const [startYear, startMonth] = start.split('-').map(Number);
        const [endYear, endMonth] = end.split('-').map(Number);

        const currentDate = new Date(startYear, startMonth - 1, 1); // Months are 0-based in JS
        const endDate = new Date(endYear, endMonth - 1, 1);

        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        return dates;
    };

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

    // Cell navigation helpers
    const getCellCoords = (inputId) => {
        const [rowIndex, colId] = inputId.split('-');
        return { rowIndex: parseInt(rowIndex), colId: parseInt(colId) };
    };

    const getInputId = (rowIndex, colId) => `${rowIndex}-${colId}`;

    const focusInput = (rowIndex, colId) => {
        const inputId = getInputId(rowIndex, colId);
        const input = inputRefs.current[inputId];
        if (input) {
            input.focus();
            input.select();
        }
    };

    const handleKeyDown = (e, currentRowIndex, currentColId) => {
        const currentColIndex = jobColumns.findIndex(col => col.id === currentColId);

        switch (e.key) {
            case 'Enter':
            case 'ArrowDown':
                e.preventDefault();
                if (currentRowIndex + 1 < dateRange.length) {
                    focusInput(currentRowIndex + 1, currentColId);
                }
                break;

            case 'ArrowUp':
                e.preventDefault();
                if (currentRowIndex > 0) {
                    focusInput(currentRowIndex - 1, currentColId);
                }
                break;

            case 'ArrowRight':
                e.preventDefault();
                if (currentColIndex + 1 < jobColumns.length) {
                    focusInput(currentRowIndex, jobColumns[currentColIndex + 1].id);
                }
                break;

            case 'ArrowLeft':
                e.preventDefault();
                if (currentColIndex > 0) {
                    focusInput(currentRowIndex, jobColumns[currentColIndex - 1].id);
                }
                break;

            case 'Tab':
                e.preventDefault();
                if (!e.shiftKey) {
                    if (currentColIndex < jobColumns.length - 1) {
                        focusInput(currentRowIndex, jobColumns[currentColIndex + 1].id);
                    } else if (currentRowIndex < dateRange.length - 1) {
                        focusInput(currentRowIndex + 1, jobColumns[0].id);
                    }
                } else {
                    if (currentColIndex > 0) {
                        focusInput(currentRowIndex, jobColumns[currentColIndex - 1].id);
                    } else if (currentRowIndex > 0) {
                        focusInput(currentRowIndex - 1, jobColumns[jobColumns.length - 1].id);
                    }
                }
                break;
        }
    };

    const addJobColumn = () => {
        setJobColumns([...jobColumns, {
            id: Date.now(),
            title: '',
            type: 'RGPS',
            employmentType: 'Empregada',
            values: {}
        }]);
    };

    const removeJobColumn = (columnId) => {
        if (jobColumns.length > 1) {
            setJobColumns(jobColumns.filter(col => col.id !== columnId));
        }
    };

    const updateCellValue = (dateKey, columnId, value) => {
        setJobColumns(jobColumns.map(col => {
            if (col.id === columnId) {
                return {
                    ...col,
                    values: {
                        ...col.values,
                        [dateKey]: value
                    }
                };
            }
            return col;
        }));
    };

    return (
        <div className="grid-container">
            {/* Date Selection Controls */}
            <div className="date-controls">
                <div className="date-input-group">
                    <label>Data Inicial</label>
                    <input
                        type="month"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="date-input"
                    />
                </div>
                <div className="date-input-group">
                    <label>Data Final</label>
                    <input
                        type="month"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="date-input"
                        min={startDate}
                    />
                </div>
                <button
                    onClick={addJobColumn}
                    className="add-job-button"
                >
                    + Adicionar Trabalho
                </button>
            </div>

            {/* Grid */}
            {dateRange.length > 0 ? (
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
                                                onChange={(e) => {
                                                    setJobColumns(jobColumns.map(col =>
                                                        col.id === column.id ? { ...col, title: e.target.value } : col
                                                    ));
                                                }}
                                                placeholder="Nome do Trabalho"
                                            />
                                            {jobColumns.length > 1 && (
                                                <button
                                                    onClick={() => removeJobColumn(column.id)}
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
                                                onChange={(e) => {
                                                    setJobColumns(jobColumns.map(col =>
                                                        col.id === column.id ? { ...col, type: e.target.value } : col
                                                    ));
                                                }}
                                            >
                                                <option value="RGPS">RGPS</option>
                                                <option value="RPPS">RPPS</option>
                                            </select>
                                            <select
                                                className="job-type-select"
                                                value={column.employmentType}
                                                onChange={(e) => {
                                                    setJobColumns(jobColumns.map(col =>
                                                        col.id === column.id ? { ...col, employmentType: e.target.value } : col
                                                    ));
                                                }}
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
                                                        value={column.values[dateKey] || ''}
                                                        onChange={(e) => updateCellValue(dateKey, column.id, e.target.value)}
                                                        onKeyDown={(e) => handleKeyDown(e, rowIndex, column.id)}
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
            ) : (
                <div className="empty-state">
                    Selecione um período para visualizar os dados
                </div>
            )}
        </div>
    );
};

export default TrabalhosGrid;