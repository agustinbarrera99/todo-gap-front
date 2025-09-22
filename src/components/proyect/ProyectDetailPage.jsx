// src/components/proyect/ProjectDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';
import { Loader } from '../ui/loader.jsx';
import TaskBoard from '../TaskBoard.jsx';

const ProjectDetailPage = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { authToken } = useAuth();

    useEffect(() => {
        const fetchProject = async () => {
            if (!authToken) {
                setIsLoading(false);
                setError("No estás autenticado para ver este proyecto.");
                return;
            }

            try {
                const config = {
                    headers: { 'Authorization': `Bearer ${authToken}` }
                };
                const response = await axios.get(`http://localhost:8080/api/projects/${projectId}`, config);
                setProject(response.data.response);
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching project details:", err);
                setError("No se pudo cargar la información del proyecto.");
                setIsLoading(false);
            }
        };

        if (projectId) {
            fetchProject();
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
        return <div className="text-center mt-8 text-2xl text-red-600 font-semibold">{error}</div>;
    }

    if (!project) {
        return <div className="text-center mt-8 text-xl text-gray-700">Proyecto no encontrado o ID inválido.</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border-l-4 border-emerald-500">
                <h1 className="text-4xl font-extrabold mb-2 text-gray-800">{project.title}</h1>
                <p className="text-gray-600 text-lg">{project.description}</p>
            </div>
            
            <h2 className="text-3xl font-bold mb-4 text-gray-800 border-b pb-2">Tablero Kanban</h2>
            
            <TaskBoard projectId={projectId} /> 
        </div>
    );
};

export default ProjectDetailPage;