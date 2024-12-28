import React, { createContext, useState, useEffect } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("accessToken");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setAccessToken(storedToken);
      } catch (error) {
        console.error("Error parsing stored user data", error);
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, setUser, setAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
