import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { getMinimumWageForDate } from './SalarioMinimo';
import { getTetoForDate } from './Teto';
import './TrabalhosGrid.css';

const TrabalhosGrid = () => {
    const { id: formId } = useParams();
    const [dateRange, setDateRange] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [activeCell, setActiveCell] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
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
        if (formId) {
            loadFormData();
        }
    }, [formId]);

    useEffect(() => {
        if (startDate && endDate) {
            const dates = generateDateRange(startDate, endDate);
            setDateRange(dates);
        }
    }, [startDate, endDate]);

    const loadFormData = async () => {
        try {
            const { data, error } = await supabase
                .from('form_data')
                .select('*')
                .eq('form_id', formId);

            if (error) throw error;

            if (data && data.length > 0) {
                // Group data by job
                const jobsMap = new Map();
                data.forEach(row => {
                    if (!jobsMap.has(row.job_id)) {
                        jobsMap.set(row.job_id, {
                            id: row.job_id,
                            title: row.job_title,
                            type: row.job_type,
                            employmentType: row.employment_type,
                            values: {}
                        });
                    }
                    jobsMap.get(row.job_id).values[row.date] = row.salary;
                });

                setJobColumns(Array.from(jobsMap.values()));

                // Set date range based on data
                const dates = data.map(row => row.date);
                const sortedDates = dates.sort();
                setStartDate(sortedDates[0]);
                setEndDate(sortedDates[sortedDates.length - 1]);
            }
        } catch (error) {
            console.error('Error loading form data:', error);
            alert('Error loading form data');
        } finally {
            setIsLoading(false);
        }
    };

    const saveGridData = async () => {
        try {
            setIsSaving(true);

            // First delete existing data for this form
            const { error: deleteError } = await supabase
                .from('form_data')
                .delete()
                .eq('form_id', formId);

            if (deleteError) throw deleteError;

            // Prepare the data to save
            const formDataToSave = jobColumns.flatMap(column => 
                Object.entries(column.values)
                    .filter(([_, salary]) => salary !== null && salary !== '') // Filter out empty values
                    .map(([date, salary]) => ({
                        form_id: formId,
                        job_id: column.id,
                        date,
                        salary: parseFloat(salary) || 0,
                        job_title: column.title,
                        job_type: column.type,
                        employment_type: column.employmentType
                    }))
            );

            if (formDataToSave.length > 0) {
                // Insert new data
                const { error: insertError } = await supabase
                    .from('form_data')
                    .insert(formDataToSave);

                if (insertError) throw insertError;
            }

            alert('Dados salvos com sucesso!');
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Erro ao salvar dados');
        } finally {
            setIsSaving(false);
        }
    };

    const generateDateRange = (start, end) => {
        const dates = [];
        const [startYear, startMonth] = start.split('-').map(Number);
        const [endYear, endMonth] = end.split('-').map(Number);

        const currentDate = new Date(startYear, startMonth - 1, 1);
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
                if (e.target.selectionStart === e.target.value.length) {
                    e.preventDefault();
                    if (currentColIndex + 1 < jobColumns.length) {
                        focusInput(currentRowIndex, jobColumns[currentColIndex + 1].id);
                    }
                }
                break;

            case 'ArrowLeft':
                if (e.target.selectionStart === 0) {
                    e.preventDefault();
                    if (currentColIndex > 0) {
                        focusInput(currentRowIndex, jobColumns[currentColIndex - 1].id);
                    }
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

    if (isLoading) {
        return <div className="loading">Carregando...</div>;
    }

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
                    disabled={isSaving}
                >
                    + Adicionar Trabalho
                </button>
                <button
                    onClick={saveGridData}
                    className="save-button"
                    disabled={isSaving}
                >
                    {isSaving ? 'Salvando...' : 'Salvar'}
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