import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './IndicesHandler.css';

const IndicesHandler = ({ onIndicesLoaded }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const processExcelFile = async (file) => {
        try {
            setLoading(true);
            setError(null);

            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, {
                cellText: false,
                cellDates: false
            });

            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            console.log("Raw Excel Data:", jsonData); // Debug log

            // Process data starting from row 10
            const factors = [];
            for (let i = 9; i < jsonData.length; i++) {
                const row = jsonData[i];
                console.log("Processing row:", i + 1, row); // Debug log

                if (!row || row.length < 3) {
                    console.log("Skipping row - insufficient data"); // Debug log
                    continue;
                }

                // Get month/year from column B (index 1)
                const monthYearStr = String(row[1] || '').trim();
                // Get factor from column C (index 2)
                const factorStr = String(row[2] || '').replace(',', '.');
                const factorValue = parseFloat(factorStr);

                console.log("Extracted values:", { // Debug log
                    monthYearStr,
                    factorStr,
                    factorValue
                });

                if (!monthYearStr || isNaN(factorValue)) {
                    console.log("Skipping row - invalid data"); // Debug log
                    continue;
                }

                // Parse the month-year format (e.g., "Jul-94" to "1994-07")
                const [monthStr, yearStr] = monthYearStr.split('-');
                console.log("Split date:", monthStr, yearStr); // Debug log

                const monthMap = {
                    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
                    'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
                    'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
                };

                const month = monthMap[monthStr];
                const year = yearStr.length === 2 ? `19${yearStr}` : yearStr;

                if (!month || !year) {
                    console.log("Skipping row - invalid date format"); // Debug log
                    continue;
                }

                factors.push({
                    date: `${year}-${month}`,
                    factor: factorValue
                });

                console.log("Added factor:", factors[factors.length - 1]); // Debug log
            }

            console.log("Final factors array:", factors); // Debug log

            if (factors.length === 0) {
                throw new Error('Nenhum fator de correção encontrado no arquivo.');
            }

            // Use the first month/year as reference date (most recent)
            const referenceDate = factors[0].date;

            onIndicesLoaded({
                referenceDate,
                factors: factors.sort((a, b) => b.date.localeCompare(a.date))
            });

        } catch (error) {
            console.error('Error processing file:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="indices-handler">
            <div className="upload-section">
                <label className="upload-label">
                    <span className="upload-text">
                        {loading ? 'Processando...' : 'Selecione o arquivo de índices'}
                    </span>
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) processExcelFile(file);
                        }}
                        disabled={loading}
                        className="file-input"
                    />
                </label>
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default IndicesHandler;