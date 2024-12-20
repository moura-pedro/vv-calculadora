import React from 'react';

const DateRangeControls = ({ 
    startDate, 
    endDate, 
    onStartDateChange, 
    onEndDateChange, 
    onAddJob, 
    saveStatus 
}) => {
    return (
        <div className="date-controls">
            <div className="date-input-group">
                <label>Data Inicial</label>
                <input
                    type="month"
                    value={startDate}
                    onChange={(e) => onStartDateChange(e.target.value)}
                    className="date-input"
                />
            </div>
            <div className="date-input-group">
                <label>Data Final</label>
                <input
                    type="month"
                    value={endDate}
                    onChange={(e) => onEndDateChange(e.target.value)}
                    className="date-input"
                    min={startDate}
                />
            </div>
            <button
                onClick={onAddJob}
                className="add-job-button"
            >
                + Adicionar Trabalho
            </button>
            <div className="save-status">
                {saveStatus === 'saving' && <span className="saving">Salvando...</span>}
                {saveStatus === 'saved' && <span className="saved">Todas as alterações salvas</span>}
                {saveStatus === 'error' && <span className="error">Erro ao salvar</span>}
            </div>
        </div>
    );
};

export default DateRangeControls;