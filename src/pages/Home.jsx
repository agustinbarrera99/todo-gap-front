import React from "react";
import Buton from "../components/ui/Buton.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { FaTasks, FaEdit, FaCalendarAlt, FaPalette } from 'react-icons/fa';

const FeatureCard = ({ icon, title, description }) => (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
        <div className="text-4xl text-blue-700 mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
        <p className="text-center text-gray-600">{description}</p>
    </div>
);

const Home = () => {
    const { isAuthenticated } = useAuth();

    const features = [
        { icon: <FaTasks />, title: 'Gestiona tus Tareas', description: 'Crea, edita y elimina tus tareas para mantenerte organizado.' },
        { icon: <FaEdit />, title: 'Personaliza a tu gusto', description: 'Modifica tus tareas en cualquier momento para adaptarlas a tus necesidades.' },
        { icon: <FaCalendarAlt />, title: 'No olvides nada', description: 'Asigna fechas de vencimiento y recordatorios para cada una de tus tareas.' },
        { icon: <FaPalette />, title: 'Organiza por Categorías', description: 'Clasifica tus proyectos y tareas por categorías para una mejor visualización.' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4">
            <section className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-blue-800 mb-4">
                    Bienvenido a Todo Gap
                </h1>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    Organiza tu vida y aumenta tu productividad. Gestiona tus proyectos y tareas de manera eficiente y sencilla, manteniéndote siempre al tanto.
                </p>
                {isAuthenticated ? (
                    <div className="space-x-4">
                        <Link to="/my-projects">
                            <Buton text="Mis proyectos" className="bg-blue-700 hover:bg-blue-800" />
                        </Link>
                        <Link to="/create-project">
                            <Buton text="Crear proyecto" className="bg-gray-400 hover:bg-gray-500" />
                        </Link>
                    </div>
                ) : (
                    <div className="space-x-4">
                        <Link to="/register">
                            <Buton text="Regístrate ahora" className="bg-blue-700 hover:bg-blue-800" />
                        </Link>
                        <Link to="/login">
                            <Buton text="Iniciar sesión" className="bg-gray-400 hover:bg-gray-500" />
                        </Link>
                    </div>
                )}
            </section>

            {/* Sección de características con tarjetas */}
            <section className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">
                    Características clave
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard 
                            key={index} 
                            icon={feature.icon} 
                            title={feature.title} 
                            description={feature.description} 
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;