import "./App.css";
import Header from "./components/ui/Header.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CreateProject from "./pages/createProyect.jsx";
import ProyectList from "./components/proyect/ProyectList.jsx";
import ProjectDetailPage from "./components/proyect/ProyectDetailPage.jsx";
import Footer from "./components/ui/Footer.jsx";
import Verification from "./pages/Verification.jsx";
import ForgotPassword from "./pages/forgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify" element={<Verification />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create-project" element={<CreateProject />} />
              <Route path="/my-projects" element={<ProyectList />} />
              <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
              <Route path="forgot-password" element= {<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
