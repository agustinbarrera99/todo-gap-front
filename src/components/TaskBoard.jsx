import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";
import { Loader } from "./ui/loader.jsx";
import Modal from "./ui/Modal.jsx";
import TaskColumn from "./task/TaskColumn.jsx";
import Button from "./ui/Buton.jsx";
import CreateTaskModal from "./task/CreateTaskModal.jsx";
import { FaPlus } from "react-icons/fa";

const API_BASE_URL = "http://localhost:8080/api";
const TASK_STATUSES = ["PENDIENTE", "EN PROGRESO", "A VERIFICAR", "COMPLETADA"];

const TaskBoard = ({ projectId }) => {
    const { authToken } = useAuth();

    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // 1. FUNCIÓN DE CARGA DE TAREAS
    const fetchTasks = async () => {
        if (!authToken) {
            setError("No estás autenticado. Por favor, inicia sesión.");
            setIsModalOpen(true);
            setIsLoading(false);
            return;
        }
        if (!projectId) return;

        setIsLoading(true);
        setError(null);

        try {
            const config = {
                headers: { Authorization: `Bearer ${authToken}` },
            };

            const response = await axios.get(
                `${API_BASE_URL}/tasks/project/${projectId}`,
                config
            );

            // 💡 Solo establecemos las tareas en el fetch
            setTasks(response.data.response || []); 
        } catch (err) {
            console.error("Error al cargar las tareas:", err);
            const errorMessage = err.response
                ? err.response.data.message ||
                  "Error al obtener las tareas del proyecto."
                : "Error de red o servidor no disponible.";

            setError(errorMessage);
            setIsModalOpen(true);
        } finally {
            setIsLoading(false);
        }
    };
    
    // 2. FUNCIÓN DE ACTUALIZACIÓN DE ESTADO (DRAG & DROP)
    const updateTaskStatus = async (taskId, newStatus) => {
        if (!authToken || !projectId || !taskId) {
            console.error("Faltan datos para actualizar la tarea.");
            return;
        }
        
        // Convertimos el estado de la columna (MAYÚSCULAS) al formato del modelo (Título o Título Case)
        // Ejemplo: "PENDIENTE" -> "Pendiente"
        const statusToSend = newStatus.charAt(0).toUpperCase() + newStatus.slice(1).toLowerCase();

        try {
            const config = {
                headers: { Authorization: `Bearer ${authToken}` },
            };

            // Endpoint: PUT http://localhost:8080/api/tasks/:pid/:tid
            const url = `${API_BASE_URL}/tasks/${projectId}/${taskId}`;

            // Enviamos solo el campo 'status' para actualizar
            await axios.put(url, { status: statusToSend }, config);

            // Tras el éxito, recargamos las tareas para actualizar el tablero
            fetchTasks(); 
        } catch (err) {
            console.error("Error al actualizar el estado de la tarea:", err);
            alert("Error al mover la tarea. Por favor, inténtalo de nuevo.");
        }
    };
    
    // El useEffect que llama a fetchTasks sigue siendo el mismo
    useEffect(() => {
        fetchTasks();
    }, [projectId, authToken]);

    const closeModal = () => {
        setIsModalOpen(false);
        setError(null);
    };

    const handleTaskCreationSuccess = () => {
        setIsCreateModalOpen(false);
        fetchTasks();
    };

    const groupedTasks = TASK_STATUSES.reduce((acc, status) => {
        const uppercaseStatus = status.toUpperCase();

        acc[status] = tasks.filter(
            (task) => task.status && task.status.toUpperCase() === uppercaseStatus 
        );
        return acc;
    }, {});

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow-inner">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-700">Tablero de Tareas</h3>
                <Button
                    text={
                        <span className="flex items-center space-x-2">
                            <FaPlus className="w-4 h-4" />
                            <span>Crear Tarea</span>
                        </span>
                    }
                    onClick={() => setIsCreateModalOpen(true)}
                />
            </div>
            
            <div className="flex space-x-4 overflow-x-auto pb-4">
                {TASK_STATUSES.map((status) => (
                    <TaskColumn
                        key={status}
                        title={status}
                        tasks={groupedTasks[status] || []}
                        onTaskActionCompleted={fetchTasks}
                        onDropTask={updateTaskStatus} 
                    />
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal}></Modal>
            <CreateTaskModal
                projectId={projectId}
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleTaskCreationSuccess}
            />
        </div>
    );
};

export default TaskBoard;