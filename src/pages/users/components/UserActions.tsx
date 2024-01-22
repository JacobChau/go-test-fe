import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import React, { useState } from "react";
import { ActionTableProps } from "@components/PaginationTable/GenericTable.tsx";

const UserActions: React.FC<ActionTableProps> = (props: ActionTableProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = async () => {
    props.handleEdit(props.rowIndex);
    handleClose();
  };

  const handleDeleteClick = () => {
    setConfirmOpen(true);
    handleClose();
  };

  const handleConfirmDelete = async () => {
    try {
      console.log("Deleting user:", props.row.id);
      props.onDeleted && props.onDeleted(props.row.id);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
    setConfirmOpen(false);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
  };

  return (
    <>
      <IconButton
        id="user-actions-button"
        aria-controls={open ? "user-actions-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <IconDotsVertical width={18} />
      </IconButton>
      <Menu
        id="user-actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "user-actions-button",
        }}
      >
        <MenuItem onClick={handleEditClick}>
          <ListItemIcon>
            <IconEdit width={18} />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <ListItemIcon>
            <IconTrash width={18} />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
      <Dialog
        open={confirmOpen}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserActions;
