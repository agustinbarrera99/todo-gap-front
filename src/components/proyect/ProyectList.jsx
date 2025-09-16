import React, { useState } from "react";
import ProyectCard from "./ProyectCard"; // Importa el componente hijo

const ProyectList = () => {
    // Estado con un proyecto de prueba (hardcodeado)
    const [projects, setProjects] = useState([
        {
            id: '1',
            title: 'Aplicación de Tareas',
            description: 'Una aplicación para gestionar tareas diarias y proyectos personales.',
            status: 'En progreso',
            author: 'Usuario de prueba',
            createdAt: '2023-10-27'
        }
    ]);

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold mb-6">Mis Proyectos</h2>
            {projects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Mapea la lista de proyectos y renderiza un ProjectCard por cada uno */}
                    {projects.map(project => (
                        <ProyectCard key={project.id} project={project} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No hay proyectos para mostrar.</p>
            )}
        </div>
    );
};

export default ProyectList;

