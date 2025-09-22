import Form from "../components/ui/Form.jsx";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Modal from "../components/ui/Modal.jsx";
import Button from "../components/ui/Buton.jsx";

const Register = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); 

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        if (isSuccess) {
            navigate('/login');
        }
        setModalMessage("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (password !== confirmPassword) {
            setIsSuccess(false);
            setModalMessage("Las contraseñas no coinciden. Por favor, verifica ambos campos.");
            setIsModalOpen(true);
            return; 
        }
        
        if (!username || !email || !password) {
             setIsSuccess(false);
             setModalMessage("Por favor, rellena todos los campos.");
             setIsModalOpen(true);
             return; 
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', { 
                username, 
                email, 
                password 
            });

            if (response.data.statusCode === 201 || response.status === 201) { 
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

            let userMessage = "Ocurrió un error inesperado al registrarte. Inténtalo de nuevo.";

            if (error.response && error.response.data && error.response.data.message) {
                const backendMessage = error.response.data.message;

                if (backendMessage.includes("Email already in use") || backendMessage.includes("E11000")) {
                    userMessage = "El nombre de usuario o el correo electrónico ya están registrados.";
                } else if (error.response.status === 400) {
                    userMessage = backendMessage;
                }
            } else if (error.request) {
                 userMessage = "No se pudo conectar con el servidor. Verifica tu conexión.";
            }
            
            setModalMessage(userMessage);
            setIsModalOpen(true);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 min-h-screen bg-gray-50">
            <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                        Crea una cuenta
                    </h2>
                    
                    <Form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">
                                Nombre de Usuario
                            </label>
                            <input
                                type="text"
                                id="username"
                                placeholder="Nombre de usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 focus:ring-blue-600 focus:border-blue-600"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                                Tu Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 focus:ring-blue-600 focus:border-blue-600"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 focus:ring-blue-600 focus:border-blue-600"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900">
                                Confirmar Contraseña
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 focus:ring-blue-600 focus:border-blue-600"
                                required
                            />
                        </div>

                        <Button type="submit" text="Crear cuenta" />
                        
                        <p className="text-sm font-light text-gray-500">
                            ¿Ya tienes una cuenta? 
                            <Link to="/login" className="font-medium text-blue-600 hover:underline ml-1">
                                Inicia sesión
                            </Link>
                        </p>
                    </Form>
                </div>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <div className="text-center">
                    <h3 className={`text-xl font-bold mb-2 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                        {isSuccess ? '¡Operación Exitosa! ✅' : '¡Error! ❌'}
                    </h3>
                    <p>{modalMessage}</p>
                    <button
                        onClick={handleCloseModal}
                        className={`mt-4 px-4 py-2 rounded text-white font-medium ${isSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                        {isSuccess ? 'Ir a Login' : 'Cerrar'}
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Register;