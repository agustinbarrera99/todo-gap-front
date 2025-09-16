import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProjectDetailPage = () => {
    // Obtiene el ID del proyecto de la URL
    const { projectId } = useParams();
    
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/projects/${projectId}`);
                setProject(response.data);
                setIsLoading(false);
            } catch (err) {
                setError("No se pudo cargar la información del proyecto.");
                setIsLoading(false);
            }
        };

        fetchProject();
    }, [projectId]); // El efecto se vuelve a ejecutar si el ID del proyecto cambia

    if (isLoading) {
        return <div className="text-center mt-8">Cargando proyecto...</div>;
    }

    if (error) {
        return <div className="text-center mt-8 text-red-500">{error}</div>;
    }

    if (!project) {
        return <div className="text-center mt-8">Proyecto no encontrado.</div>;
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
            <p className="text-gray-600 mb-6">{project.description}</p>

            {/* Aquí van los componentes para las tareas, colaboración, etc. */}
            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Tareas del proyecto</h2>
                {/* Componente para mostrar la lista de tareas */}
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Colaboradores</h2>
                {/* Componente para mostrar y gestionar colaboradores */}
            </div>
        </div>
    );
};

export default ProjectDetailPage;