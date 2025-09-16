const Home = () => {
    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Welcome to Todo Gap</h2>
            <p className="mb-4">Manage your tasks efficiently and stay organized.</p>
            <div className="bg-white shadow-md rounded p-4">
                <h3 className="text-xl font-semibold mb-2">Features:</h3>
                <ul className="list-disc list-inside">
                    <li>Create, edit, and delete tasks</li>
                    <li>Mark tasks as completed</li>
                    <li>Organize tasks by categories</li>
                    <li>Set due dates and reminders</li>
                    <li>Responsive design for all devices</li>
                </ul>
            </div>
        </div>
    );
}

export default Home;