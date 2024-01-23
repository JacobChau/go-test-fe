import { IconButton, Grid } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState } from "react";
import { ActionTableProps } from "@components/PaginationTable/GenericTable.tsx";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationDialog from "@components/Dialog/DeleteConfirmationDialog.tsx";

const AssessmentAction: React.FC<ActionTableProps> = (
  props: ActionTableProps,
) => {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleEditClick = async () => {
    navigate(`/tests/${props.row.id}/edit`);
  };

  const handleDeleteClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      console.log("Deleting test:", props.row.id);
      if (props.onDeleted) {
        props.onDeleted(props.row.id);
      }
    } catch (error) {
      console.error("Failed to delete test:", error);
    }
    setConfirmOpen(false);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
  };

  return (
    <>
      <Grid
        container
        spacing={0}
        wrap={"nowrap"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Grid item xs>
          <IconButton
            id="test-actions-button"
            aria-controls="test-actions-menu"
            aria-haspopup="true"
            aria-expanded="true"
            onClick={() =>
              navigate(`/tests/${props.row.id}/results`, {
                state: { name: props.row.name },
              })
            }
          >
            <AssessmentIcon />
          </IconButton>
        </Grid>
        <Grid item xs>
          <IconButton
            id="test-actions-button"
            aria-controls="test-actions-menu"
            aria-haspopup="true"
            aria-expanded="true"
            onClick={handleEditClick}
          >
            <EditIcon />
          </IconButton>
        </Grid>
        <Grid item xs>
          <IconButton
            id="test-actions-button"
            aria-controls="test-actions-menu"
            aria-haspopup="true"
            aria-expanded="true"
            onClick={handleDeleteClick}
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
      <DeleteConfirmationDialog
        open={confirmOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default AssessmentAction;
