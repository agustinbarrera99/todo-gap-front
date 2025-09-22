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
      setUserId(getUserIdFromToken(authToken));
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setUserId(null); 
    }
  }, [authToken]);
  const login = (token) => {
    setAuthToken(token);
  };

  const logout = () => {

    setAuthToken(null);

  };

  const isAuthenticated = !!authToken;

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
