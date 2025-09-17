import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';
import { Loader } from '../loader.jsx';

const ProjectDetailPage = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { authToken } = useAuth();

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                };
                const response = await axios.get(`http://localhost:8080/api/projects/${projectId}`, config);
                setProject(response.data.response); // Ajusta según la estructura de tu respuesta
                setIsLoading(false);
            } catch (err) {
                setError("No se pudo cargar la información del proyecto.");
                setIsLoading(false);
            }
        };

        if (authToken) {
            fetchProject();
        } else {
            setIsLoading(false);
            setError("No estás autenticado para ver este proyecto.");
        }
    }, [projectId, authToken]);

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

    if (!project) {
        return <div className="text-center mt-8">Proyecto no encontrado.</div>;
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
            <p className="text-gray-600 mb-6">{project.description}</p>
            {/* El resto del componente... */}
        </div>
    );
};

export default ProjectDetailPage;