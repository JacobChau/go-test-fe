import {lazy} from "react";
import Loadable from "@components/Loadable.tsx";
import {Protected} from "@/routes/AuthMiddleware.tsx";
import MainLayout from "@/layouts/MainLayout/MainLayout.tsx";
import ErrorNotFound from "@/pages/errors/ErrorNotFound.tsx";

const UserList = Loadable(lazy(()=> import("@/pages/users/UserList.tsx")));
const UserDetail = Loadable(lazy(()=> import("@/pages/users/UserDetail.tsx")))
const CreateOrUpdateQuestion = Loadable(lazy(()=> import("@/pages/question/CreateOrUpdateQuestion.tsx")))
const CreateOrUpdateTest = Loadable(lazy(()=> import("@/pages/tests/CreateOrUpdateTest.tsx")))
const QuestionBank = Loadable(lazy(()=> import("@/pages/question/QuestionBank.tsx")))
const GroupList = Loadable(lazy(()=> import("@/pages/groups/GroupList.tsx")))
const TestList = Loadable(lazy(()=> import("@/pages/tests/TestList.tsx")))
const QuestionDetail = Loadable(lazy(()=> import("@/pages/question/QuestionDetail.tsx")))

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
            path: "/groups",
            element: <GroupList />,
        },
        {
            path: '/questions/create',
            element: <CreateOrUpdateQuestion />,
        },
        {
            path: '/questions/:id',
            element: <QuestionDetail />,
        },
        {
            path: '/questions/:id/edit',
            element: <CreateOrUpdateQuestion />,
        },
        {
            path: '/tests/create',
            element: <CreateOrUpdateTest />,
        },
        {
            path: '/tests/:id/edit',
            element: <CreateOrUpdateTest />,
        },
        {
            path: '/tests',
            element: <TestList />,
        },
        {
            path: '/questions',
            element: <QuestionBank />,
        },
        {
            path: "*",
            element: <ErrorNotFound />,
        }
    ],
}

export default MainRoutes;