import React from 'react'
import { Navigate } from 'react-router-dom'
import {isAuthenticated} from "@/helpers";

const Protected = ({ children })=> {
    const isLoggedIn = isAuthenticated();

    if (!isLoggedIn) {
        return <Navigate to="/login" />
    }

    return children;
}

const Public = ({children})=> {
    const isLoggedIn = isAuthenticated();

    if (isLoggedIn) {
        return <Navigate to="/"/>
    }

    return children;
}

export {Protected, Public};