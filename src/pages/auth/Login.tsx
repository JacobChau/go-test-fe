import React from "react";
import {LoginForm} from '@components/Form/LoginForm.tsx';
import AuthLayout from "@components/Layout/AuthLayout.tsx";

// ==============================|| LOGIN ||============================== //

const Login: React.FC = () => {
    return (
            <AuthLayout
                title="Sign in"
                subTitle="To keep connected with us."
                formComponent={<LoginForm />}
                linkText="Create new account"
                to="/register"
            />
    );
};

export default Login;
