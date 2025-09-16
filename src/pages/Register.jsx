import Form from "../components/Form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Modal from "../components/Modal.jsx";

const Register = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    // Lógica para cerrar el modal y, si fue exitoso, redirigir
    const handleCloseModal = () => {
        setIsModalOpen(false);
        if (isSuccess) {
            navigate('/login');
        }
        setModalMessage("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', { 
                username, 
                email, 
                password 
            });

            if (response.data.statusCode === 201) {
                setIsSuccess(true);
                setModalMessage("Registro exitoso. ¡Ahora puedes iniciar sesión!");
                setIsModalOpen(true);
            } else {
                setModalMessage(response.data.message || "Error en el registro. Inténtalo de nuevo.");
                setIsSuccess(false);
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error("Registration failed:", error);
            setIsSuccess(false);

            let userMessage = "Ocurrió un error inesperado. Inténtalo de nuevo.";

            if (error.response && error.response.data && error.response.data.message) {
                const backendMessage = error.response.data.message;

                if (backendMessage.includes("Path `username` is required")) {
                    userMessage = "El nombre de usuario es obligatorio.";
                } else if (backendMessage.includes("Path `email` is required")) {
                    userMessage = "El correo electrónico es obligatorio.";
                } else if (backendMessage.includes("Path `password` is required")) {
                    userMessage = "La contraseña es obligatoria.";
                } else if (backendMessage.includes("Email already in use")) {
                    userMessage = "El correo electrónico ya está en uso.";
                } else if (backendMessage.includes("E11000 duplicate key error collection")) {
                    userMessage = "El nombre de usuario ya está en uso. Por favor, elige otro.";
                }
            }
            
            setModalMessage(userMessage);
            setIsModalOpen(true);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <Form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-2 border border-gray-300 rounded"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                    >
                        Register
                    </button>
                </Form>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <div className="text-center">
                    <h3 className={`text-xl font-bold mb-2 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                        {isSuccess ? 'Registro Exitoso' : 'Error en el Registro'}
                    </h3>
                    <p>{modalMessage}</p>
                </div>
            </Modal>
        </div>
    );
};

export default Register;