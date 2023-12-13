import React from 'react';
import {useDispatch, useSelector} from "react-redux";

// material-ui
import {
    Box,
    Button,
    FormHelperText,
    Grid,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton, CircularProgress, FormControlLabel, Checkbox
} from '@mui/material';

//  third party
import * as Yup from 'yup';
import {Formik, FormikHelpers } from 'formik';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {useTheme} from "@mui/material/styles";
import {login} from "@/stores/authSlice.ts";
import {RootState} from "@/stores/store.ts";

export const LoginForm: React.FC = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state: RootState) => state.auth);
    const [showPassword, setShowPassword] = React.useState(false);
    const [rememberMe, setRememberMe] = React.useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
    };

    const handleRememberMe = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRememberMe(event.target.checked);
    }

    const onSubmit = async (
        values: { email: string; password: string; submit: null },
        { setSubmitting }: FormikHelpers<{ email: string; password: string; submit: null }>
    ) => {
        setSubmitting(true);

        dispatch<any>(login({email: values.email, password: values.password}))
            .unwrap()
            .catch((error: any) => {
                console.log(error);
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    return (
        <Formik
            initialValues={{
                email: '',
                password: '',
                submit: null,
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                password: Yup.string().max(255).required('Password is required'),
            })}
            onSubmit={onSubmit}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <TextField
                        autoComplete='off'
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

                    <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ mt: theme.spacing(3), mb: theme.spacing(1) }}>
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            autoComplete="new-password"
                            id="outlined-adornment-password"
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

                    <Grid container justifyContent="space-between" alignItems="center">
                        <FormControlLabel control={<Checkbox value="remember" color="primary" checked={rememberMe} onChange={handleRememberMe} />} label="Remember me" />

                        <Typography variant="subtitle2" color="primary" sx={{ textDecoration: 'none' }}>
                            <Box
                                component="a"
                                href="/forgot-password"
                                sx={{
                                    textDecoration: 'none',
                                    color: 'primary.light',
                                    '&:hover': {
                                        color: 'primary.dark',
                                    }
                                }}
                            >
                                Forgot Password?
                            </Box>
                        </Typography>
                    </Grid>

                    {errors.submit && (
                        <Box mt={3}>
                            <FormHelperText error>{errors.submit}</FormHelperText>
                        </Box>
                    )}

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
                        Login
                    </Button>
                </form>
            )}
        </Formik>
    );
};