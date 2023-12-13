import React from "react";
import {RegisterForm} from '@components/Form/RegisterForm.tsx';
import AuthLayout from "@components/Layout/AuthLayout.tsx";

const Register: React.FC = () => {

    return (
        <AuthLayout
            title="Register"
            subTitle="To keep connected with us."
            formComponent={<RegisterForm />}
            linkText="Having an account"
            to="/login"
        />
    );
};
export default Register