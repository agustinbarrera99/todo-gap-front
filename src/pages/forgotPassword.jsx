import Form from "../components/ui/Form.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../components/ui/Modal.jsx";
import Button from "../components/ui/Buton.jsx";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setMessage("");
        if (isSuccess) {
            // Después de un envío exitoso, es bueno redirigir al login o a una página de información
            navigate('/login'); 
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Llama al nuevo endpoint del backend para solicitar el token de restauración
            const response = await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
            console.log(response)
            
            // El backend debería responder con un mensaje genérico por seguridad
            setMessage(response.data.message || "Si el email está registrado, recibirás un correo con instrucciones.");
            setIsSuccess(true);
            setIsModalOpen(true);
            
        } catch (error) {
            console.error("Forgot Password failed:", error);
            const errorMessage = 
                error.response && error.response.data
                ? error.response.data.message || "Ocurrió un error al enviar la solicitud."
                : "Ocurrió un error de conexión. Intenta de nuevo más tarde.";

            // Por seguridad, incluso en caso de error HTTP, es mejor mostrar un mensaje genérico.
            setMessage("Ha ocurrido un error. Intenta de nuevo o verifica tu conexión.");
            setIsSuccess(false);
            setIsModalOpen(true);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 min-h-screen bg-900">
            <div className="w-full bg-gray-800 rounded-lg shadow border-emerald-500 border-1 md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h2 className="text-xl font-bold leading-tight tracking-tight text-emerald-500 md:text-2xl">
                        Recuperar Contraseña 🔑
                    </h2>
                    <p className="text-sm text-gray-400">
                        Ingresa el email asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
                    </p>
                    
                    <Form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-emerald-400">
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

                        <Button type="submit" text="Enviar Enlace de Restauración" bgColor={"bg-emerald-500"} bgColorHover={"hover:bg-emerald-600"}/>
                        
                        <p className="text-sm font-light text-gray-500 mt-4">
                            <Link to="/login" className="font-medium text-blue-600 hover:underline">
                                Volver al Login
                            </Link>
                        </p>
                    </Form>
                </div>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <div className="text-center">
                    <h3 className={`text-xl font-bold mb-2 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                        {isSuccess ? '¡Correo Enviado! 📬' : 'Error en la Solicitud ❌'}
                    </h3>
                    <p>{message}</p>
                    <button
                        onClick={handleCloseModal}
                        className={`mt-4 px-4 py-2 rounded text-white font-medium ${isSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                        {isSuccess ? 'Entendido' : 'Cerrar'}
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default ForgotPassword;