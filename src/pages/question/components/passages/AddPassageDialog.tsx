import React, { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
  IconButton,
  ListItem,
  List,
  ListItemText,
  DialogActions,
  Typography,
  Box,
} from "@mui/material";
import { PassageAttributes, PassagesPayload, Resource } from "@/types/apis";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import PassageService from "@/api/services/passageService.ts";
import QuillEditor from "@components/Form/QuillEditor/QuillEditor.tsx";
import { useTheme } from "@mui/material/styles";

interface AddPassageDialogProps {
  open: boolean;
  onClose: () => void;
  passages: Resource<PassagesPayload>[];
  onPassagesUpdated: () => Promise<void>;
  onSelectedPassage: (passageId: string) => void;
}

const AddPassageDialog: React.FC<AddPassageDialogProps> = ({
  passages,
  open,
  onClose,
  onPassagesUpdated,
  onSelectedPassage,
}) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const [passageData, setPassageData] = useState<PassageAttributes>({
    title: "",
    content: "",
  });
  const [editingPassageId, setEditingPassageId] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassageData({ ...passageData, title: event.target.value });
  };

  const handleListItemClick = (passageId: string) => {
    console.log("Selected passage:", passageId);
    onSelectedPassage(passageId);
    onClose();
  };

  const handleFormSubmit = useCallback(async () => {
    if (!passageData.title) {
      alert("Please fill in the passage name.");
      return;
    }
    if (!passageData.content) {
      alert("Please fill in the passage content.");
      return;
    }
    try {
      setIsLoading(true);
      if (editingPassageId) {
        await PassageService.updatePassage(editingPassageId, {
          title: passageData.title,
          content: passageData.content,
        });
      } else {
        await PassageService.createPassage({
          title: passageData.title,
          content: passageData.content,
        });
      }
    } catch (error) {
      console.error("Error creating passage:", error);
    } finally {
      setIsLoading(false);
      clearForm();
      await onPassagesUpdated();
    }
  }, [passageData, editingPassageId]);

  const handleEdit = useCallback(async (passageId: string) => {
    setIsLoading(true);
    try {
      setEditingPassageId(passageId);
      const { data } = await PassageService.getPassageById(passageId);
      setPassageData({
        title: data.attributes.title,
        content: data.attributes.content,
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching passage:", error);
      setIsLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async (passageId: string) => {
    setIsLoading(true);
    try {
      await PassageService.deletePassage(passageId);
      await onPassagesUpdated();
      setIsLoading(false);
    } catch (error) {
      console.error("Error deleting passage:", error);
      setIsLoading(false);
    }
  }, []);

  const clearForm = () => {
    setPassageData({ title: "", content: "" });
    setEditingPassageId(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {editingPassageId ? "Edit Passage" : "Add Passage"}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="passage-name"
              label="Passage Name"
              name="name"
              value={passageData.title}
              onChange={handleInputChange}
              autoFocus
            />
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Box sx={{ maxHeight: "45vh", overflowY: "auto" }}>
              {!isLoading && (
                <QuillEditor
                  value={passageData.content}
                  onChange={(content: string) =>
                    setPassageData({ ...passageData, content })
                  }
                  key={passages.findIndex(
                    (passage) => passage.attributes.title === passageData.title,
                  )}
                />
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <List dense style={{ maxHeight: "60vh", overflowY: "auto" }}>
              {passages.map((passage) => (
                <ListItem
                  sx={{
                    py: 1,
                    transition: theme.transitions.create(
                      ["background-color", "box-shadow"],
                      {
                        duration: theme.transitions.duration.short,
                      },
                    ),
                    "&:hover": {
                      cursor: "pointer",
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                    },
                    borderRadius: 1,
                  }}
                  key={passage.id}
                  onClick={() => handleListItemClick(passage.id)}
                  secondaryAction={
                    <>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleEdit(passage.id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDelete(passage.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText primary={passage.attributes.title} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {editingPassageId && (
          <Button onClick={clearForm} color="primary">
            New Passage
          </Button>
        )}
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleFormSubmit} color="primary" variant="contained">
          {editingPassageId ? "Save Changes" : "Add"}
        </Button>
      </DialogActions>
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <CircularProgress />
        </div>
      )}
    </Dialog>
  );
};

export default AddPassageDialog;
