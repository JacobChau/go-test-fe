import client from "@/api/axios/axiosConfig.ts";
import {
    AccessTokenPayload,
    AuthResponse,
    CredentialsParams,
    CredentialsPayload, ForgotPasswordParams, GoogleLoginParams, RefreshTokenParams,
} from "@/types/apis";
import {removeTokens, setAccessToken, setRefreshToken} from "@/helpers";

const API_URL = '/auth';

const login = async (data: CredentialsParams)  => {
   return client.post<AuthResponse<CredentialsPayload>>(`${API_URL}/login`, data).then((response) => {
       if (response.data) {
           const {accessToken, refreshToken} = response.data.data;
           setAccessToken(accessToken);

           if (refreshToken) {
               setRefreshToken(refreshToken);
           }
       }

       return response;
   });
}

const register = async (data: CredentialsParams) => {
    return client.post<AuthResponse<CredentialsPayload>>(`${API_URL}/register`, data);
}

const logout = () => {
    removeTokens();
}

const loginWithGoogle = async (data: GoogleLoginParams) => {
    return client.post<AuthResponse<AccessTokenPayload>>(`${API_URL}/google`, data).then((response) => {
        if (response.data) {
            const {accessToken} = response.data.data;
            setAccessToken(accessToken);
        }

        return response;
    });
}

const refreshToken = async (data: RefreshTokenParams) => {
    return client.post<AuthResponse<AccessTokenPayload>>(`${API_URL}/refresh`, data).then((response) => {
        if (response.data) {
            const {accessToken} = response.data.data;
            setAccessToken(accessToken)
        }

        return response;
    });
}

const forgotPassword = (data: ForgotPasswordParams) => {
    return client.post(`${API_URL}/forgot-password`, data);
}

const AuthService = {
    login,
    register,
    logout,
    refreshToken,
    forgotPassword,
    loginWithGoogle
}

export default AuthService;