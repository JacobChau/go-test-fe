import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AuthService from "@/api/services/authService.ts";
import { Button, TextField, CircularProgress } from "@mui/material";

export const ForgotPasswordForm: React.FC = () => {
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.auth);

    return (
        <Formik
            initialValues={{ email: '' }}
            validationSchema={Yup.object({
                email: Yup.string()
                    .email('Invalid email address')
                    .required('Required'),
            })}
            onSubmit={async (values, { setSubmitting }) => {
                try {
                    setSubmitting(true);
                    await dispatch(AuthService.forgotPassword({ email: values.email }));
                } catch (error) {
                    console.error(error);
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
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

                    <Button
                        color="primary"
                        disabled={isSubmitting}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3 }}
                        startIcon={isLoading ? <CircularProgress size={24} /> : null}
                    >
                        Send password reset email
                    </Button>
                </form>
            )}
        </Formik>
    );
};
