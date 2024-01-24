import React, { useState } from "react";
import {
  IconButton,
  Grid,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ActionTableProps } from "@components/PaginationTable/GenericTable.tsx";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationDialog from "@components/Dialog/DeleteConfirmationDialog.tsx";

const AssessmentAction: React.FC<ActionTableProps> = (
  props: ActionTableProps,
) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleEditClick = () => {
    navigate(`/tests/${props.row.id}/edit`);
    handleCloseMenu();
  };

  const handleViewResultsClick = () => {
    navigate(`/tests/${props.row.id}/results`, {
      state: { name: props.row.name },
    });
    handleCloseMenu();
  };

  const handleDeleteClick = () => {
    setConfirmOpen(true);
    handleCloseMenu();
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

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {isMobile ? (
        <>
          <IconButton onClick={handleOpenMenu}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
            <MenuItem onClick={handleViewResultsClick}>
              <AssessmentIcon /> View Results
            </MenuItem>
            <MenuItem onClick={handleEditClick}>
              <EditIcon /> Edit
            </MenuItem>
            <MenuItem onClick={handleDeleteClick}>
              <DeleteIcon /> Delete
            </MenuItem>
          </Menu>
        </>
      ) : (
        <Grid
          container
          spacing={0}
          wrap={"nowrap"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Grid item>
            <IconButton onClick={handleViewResultsClick}>
              <AssessmentIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton onClick={handleEditClick}>
              <EditIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton onClick={handleDeleteClick}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      )}
      <DeleteConfirmationDialog
        open={confirmOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default AssessmentAction;
