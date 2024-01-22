export type UserRole = "Admin" | "Teacher" | "Student";

interface RolePermissions {
  canAccess: string[];
  canEdit: boolean | string[];
}

const rolePermissions: Record<UserRole, RolePermissions> = {
  Admin: {
    canAccess: [
      "dashboard",
      "create-test",
      "test-management",
      "create-question",
      "question-list",
      "test-result",
      "user-management",
      "group-management",
      "create-group",
    ],
    canEdit: true,
  },
  Teacher: {
    canAccess: [
      "dashboard",
      "create-test",
      "test-management",
      "create-question",
      "question-list",
      "test-result",
      "group-management",
    ],
    canEdit: ["groups", "questions", "tests"],
  },
  Student: {
    canAccess: ["dashboard", "test-result", "tests"],
    canEdit: false,
  },
};

export default rolePermissions;
