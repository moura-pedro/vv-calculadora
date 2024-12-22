import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { getMinimumWageForDate } from '../JobsForm/SalarioMinimo';
import { getTetoForDate } from '../JobsForm/Teto';
import './SalarioBeneficio.css';

const SalarioBeneficio = ({ formId }) => {
    const [salaryData, setSalaryData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

            // Process the data to get monthly totals with adjustments
            const monthlyTotals = processMonthlyTotals(data);
            setSalaryData(monthlyTotals);
        } catch (error) {
            console.error('Error fetching salary data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const processMonthlyTotals = (data) => {
        // First, group data by month
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

        // Process each month's data with adjustments
        const processedData = Object.entries(monthlyData).map(([date, monthData]) => {
            const minimumWage = getMinimumWageForDate(date);
            const teto = getTetoForDate(date);

            // Calculate total with adjustments
            const total = monthData.jobs.reduce((sum, job) => {
                let jobValue = job.salary;

                // Apply SM/Teto adjustments for RGPS+CI jobs
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
                total
            };
        });

        // Filter out zero totals and sort by date
        return processedData
            .filter(month => month.total > 0)
            .sort((a, b) => a.date.localeCompare(b.date));
    };

    const formatDate = (dateStr) => {
        const [year, month] = dateStr.split('-');
        return new Intl.DateTimeFormat('pt-BR', {
            month: 'long',
            year: 'numeric'
        }).format(new Date(year, month - 1));
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
            <div className="salary-table-container">
                <table className="salary-table">
                    <thead>
                        <tr>
                            <th>Competência</th>
                            <th>Valor Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salaryData.map((month) => (
                            <tr key={month.date}>
                                <td>{formatDate(month.date)}</td>
                                <td className="value-cell">
                                    {formatCurrency(month.total)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalarioBeneficio;