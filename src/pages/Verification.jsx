import Form from "../components/ui/Form.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../components/ui/Modal.jsx";
import Button from "../components/ui/Buton.jsx";

const Verification = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setMessage("");
        if (isSuccess) {
            // Si la verificación es exitosa, redirige a login
            navigate('/login'); 
        }
    };

    const handleSubmit = async (event) => {
        const data = {email, code}
        event.preventDefault();
        try {
            // Se envía una petición GET o POST al endpoint de verificación (usaremos GET como en la explicación anterior)
            // Asegúrate de que tu backend esté configurado para manejar los parámetros como `query`
            const response = await axios.post(`http://localhost:8080/api/auth/verify-email`, data);
            setMessage(response.data.message);
            setIsSuccess(true);
            setIsModalOpen(true);
            
        } catch (error) {
            console.error("Verification failed:", error);
            const errorMessage = 
                error.response && error.response.data
                ? error.response.data.message || "Error de verificación."
                : "Ocurrió un error al intentar verificar tu cuenta. Intenta de nuevo.";

            setMessage(errorMessage);
            setIsSuccess(false);
            setIsModalOpen(true);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 min-h-screen bg-900">
            <div className="w-full bg-gray-800 rounded-lg shadow border-emerald-500 border-1 md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h2 className="text-xl font-bold leading-tight tracking-tight text-emerald-500 md:text-2xl">
                        Verificación de Cuenta 📧
                    </h2>
                    <p className="text-sm text-gray-400">
                        Ingresa el código de 8 caracteres que enviamos a tu correo electrónico.
                    </p>
                    
                    <Form onSubmit={handleSubmit}>
                        {/* Campo de Email (para identificar al usuario) */}
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

                        {/* Campo para el Código de Verificación */}
                        <div>
                            <label htmlFor="code" className="block mb-2 text-sm font-medium text-emerald-400">
                                Código de Verificación
                            </label>
                            <input
                                type="text"
                                id="code"
                                placeholder="8 caracteres"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 focus:ring-blue-600 focus:border-blue-600"
                                required
                                maxLength={8}
                            />
                        </div>

                        <Button type="submit" text="Verificar Cuenta" bgColor={"bg-emerald-500"} bgColorHover={"hover:bg-emerald-600"}/>
                    </Form>
                </div>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <div className="text-center">
                    <h3 className={`text-xl font-bold mb-2 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                        {isSuccess ? '¡Verificación Exitosa! ✅' : 'Error de Verificación ❌'}
                    </h3>
                    <p>{message}</p>
                    <button
                        onClick={handleCloseModal}
                        className={`mt-4 px-4 py-2 rounded text-white font-medium ${isSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                        {isSuccess ? 'Ir a Iniciar Sesión' : 'Cerrar'}
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Verification;