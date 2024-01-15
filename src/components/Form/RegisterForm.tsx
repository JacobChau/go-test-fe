import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";


// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    FormHelperText,
    TextField,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    FormControlLabel,
    Checkbox, CircularProgress
} from '@mui/material';

// third party
import * as Yup from 'yup';
import {Formik, FormikHelpers} from 'formik';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {register} from "@/stores/authSlice.ts";
import {RootState} from "@/stores/store.ts";
import {RegisterParams} from "@/types/apis";


export const RegisterForm = ({ ...rest }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading } = useSelector((state: RootState) => state.auth);

    const [showPassword, setShowPassword] = React.useState(false);
    const [checked, setChecked] = React.useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
    };


    const onSubmit = async (
        values: RegisterParams & { submit: null },
        { setSubmitting }: FormikHelpers<RegisterParams & { submit: null }>
    ) => {
        setSubmitting(true);

        dispatch<any>(register({ name: values.name, email: values.email, password: values.password }))
            .then(()=> {
                navigate('/login', { replace: true });
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    return (
        <Formik
            initialValues={{
                name: '',
                email: '',
                password: '',
                submit: null
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                name: Yup.string().max(255).required('Username is required'),
                password: Yup.string().max(255).required('Password is required')
            })}
             onSubmit={onSubmit}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
                <form noValidate onSubmit={handleSubmit} {...rest}>
                    <TextField
                        error={Boolean(touched.name && errors.name)}
                        fullWidth
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

                    {errors.submit && (
                        <Box mt={3}>
                            <FormHelperText error>{errors.submit}</FormHelperText>
                        </Box>
                    )}
                    <Box my={0}>
                        <FormControlLabel
                            control={
                                <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
                            }
                            label={
                                <>
                                    I have read the &nbsp;
                                    <Link to="#">Terms and Conditions </Link>
                                </>
                            }
                        />
                    </Box>

                    <Button
                        color="primary"
                        disabled={isLoading}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3 }}
                        startIcon={isLoading ? <CircularProgress size={24} /> : null}
                    >
                        Register
                    </Button>
                </form>
            )}
        </Formik>
    );
};