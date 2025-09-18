import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';
import { FaTrashAlt } from 'react-icons/fa';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Buton.jsx';

const API_BASE_URL = "http://localhost:8080/api";

// Función auxiliar para obtener el estilo de color basado en la prioridad
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

const TaskItem = ({ task, onTaskDeleted }) => { 
    const { authToken } = useAuth();
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    
    const projectId = task.project; 
    console.log(projectId)

    const { title, description, priority, assignedTo, createdAt } = task;

    const handleDragStart = (e) => {
        // Al comenzar el arrastre, guardamos el ID de la tarea en el objeto de datos del evento
        e.dataTransfer.setData("taskId", task._id);
    };

    const priorityStyles = getPriorityStyles(priority);

    const formattedDate = createdAt 
        ? new Date(createdAt).toLocaleDateString() 
        : 'N/A';
        
    const assignedUserName = assignedTo 
        ? (assignedTo.name || assignedTo.username || 'Usuario Asignado')
        : 'Sin asignar';

    // Evita que el click en el botón active el click de la card.
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
            const config = {
                headers: { 'Authorization': `Bearer ${authToken}` }
            };
            
            // Endpoint: http://localhost:8080/api/tasks/:pid/:tid 
            const url = `${API_BASE_URL}/tasks/${projectId}/${task._id}`;
            await axios.delete(url, config);

            // Éxito: Notificar al componente padre (TaskBoard) para recargar las tareas
            if (onTaskDeleted) {
                onTaskDeleted();
            }
        } catch (error) {
            console.error("Error al eliminar la tarea:", error.response ? error.response.data : error.message);
            alert("Error al eliminar la tarea. Revisa la consola."); // Alerta simple de error
        }
    };

    return (
        <>
            <div draggable="true"
                onDragStart={handleDragStart}
                className="bg-white p-4 rounded-lg shadow-md border-b-2 border-gray-300 hover:shadow-lg transition duration-150 ease-in-out relative"
                onClick={() => console.log('Abrir detalles de la tarea:', task._id)}
            >
                <div className="absolute top-2 right-2">
                    <button 
                        onClick={handleDeleteClick} 
                        className="text-red-400 hover:text-red-600 p-1 rounded-full bg-white hover:bg-gray-50 transition-colors z-20"
                        aria-label="Eliminar tarea"
                    >
                        <FaTrashAlt className="w-4 h-4" />
                    </button>
                </div>

                {/* Título y Prioridad */}
                <div className="flex justify-between items-start mb-2 pr-8"> {/* Añadimos pr-8 para el espacio del botón */}
                    <h5 className="font-bold text-lg text-gray-900 leading-tight">
                        {title}
                    </h5>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${priorityStyles.color} ml-3`}>
                        {priorityStyles.label}
                    </span>
                </div>

                {/* Descripción (Extracto) */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {description.substring(0, 100)}{description.length > 100 ? '...' : ''}
                </p>

                {/* Metadatos (Asignado y Fecha) */}
                <div className="flex justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                    <p>
                        <span className="font-medium text-gray-700">Asignado:</span> {assignedUserName}
                    </p>
                    <p>
                        <span className="font-medium text-gray-700">Creada:</span> {formattedDate}
                    </p>
                </div>
            </div>

            {/* Modal de Confirmación */}
            <Modal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                title="Confirmar Eliminación de Tarea"
                footer={[
                    <Button 
                        key="cancel" 
                        text="Cancelar" 
                        onClick={() => setIsConfirmModalOpen(false)} 
                        className="bg-gray-400 hover:bg-gray-500"
                    />,
                    <Button 
                        key="confirm" 
                        text="Eliminar" 
                        onClick={executeDelete} 
                        className="bg-red-600 hover:bg-red-700" 
                    />,
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