import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Sửa lại cách import

const ExpertRoute = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");

  let isExpert = false;
  if (accessToken) {
    try {
      const decodedToken = jwtDecode(accessToken); // Sử dụng jwtDecode trực tiếp
      console.log(decodedToken);
      isExpert = decodedToken.role === "expert";
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  if (!isExpert) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ExpertRoute;
