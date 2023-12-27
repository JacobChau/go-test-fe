import {IconButton, Grid} from '@mui/material';
import { IconEdit, IconTrash } from "@tabler/icons-react";
import React, {useState} from "react";
import {ActionTableProps} from "@components/PaginationTable/GenericTable.tsx";
import {useNavigate} from "react-router-dom";
import DeleteConfirmationDialog from "@components/Dialog/DeleteConfirmationDialog.tsx";


const QuestionAction: React.FC<ActionTableProps> = (props: ActionTableProps) => {
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
            console.log('Deleting question:', props.row.id);
            if (props.onDeleted) {
                props.onDeleted(props.row.id);
            }
        } catch (error) {
            console.error('Failed to delete question:', error);
        }
        setConfirmOpen(false);
    };

    const handleCancelDelete = () => {
        setConfirmOpen(false);
    };

    return (
        <>
            <Grid container>
                <Grid item xs>
                    <IconButton
                        id="question-actions-button"
                        aria-controls="question-actions-menu"
                        aria-haspopup="true"
                        aria-expanded="true"
                        onClick={handleEditClick}
                    >
                        <IconEdit width={18} />
                    </IconButton>
                </Grid>
                <Grid item xs>
                    <IconButton
                        id="question-actions-button"
                        aria-controls="question-actions-menu"
                        aria-haspopup="true"
                        aria-expanded="true"
                        onClick={handleDeleteClick}
                    >
                        <IconTrash width={18} />
                    </IconButton>
                </Grid>
            </Grid>
            <DeleteConfirmationDialog open={confirmOpen} onClose={handleCancelDelete} onConfirm={handleConfirmDelete} />
        </>
    );
};

export default QuestionAction;