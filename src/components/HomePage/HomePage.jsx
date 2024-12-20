import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './HomePage.css'

const HomePage = () => {
    const navigate = useNavigate();
    const [forms, setForms] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newFormName, setNewFormName] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = async () => {
        try {
            const { data, error } = await supabase
                .from('forms')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setForms(data || []);
        } catch (error) {
            console.error('Error fetching forms:', error);
            alert('Error fetching forms');
        } finally {
            setIsLoading(false);
        }
    };

    const createNewForm = async () => {
        if (newFormName.trim()) {
            try {
                const newForm = {
                    id: Date.now(),
                    name: newFormName
                    // Supabase will automatically set created_at and last_modified
                };

                const { data, error } = await supabase
                    .from('forms')
                    .insert([newForm])
                    .select(); // Add this to get the returned data

                if (error) throw error;

                if (data && data[0]) {
                    setForms([data[0], ...forms]);
                    setNewFormName('');
                    setIsCreating(false);
                }
            } catch (error) {
                console.error('Error creating form:', error);
                alert('Error creating form');
            }
        }
    };

    const deleteForm = async (formId) => {
        if (window.confirm('Tem certeza que deseja excluir este formulário?')) {
            try {
                // Delete associated form data first
                const { error: dataError } = await supabase
                    .from('form_data')
                    .delete()
                    .eq('form_id', formId);

                if (dataError) throw dataError;

                // Then delete the form
                const { error: formError } = await supabase
                    .from('forms')
                    .delete()
                    .eq('id', formId);

                if (formError) throw formError;

                setForms(forms.filter(form => form.id !== formId));
            } catch (error) {
                console.error('Error deleting form:', error);
                alert('Error deleting form');
            }
        }
    };

    const formatDate = (dateStr) => {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateStr));
    };

    if (isLoading) {
        return <div className="loading-state">Carregando...</div>;
    }

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
                                <p>Criado em: {formatDate(form.created_at)}</p>
                                <p>Última modificação: {formatDate(form.last_modified || form.created_at)}</p>
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