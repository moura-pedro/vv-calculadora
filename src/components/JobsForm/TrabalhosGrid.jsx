import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import DateRangeControls from './DateRangeControls';
import JobTable from './JobTable';
import './TrabalhosGrid.css';

const TrabalhosGrid = () => {
    const { id: formId } = useParams();
    const [dateRange, setDateRange] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState('saved');
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
    const saveTimeoutRef = useRef(null);

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

    const saveData = useCallback(async (dataToSave) => {
        try {
            setSaveStatus('saving');

            const { error: deleteError } = await supabase
                .from('form_data')
                .delete()
                .eq('form_id', formId);

            if (deleteError) throw deleteError;

            if (dataToSave.length > 0) {
                const { error: insertError } = await supabase
                    .from('form_data')
                    .insert(dataToSave);

                if (insertError) throw insertError;
            }

            await supabase
                .from('forms')
                .update({ last_modified: new Date().toISOString() })
                .eq('id', formId);

            setSaveStatus('saved');
        } catch (error) {
            console.error('Error saving data:', error);
            setSaveStatus('error');
        }
    }, [formId]);

    const prepareDataForSave = useCallback(() => {
        return jobColumns.flatMap(column => 
            Object.entries(column.values)
                .filter(([_, salary]) => salary !== null && salary !== '')
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
    }, [jobColumns, formId]);

    useEffect(() => {
        if (!isLoading && formId) {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }

            saveTimeoutRef.current = setTimeout(() => {
                const dataToSave = prepareDataForSave();
                saveData(dataToSave);
            }, 1000);
        }

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [jobColumns, formId, isLoading, saveData, prepareDataForSave]);

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

    const handleKeyDown = (e, currentRowIndex, currentColId) => {
        const currentColIndex = jobColumns.findIndex(col => col.id === currentColId);

        const getInputId = (rowIndex, colId) => `${rowIndex}-${colId}`;
        
        const focusInput = (rowIndex, colId) => {
            const inputId = getInputId(rowIndex, colId);
            const input = inputRefs.current[inputId];
            if (input) {
                input.focus();
                input.select();
            }
        };

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

    const handleStartDateChange = (newDate) => {
        setStartDate(newDate);
        if (newDate && endDate) {
            setDateRange(generateDateRange(newDate, endDate));
        }
    };

    const handleEndDateChange = (newDate) => {
        setEndDate(newDate);
        if (startDate && newDate) {
            setDateRange(generateDateRange(startDate, newDate));
        }
    };

    const handleAddJob = () => {
        setJobColumns([...jobColumns, {
            id: Date.now(),
            title: '',
            type: 'RGPS',
            employmentType: 'Empregada',
            values: {}
        }]);
    };

    const handleRemoveJob = (columnId) => {
        if (jobColumns.length > 1) {
            setJobColumns(jobColumns.filter(col => col.id !== columnId));
        }
    };

    const handleUpdateCell = (dateKey, columnId, value) => {
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

    const handleUpdateJobTitle = (columnId, title) => {
        setJobColumns(jobColumns.map(col =>
            col.id === columnId ? { ...col, title } : col
        ));
    };

    const handleUpdateJobType = (columnId, field, value) => {
        setJobColumns(jobColumns.map(col =>
            col.id === columnId ? { ...col, [field]: value } : col
        ));
    };

    if (isLoading) {
        return <div className="loading">Carregando...</div>;
    }

    return (
        <div className="grid-container">
            <DateRangeControls
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
                onAddJob={handleAddJob}
                saveStatus={saveStatus}
            />
            
            {dateRange.length > 0 ? (
                <JobTable
                    dateRange={dateRange}
                    jobColumns={jobColumns}
                    onUpdateCell={handleUpdateCell}
                    onRemoveJob={handleRemoveJob}
                    onUpdateJobTitle={handleUpdateJobTitle}
                    onUpdateJobType={handleUpdateJobType}
                    inputRefs={inputRefs}
                    onKeyDown={handleKeyDown}
                />
            ) : (
                <div className="empty-state">
                    Selecione um período para visualizar os dados
                </div>
            )}
        </div>
    );
};

export default TrabalhosGrid;