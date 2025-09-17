import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx";
import ProyectCard from "./ProyectCard.jsx";
import { Loader } from "../loader.jsx";

const ProyectList = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { authToken } = useAuth(); 

    // Función para obtener los proyectos
    const fetchProjects = async () => {
        if (!authToken) {
            setIsLoading(false);
            setError("No estás autenticado para ver los proyectos.");
            return;
        }
        
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${authToken}` 
                }
            };
            const response = await axios.get('http://localhost:8080/api/projects', config);
            setProjects(response.data.response || []);
            setIsLoading(false);
        } catch (err) {
            console.error("Error al obtener los proyectos:", err.response ? err.response.data : err.message);
            setError("Error al cargar los proyectos. Intenta de nuevo más tarde.");
            setIsLoading(false);
        }
    };
    
    // Función para actualizar el estado después de una eliminación
    const handleProjectDeleted = (deletedProjectId) => {
        setProjects(prevProjects => 
            prevProjects.filter(project => project._id !== deletedProjectId)
        );
    };

    useEffect(() => {
        fetchProjects();
    }, [authToken]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader />
            </div>
        );
    }

    if (error) {
        return <div className="text-center mt-8 text-red-500">{error}</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold mb-10 mt-6">Mis Proyectos</h2>
            {projects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <ProyectCard 
                            key={project._id} 
                            project={project} 
                            onProjectDeleted={handleProjectDeleted} // Pasamos el callback
                        />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 text-4xl mt-1">No hay proyectos para mostrar.</p>
            )}
        </div>
    );
};

export default ProyectList;