import React from "react";
import TaskItem from "./TaskItem.jsx";

// El componente TaskColumn ahora recibe onDropTask
const TaskColumn = ({ title, tasks, onTaskActionCompleted, onDropTask }) => { 
    // Lógica de colores (puede ir antes o dentro del componente, está bien aquí)
    let borderColor = "border-gray-300";
    let titleColor = "text-gray-700";

    if (title === "PENDIENTE") {
        borderColor = "border-blue-500";
        titleColor = "text-blue-700";
    } else if (title === "EN PROGRESO") {
        borderColor = "border-yellow-500";
        titleColor = "text-yellow-700";
    } else if (title === "A VERIFICAR") {
        borderColor = "border-purple-500";
        titleColor = "text-purple-700";
    } else if (title === "COMPLETADA") {
        borderColor = "border-green-500";
        titleColor = "text-green-700";
    }

    // Manejador: Permite soltar elementos sobre la columna
    const handleDragOver = (e) => {
        e.preventDefault(); // Es esencial para permitir el drop
    };

    // Manejador: Se ejecuta cuando una tarea se suelta
    const handleDrop = (e) => {
        e.preventDefault();

        // Obtiene el ID de la tarea que se guardó en TaskItem.jsx
        const taskId = e.dataTransfer.getData("taskId");

        if (taskId) {
            // Llama a la función en TaskBoard para actualizar el estado
            // Pasamos el título de la columna como el nuevo estado
            onDropTask(taskId, title);
        }
    };

    return (
        <div
            className={`flex-shrink-0 w-80 bg-white rounded-lg shadow-md p-4 border-t-4 ${borderColor}`}
            onDragOver={handleDragOver} // Habilita la columna como drop zone
            onDrop={handleDrop}         // Maneja la tarea soltada
        >
            <h4 className={`text-lg font-bold mb-4 ${titleColor} uppercase`}>
                {title} ({tasks.length})
            </h4>
            <div className="space-y-4 h-full min-h-[100px]">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <TaskItem
                            key={task._id || task.id}
                            task={task}
                            // onTaskDeleted y onTaskActionCompleted son la misma función (fetchTasks)
                            onTaskDeleted={onTaskActionCompleted} 
                        />
                    ))
                ) : (
                    <div className="text-center p-6 text-gray-400 bg-gray-50 rounded-md">
                        No hay tareas en este estado.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskColumn;