// SalarioBeneficio/index.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { getMinimumWageForDate } from '../JobsForm/SalarioMinimo';
import { getTetoForDate } from '../JobsForm/Teto';
import IndicesHandler from './IndicesHandler';
import './SalarioBeneficio.css';

const SalarioBeneficio = ({ formId }) => {
    const [salaryData, setSalaryData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [indices, setIndices] = useState(null);
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        fetchSalaryData();
    }, [formId]);

    const fetchSalaryData = async () => {
        try {
            const { data, error } = await supabase
                .from('form_data')
                .select('*')
                .eq('form_id', formId);

            if (error) throw error;

            const monthlyTotals = processMonthlyTotals(data);
            setSalaryData(monthlyTotals);
        } catch (error) {
            console.error('Error fetching salary data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const processMonthlyTotals = (data) => {
        // Group data by month
        const monthlyData = data.reduce((acc, curr) => {
            const month = curr.date;
            if (!acc[month]) {
                acc[month] = {
                    date: month,
                    jobs: []
                };
            }
            acc[month].jobs.push({
                salary: curr.salary,
                type: curr.job_type,
                employmentType: curr.employment_type
            });
            return acc;
        }, {});

        // Process each month
        const processedData = Object.entries(monthlyData).map(([date, monthData]) => {
            const minimumWage = getMinimumWageForDate(date);
            const teto = getTetoForDate(date);

            const total = monthData.jobs.reduce((sum, job) => {
                let jobValue = job.salary;

                if (job.type === 'RGPS' && job.employmentType === 'CI') {
                    if (jobValue < minimumWage && jobValue !== 0) {
                        jobValue = minimumWage;
                    } else if (jobValue > teto) {
                        jobValue = teto;
                    }
                }

                return sum + jobValue;
            }, 0);

            return {
                date,
                total,
                originalData: monthData
            };
        });

        return processedData
            .filter(month => month.total > 0)
            .sort((a, b) => a.date.localeCompare(b.date));
    };

    const handleIndicesLoaded = (loadedIndices) => {
        setIndices(loadedIndices);
        
        // Calculate summary
        if (salaryData.length > 0) {
            const updatedValues = salaryData.map(month => {
                const factor = loadedIndices.factors.find(f => f.date === month.date)?.factor || 0;
                return month.total * factor;
            }).filter(val => !isNaN(val) && val > 0);

            const total = updatedValues.reduce((sum, val) => sum + val, 0);
            const count = updatedValues.length;
            const average = count > 0 ? total / count : 0;

            setSummary({
                total,
                count,
                average
            });
        }
    };

    const formatDate = (dateStr) => {
        const [year, month] = dateStr.split('-');
        
        // Month mapping for English abbreviated months
        const monthAbbrev = {
            '01': 'Jan', '02': 'Feb', '03': 'Mar',
            '04': 'Apr', '05': 'May', '06': 'Jun',
            '07': 'Jul', '08': 'Aug', '09': 'Sep',
            '10': 'Oct', '11': 'Nov', '12': 'Dec'
        };

        // Use last 2 digits of year
        const shortYear = year.slice(2);
        
        return `${monthAbbrev[month]}-${shortYear}`;
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    if (isLoading) {
        return <div className="loading">Carregando...</div>;
    }

    return (
        <div className="salario-beneficio-container">
            <h2>Salário de Benefício</h2>
            
            <IndicesHandler onIndicesLoaded={handleIndicesLoaded} />

            {indices && (
                <div className="reference-info">
                    Fatores de atualização para {formatDate(indices.referenceDate)}
                </div>
            )}
            
            <div className="salary-table-container">
                <table className="salary-table">
                    <thead>
                        <tr>
                            <th>Competência</th>
                            <th>Valor Total</th>
                            {indices && <th>Fator</th>}
                            {indices && <th>Valor Atualizado</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {salaryData.map((month) => {
                            const factor = indices?.factors.find(f => f.date === month.date)?.factor;
                            const updatedValue = factor ? month.total * factor : null;
                            
                            return (
                                <tr key={month.date}>
                                    <td className="month-cell">{formatDate(month.date)}</td>
                                    <td className="value-cell">
                                        {formatCurrency(month.total)}
                                    </td>
                                    {indices && (
                                        <td className="factor-cell">
                                            {factor?.toFixed(6) || '-'}
                                        </td>
                                    )}
                                    {indices && (
                                        <td className="value-cell updated">
                                            {updatedValue ? formatCurrency(updatedValue) : '-'}
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                    {summary && (
                        <tfoot>
                            <tr className="summary-row">
                                <td colSpan="2">Média das {summary.count} maiores contribuições:</td>
                                <td></td>
                                <td className="value-cell total">{formatCurrency(summary.average)}</td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </div>
    );
};

export default SalarioBeneficio;