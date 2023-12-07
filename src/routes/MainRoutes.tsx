import Loadable from "@components/Loadable.tsx";
import {lazy} from "react";
import {Protected} from "@/routes/AuthMiddleware.tsx";
import MainLayout from "@/layouts/MainLayout";

const UserList = Loadable(lazy(()=> import("@/pages/users/UserList.tsx")));
const UserDetail = Loadable(lazy(()=> import("@/pages/users/UserDetail.tsx")))


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
    ],
}

export default MainRoutes;