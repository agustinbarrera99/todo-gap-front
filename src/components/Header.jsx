import Buton from "./Buton.jsx";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import IconContainer from "./IconContainer.jsx";
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
        <header className="w-full p-4 bg-blue-800 text-white flex justify-between items-center">
            <div className="flex-none w-10">
                {showBackButton && (
                    <button onClick={() => navigate(-1)} aria-label="Volver">
                        <IconContainer 
                            icon={<IoMdArrowBack />} 
                            className="text-white text-xl" 
                        />
                    </button>
                )}
            </div>
            <div className="flex-grow text-center">
                <Link to="/" className="text-2xl font-bold">
                    Todo gap
                </Link>
            </div>
            
            <div className="flex-none flex justify-end items-center">
                {isAuthenticated && (
                    <Buton text="Cerrar Sesión" onClick={handleLogoutClick} />
                )}
            </div>
        </header>
    );
};

export default Header;