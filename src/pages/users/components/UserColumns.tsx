import { TableColumn } from "@components/PaginationTable/GenericTable.tsx";
import { Avatar, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";

export const UserColumns: TableColumn[] = [
  {
    label: "ID",
    key: "id",
    type: "text",
    canEdit: false,
    sx: { width: "5%" },
    canSearch: false,
  },
  {
    label: "User",
    key: "user",
    type: "user",
    sx: { width: "25%" },
    render: (row) => (
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          src={row.avatar}
          alt={row.name}
          sx={{ width: 30, height: 30 }}
        />
        <Typography variant="subtitle2" fontWeight="600">
          {row.name}
        </Typography>
      </Stack>
    ),
    canEdit: true,
    canSearch: true,
  },
  {
    label: "Email",
    key: "email",
    type: "email",
    canEdit: false,
    canSearch: true,
    sx: { width: "20%" },
  },
  {
    label: "Role",
    key: "role",
    type: "enum",
    enumValues: ["Student", "Teacher"],
    canEdit: true,
    canSearch: true,
    sx: { width: "15%" },
  },
  {
    label: "Verified At",
    key: "emailVerifiedAt",
    type: "date",
    canEdit: false,
    render: (row) =>
      row.emailVerifiedAt
        ? dayjs(row.emailVerifiedAt).format("DD-MM-YYYY")
        : "N/A",
    sx: { width: "15%" },
    canSearch: false,
  },
  {
    label: "Birthdate",
    key: "birthdate",
    type: "date",
    canEdit: true,
    render: (row) =>
      row.birthdate ? dayjs(row.birthdate).format("DD-MM-YYYY") : "N/A",
    sx: { width: "15%" },
    canSearch: false,
  },
];
