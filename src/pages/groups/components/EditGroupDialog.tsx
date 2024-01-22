import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import React from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { GroupAttributes } from "@/types/apis/groupTypes.ts";

interface EditGroupDialogProps {
  open: boolean;
  onClose: () => void;
  groupData: GroupAttributes & { id: string };
  onUpdated: (id: string, data: any) => void;
}

const groupValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().optional(),
});

const EditGroupDialog: React.FC<EditGroupDialogProps> = ({
  open,
  onClose,
  groupData,
  onUpdated,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Group</DialogTitle>
      <Formik
        initialValues={groupData}
        validationSchema={groupValidationSchema}
        onSubmit={(values, actions) => {
          onUpdated(groupData.id, {
            name: values.name,
            description: values.description,
          });
          actions.setSubmitting(false);
        }}
      >
        {({
          values,
          errors,
          handleBlur,
          handleChange,
          touched,
          isSubmitting,
        }) => (
          <Form>
            <DialogContent>
              <TextField
                error={Boolean(touched.name && errors.name)}
                fullWidth
                autoComplete="off"
                helperText={touched.name && errors.name}
                label="Full Name"
                margin="normal"
                name="name"
                onBlur={handleBlur}
                onChange={handleChange}
                type="text"
                value={values.name}
                variant="outlined"
              />
              <TextField
                error={Boolean(touched.description && errors.description)}
                fullWidth
                autoComplete="off"
                helperText={touched.description && errors.description}
                label="Description"
                margin="normal"
                name="description"
                onBlur={handleBlur}
                onChange={handleChange}
                type="text"
                value={values.description}
                variant="outlined"
                multiline
                minRows={4}
                maxRows={6}
              />
            </DialogContent>

            <DialogActions>
              <Button type="submit" disabled={isSubmitting} variant="contained">
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default EditGroupDialog;
