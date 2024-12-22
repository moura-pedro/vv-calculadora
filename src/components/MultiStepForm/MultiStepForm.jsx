// src/components/MultiStepForm/MultiStepForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Stepper from '../Stepper/Stepper';
import TrabalhosGrid from '../JobsForm/TrabalhosGrid';
import SalarioBeneficio from '../SalarioBeneficio/SalarioBeneficio';
import './MultiStepForm.css';

const steps = [
  { id: 1, label: 'Remuneração' },
  { id: 2, label: 'Salário-de-Benefício' },
  { id: 3, label: 'Tempo de contribuição' },
  { id: 4, label: 'Sobrevida' },
  { id: 5, label: 'Resultados' }
];

const MultiStepForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    remuneracao: null,
    salarioBeneficio: null,
    tempoContribuicao: null,
    sobrevida: null
  });

  // Add a back button to return to home
  const handleBackToHome = () => {
    navigate('/');
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <TrabalhosGrid />
            <div className="navigation-buttons">
              <button 
                className="back-button"
                onClick={handleBackToHome}
              >
                Voltar para Home
              </button>
              <button 
                onClick={handleNext} 
                className="next-button"
              >
                Próximo
              </button>
            </div>
          </div>
        );

        case 2:
          return (
            <div className="step-content">
              <SalarioBeneficio formId={id} />
              <div className="navigation-buttons">
                <button 
                  onClick={handleBack} 
                  className="back-button"
                >
                  Voltar
                </button>
                <button 
                  onClick={handleNext} 
                  className="next-button"
                >
                  Próximo
                </button>
              </div>
            </div>
          );

      case 3:
        return (
          <div className="step-content">
            <div className="step-placeholder">
              <h2>Tempo de Contribuição</h2>
              <p>Esta funcionalidade será implementada em breve.</p>
            </div>
            <div className="navigation-buttons">
              <button 
                onClick={handleBack} 
                className="back-button"
              >
                Voltar
              </button>
              <button 
                onClick={handleNext} 
                className="next-button"
              >
                Próximo
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <div className="step-placeholder">
              <h2>Cálculo da Sobrevida</h2>
              <p>Esta funcionalidade será implementada em breve.</p>
            </div>
            <div className="navigation-buttons">
              <button 
                onClick={handleBack} 
                className="back-button"
              >
                Voltar
              </button>
              <button 
                onClick={handleNext} 
                className="next-button"
              >
                Próximo
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-content">
            <div className="step-placeholder">
              <h2>Resultados</h2>
              <p>Esta funcionalidade será implementada em breve.</p>
            </div>
            <div className="navigation-buttons">
              <button 
                onClick={handleBack} 
                className="back-button"
              >
                Voltar
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="multi-step-form">
      <Stepper steps={steps} currentStep={currentStep} />
      {renderStepContent()}
    </div>
  );
};

export default MultiStepForm;