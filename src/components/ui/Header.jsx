import Button from "./Buton.jsx";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import IconContainer from "../IconContainer.jsx";
import { IoMdArrowBack } from "react-icons/io";

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const showBackButton = isAuthenticated && location.pathname !== "/";

  const handleLogoutClick = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="text-gray-600 body-font bg-gray-800 shadow-md">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <div className="flex-grow flex items-center justify-start">
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              aria-label="Volver"
              className="mr-5"
            >
              <IconContainer
                icon={<IoMdArrowBack />}
                className="text-emerald-500 text-2xl hover:text-emerald-400 transition duration-300"
              />
            </button>
          )}

<Link
  to="/"
  className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-10 h-10 text-emerald-500 p-2 bg-gray-800 rounded-full"
  >
    <rect x="3" y="4" width="4" height="16" rx="1"></rect>
    <rect x="10" y="4" width="4" height="10" rx="1"></rect>
    <rect x="17" y="4" width="4" height="6" rx="1"></rect>
  </svg>
  <span className="ml-3 text-xl text-emerald-500">ToDoGap</span>
</Link>
        </div>

        {/* Contenedor del botón "Cerrar Sesión" */}
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          {isAuthenticated && (
            <Button
              textColor={"text-emerald-500"}
              onClick={handleLogoutClick}
              text="Cerrar cesion"
            >
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
