import Buton from "./Buton.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import AccordionDropdown from "./AcordionDropdown.jsx";

const Header = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

    const handleLoginClick = () => {
        navigate("/login");
    };

    const handleRegisterClick = () => {
        navigate("/register");
    };

    const handleLogoutClick = () => {
        logout();
        navigate("/login");
    };

    const dropdownOptions = [
        { value: "myProjects", label: "Mis proyectos" },
        { value: "createProyect", label: "Crear proyecto" },
    ];

    const handleDropdownSelect = (option) => {
        console.log("Opción seleccionada:", option);

        if (option.value === "createProyect") {
            navigate("/create-project");
        }
        if (option.value === "myProjects") {
            navigate("/my-projects");
        }
    };
    
    // El 'return' del componente Header debe estar aquí, fuera de cualquier otra función
    return (
        <header className="w-full p-4 bg-orange-500 text-white flex justify-between items-center">
            <h1 className="text-2xl font-bold">Todo gap</h1>
            <div className="flex space-x-2">
                {isAuthenticated ? (
                    <>
                        <Buton text="Logout" onClick={handleLogoutClick} />
                        <AccordionDropdown
                            options={dropdownOptions}
                            onSelect={handleDropdownSelect}
                        />
                    </>
                ) : (
                    <>
                        <Buton text="Login" onClick={handleLoginClick} />
                        <Buton text="Register" onClick={handleRegisterClick} />
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;