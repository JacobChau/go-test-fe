import {lazy} from "react";
import Loadable from "@components/Loadable.tsx";
import {Protected} from "@/routes/AuthMiddleware.tsx";
import MainLayout from "@/layouts/MainLayout/MainLayout.tsx";
import ErrorNotFound from "@/pages/errors/ErrorNotFound";

const UserList = Loadable(lazy(()=> import("@/pages/users/UserList.tsx")));
const UserDetail = Loadable(lazy(()=> import("@/pages/users/UserDetail.tsx")))
const CreateOrUpdateQuestion = Loadable(lazy(()=> import("@/pages/question/CreateOrUpdateQuestion.tsx")))
const QuestionBank = Loadable(lazy(()=> import("@/pages/question/QuestionBank.tsx")))
// const GroupList = Loadable(lazy(()=> import("@/pages/groups/GroupList.tsx")))
// const CreateTest = Loadable(lazy(()=> import("@/pages/assessments/CreateTest.tsx")))
const QuestionDetail = Loadable(lazy(()=> import("@/pages/question/QuestionDetail.tsx")))
const Dashboard = Loadable(lazy(()=> import("@/pages/assessments/AssessmentPagination.tsx")))
const TakeAssessment = Loadable(lazy(()=> import("@/pages/assessments/TakeAssessment.tsx")))

const MainRoutes = {
    path: "/",
    element:
        <Protected >
            <MainLayout />
        </Protected>,
    children: [
        {
            path: "/dashboard",
            element: <Dashboard />,
        },
        {
            path: "/users",
            element: <UserList />,
        },
        {
            path: "/users/:id",
            element: <UserDetail />,
        },
        // {
        //     path: "/groups",
        //     element: <GroupList />,
        // },
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
            path: '/questions',
            element: <QuestionBank />,
        },
        // {
        //     path: '/assessments/create',
        //     element: <CreateTest />,
        // },
        {
            path: '/assessments/:id/take',
            element: <TakeAssessment />,
        },
        {
            path: "*",
            element: <ErrorNotFound />,
        }
    ],
}

export default MainRoutes;