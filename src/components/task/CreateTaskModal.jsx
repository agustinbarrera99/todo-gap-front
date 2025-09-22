// src/components/proyect/CreateTaskModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Buton.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const API_BASE_URL = "http://localhost:8080/api";
const STATUS_OPTIONS = ["Pendiente", "En progreso", "A verificar", "Completada"];
const PRIORITY_OPTIONS = ["low", "medium", "high"];

const CreateTaskModal = ({ projectId, isOpen, onClose, onSuccess }) => {
    const { authToken } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'Pendiente', 
        priority: 'medium', 
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setFormError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.description) {
            setFormError("El título y la descripción son obligatorios.");
            return;
        }

        if (!authToken) {
            setFormError("Error de autenticación. Por favor, reinicia la sesión.");
            return;
        }

        setIsSubmitting(true);
        setFormError('');

        try {
            const config = {
                headers: { 
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            };
            
            const response = await axios.post(
                `${API_BASE_URL}/tasks/${projectId}`,
                formData,
                config
            );

            onSuccess(response.data); 
            setFormData({ title: '', description: '', status: 'Pendiente', priority: 'medium' });
            onClose();

        } catch (err) {
            console.error("Error al crear la tarea:", err);
            const errorMsg = err.response 
                ? err.response.data.message || "Error al crear la tarea." 
                : "Error de red o servidor no disponible.";
            setFormError(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-4">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Crear Nueva Tarea</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            placeholder="Ej. Implementar autenticación"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                            name="description"
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            placeholder="Detalles de lo que se debe hacer..."
                            required
                        />
                    </div>

                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estado</label>
                            <select
                                name="status"
                                id="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white"
                            >
                                {STATUS_OPTIONS.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="flex-1">
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Prioridad</label>
                            <select
                                name="priority"
                                id="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white capitalize"
                            >
                                {PRIORITY_OPTIONS.map(opt => (
                                    <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        
                    </div>

                    {formError && (
                        <p className="text-sm text-red-600 font-medium">{formError}</p>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <Button 
                            type="submit"
                            text={isSubmitting ? "Creando..." : "Crear Tarea"}
                            disabled={isSubmitting}
                        />
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default CreateTaskModal;