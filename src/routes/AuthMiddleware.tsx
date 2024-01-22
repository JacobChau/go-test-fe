import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "@/helpers";

interface ProtectedProps {
  children: React.ReactNode;
}

const Protected: React.FC<ProtectedProps> = ({ children }) => {
  const isLoggedIn = isAuthenticated();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};

const Public: React.FC<ProtectedProps> = ({ children }) => {
  const isLoggedIn = isAuthenticated();

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return children;
};

export { Protected, Public };
