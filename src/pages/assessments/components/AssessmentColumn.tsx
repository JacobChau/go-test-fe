import { TableColumn } from "@components/PaginationTable/GenericTable.tsx";
import { Avatar, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { AssessmentAttributes } from "@/types/apis/assessmentTypes.ts";

const AssessmentColumn: TableColumn[] = [
  {
    label: "ID",
    key: "id",
    type: "text",
    canEdit: false,
    canSearch: false,
    sx: { width: "1" },
  },
  {
    label: "Name",
    key: "name",
    type: "text",
    canEdit: false,
    canSearch: true,
    sx: { width: "35%", minWidth: 200 },
  },
  {
    label: "Description",
    key: "description",
    type: "text",
    canEdit: false,
    canSearch: true,
    sx: { width: "35%", minWidth: 150 },
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
    label: "Total Marks",
    key: "totalMarks",
    type: "number",
    canEdit: false,
    canSearch: false,
    sx: { width: "10%", minWidth: 120, textAlign: "center" },
  },
  {
    label: "Pass Marks",
    key: "passMarks",
    type: "number",
    canEdit: false,
    canSearch: false,
    sx: { width: "10%", minWidth: 120, textAlign: "center" },
  },
  {
    label: "Subject",
    key: "subject",
    type: "text",
    canEdit: false,
    canSearch: false,
    sx: { width: "10%", minWidth: 75, textAlign: "center" },
    render: (row: AssessmentAttributes) => (
      <Typography variant="body2">{row.subject.attributes.name}</Typography>
    ),
  },
  {
    label: "Duration",
    key: "duration",
    type: "number",
    canEdit: false,
    canSearch: false,
    sx: { width: "10%", minWidth: 75, textAlign: "center" },
  },
  {
    label: "Attempts",
    key: "maxAttempts",
    type: "number",
    canEdit: false,
    canSearch: false,
    sx: { width: "10%", minWidth: 75, textAlign: "center" },
  },
  {
    label: "Start Date",
    key: "validFrom",
    type: "date",
    canEdit: false,
    canSearch: false,
    sx: { width: "15%", minWidth: 150, textAlign: "center" },
    render: (row) => (
      <Typography variant="body2">
        {dayjs(row.validFrom).format("DD/MM/YYYY HH:mm")}
      </Typography>
    ),
  },
  {
    label: "End Date",
    key: "validTo",
    type: "date",
    canEdit: false,
    canSearch: false,
    sx: { width: "15%", minWidth: 150, textAlign: "center" },
    render: (row) => (
      <Typography variant="body2">
        {dayjs(row.validTo).format("DD/MM/YYYY HH:mm")}
      </Typography>
    ),
  },
  {
    label: "Published",
    key: "isPublished",
    type: "boolean",
    canEdit: false,
    canSearch: false,
    sx: { width: "10%" },
    render: (row) => (
      <Stack direction="row" alignItems="center" justifyContent="center">
        <Avatar
          sx={{
            width: 24,
            height: 24,
            fontSize: 12,
            backgroundColor: row.isPublished ? "success.main" : "error.main",
          }}
        >
          {row.isPublished ? "Yes" : "No"}
        </Avatar>
      </Stack>
    ),
  },
];

export default AssessmentColumn;
