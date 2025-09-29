import React from "react";
import Buton from "../components/ui/Buton.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { FaTasks, FaEdit, FaPalette } from 'react-icons/fa';
import { AiOutlineTeam } from "react-icons/ai";
import Hero from "../components/ui/Hero.jsx";

const FeatureCard = ({ icon, title, description }) => (
    <div className="flex flex-col items-center p-6 bg-gray-800 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
        <div className="text-4xl text-emerald-500 mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2 text-gray-200">{title}</h3>
        <p className="text-center text-gray-400">{description}</p>
    </div>
);

const Home = () => {
    const { isAuthenticated } = useAuth();

    const features = [
        { icon: <FaTasks />, title: 'Gestiona tus Tareas', description: 'Crea, edita y elimina tus tareas para mantenerte organizado.' },
        { icon: <FaEdit />, title: 'Personaliza a tu gusto', description: 'Modifica tus tareas en cualquier momento para adaptarlas a tus necesidades.' },
        { icon: <AiOutlineTeam />, title: 'Trabaja en equipo', description: 'Agrega miembros a tus proyectos para trabajar en equipo.' },
        { icon: <FaPalette />, title: 'Organiza por Categorías', description: 'Clasifica tus proyectos y tareas por categorías para una mejor visualización.' },
    ];

    return (
        <div className="min-h-screen bg-gray-900">
            <Hero />
            <section className="max-w-6xl mt-16 mb-16 mx-auto">
                <h2 className="text-3xl font-bold text-center text-emerald-500 mb-10">
                    Características clave
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 bg-gray-900">
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
