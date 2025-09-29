import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx";
import { Loader } from "../ui/loader.jsx";
import TaskBoard from "../TaskBoard.jsx";
import ProjectMembers from "../ui/ProjectMember.jsx";
import { useCallback } from "react";
import AddMemberModal from "../ui/AddMemberModal.jsx";

const ProjectDetailPage = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { authToken, userId } = useAuth();
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

    const handleMembersAdded = (updatedMembersList) => {
        setProject((prevProject) => {
            if (!prevProject) return null;
            return {
                ...prevProject,
                members: updatedMembersList,
            };
        });
    };

    const fetchProject = useCallback(async () => {
        if (!authToken) {
            setIsLoading(false);
            setError("No estás autenticado para ver este proyecto.");
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${authToken}` },
            };
            const response = await axios.get(
                `http://localhost:8080/api/projects/${projectId}`,
                config
            );
            setProject(response.data.response);
            setIsLoading(false);
        } catch (err) {
            console.error("Error fetching project details:", err);
            setError("No se pudo cargar la información del proyecto.");
            setIsLoading(false);
        }
    }, [projectId, authToken]);

    useEffect(() => {
        if (projectId) {
            fetchProject();
        }
    }, [projectId, fetchProject]);

    const handleMemberRemoved = (memberId) => {
        setProject((prevProject) => {
            if (!prevProject) return null;

            const updatedMembers = prevProject.members.filter(
                (member) => member._id !== memberId
            );

            return {
                ...prevProject,
                members: updatedMembers,
            };
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center mt-8 text-2xl text-red-600 font-semibold">
                {error}
            </div>
        );
    }

    if (!project) {
        return (
            <div className="text-center mt-8 text-xl text-gray-700">
                Proyecto no encontrado o ID inválido.
            </div>
        );
    }

    const projectOwnerId = project.owner._id
        ? project.owner._id.toString()
        : project.owner;
    const isOwner = userId === projectOwnerId;

    return (
        <div className="container mx-auto p-4 md:p-8 bg-gray-900 min-h-screen">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                
                <div className="bg-gray-800 shadow-lg rounded-lg p-6 border-l-4 border-emerald-500 w-full md:w-2/3">
                    <h1 className="text-4xl font-extrabold mb-2 text-emerald-500">
                        {project.title}
                    </h1>
                    <p className="text-emerald-400 text-lg">{project.description}</p>
                </div>
                
                {project.members && (
                    <ProjectMembers
                        projectId={projectId}
                        members={project.members}
                        onMemberRemoved={handleMemberRemoved}
                        projectOwnerId={projectOwnerId}
                        onAddMemberClick={() => setIsAddMemberModalOpen(true)}
                        isOwner={isOwner}
                        ProjectMembers={project.members || []}
                    />
                )}
            </div>
            
            <h2 className="text-3xl font-bold mb-4 text-emerald-500 border-b pb-2">
                Tablero Kanban
            </h2>

            <TaskBoard projectMembers={project?.members || []}  projectId={projectId} />
            
            <AddMemberModal
                isOpen={isAddMemberModalOpen}
                onClose={() => setIsAddMemberModalOpen(false)}
                projectId={projectId}
                currentMembers={project.members}
                onMembersAdded={handleMembersAdded}
            />
        </div>
    );
};

export default ProjectDetailPage;