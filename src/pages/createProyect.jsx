import React, { useState } from "react";
import Form from "../components/ui/Form.jsx";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import Modal from "../components/ui/Modal.jsx";
import Button from "../components/ui/Buton.jsx";
import MemberSelector from "../components/ui/MemberSelector.jsx";
import useDebounce from "../hooks/useDebounce.jsx";

const CreateProject = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
    const [memberIds, setMemberIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const { authToken } = useAuth();
  const navigate = useNavigate();
  const userErrorMessage =
    "Ocurrió un error al intentar crear el proyecto. Por favor, inténtalo de nuevo.";

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };

    const handleMembersChange = (ids) => {
        setMemberIds(ids);
    };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!authToken) {
      setModalMessage("Necesitas iniciar sesión para crear un proyecto.");
      setIsModalOpen(true);
      return;
    }

    const projectData = {
      title,
      description,
      members: memberIds
    };

    console.log(projectData)

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };

      const response = await axios.post(
        "http://localhost:8080/api/projects",
        projectData,
        config
      );

      if (response.data.statusCode === 201) {
        navigate("/my-projects");
        return;
      } else {
        setModalMessage(
          "Proyecto creado, pero el servidor devolvió una respuesta inesperada."
        );
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error al crear proyecto:", error);

      let message = userErrorMessage;
      if (error.response) {
        message =
          error.response.data.message ||
          error.response.data.error ||
          userErrorMessage;
      } else if (error.request) {
        message = "No se pudo conectar con el servidor. Verifica tu conexión.";
      }
      setModalMessage(message);
      setIsModalOpen(true);
    }
  };

    return (
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 min-h-screen bg-gray-50">
            <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                        Crear Nuevo Proyecto
                    </h2>
                    <Form onSubmit={handleSubmit}>
                        {/* Input Título */}
                        <div>
                            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">
                                Título del Proyecto
                            </label>
                            <input
                                type="text"
                                id="title"
                                placeholder="Título del proyecto"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 focus:ring-blue-600 focus:border-blue-600"
                                required
                            />
                        </div>

                        {/* Input Descripción */}
                        <div>
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">
                                Descripción
                            </label>
                            <textarea
                                id="description"
                                placeholder="Descripción detallada del proyecto"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 focus:ring-blue-600 focus:border-blue-600 h-32 resize-none"
                                required
                            />
                        </div>

                        {/* 💡 Nuevo componente de selección de miembros */}
                        <MemberSelector 
                            onMembersChange={handleMembersChange}
                        />

                        <Button type="submit" text="Crear Proyecto" />
                        <p className="text-sm font-light text-gray-500">
                            Asegúrate de haber iniciado sesión antes de crear.
                        </p>
                    </Form>
                </div>
            </div>
            {/* Modal de error */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <div className="text-center">
                    <h3 className="text-xl font-bold mb-2 text-red-600">Error ⚠️</h3>
                    <p className="text-gray-700">{modalMessage}</p>
                    <button
                        onClick={handleCloseModal}
                        className="mt-4 px-4 py-2 rounded text-white font-medium bg-red-600 hover:bg-red-700"
                    >
                        Cerrar
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default CreateProject;