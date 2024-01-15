import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import {FC} from "react";


export interface ConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}


const ConfirmationDialog: FC<ConfirmationDialogProps> = ({ open, onClose, onConfirm, message }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="primary" autoFocus variant={"contained"}>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};


export default ConfirmationDialog;