import "./App.css";
import Header from "./components/Header.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CreateProject from "./pages/createProyect.jsx";
import ProyectList from "./components/proyect/ProyectList.jsx";
import ProjectDetailPage from "./components/proyect/ProyectDetailPage.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/my-projects" element={<ProyectList />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
