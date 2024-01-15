import {FC} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from "@mui/material";
import {Formik} from "formik";
import * as Yup from 'yup';
import {CreateGroupParams} from "@/types/apis";

interface CreateGroupFormProps {
    open: boolean;
    onClose: () => void;
    onSave: (newData: CreateGroupParams) => void;
}


const CreateGroupFormSchema = Yup.object().shape({
    name: Yup.string().max(255).required('Group name is required'),
    description: Yup.string().nullable(),
});

const CreateGroupForm: FC<CreateGroupFormProps> = ({ open, onClose, onSave }) => {
    const onSubmit = async (values: CreateGroupParams) => {
        onSave(values);
        onClose();
    }

    const initialFormValues: CreateGroupParams = {
        name: '',
        description: '',
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Create Group</DialogTitle>
            <Formik initialValues={initialFormValues} validationSchema={CreateGroupFormSchema} onSubmit={onSubmit}>
                {({ values, errors, handleBlur, handleChange, handleSubmit, touched }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <DialogContent>
                            <TextField
                                error={Boolean(touched.name && errors.name)}
                                fullWidth
                                autoComplete="off"
                                helperText={touched.name && errors.name}
                                label="Group Name"
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
                            />

                        </DialogContent>
                        <DialogActions>
                            <Button type="submit" variant={'contained'} color={'primary'}>Save</Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </DialogActions>
                    </form>
                )}
            </Formik>
        </Dialog>
    );
};

export default CreateGroupForm;
