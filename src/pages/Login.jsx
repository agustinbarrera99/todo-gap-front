import Form from "../components/Form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Modal from "../components/Modal.jsx";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false)

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setErrorMessage("");
        if (isSuccess) {
            navigate('/');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', { email, password });
            const { token } = response.data;

            if (token) {
                login(token);
                setIsSuccess(true);
                setErrorMessage("¡Inicio de sesión exitoso!");
                setIsModalOpen(true);
            } else {
                setErrorMessage("Usuario o contraseña incorrectos.");
                setIsSuccess(false);
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error("Login failed:", error);
            setIsSuccess(false); 
            setErrorMessage(userMessage);
            setIsModalOpen(true);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <Form onSubmit={handleSubmit}>
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
                        Login
                    </button>
                </Form>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <div className="text-center">
                    <h3 className={`text-xl font-bold mb-2 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                        {isSuccess ? '¡Login Exitoso!' : 'Error en el Login'}
                    </h3>
                    <p>{errorMessage}</p>
                </div>
            </Modal>
        </div>
    );
};

export default Login;