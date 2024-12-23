import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelViewer = ({ onDataLoaded }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const processExcelFile = async (file) => {
        try {
            setLoading(true);
            setError(null);

            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, {
                cellDates: true,
                cellNF: true,
                cellText: false
            });

            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
                header: 1,
                raw: true,
                defval: ''
            });

            const processedData = jsonData.map(row =>
                row.map(cell => {
                    if (typeof cell === 'number' && cell > 30000) {
                        return formatExcelDate(cell);
                    }
                    if (cell instanceof Date) {
                        return formatExcelDate(cell);
                    }
                    return cell;
                })
            );

            onDataLoaded(processedData);
        } catch (error) {
            console.error('Error processing file:', error);
            setError('Error processing Excel file');
        } finally {
            setLoading(false);
        }
    };

    const formatExcelDate = (value) => {
        if (typeof value === 'number') {
            const date = XLSX.SSF.parse_date_code(value);
            const monthNames = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];
            return `${monthNames[date.m - 1]}-${String(date.y).slice(2)}`;
        }
        if (value instanceof Date) {
            const monthNames = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];
            return `${monthNames[value.getMonth()]}-${String(value.getFullYear()).slice(2)}`;
        }
        return value;
    };

    return (
        <div className="excel-uploader">
            <div className="upload-container">
                <label className="upload-button">
                    <span>Upload Excel File</span>
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                processExcelFile(file);
                                e.target.value = '';  // Reset input
                            }
                        }}
                        className="hidden"
                    />
                </label>
                {loading && <span className="loading-text">Processando...</span>}
                {error && <span className="error-text">{error}</span>}
            </div>
        </div>
    );
};

export default ExcelViewer;