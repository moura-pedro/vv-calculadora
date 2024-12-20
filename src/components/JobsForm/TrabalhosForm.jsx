// src/components/JobsForm/TrabalhosForm.jsx
import React, { useState, useMemo } from 'react';
import TrabalhoCard from './TrabalhoCard';
import TabelaResumo from './TabelaResumo';
import { getMinimumWageForDate } from './SalarioMinimo';
import { getMonthsBetweenDates } from './utils';
import './TrabalhosForm.css';

const TrabalhosForm = ({ trabalhos: trabalhosProp, onTrabalhosChange }) => {
  const [trabalhos, setTrabalhos] = useState([{
    id: Date.now(),
    name: '',
    type: '',
    employmentType: '',
    startDate: '',
    endDate: '',
    salary: ''
  }]);

  const addTrabalho = () => {
    const novosTrabalhos = [...trabalhos, {
      id: Date.now(),
      name: '',
      type: '',
      employmentType: '',
      startDate: '',
      endDate: '',
      salary: ''
    }];
    setTrabalhos(novosTrabalhos);
    if (onTrabalhosChange) {
      onTrabalhosChange(novosTrabalhos);
    }
  };

  const removeTrabalho = (trabalhoId) => {
    if (trabalhos.length > 1) {
      const novosTrabalhos = trabalhos.filter(trabalho => trabalho.id !== trabalhoId);
      setTrabalhos(novosTrabalhos);
      if (onTrabalhosChange) {
        onTrabalhosChange(novosTrabalhos);
      }
    }
  };

  const updateTrabalho = (trabalhoId, field, value) => {
    const novosTrabalhos = trabalhos.map(trabalho => 
      trabalho.id === trabalhoId ? { ...trabalho, [field]: value } : trabalho
    );
    setTrabalhos(novosTrabalhos);
    if (onTrabalhosChange) {
      onTrabalhosChange(novosTrabalhos);
    }
  };

  const resumoMensal = useMemo(() => {
    const resumo = new Map();
    
    // Primeiro, coleta todos os meses únicos de todos os trabalhos
    const todosOsMeses = new Set();
    trabalhos.forEach(trabalho => {
      if (trabalho.startDate && trabalho.endDate && trabalho.salary) {
        const meses = getMonthsBetweenDates(trabalho.startDate, trabalho.endDate);
        meses.forEach(data => {
          const chaveDoMes = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
          todosOsMeses.add(chaveDoMes);
        });
      }
    });

    // Inicializa o resumo para todos os meses
    Array.from(todosOsMeses).sort().forEach(chaveDoMes => {
      const [ano, mes] = chaveDoMes.split('-');
      resumo.set(chaveDoMes, {
        total: 0,
        trabalhos: [],
        salarioMinimo: getMinimumWageForDate(chaveDoMes),
        displayDate: `${mes}/${ano}` // Simplified date display
      });
    });
    
    // Adiciona informações dos trabalhos para cada mês
    trabalhos.forEach(trabalho => {
      if (trabalho.startDate && trabalho.endDate && trabalho.salary) {
        const meses = getMonthsBetweenDates(trabalho.startDate, trabalho.endDate);
        
        meses.forEach(data => {
          const chaveDoMes = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
          const dadosDoMes = resumo.get(chaveDoMes);
          
          if (dadosDoMes) {
            const salarioNumerico = Number(trabalho.salary) || 0;
            dadosDoMes.total += salarioNumerico;
            dadosDoMes.trabalhos.push({
              name: trabalho.name || 'Sem nome',
              type: trabalho.type || 'Não especificado',
              employmentType: trabalho.employmentType || 'Não especificado',
              salary: salarioNumerico
            });
          }
        });
      }
    });
    
    // Converte o Map em um array ordenado
    return Array.from(resumo.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([mes, dados]) => ({
        mes,
        ...dados
      }));
  }, [trabalhos]);

  return (
    <div className="jobs-form">
      <div className="jobs-form-container">
        <h2>Adicionar Trabalhos</h2>
        
        {trabalhos.map((trabalho, index) => (
          <TrabalhoCard
            key={trabalho.id}
            trabalho={trabalho}
            index={index}
            onRemove={removeTrabalho}
            onUpdate={updateTrabalho}
            canRemove={trabalhos.length > 1}
          />
        ))}

        <button className="add-button" onClick={addTrabalho}>
          Adicionar Outro Trabalho
        </button>

        <TabelaResumo resumo={resumoMensal} />
      </div>
    </div>
  );
};

export default TrabalhosForm;