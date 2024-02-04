import { lazy } from "react";
import Loadable from "@components/Loadable.tsx";
import { Protected } from "@/routes/AuthMiddleware.tsx";
import MainLayout from "@/layouts/MainLayout/MainLayout.tsx";
import ErrorNotFound from "@/pages/errors/ErrorNotFound";

const UserList = Loadable(lazy(() => import("@/pages/users/UserList.tsx")));
const UserDetail = Loadable(lazy(() => import("@/pages/users/UserDetail.tsx")));
const CreateOrUpdateQuestion = Loadable(
  lazy(() => import("@/pages/question/CreateOrUpdateQuestionPage.tsx")),
);
const QuestionBank = Loadable(
  lazy(() => import("@/pages/question/QuestionBank.tsx")),
);
const GroupList = Loadable(lazy(() => import("@/pages/groups/GroupList.tsx")));
const QuestionDetail = Loadable(
  lazy(() => import("@/pages/question/QuestionDetail.tsx")),
);
const Dashboard = Loadable(
  lazy(() => import("@/pages/assessments/AssessmentPagination.tsx")),
);
const TakeAssessment = Loadable(
  lazy(() => import("@/pages/assessments/TakeAssessment.tsx")),
);
const AssessmentResult = Loadable(
  lazy(() => import("@/pages/assessments/AssessmentResult.tsx")),
);

const CreateOrUpdateTest = Loadable(
  lazy(() => import("@/pages/assessments/CreateOrUpdateAssessment.tsx")),
);
const AssessmentManagement = Loadable(
  lazy(() => import("@/pages/assessments/AssessmentManagement.tsx")),
);

const AssessmentResultListPage = Loadable(
  lazy(() => import("@/pages/assessments/AssessmentResultPagination.tsx")),
);

const GroupMemberList = Loadable(
  lazy(() => import("@/pages/groups/GroupMemberList.tsx")),
);

const VideoTest = Loadable(
  lazy(() => import("@/pages/video/VideoComponent.tsx")),
);

const MainRoutes = {
  path: "/",
  element: (
    // <Protected>
    <MainLayout />
    // </Protected>
  ),
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
    {
      path: "/groups",
      element: <GroupList />,
    },
    {
      path: "/groups/:id/members",
      element: <GroupMemberList />,
    },
    {
      path: "/questions/create",
      element: <CreateOrUpdateQuestion />,
    },
    {
      path: "/questions/:id",
      element: <QuestionDetail />,
    },
    {
      path: "/questions/:id/edit",
      element: <CreateOrUpdateQuestion />,
    },
    {
      path: "/questions",
      element: <QuestionBank />,
    },
    {
      path: "/tests/create",
      element: <CreateOrUpdateTest />,
    },
    {
      path: "/tests/:id/edit",
      element: <CreateOrUpdateTest />,
    },
    {
      path: "/tests/management",
      element: <AssessmentManagement />,
    },
    {
      path: "/tests/results",
      element: <AssessmentResultListPage />,
    },
    {
      path: "/tests/:id/take",
      element: <TakeAssessment />,
    },
    {
      path: "/tests/:id/results/:attemptId",
      element: <AssessmentResult />,
    },
    {
      path: "/tests/:id/results",
      element: <AssessmentResultListPage />,
    },
    {
      path: "/video",
      element: <VideoTest />,
    },

    {
      path: "*",
      element: <ErrorNotFound />,
    },
  ],
};

export default MainRoutes;
