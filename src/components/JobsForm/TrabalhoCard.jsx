import React from 'react';

const TrabalhoCard = ({ trabalho, index, onRemove, onUpdate, canRemove }) => {
  return (
    <div className="job-card">
      <div className="job-header">
        <h3>Trabalho {index + 1}</h3>
        {canRemove && (
          <button 
            className="remove-button"
            onClick={() => onRemove(trabalho.id)}
          >
            Remover
          </button>
        )}
      </div>

      <div className="form-group">
        <label htmlFor={`name-${trabalho.id}`}>Nome do Trabalho:</label>
        <input
          id={`name-${trabalho.id}`}
          type="text"
          value={trabalho.name}
          onChange={(e) => onUpdate(trabalho.id, 'name', e.target.value)}
          placeholder="Digite o nome do trabalho"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor={`type-${trabalho.id}`}>Tipo:</label>
          <select
            id={`type-${trabalho.id}`}
            value={trabalho.type}
            onChange={(e) => onUpdate(trabalho.id, 'type', e.target.value)}
          >
            <option value="">Selecione o Tipo</option>
            <option value="RGPS">RGPS</option>
            <option value="RPPS">RPPS</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor={`employmentType-${trabalho.id}`}>Tipo de Vínculo:</label>
          <select
            id={`employmentType-${trabalho.id}`}
            value={trabalho.employmentType}
            onChange={(e) => onUpdate(trabalho.id, 'employmentType', e.target.value)}
          >
            <option value="">Selecione o Tipo de Vínculo</option>
            <option value="Empregada">Empregada</option>
            <option value="CI">CI</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor={`startDate-${trabalho.id}`}>Data Inicial:</label>
          <input
            id={`startDate-${trabalho.id}`}
            type="month"
            value={trabalho.startDate}
            onChange={(e) => onUpdate(trabalho.id, 'startDate', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor={`endDate-${trabalho.id}`}>Data Final:</label>
          <input
            id={`endDate-${trabalho.id}`}
            type="month"
            value={trabalho.endDate}
            onChange={(e) => onUpdate(trabalho.id, 'endDate', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor={`salary-${trabalho.id}`}>Salário:</label>
        <input
          id={`salary-${trabalho.id}`}
          type="number"
          value={trabalho.salary}
          onChange={(e) => onUpdate(trabalho.id, 'salary', e.target.value)}
          placeholder="Digite o salário"
        />
      </div>
    </div>
  );
};

export default TrabalhoCard;