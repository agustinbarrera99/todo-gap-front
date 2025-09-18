import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
const AuthContext = createContext();

const AUTH_TOKEN_KEY = "authToken";

const getUserIdFromToken = (token) => {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.id || decoded.userId || decoded._id || null;
  } catch (error) {
    console.error("token invalido o expirado");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => {
    return localStorage.getItem(AUTH_TOKEN_KEY) || null;
  });

  const [userId, setUserId] = useState(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    return getUserIdFromToken(token);
  });
  useEffect(() => {
    if (authToken) {
      localStorage.setItem(AUTH_TOKEN_KEY, authToken);
      // 👈 Obtiene el userId del token CADA VEZ que el token cambia
      setUserId(getUserIdFromToken(authToken));
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setUserId(null); // Limpia el userId
    }
  }, [authToken]);
  const login = (token) => {
    setAuthToken(token);
  };

  // Función para cerrar sesión
  const logout = () => {
    // Establece el token en null y el useEffect lo eliminará de localStorage
    setAuthToken(null);
    // navigate('/login'); // Opcional: Redirigir al login después del logout
  };

  const isAuthenticated = !!authToken; // Doble negación para convertir a booleano

  const value = {
    authToken,
    userId,
    isAuthenticated,
    login,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
