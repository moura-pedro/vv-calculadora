import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { getMinimumWageForDate } from '../JobsForm/SalarioMinimo';
import { getTetoForDate } from '../JobsForm/Teto';
import ExcelViewer from './ExcelViewer';
import './SalarioBeneficio.css';

const SalarioBeneficio = ({ formId }) => {
    const [salaryData, setSalaryData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [factorsMap, setFactorsMap] = useState(new Map());
    const [referenceDate, setReferenceDate] = useState(null);
    const [showIndices, setShowIndices] = useState(true);

    const toggleIndices = () => setShowIndices(!showIndices);

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

    const handleExcelData = (data) => {
        const dataRows = data.slice(2).filter(row => row.length >= 2 && row[0] && row[1]);
        const newFactorsMap = new Map();
        
        dataRows.forEach(row => {
            const monthYear = row[0];
            const factor = parseFloat(row[1]);
            
            if (monthYear && !isNaN(factor)) {
                const parts = monthYear.split('-');
                if (parts.length === 2) {
                    const month = parts[0];
                    const year = parts[1];
                    
                    const monthMap = {
                        'Jan': '01', 'Feb': '02', 'Mar': '03',
                        'Apr': '04', 'May': '05', 'Jun': '06',
                        'Jul': '07', 'Aug': '08', 'Sep': '09',
                        'Oct': '10', 'Nov': '11', 'Dec': '12'
                    };
                    
                    const monthNum = monthMap[month];
                    if (monthNum) {
                        let fullYear;
                        if (year.length === 2) {
                            const yearNum = parseInt(year);
                            fullYear = yearNum >= 90 ? '19' + year : '20' + year;
                        } else {
                            fullYear = year;
                        }
                        const key = `${fullYear}-${monthNum}`;
                        newFactorsMap.set(key, factor);
                        
                        if (!referenceDate) {
                            setReferenceDate(key);
                        }
                    }
                }
            }
        });
        
        setFactorsMap(newFactorsMap);
        setShowIndices(false);  // Hide indices after successful upload
    };

    const formatDate = (dateStr) => {
        const [year, month] = dateStr.split('-');
        const monthAbbrev = {
            '01': 'Jan', '02': 'Feb', '03': 'Mar',
            '04': 'Apr', '05': 'May', '06': 'Jun',
            '07': 'Jul', '08': 'Aug', '09': 'Sep',
            '10': 'Oct', '11': 'Nov', '12': 'Dec'
        };
        return `${monthAbbrev[month]}-${year.slice(2)}`;
    };

    const formatFactor = (value) => {
        return value?.toFixed(6) || '-';
    };

    if (isLoading) {
        return <div className="loading">Carregando...</div>;
    }

    return (
        <div className="salario-beneficio-grid">
            <div className="excel-info-section">
                <div className="excel-info">
                    <h2 className="table-title">Índices de Atualização</h2>
                    <p>Baixe os índices de atualização do site oficial da Previdência Social:</p>
                    <a 
                        href="https://www.gov.br/previdencia/pt-br/assuntos/previdencia-social/legislacao#:~:text=%C3%8Dndice%20de%20atualiza%C3%A7%C3%A3o%20dos%C2%A0benef%C3%ADcios%20pagos%20com%20atraso"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gov-link"
                    >
                        Portal da Previdência Social - Índices de Atualização
                    </a>
                    <div className="excel-uploader">
                        <ExcelViewer onDataLoaded={handleExcelData} />
                    </div>
                </div>
                <div className="toggle-container">
                    <button 
                        className="toggle-button"
                        onClick={toggleIndices}
                    >
                        {showIndices ? 'Ocultar' : 'Mostrar'} Tabela de Índices
                    </button>
                </div>
            </div>

            <div className="salary-table-container">
                <h2 className="table-title">Salário de Benefício</h2>
                {referenceDate && (
                    <div className="reference-info">
                        Fatores de atualização para {formatDate(referenceDate)}
                    </div>
                )}
                <table className="salary-table">
                    <thead>
                        <tr>
                            <th>Período</th>
                            <th>Sal. Cont.</th>
                            <th>A. Monetária (Pt MPS 3.880/2024)</th>
                            <th>SC Atualizado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salaryData.map((month) => {
                            const factor = factorsMap.get(month.date);
                            const updatedValue = factor ? month.total * factor : null;
                            
                            return (
                                <tr key={month.date}>
                                    <td className="month-cell">
                                        {formatDate(month.date)}
                                    </td>
                                    <td className="value-cell">
                                        {month.total.toFixed(2)}
                                    </td>
                                    <td className="factor-cell">
                                        {formatFactor(factor)}
                                    </td>
                                    <td className="updated-value-cell">
                                        {updatedValue ? updatedValue.toFixed(2) : '-'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    {salaryData.length > 0 && factorsMap.size > 0 && (
                        <tfoot>
                            <tr className="summary-row">
                                <td colSpan="3" className="summary-label">
                                    Média dos {salaryData.length} maiores salários de contribuição:
                                </td>
                                <td className="summary-value">
                                    {(salaryData.reduce((sum, month) => {
                                        const factor = factorsMap.get(month.date);
                                        return sum + (factor ? month.total * factor : 0);
                                    }, 0) / salaryData.length).toFixed(2)}
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>

            {showIndices && (
                <div className="indices-table-container">
                    <table className="salary-table">
                        <thead>
                            <tr>
                                <th>Período</th>
                                <th>Fator</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from(factorsMap.entries())
                                .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
                                .map(([date, factor]) => (
                                    <tr key={date}>
                                        <td className="month-cell">{formatDate(date)}</td>
                                        <td className="factor-cell">{formatFactor(factor)}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SalarioBeneficio;