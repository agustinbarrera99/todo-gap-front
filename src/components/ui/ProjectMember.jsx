import React, { useState } from "react";
import axios from "axios";
import Modal from "./Modal";
import Button from "./Buton";
import { useAuth } from "../../context/AuthContext";
import { FaUserTimes, FaCrown } from "react-icons/fa";

const API_PROJECTS_URL = "http://localhost:8080/api/projects";

const ProjectMembers = ({
  projectId,
  members,
  onMemberRemoved,
  projectOwnerId,
  onAddMemberClick,
  isOwner,
}) => {
  const { authToken } = useAuth();
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [memberToDeleteName, setMemberToDeleteName] = useState("");

  const handleDeleteClick = (memberId, memberUsername) => {
    if (memberId === projectOwnerId) {
      setErrorModal({
        isOpen: true,
        message:
          "El propietario del proyecto no puede ser eliminado de la lista de miembros.",
      });
      return;
    }
    setMemberToDelete(memberId);
    setMemberToDeleteName(memberUsername || "este miembro");
    setIsConfirmModalOpen(true);
  };

  // Función que se ejecuta al confirmar la eliminación
  const executeRemoveMember = async () => {
    const memberId = memberToDelete;
    setIsConfirmModalOpen(false); // Cierra el modal de confirmación
    setMemberToDelete(null); // Limpia el estado
    setMemberToDeleteName("");

    try {
      const config = {
        headers: { Authorization: `Bearer ${authToken}` },
      };
      await axios.delete(
        `${API_PROJECTS_URL}/${projectId}/members/${memberId}`,
        config
      );
      onMemberRemoved(memberId);
    } catch (err) {
      console.error("Error al eliminar miembro:", err.response?.data || err);
      setErrorModal({
        isOpen: true,
        message:
          err.response?.data?.message ||
          "Error al eliminar miembro. Revisa tus permisos o la conexión.",
      });
    }
  };
  const currentOwnerId = projectOwnerId;

  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-6 border-l-4 border-yellow-500 w-full md:w-1/3">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-yellow-500">
          Miembros ({members.length})
        </h3>

        {isOwner && (
          <button
            onClick={onAddMemberClick}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1 px-3 rounded-md text-sm transition-colors duration-200 flex items-center"
          >
            + Agregar
          </button>
        )}
      </div>
      <ul className="space-y-3 max-h-64 overflow-y-auto pr-2">
        {members.length > 0 ? (
          members.map((member) => {
            const isMemberOwner = member._id === currentOwnerId;
            const initial = member.username
              ? member.username[0].toUpperCase()
              : "U";

            return (
              <li
                key={member._id}
                className="flex justify-between items-center p-3 bg-gray-700 rounded-md transition-colors duration-150 hover:bg-gray-600"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-600 text-white font-bold text-sm">
                    {initial}
                  </div>

                  <span className="text-white font-medium">
                    {member.username || member.email}
                    {isMemberOwner && (
                      <span className="ml-2 bg-yellow-700 text-xs font-bold py-0.5 px-2 rounded-full inline-flex items-center">
                        <FaCrown className="mr-1 text-xs" /> Owner
                      </span>
                    )}
                  </span>
                </div>

                {isOwner && !isMemberOwner && (
                  <button
                    onClick={() =>
                      handleDeleteClick(
                        member._id,
                        member.username || member.email
                      )
                    }
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-2 rounded-md text-xs transition-colors duration-200"
                    aria-label={`Eliminar a ${member.username}`}
                  >
                    <FaUserTimes className="inline-block mr-1" /> Eliminar
                  </button>
                )}
              </li>
            );
          })
        ) : (
          <p className="text-gray-400 text-center py-4">
            Aún no hay miembros en este proyecto.
          </p>
        )}
      </ul>
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirmar Eliminación de Miembro"
        className="max-w-md bg-gray-800 text-white"
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
            onClick={executeRemoveMember}
            className="bg-red-600 hover:bg-red-700"
          />,
        ]}
      >
        <p className="text-gray-300">
          ¿Estás seguro de que quieres eliminar a{" "}
          <strong className="text-yellow-500">{memberToDeleteName}</strong> del
          proyecto?
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Esta acción no se puede deshacer y el miembro perderá el acceso.
        </p>
      </Modal>
                             {" "}
      <Modal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: "" })}
        title="Error al Eliminar Miembro"
        className="max-w-xs bg-gray-800 text-white"
        footer={[
          <Button
            key="close"
            text="Cerrar"
            onClick={() => setErrorModal({ isOpen: false, message: "" })}
            className="bg-red-600 hover:bg-red-700 text-white"
          />,
        ]}
      >
                        <p className="text-gray-300">{errorModal.message}</p>   
               {" "}
      </Modal>
    </div>
  );
};

export default ProjectMembers;
