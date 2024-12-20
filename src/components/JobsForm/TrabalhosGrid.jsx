import React, { useState, useEffect, useRef } from 'react';
import { getMinimumWageForDate } from './SalarioMinimo';
import { getTetoForDate } from './Teto';  // Add this import

// import './TrabalhosGrid.css'

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

    // Ref to store input refs
    const inputRefs = useRef({});

    // Generate date range when dates change
    useEffect(() => {
        if (startDate && endDate) {
            const dates = generateDateRange(startDate + '-01', endDate + '-01');
            setDateRange(dates);
        }
    }, [startDate, endDate]);

    // Helper to generate range of dates
    const generateDateRange = (start, end) => {
        if (!start || !end) return [];

        const dates = [];
        const currentDate = new Date(start);
        const endDate = new Date(end);

        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        return dates;
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

    // Handle keyboard navigation
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

    // Job management functions
    const addJobColumn = () => {
        setJobColumns([...jobColumns, {
            id: Date.now(),
            title: '',
            type: 'RGPS',
            employmentType: 'Empregada',
            values: {}
        }]);
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

    const removeJobColumn = (columnId) => {
        if (jobColumns.length > 1) {
            setJobColumns(jobColumns.filter(col => col.id !== columnId));
        }
    };

    const formatMonthYear = (date) => {
        return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit' }).format(date);
    };

    return (
        <div className="p-4">
            {/* Date Selection Controls */}
            <div className="mb-6 flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data Inicial
                    </label>
                    <input
                        type="month"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data Final
                    </label>
                    <input
                        type="month"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-2 border rounded"
                        min={startDate}
                    />
                </div>
                <button
                    onClick={addJobColumn}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    + Adicionar Trabalho
                </button>
            </div>

            {/* Grid */}
            {dateRange.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="sticky left-0 bg-gray-100 px-4 py-2 border">Mês</th>
                                {jobColumns.map(column => (
                                    <th key={column.id} className="px-4 py-2 border min-w-[200px]">
                                        <div className="flex justify-between items-center mb-2">
                                            <input
                                                type="text"
                                                className="w-full p-1 border rounded mr-2"
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
                                                    className="text-red-500 hover:text-red-700 px-2"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-1">
                                            <select
                                                className="p-1 border rounded text-sm"
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
                                                className="p-1 border rounded text-sm"
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
                                <th className="px-4 py-2 border">Total</th>
                                <th className="px-4 py-2 border">Teto</th>
                                <th className="px-4 py-2 border">SM</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dateRange.map((date, rowIndex) => {
                                const dateKey = date.toISOString().slice(0, 7);
                                const rowTotal = jobColumns.reduce((sum, col) =>
                                    sum + (Number(col.values[dateKey]) || 0), 0
                                );
                                const minimumWage = getMinimumWageForDate(dateKey);

                                return (
                                    <tr key={dateKey} className="hover:bg-gray-50">
                                        <td className="sticky left-0 bg-white px-4 py-2 border">
                                            {formatMonthYear(date)}
                                        </td>
                                        {jobColumns.map(column => {
                                            const inputId = getInputId(rowIndex, column.id);
                                            return (
                                                <td key={`${dateKey}-${column.id}`} className="px-4 py-2 border">
                                                    <input
                                                        ref={el => inputRefs.current[inputId] = el}
                                                        type="number"
                                                        className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        value={column.values[dateKey] || ''}
                                                        onChange={(e) => updateCellValue(dateKey, column.id, e.target.value)}
                                                        onKeyDown={(e) => handleKeyDown(e, rowIndex, column.id)}
                                                        onFocus={() => setActiveCell(inputId)}
                                                        step="0.01"
                                                    />
                                                </td>
                                            );
                                        })}
                                        <td className="px-4 py-2 border font-semibold">
                                            {rowTotal.toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            })}
                                        </td>
                                        <td className="px-4 py-2 border">
                                            {getTetoForDate(dateKey).toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            })}
                                        </td>
                                        <td className="px-4 py-2 border">
                                            {minimumWage.toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            })}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    Selecione um período para visualizar os dados
                </div>
            )}
        </div>
    );
};

export default TrabalhosGrid;