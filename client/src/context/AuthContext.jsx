import React, { createContext, useState, useEffect } from "react";
// import { setupAxiosInterceptors } from "../helps/check"; // Import setupAxiosInterceptors

// Tạo Auth Context
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

    // Thiết lập Axios Interceptors
    // setupAxiosInterceptors(storedToken, setAccessToken);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, setUser, setAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
