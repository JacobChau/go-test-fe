import { IconButton, Grid } from "@mui/material";
import React, { useState } from "react";
import { ActionTableProps } from "@components/PaginationTable/GenericTable.tsx";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DeleteConfirmationDialog from "@components/Dialog/DeleteConfirmationDialog.tsx";

const QuestionAction: React.FC<ActionTableProps> = (
  props: ActionTableProps,
) => {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleEditClick = async () => {
    navigate(`/questions/${props.row.id}/edit`);
  };

  const handleDeleteClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (props.onDeleted) {
        props.onDeleted(props.row.id);
      }
    } catch (error) {
      console.error("Failed to delete question:", error);
    }
    setConfirmOpen(false);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
  };

  return (
    <>
      <Grid container>
        <Grid item xs={6}>
          <IconButton
            size={"medium"}
            id="question-actions-button"
            onClick={handleEditClick}
            aria-label="edit"
            aria-controls="question-actions-menu"
            aria-haspopup="true"
          >
            <EditIcon />
          </IconButton>
        </Grid>
        <Grid item xs={6}>
          <IconButton
            size={"medium"}
            aria-label="delete"
            aria-controls="question-actions-menu"
            aria-haspopup="true"
            id="question-actions-button"
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

export default QuestionAction;
