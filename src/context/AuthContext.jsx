import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userId, setUserId] = useState(null)

  const login = (token, id) => {
    setAuthToken(token);
    setUserId(id)
  };

  const logout = () => {
    setAuthToken(null);
    setUserId(null)
  };

  const value = {
    isAuthenticated: !!authToken,
    authToken,
    userId,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};