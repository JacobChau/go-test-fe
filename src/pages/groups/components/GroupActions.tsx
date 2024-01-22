import { useNavigate } from "react-router-dom";
import { IconButton, Grid } from "@mui/material";
import React, { useState } from "react";
import { ActionTableProps } from "@components/PaginationTable/GenericTable.tsx";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PeopleIcon from "@mui/icons-material/People";
import DeleteConfirmationDialog from "@components/Dialog/DeleteConfirmationDialog.tsx";
import { EditGroupDialog } from "@/pages/groups/components/index.ts";
import { GroupAttributes } from "@/types/apis/groupTypes.ts";

const GroupActions: React.FC<ActionTableProps> = (props: ActionTableProps) => {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleEditClick = async () => {
    setEditOpen(true);
  };

  const handleDeleteClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (props.onDeleted) {
      props.onDeleted(props.row.id);
    }
    setConfirmOpen(false);
  };

  const handleUpdated = async (_id: string, updatedGroup: GroupAttributes) => {
    if (props.onUpdated) {
      props.onUpdated(_id, updatedGroup);
    }
    setEditOpen(false);
  };

  return (
    <>
      <Grid container>
        <Grid item xs={4}>
          <IconButton
            onClick={() => navigate(`/groups/${props.row.id}/members`)}
            aria-label="info"
          >
            <PeopleIcon />
          </IconButton>
        </Grid>
        <Grid item xs={4}>
          <IconButton onClick={handleEditClick} aria-label="edit">
            <EditIcon />
          </IconButton>
        </Grid>
        <Grid item xs={4}>
          <IconButton onClick={handleDeleteClick} aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
      <EditGroupDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        groupData={props.row}
        onUpdated={handleUpdated}
      />
      <DeleteConfirmationDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default GroupActions;
