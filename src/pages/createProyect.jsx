import React, { useState } from 'react';
import Form from '../components/Form.jsx';

const CreateProject = () => {
    // Estados para los campos del formulario
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        // Lógica para enviar los datos del proyecto al backend
        console.log("Datos del proyecto a enviar:");
        console.log("Título:", title);
        console.log("Descripción:", description);
        
        // Aquí podrías agregar la llamada a una API, por ejemplo:
        // axios.post('/api/projects', { title, description });
        
        // Opcional: limpiar los campos después de enviar
        setTitle("");
        setDescription("");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-2xl font-bold mb-4">Crear Proyecto</h2>
            <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
                <Form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Título del proyecto"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="p-2 border border-gray-300 rounded"
                        required
                    />
                    <textarea
                        placeholder="Descripción del proyecto"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="p-2 border border-gray-300 rounded h-32 resize-none"
                        required
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                    >
                        Crear
                    </button>
                </Form>
            </div>
        </div>
    );
}

export default CreateProject;