import { lazy } from 'react';
import { Verify} from "@/pages/auth";
import Loadable from "@components/Loadable.tsx";
import {Public} from "@/routes/AuthMiddleware.tsx";
import MinimalLayout from "@/layouts/MinimalLayout.tsx";
import {Navigate} from "react-router-dom";

const AuthLogin = Loadable(lazy(()=> import("@/pages/auth/Login.tsx")));
const AuthRegister = Loadable(lazy(()=> import("@/pages/auth/Register.tsx")));
const AuthForgotPassword = Loadable(lazy(()=> import("@/pages/auth/ForgotPassword.tsx")));
const ErrorNotFound = Loadable(lazy(()=> import("@/pages/errors/ErrorNotFound.tsx")))


const AuthenticationRoutes = {
    path: "/",
    element: <MinimalLayout />,
    children: [
        {
            path: "/404",
            element: <ErrorNotFound />,
        },
        {
            path: "/login",
            element: <Public><AuthLogin /></Public>,
        },
        {
            path: "/register",
            element: <Public><AuthRegister /></Public>,
        },
        {
            path: "/verify",
            element: <Verify />,
        },
        {
            path: "/forgot-password",
            element: <AuthForgotPassword />,
        },
        {
            path: "*",
            element: <Navigate to="/404" />,
        }
    ],
};

export default AuthenticationRoutes;