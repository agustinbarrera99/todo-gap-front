import React, { useState } from "react";
import Form from "../components/Form.jsx";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal.jsx";

const CreateProject = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const { authToken } = useAuth();
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const closeModal = () => {
        setIsModalOpen(false);
        setModalMessage("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!authToken) {
            setModalMessage("No hay un token de autenticación. Inicia sesión para crear un proyecto.");
            setIsModalOpen(true);
            return;
        }
        const projectData = {
            title,
            description
        };

        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            };

            const response = await axios.post(
                'http://localhost:8080/api/projects',
                projectData,
                config
            );

            if (response.data.statusCode === 201) {
                navigate("/my-projects");
            } else {
                setModalMessage("Proyecto creado, pero no se realizó la redirección.");
                setIsModalOpen(true);
            }
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : "Ocurrió un error inesperado.";
            setModalMessage(errorMessage);
            setIsModalOpen(true);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-2xl font-bold mb-4">Crear Proyecto</h2>
            <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
                <Form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Título del proyecto"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="p-2 border border-gray-300 rounded"
                        required
                    />
                    <textarea
                        placeholder="Descripción del proyecto"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="p-2 border border-gray-300 rounded h-32 resize-none"
                        required
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                    >
                        Crear
                    </button>
                </Form>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <h3 className="text-xl font-semibold mb-4">Error</h3>
                <p className="text-gray-700 mb-4">{modalMessage}</p>
                <button
                    onClick={closeModal}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Cerrar
                </button>
            </Modal>
        </div>
    );
};

export default CreateProject;