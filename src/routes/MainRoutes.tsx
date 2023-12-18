import Loadable from "@components/Loadable.tsx";
import {lazy} from "react";
import {Protected} from "@/routes/AuthMiddleware.tsx";
import MainLayout from "@/layouts/MainLayout/MainLayout.tsx";
import {Navigate} from "react-router-dom";

const UserList = Loadable(lazy(()=> import("@/pages/users/UserList.tsx")));
const UserDetail = Loadable(lazy(()=> import("@/pages/users/UserDetail.tsx")))
const CreateQuestion = Loadable(lazy(()=> import("@/pages/question/CreateQuestion/CreateQuestion.tsx")))

const MainRoutes = {
    path: "/",
    element:
        <Protected >
            <MainLayout />
        </Protected>,
    children: [
        {
            path: "/users",
            element: <UserList />,
        },
        {
            path: "/users/:id",
            element: <UserDetail />,
        },
        {
            path: '/questions/create',
            element: <CreateQuestion />,
        },
        {
            path: "*",
            element: <Navigate to="/404" />,
        }
    ],
}

export default MainRoutes;