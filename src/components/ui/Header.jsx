import Button from "./Buton.jsx";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import IconContainer from "../IconContainer.jsx";
import { IoMdArrowBack } from "react-icons/io";

const Header = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const showBackButton = isAuthenticated && location.pathname !== '/';

    const handleLogoutClick = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="w-full p-4 bg-emerald-500 flex justify-between items-center text-black">
            <div className="w-1/4 flex justify-start items-center">
                {showBackButton && (
                    <button onClick={() => navigate(-1)} aria-label="Volver">
                        <IconContainer 
                            icon={<IoMdArrowBack />} 
                            className="text-black text-2xl hover:text-gray-300 transition duration-300" 
                        />
                    </button>
                )}
            </div>
            
            <div className="flex-grow text-center">
                <Link to="/" className="text-2xl font-bold text-black tracking-wider">
                    Todo gap
                </Link>
            </div>
            
            <div className="w-1/4 flex justify-end items-center">
                {isAuthenticated && (
                    <button 
                        onClick={handleLogoutClick}
                        className="text-sm font-medium text-black hover:text-emerald-950 transition duration-300"
                    >
                        Cerrar Sesión
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;