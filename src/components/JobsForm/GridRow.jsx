import React from 'react';
import { getMinimumWageForDate } from './SalarioMinimo';
import { getTetoForDate } from './Teto';

const GridRow = ({
    date,
    jobColumns,
    onUpdateCell,
    inputRefs,
    onKeyDown,
    rowIndex
}) => {
    const dateKey = date.toISOString().slice(0, 7);
    const minimumWage = getMinimumWageForDate(dateKey);
    const teto = getTetoForDate(dateKey);

    // Calculate adjusted values and total
    const adjustedValues = jobColumns.map(column => {
        const value = Number(column.values[dateKey]) || 0;
        if (column.type === 'RGPS' && column.employmentType === 'CI') {
            if (value < minimumWage && value !== 0) {
                return minimumWage;
            } else if (value > teto) {
                return teto;
            }
        }
        return value;
    });

    const rowTotal = adjustedValues.reduce((sum, value) => sum + value, 0);
    const originalValues = jobColumns.map(column => Number(column.values[dateKey]) || 0);
    const hasAnySalary = originalValues.some(value => value > 0);

    // Determine row highlight
    const getRowStyle = () => {

        const hasLowerThanSM = jobColumns.some(column => {
            const value = Number(column.values[dateKey]) || 0;
            return column.type === 'RGPS' && 
                   column.employmentType === 'CI' && 
                   value < minimumWage && 
                   value !== 0;
        });

        const hasHigherThanTeto = jobColumns.some(column => {
            const value = Number(column.values[dateKey]) || 0;
            return column.type === 'RGPS' && 
                   column.employmentType === 'CI' && 
                   value > teto;
        });

        if (hasLowerThanSM) {
            return { backgroundColor: '#FFE0B2' }; // Light orange
        }
        if (hasHigherThanTeto) {
            return { backgroundColor: '#BBDEFB' }; // Light blue
        }

        return {};
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

    return (
        <tr style={getRowStyle()}>
            <td className="month-column">
                {formatMonthYear(date)}
            </td>
            {jobColumns.map(column => {
                const inputId = `${rowIndex}-${column.id}`;
                const value = column.values[dateKey] || '';
                
                return (
                    <td key={`${dateKey}-${column.id}`}>
                        <input
                            ref={el => inputRefs.current[inputId] = el}
                            type="number"
                            className="salary-input"
                            value={value}
                            onChange={(e) => onUpdateCell(dateKey, column.id, e.target.value)}
                            onKeyDown={(e) => onKeyDown(e, rowIndex, column.id)}
                        />
                        {column.type === 'RGPS' && 
                         column.employmentType === 'CI' && 
                         value !== '' && 
                         ((Number(value) < minimumWage && Number(value) !== 0) || Number(value) > teto) && (
                            <div className="adjusted-value">
                                Ajustado: {formatCurrency(Number(value) < minimumWage ? minimumWage : teto)}
                            </div>
                        )}
                    </td>
                );
            })}
            <td className="total-column">{formatCurrency(rowTotal)}</td>
            <td className="teto-column">{formatCurrency(teto)}</td>
            <td className="sm-column">{formatCurrency(minimumWage)}</td>
        </tr>
    );
};

export default GridRow;