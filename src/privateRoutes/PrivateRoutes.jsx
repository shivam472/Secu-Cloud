import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import { LoginContext } from "../contexts/LoginContext";

const PrivateRoutes = () => {
  const { isAuthenticated } = useContext(LoginContext);

  return isAuthenticated ? (
    <>
      <Navbar />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoutes;
