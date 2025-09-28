import Form from "../components/ui/Form.jsx";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Importar useParams
import axios from "axios";
import Modal from "../components/ui/Modal.jsx";
import Button from "../components/ui/Buton.jsx";

const ResetPassword = () => {
    const navigate = useNavigate();
    const { token } = useParams(); // ⬅️ CLAVE: Extrae el token de la URL

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setMessage("");
        if (isSuccess) {
            // Si es exitoso, redirige al login
            navigate('/login'); 
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage("Las contraseñas no coinciden.");
            setIsSuccess(false);
            setIsModalOpen(true);
            return;
        }

        if (newPassword.length < 8) {
            setMessage("La contraseña debe tener al menos 8 caracteres.");
            setIsSuccess(false);
            setIsModalOpen(true);
            return;
        }

        try {
            // ⬅️ Envía la nueva contraseña al endpoint que usa el token
            const response = await axios.post(`http://localhost:8080/api/auth/reset-password/${token}`, { 
                newPassword: newPassword 
            });
            
            setMessage(response.data.message || "Contraseña actualizada exitosamente.");
            setIsSuccess(true);
            setIsModalOpen(true);
            
        } catch (error) {
            console.error("Password Reset failed:", error);
            
            const errorMessage = 
                error.response && error.response.data
                ? error.response.data.message || "El enlace ha expirado o es inválido."
                : "Ocurrió un error de conexión. Intenta de nuevo más tarde.";

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
                        Establecer Nueva Contraseña
                    </h2>
                    <p className="text-sm text-gray-400">
                        Ingresa y confirma tu nueva contraseña. Asegúrate de que tenga al menos 8 caracteres.
                    </p>
                    
                    <Form onSubmit={handleSubmit}>
                        {/* Campo Nueva Contraseña */}
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-emerald-400">
                                Nueva Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 focus:ring-blue-600 focus:border-blue-600"
                                required
                            />
                        </div>

                        {/* Campo Confirmar Contraseña */}
                        <div>
                            <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-emerald-400">
                                Confirmar Contraseña
                            </label>
                            <input
                                type="password"
                                id="confirm-password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 focus:ring-blue-600 focus:border-blue-600"
                                required
                            />
                        </div>

                        <Button type="submit" text="Cambiar Contraseña" bgColor={"bg-emerald-500"} bgColorHover={"hover:bg-emerald-600"}/>
                    </Form>
                </div>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <div className="text-center">
                    <h3 className={`text-xl font-bold mb-2 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                        {isSuccess ? '¡Éxito! ✅' : 'Error ❌'}
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

export default ResetPassword;