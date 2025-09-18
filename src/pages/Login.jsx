import Form from "../components/ui/Form.jsx";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Modal from "../components/ui/Modal.jsx";
import Button from "../components/ui/Buton.jsx";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false)

    const userMessage = "Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo de nuevo.";

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
            console.log(response.data)
            const { token, userId } = response.data;

            if (token && userId) {
                login(token, userId);
                navigate("/")
            } else {
                setErrorMessage("Usuario o contraseña incorrectos.");
                setIsSuccess(false);
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error("Login failed:", error);
            if (error.response && error.response.status === 401) {
                setErrorMessage("Credenciales inválidas. Por favor, verifica tu email y contraseña.");
            } else {
                setErrorMessage(userMessage);
            }
            setIsSuccess(false); 
            setIsModalOpen(true);
        }
    };

    return (

        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 min-h-screen bg-gray-50">
            <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    {/* Título de Login */}
                    <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                        Iniciar Sesión
                    </h2>
                    
                    <Form onSubmit={handleSubmit}>
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

                        {/* Campo de Contraseña */}
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
                        <Button type="submit" text="Login" />
                        
                        <p className="text-sm font-light text-gray-500">
                            ¿No tienes una cuenta? 
                            <Link to="/register" className="font-medium text-blue-600 hover:underline ml-1">
                                Regístrate aquí
                            </Link>
                        </p>
                    </Form>
                </div>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <div className="text-center">
                    <h3 className={`text-xl font-bold mb-2 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                        {!isSuccess  && 'Error en el Login ❌'}
                    </h3>
                    <p>{errorMessage}</p>
                    <button
                        onClick={handleCloseModal}
                        className={`mt-4 px-4 py-2 rounded text-white font-medium ${isSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                        {isSuccess ? 'Continuar' : 'Cerrar'}
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Login;