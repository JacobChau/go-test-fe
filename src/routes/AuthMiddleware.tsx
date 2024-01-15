import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "@/helpers";
import UserService from "@/api/services/userService.ts";
import { rolePermissions } from "@/constants";
import { Resource, UserAttributes } from "@/types/apis";

interface ProtectedProps {
  children: React.ReactNode;
}

const Protected: React.FC<ProtectedProps> = ({ children }) => {
  // const [user, setUser] = useState<Resource<UserAttributes> | null>(null);
  const isLoggedIn = isAuthenticated();

  // useEffect(() => {
  //   if (isLoggedIn) {
  //     UserService.getCurrentUser().then((res) => {
  //       setUser(res.data);
  //     });
  //   }
  // }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};

const Public = ({ children }) => {
  const isLoggedIn = isAuthenticated();

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return children;
};

export { Protected, Public };
