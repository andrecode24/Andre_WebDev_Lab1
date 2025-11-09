// src/routes/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  // Jika belum login, tendang ke login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika role tidak sesuai, tendang ke dashboard sesuai role sebenarnya
  if (allowedRole && role !== allowedRole) {
    if (role === "student") return <Navigate to="/student-dashboard" replace />;
    if (role === "instructor") return <Navigate to="/instructor-dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  // Kalau semua oke, tampilkan halamannya
  return children;
};

export default ProtectedRoute;
