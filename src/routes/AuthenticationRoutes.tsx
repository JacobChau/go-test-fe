import { lazy } from 'react';
import { Verify} from "@/pages/auth";
import Loadable from "@components/Loadable.tsx";
import {Public} from "@/routes/AuthMiddleware.tsx";
import MinimalLayout from "@/layouts/MinimalLayout.tsx";

const AuthLogin = Loadable(lazy(()=> import("@/pages/auth/Login.tsx")));
const AuthRegister = Loadable(lazy(()=> import("@/pages/auth/Register.tsx")));
const AuthForgotPassword = Loadable(lazy(()=> import("@/pages/auth/ForgotPassword.tsx")));


const AuthenticationRoutes = {
    path: "/",
    element: <MinimalLayout />,
    children: [
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
        }
    ],
};

export default AuthenticationRoutes;