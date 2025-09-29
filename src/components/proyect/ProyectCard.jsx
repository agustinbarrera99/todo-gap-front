import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import axios from "axios";
import IconContainer from "../IconContainer.jsx"; 
import { FaTrashAlt } from "react-icons/fa"; 
import React, { useState } from 'react'; 
import Modal from "../ui/Modal.jsx"; 
import Button from "../ui/Buton.jsx";

const ProyectCard = ({ project, onProjectDeleted }) => {
    const navigate = useNavigate();
    const { userId, authToken } = useAuth(); 
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [resultMessage, setResultMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    
    // ⬅️ CORRECCIÓN: Compara el ID de usuario con el ID del propietario del proyecto.
    const isOwner = userId === (project.owner?._id || project.owner); 

    const handleCardClick = () => {
        navigate(`/projects/${project._id}`);
    };

    const handleDeleteClick = (event) => {
        event.stopPropagation();
        setIsConfirmModalOpen(true);
    };

    const executeDelete = async () => {
        setIsConfirmModalOpen(false); 

        try {
            const config = {
                headers: { 'Authorization': `Bearer ${authToken}` }
            };
            
            const url = `http://localhost:8080/api/projects/${project._id}`;
            await axios.delete(url, config);
            
            // ⬅️ CORRECCIÓN: Solo si la solicitud es exitosa, se elimina el proyecto de la UI.
            if (onProjectDeleted) {
                onProjectDeleted(project._id);
            }
            
            // En caso de éxito, no abrimos el modal de resultado ya que el componente desaparecerá.
            // Si la llamada es exitosa, el componente se elimina de la lista y no sigue renderizándose.
            
        } catch (error) {
            setIsSuccess(false);
            // Intenta obtener un mensaje de error detallado desde el backend
            const userMessage = error.response?.data?.message || "❌ Error: No se pudo eliminar el proyecto. Revisa tus permisos.";
            console.error("Error al eliminar el proyecto:", error.response ? error.response.data : error.message);
            setResultMessage(userMessage);
            setIsResultModalOpen(true); // Abrir modal solo si falla.
        }
    };

    return (
        <>
            <div 
                className="bg-gray-800 rounded-lg shadow-md p-6 border cursor-pointer hover:shadow-lg transition-shadow duration-200 relative"
                onClick={handleCardClick}
            >
                <h3 className="text-xl font-semibold text-emerald-500 mb-2">{project.title}</h3>
                <p className="text-emerald-600 mb-4">{project.description}</p>
                
                {isOwner && (
                    <div className="absolute top-4 right-4 z-10">
                        <button 
                            onClick={handleDeleteClick} 
                            className="text-emerald-500 hover:text-emerald-600 transition-colors duration-200 p-2 rounded-full"
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
                    <p className="text-emerald-600"><strong className="text-emerald-600">Miembros:</strong> {project.members.length}</p>
                    <p className="text-emerald-600">
                        <strong className="text-emerald-600">Creador:</strong> 
                        {/* ⬅️ CORRECCIÓN: Acceso seguro al username con optional chaining */}
                        {project.owner?.username || 'Cargando...'}
                    </p>
                    <p className="text-emerald-600"><strong className="text-emerald-600">Fecha:</strong> {new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            <Modal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                title="Confirmar eliminación"
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
                    Estás a punto de eliminar permanentemente el proyecto **"{project.title}"**. ¿Estás seguro de continuar?
                </p>
            </Modal>
        
            <Modal
                isOpen={isResultModalOpen}
                onClose={() => setIsResultModalOpen(false)}
                title={isSuccess ? "Operación Exitosa" : "Error"}
                footer={[
                    <Button 
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