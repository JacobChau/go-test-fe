import { GroupAttributes } from "@/types/apis/groupTypes";
import { TableColumn } from "@components/PaginationTable/GenericTable.tsx";
import { Avatar, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";

export const GroupColumns: TableColumn[] = [
  {
    label: "ID",
    key: "id",
    type: "text",
    canEdit: false,
    canSearch: false,
    sx: { width: "5%" },
  },
  {
    label: "Name",
    key: "name",
    type: "text",
    canEdit: true,
    canSearch: true,
    sx: { width: "15%", minWidth: 180 },
  },
  {
    label: "Description",
    key: "description",
    type: "text",
    canEdit: true,
    canSearch: true,
    sx: { width: "45%" },
    render: (row) => (
      <Typography
        variant="body2"
        style={{
          wordWrap: "break-word",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 1,
          WebkitBoxOrient: "vertical",
        }}
      >
        {row.description}
      </Typography>
    ),
  },
  {
    label: "Owner",
    key: "owner",
    type: "user",
    canEdit: true,
    canSearch: false,
    sx: { width: "15%", minWidth: 150 },
    render: (row: GroupAttributes) => {
      if (row.createdBy) {
        return (
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={row.createdBy.avatar}
              alt={row.createdBy.name}
              sx={{ width: 30, height: 30 }}
            />
            <Typography variant="subtitle2" fontWeight="600">
              {row.createdBy.name}
            </Typography>
          </Stack>
        );
      }
      return null;
    },
  },
  {
    label: "Members",
    key: "members",
    type: "text",
    canEdit: false,
    canSearch: false,
    sx: { width: "10%", textAlign: "center" },
    render: (row: GroupAttributes) => row.memberCount,
  },
  {
    label: "Created At",
    key: "createdAt",
    type: "date",
    canSearch: false,
    canEdit: false,
    sx: { width: "10%", minWidth: 120 },
    render: (row: GroupAttributes) => dayjs(row.createdAt).format("DD-MM-YYYY"),
  },
];
