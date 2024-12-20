import React from 'react';

const TabelaResumo = ({ resumo }) => {
  return (
    <div className="summary-table-container">
      <h3>Resumo Mensal</h3>
      <table className="summary-table">
        <thead>
          <tr>
            <th>Mês/Ano</th>
            <th>Trabalhos</th>
            <th>Salário Total</th>
            <th>Salário Mínimo</th>
          </tr>
        </thead>
        <tbody>
          {resumo.map(({ mes, trabalhos, total, salarioMinimo, displayDate }) => (
            <tr key={mes}>
              <td className="date-column">{displayDate}</td>
              <td>
                <ul className="jobs-list">
                  {trabalhos.map((trabalho, index) => (
                    <li key={index}>
                      {trabalho.name} ({trabalho.type} - {trabalho.employmentType})
                      : R$ {trabalho.salary.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="total-salary">
                R$ {total.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </td>
              <td className="minimum-wage">
                R$ {salarioMinimo.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabelaResumo;