import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';
import Modal from './Modal.jsx';
import Button from './Buton.jsx';
import MemberSelector from './MemberSelector.jsx';
import { FaUserPlus } from 'react-icons/fa';

const API_PROJECTS_URL = "http://localhost:8080/api/projects";

const AddMemberModal = ({ isOpen, onClose, projectId, currentMembers, onMembersAdded }) => {
    const { authToken } = useAuth();
    const [membersToAdd, setMembersToAdd] = useState([]); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen) {
            setMembersToAdd([]);
            setError(null);
        }
    }, [isOpen]);

    const handleAddMembers = async () => {
        if (membersToAdd.length === 0) {
            setError("Selecciona al menos un miembro para añadir.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const config = {
                headers: { 'Authorization': `Bearer ${authToken}` }
            };
            
            // 1. Obtener los IDs de los miembros *existentes*
            const existingMemberIds = (currentMembers || []).map(m => m._id || m);
            
            // 2. Combinar los IDs existentes con los IDs de los nuevos (y usar Set para evitar duplicados)
            const allMemberIdsSet = new Set([...existingMemberIds, ...membersToAdd]);
            const finalMemberIds = Array.from(allMemberIdsSet);
            
            // 3. Payload: Enviamos la lista COMPLETA y final de IDs
            const updatePayload = {
                members: finalMemberIds, 
            };
            
            // 4. Usar el endpoint PUT de actualización general
            const response = await axios.put(
                `${API_PROJECTS_URL}/${projectId}`,
                updatePayload, // Enviamos el array combinado
                config
            );
            
            const apiResponseProject = response.data.response || response.data;
            const updatedMembersList = apiResponseProject.members;
            
            if (updatedMembersList) {
                onMembersAdded(updatedMembersList); 
            }
            
            onClose(); 
        } catch (err) {
            console.error("Error añadiendo miembros:", err.response?.data || err);
            setError(err.response?.data?.message || "Error al agregar los miembros. Revisa el servidor.");
        } finally {
            setIsSubmitting(false);
        }
    };


   const currentMemberIds = (currentMembers || []).map(m => m._id);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Añadir Miembros al Proyecto"
            className="max-w-md"
            footer={[
                <Button 
                    key="cancel" 
                    text="Cancelar" 
                    onClick={onClose} 
                    className="bg-gray-600 hover:bg-gray-700 text-white"
                    disabled={isSubmitting}
                />,
                <Button 
                    key="add" 
                    text={isSubmitting ? "Añadiendo..." : "Añadir"} 
                    onClick={handleAddMembers} 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white" 
                    disabled={isSubmitting || membersToAdd.length === 0}
                    icon={<FaUserPlus />}
                />,
            ]}
        >
            <MemberSelector 
                onMembersChange={setMembersToAdd}
                excludeIds={currentMemberIds} 
                initialSelectedMembers={[]} 
            />

            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </Modal>
    );
};

export default AddMemberModal;