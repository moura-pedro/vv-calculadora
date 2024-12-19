// src/components/MultiStepForm/MultiStepForm.jsx
import React, { useState } from 'react';
import Stepper from '../Stepper/Stepper';
import JobsForm from '../JobsForm/JobsForm';
import './MultiStepForm.css';

const steps = [
  { id: 1, label: 'Remuneração' },
  { id: 2, label: 'Salário-de-Benefício' },
  { id: 3, label: 'Tempo de contribuição' },
  { id: 4, label: 'Sobrevida' },
  { id: 5, label: 'Resultados' }
];

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    jobs: [{
      id: Date.now(),
      name: '',
      type: '',
      employmentType: '',
      startDate: '',
      endDate: '',
      salary: ''
    }]
  });

  const handleJobsData = (data) => {
    setFormData(prevData => ({
      ...prevData,
      jobs: data
    }));
  };

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <JobsForm jobs={formData.jobs} onJobsChange={handleJobsData} />
            <div className="navigation-buttons">
              <button onClick={handleNext} className="next-button">
                Próximo
              </button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="step-placeholder">
              <h2>Cálculo do Salário-de-Benefício</h2>
              <p>Esta funcionalidade será implementada em breve.</p>
            </div>
            <div className="navigation-buttons">
              <button onClick={handleBack} className="back-button">
                Voltar
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="multi-step-form">
      <Stepper steps={steps} currentStep={currentStep} />
      <div className="step-content">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default MultiStepForm;