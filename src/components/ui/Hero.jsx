import Button from "./Buton.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const Hero = () => {
    const { isAuthenticated } = useAuth();

    return (
        <section className="bg-gradient-to-t from-gray-900 to-emerald-500 flex items-center justify-start py-40 px-10">
            <div className="max-w-xl mx-auto md:mx-0 text-left">
                <h1 className="text-5xl font-extrabold text-white mb-4">
                    Bienvenido a ToDoGap
                </h1>
                <p className="mt-10 text-lg text-gray-200 mb-8">
                    Organiza tu vida y aumenta tu productividad. Gestiona tus proyectos y tareas de manera eficiente y sencilla, manteniéndote siempre al tanto.
                </p>
                {isAuthenticated ? (
                    <div className="mt-5 space-x-5">
                        <Link to="/my-projects">
                            <Button text="Mis proyectos" bgColor="bg-emerald-600" bgColorHover="hover:bg-emerald-700"/>
                        </Link>
                        <Link to="/create-project">
                            <Button text="Crear proyecto" bgColor="bg-emerald-600" bgColorHover="hover:bg-emerald-700"/>
                        </Link>
                    </div>
                ) : (
                    <div className="mt-5 space-x-5">
                        <Link to="/register">
                            <Button bgColor="bg-emerald-600" bgColorHover="hover:bg-emerald-700" text="Regístrate ahora" />
                        </Link>
                        <Link to="/login">
                            <Button bgColor="bg-emerald-600" bgColorHover="hover:bg-emerald-700" text="Iniciar sesión" />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Hero;
