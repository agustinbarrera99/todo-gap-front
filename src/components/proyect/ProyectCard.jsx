import { useNavigate } from "react-router-dom";

const ProyectCard = ({ project }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/projects/${project.id}`);
    };

    return (
        <div 
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={handleCardClick}
        >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h3>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="text-sm text-gray-500">
                <p><strong>Estado:</strong> {project.status}</p>
                <p><strong>Autor:</strong> {project.author}</p>
                <p><strong>Fecha:</strong> {project.createdAt}</p>
            </div>
        </div>
    );
};

export default ProyectCard;