import React from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Button} from "@mui/material";

export interface DeleteConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({ open, onClose, onConfirm }) => (
    <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this question?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary">
                Cancel
            </Button>
            <Button onClick={onConfirm} color="primary" autoFocus>
                Confirm
            </Button>
        </DialogActions>
    </Dialog>
);

export default DeleteConfirmationDialog;