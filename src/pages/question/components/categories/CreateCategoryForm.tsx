import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";

interface CreateCategoryFormProps {
  open: boolean;
  onClose: () => void;
  onCreate: (category: { name: string; description: string }) => void;
}

const CreateCategoryForm: React.FC<CreateCategoryFormProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name) {
      alert("Please fill in the category name.");
      return;
    }
    onCreate({ name, description });
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Category</DialogTitle>
      <form onSubmit={handleCreate}>
        <DialogContent>
          <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
            Add Category: For adding a new category to the question bank.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description (Optional)"
            type="text"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary" variant="contained">
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateCategoryForm;
