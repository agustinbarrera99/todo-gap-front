import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';
import { FaTrashAlt, FaEdit } from 'react-icons/fa'; 
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Buton.jsx';
import Form from '../ui/Form.jsx'; 

const API_BASE_URL = "http://localhost:8080/api";

const getPriorityStyles = (priority) => {
    switch (priority.toLowerCase()) {
        case 'high':
            return { label: 'Alta', color: 'bg-red-200 text-red-800 border-red-400' };
        case 'medium':
            return { label: 'Media', color: 'bg-yellow-200 text-yellow-800 border-yellow-400' };
        case 'low':
            return { label: 'Baja', color: 'bg-green-200 text-green-800 border-green-400' };
        default:
            return { label: priority, color: 'bg-gray-200 text-gray-800 border-gray-400' };
    }
};

const TaskItem = ({ task, onTaskDeleted, onTaskUpdated }) => { 
    const { authToken } = useAuth();
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
    
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDescription, setEditDescription] = useState(task.description);
    
    const projectId = task.project;
    
    const { priority, assignedTo, createdAt } = task;

    const handleDragStart = (e) => {
        e.dataTransfer.setData("taskId", task._id);
    };

    const priorityStyles = getPriorityStyles(priority);

    const formattedDate = createdAt 
        ? new Date(createdAt).toLocaleDateString() 
        : 'N/A';
        
    const assignedUserName = assignedTo 
        ? (assignedTo.name || assignedTo.username || 'Usuario Asignado')
        : 'Sin asignar';

    const handleEditClick = (event) => {
        event.stopPropagation();
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();

        if (!authToken) {
            console.error("No autenticado. No se puede actualizar la tarea.");
            return;
        }

        const updatedData = {
            title: editTitle,
            description: editDescription,
        };

        try {
            const config = { headers: { 'Authorization': `Bearer ${authToken}` } };
            const url = `${API_BASE_URL}/tasks/${projectId}/${task._id}`;
            
            await axios.put(url, updatedData, config); 

            setIsEditModalOpen(false);
            if (onTaskUpdated) {
                onTaskUpdated();
            }
        } catch (error) {
            console.error("Error al actualizar la tarea:", error.response ? error.response.data : error.message);
            alert("Error al actualizar la tarea. Revisa la consola.");
        }
    };

    const handleDeleteClick = (event) => {
        event.stopPropagation();
        setIsConfirmModalOpen(true);
    };

    const executeDelete = async () => {
        setIsConfirmModalOpen(false);
        if (!authToken) {
            console.error("No autenticado. No se puede eliminar la tarea.");
            return;
        }

        try {
            const config = { headers: { 'Authorization': `Bearer ${authToken}` } };
            const url = `${API_BASE_URL}/tasks/${projectId}/${task._id}`;
            await axios.delete(url, config);

            if (onTaskDeleted) {
                onTaskDeleted();
            }
        } catch (error) {
            console.error("Error al eliminar la tarea:", error.response ? error.response.data : error.message);
            alert("Error al eliminar la tarea. Revisa la consola.");
        }
    };


    return (
        <>
            <div 
                draggable="true"
                onDragStart={handleDragStart}
                className="bg-white p-4 rounded-lg shadow-md border-b-2 border-gray-300 hover:shadow-lg transition duration-150 ease-in-out relative cursor-pointer"
                onClick={handleEditClick} 
            >
                
                <div className="absolute top-2 right-2 flex space-x-1 z-20">
                    <button 
                        onClick={handleEditClick} 
                        className="text-blue-400 hover:text-blue-600 p-1 rounded-full bg-white hover:bg-gray-50 transition-colors"
                        aria-label="Editar tarea"
                    >
                        <FaEdit className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={handleDeleteClick} 
                        className="text-red-400 hover:text-red-600 p-1 rounded-full bg-white hover:bg-gray-50 transition-colors"
                        aria-label="Eliminar tarea"
                    >
                        <FaTrashAlt className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex justify-between items-start mb-2 pr-16"> 
                    <h5 className="font-bold text-lg text-gray-900 leading-tight">
                        {task.title} 
                    </h5>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${priorityStyles.color} ml-3`}>
                        {priorityStyles.label}
                    </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {task.description.substring(0, 100)}{task.description.length > 100 ? '...' : ''}
                </p>

                <div className="flex justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                    <p>
                        <span className="font-medium text-gray-700">Asignado:</span> {assignedUserName}
                    </p>
                    <p>
                        <span className="font-medium text-gray-700">Creada:</span> {formattedDate}
                    </p>
                </div>
            </div>

            {/* Modal de EDICIÓN */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={`Editar Tarea: ${task.title}`}
                footer={[
                    <Button 
                        key="cancel" 
                        text="Cancelar" 
                        onClick={() => setIsEditModalOpen(false)} 
                        className="bg-gray-400 hover:bg-gray-500"
                    />,
                    <Button 
                        key="save" 
                        text="Guardar Cambios" 
                        onClick={handleEditSubmit} 
                        className="bg-blue-600 hover:bg-blue-700" 
                    />,
                ]}
            >
                <Form> 
                    <div className="mb-4">
                        <label htmlFor="editTitle" className="block mb-2 text-sm font-medium text-gray-900">Título</label>
                        <input
                            type="text"
                            id="editTitle"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="editDescription" className="block mb-2 text-sm font-medium text-gray-900">Descripción</label>
                        <textarea
                            id="editDescription"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 h-32 resize-none"
                            required
                        />
                    </div>
                </Form>
            </Modal>

            <Modal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                title="Confirmar Eliminación de Tarea"
                footer={[
                    <Button key="cancel" text="Cancelar" onClick={() => setIsConfirmModalOpen(false)} className="bg-gray-400 hover:bg-gray-500"/>,
                    <Button key="confirm" text="Eliminar" onClick={executeDelete} className="bg-red-600 hover:bg-red-700" />,
                ]}
            >
                <p className="text-gray-700">
                    ¿Estás seguro de eliminar la tarea **"{task.title}"**? Esta acción no se puede deshacer.
                </p>
            </Modal>
        </>
    );
};

export default TaskItem;