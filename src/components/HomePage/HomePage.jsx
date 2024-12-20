import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'

const HomePage = () => {
    const navigate = useNavigate();
    const [forms, setForms] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newFormName, setNewFormName] = useState('');

    const createNewForm = () => {
        if (newFormName.trim()) {
            const newForm = {
                id: Date.now(),
                name: newFormName,
                createdAt: new Date(),
                lastModified: new Date()
            };
            setForms([...forms, newForm]);
            setNewFormName('');
            setIsCreating(false);
        }
    };

    const deleteForm = (formId) => {
        if (window.confirm('Tem certeza que deseja excluir este formulário?')) {
            setForms(forms.filter(form => form.id !== formId));
        }
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Meus Formulários</h1>
                {!isCreating && (
                    <button 
                        className="create-form-button"
                        onClick={() => setIsCreating(true)}
                    >
                        + Novo Formulário
                    </button>
                )}
            </header>

            {isCreating && (
                <div className="create-form-container">
                    <input
                        type="text"
                        value={newFormName}
                        onChange={(e) => setNewFormName(e.target.value)}
                        placeholder="Nome do formulário"
                        className="form-name-input"
                    />
                    <div className="create-form-actions">
                        <button 
                            className="confirm-button"
                            onClick={createNewForm}
                            disabled={!newFormName.trim()}
                        >
                            Criar
                        </button>
                        <button 
                            className="cancel-button"
                            onClick={() => {
                                setIsCreating(false);
                                setNewFormName('');
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            <div className="forms-grid">
                {forms.length === 0 && !isCreating ? (
                    <div className="empty-state">
                        <p>Você ainda não tem nenhum formulário.</p>
                        <button 
                            className="create-form-button"
                            onClick={() => setIsCreating(true)}
                        >
                            Criar meu primeiro formulário
                        </button>
                    </div>
                ) : (
                    forms.map(form => (
                        <div key={form.id} className="form-card">
                            <div className="form-card-header">
                                <h3>{form.name}</h3>
                                <button
                                    className="delete-button"
                                    onClick={() => deleteForm(form.id)}
                                >
                                    ×
                                </button>
                            </div>
                            <div className="form-card-content">
                                <p>Criado em: {formatDate(form.createdAt)}</p>
                                <p>Última modificação: {formatDate(form.lastModified)}</p>
                            </div>
                            <div className="form-card-actions">
                                <button 
                                    className="edit-button"
                                    onClick={() => navigate(`/form/${form.id}`)}
                                >
                                    Abrir formulário
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HomePage;