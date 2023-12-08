import React from "react";
import {RegisterForm} from '@components/Form/RegisterForm.tsx';
import AuthLayout from "@components/Layout/AuthLayout.tsx";

const Register: React.FC = () => {
    const handleGoogleSignIn = () => {
        console.log('Google sign in');
    };

    return (
        <AuthLayout
            title="Register"
            subTitle="To keep connected with us."
            googleSignInHandler={handleGoogleSignIn}
            formComponent={<RegisterForm />}
            linkText="Having an account"
            to="/login"
        />
    );
};
export default Register