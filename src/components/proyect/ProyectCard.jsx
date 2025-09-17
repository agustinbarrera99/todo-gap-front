import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import axios from "axios";
import IconContainer from "../IconContainer.jsx"; 
import { FaTrashAlt } from "react-icons/fa"; 
import React, { useState } from 'react'; // Necesitas useState
import Modal from "../Modal.jsx"; // Asegura la ruta a tu modal
import Buton from "../Buton.jsx"; // Asegura la ruta a tu botón

const ProyectCard = ({ project, onProjectDeleted }) => {
    const navigate = useNavigate();
    const { userId, authToken } = useAuth(); 
    
    // Estados para manejar el modal de confirmación y el modal de resultado
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [resultMessage, setResultMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    // Lógica corregida para isOwner
    const isOwner = userId && project.owner && project.owner._id.toString() === userId;

    const handleCardClick = () => {
        navigate(`/projects/${project._id}`);
    };

    // Función que inicia el proceso mostrando el modal de confirmación
    const handleDeleteClick = (event) => {
        event.stopPropagation();
        setIsConfirmModalOpen(true);
    };

    // Función principal para ejecutar la eliminación
    const executeDelete = async () => {
        setIsConfirmModalOpen(false); // Cierra el modal de confirmación

        try {
            const config = {
                headers: { 'Authorization': `Bearer ${authToken}` }
            };
            
            const url = `http://localhost:8080/api/projects/${project._id}`;
            await axios.delete(url, config);

            // Éxito
            setIsSuccess(true);
            setResultMessage("✅ Proyecto eliminado exitosamente.");
            
            // Notificar a ProyectList para que actualice la vista
            if (onProjectDeleted) {
                onProjectDeleted(project._id);
            }
        } catch (error) {
            // Error
            setIsSuccess(false);
            const userMessage = "❌ Error: No se pudo eliminar el proyecto. Revisa tus permisos.";
            console.error("Error al eliminar el proyecto:", error.response ? error.response.data : error.message);
            setResultMessage(userMessage);
        } finally {
            setIsResultModalOpen(true); // Muestra el modal de resultado
        }
    };

    return (
        <>
            <div 
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow duration-200 relative"
                onClick={handleCardClick}
            >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                
                {/* Ícono de eliminación condicional para el dueño */}
                {isOwner && (
                    <div className="absolute top-4 right-4 z-10">
                        <button 
                            onClick={handleDeleteClick} // Llama a la nueva función que abre el modal
                            className="text-red-500 hover:text-red-700 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
                            aria-label="Eliminar proyecto"
                        >
                            <IconContainer 
                                icon={<FaTrashAlt />} 
                                className="text-xl" 
                            />
                        </button>
                    </div>
                )}

                <div className="text-sm text-gray-500">
                    <p><strong>Miembros:</strong> {project.members.length}</p>
                    <p><strong>Creador:</strong> {project.owner.username}</p>
                    <p><strong>Fecha:</strong> {new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Modal de CONFIRMACIÓN */}
            <Modal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                title="Confirmar eliminación"
                footer={[
                    <Buton 
                        key="cancel" 
                        text="Cancelar" 
                        onClick={() => setIsConfirmModalOpen(false)} 
                        className="bg-gray-400 hover:bg-gray-500"
                    />,
                    <Buton 
                        key="confirm" 
                        text="Eliminar" 
                        onClick={executeDelete} 
                        className="bg-red-600 hover:bg-red-700" 
                    />,
                ]}
            >
                <p className="text-gray-700">
                    Estás a punto de eliminar permanentemente el proyecto **"{project.title}"**. ¿Estás seguro de continuar?
                </p>
            </Modal>
            
            {/* Modal de RESULTADO (Éxito o Error) */}
            <Modal
                isOpen={isResultModalOpen}
                onClose={() => setIsResultModalOpen(false)}
                title={isSuccess ? "Operación Exitosa" : "Error"}
                footer={[
                    <Buton 
                        key="close" 
                        text="Aceptar" 
                        onClick={() => setIsResultModalOpen(false)} 
                        className={isSuccess ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"}
                    />
                ]}
            >
                <p className={`text-lg font-medium ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                    {resultMessage}
                </p>
            </Modal>
        </>
    );
};

export default ProyectCard;