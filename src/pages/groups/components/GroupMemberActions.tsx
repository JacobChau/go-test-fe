import { IconButton, Grid } from "@mui/material";
import React, { useState } from "react";
import { ActionTableProps } from "@components/PaginationTable/GenericTable.tsx";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationDialog from "@components/Dialog/ConfirmationDialog.tsx";

const GroupMemberActions: React.FC<ActionTableProps> = (
  props: ActionTableProps,
) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleRemoveClick = async () => {
    setConfirmOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (props.onDeleted) {
      props.onDeleted(props.row.id);
    }
    setConfirmOpen(false);
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <IconButton onClick={handleRemoveClick} aria-label="remove">
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
      <ConfirmationDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmRemove}
        message="Are you sure you want to remove this member?"
      />
    </>
  );
};

export default GroupMemberActions;
