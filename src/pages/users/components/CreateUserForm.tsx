import React, {FC} from 'react';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    InputLabel, OutlinedInput, InputAdornment, IconButton, FormHelperText, FormControl
} from "@mui/material";
import {Formik} from "formik";
import * as Yup from 'yup';
import {CreateUserParams} from "@/types/apis";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {useTheme} from "@mui/material/styles";

interface CreateUserFormProps {
    open: boolean;
    onClose: () => void;
    onSave: (newData: CreateUserParams) => void; // Assuming NewUserData is the type you defined for new user data
}


const CreateUserFormSchema = Yup.object().shape({
    name: Yup.string().max(255).required('Username is required'),
    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
    password: Yup.string().max(255).required('Password is required'),
    role: Yup.string().oneOf(['Student', 'Teacher']).required('Role is required'),
    birthdate: Yup.date().nullable().default(null),
});

const CreateUserForm: FC<CreateUserFormProps> = ({ open, onClose, onSave }) => {
    const theme = useTheme();
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
    };


    const onSubmit = async (values: CreateUserParams) => {
        onSave(values);
        onClose();
    }

    const initialFormValues: CreateUserParams = {
        name: '',
        email: '',
        password: '',
        role: 'Student',
        birthdate: ''
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Create User</DialogTitle>
            <Formik initialValues={initialFormValues} validationSchema={CreateUserFormSchema} onSubmit={onSubmit}>
                {({ setFieldValue, values, errors, handleBlur, handleChange, handleSubmit, touched }) => (
                    <form noValidate onSubmit={handleSubmit}>
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
                                error={Boolean(touched.email && errors.email)}
                                fullWidth
                                autoComplete="off"
                                helperText={touched.email && errors.email}
                                label="Email Address"
                                margin="normal"
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="email"
                                value={values.email}
                                variant="outlined"
                            />

                            <FormControl
                                fullWidth
                                error={Boolean(touched.password && errors.password)}
                                sx={{ mt: theme.spacing(2), mb: theme.spacing(1) }}
                                variant="outlined"
                            >
                                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    autoComplete="new-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={values.password}
                                    name="password"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    label="Password"
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                size="large"
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />

                                {touched.password && errors.password && (
                                    <FormHelperText error id="standard-weight-helper-text">
                                        {' '}
                                        {errors.password}{' '}
                                    </FormHelperText>
                                )}
                            </FormControl>

                            <TextField
                                error={Boolean(touched.role && errors.role)}
                                fullWidth
                                helperText={touched.role && errors.role}
                                label="Role"
                                margin="normal"
                                name="role"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                select
                                value={values.role}
                                variant="outlined"
                            >

                                <MenuItem value="Student">Student</MenuItem>
                                <MenuItem value="Teacher">Teacher</MenuItem>
                            </TextField>

                            {/* Birthdate will be datetime picker but allow null */}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    format={'DD/MM/YYYY'}
                                    sx={{ mt: theme.spacing(2), mb: theme.spacing(1) }}
                                    label="Birthdate"
                                    value={values.birthdate || null}
                                    onChange={(value) => {
                                        value && setFieldValue('birthdate', dayjs(value).format('DD-MM-YYYY'));
                                    }}
                                />
                            </LocalizationProvider>
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

export default CreateUserForm;
