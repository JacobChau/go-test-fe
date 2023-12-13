import {AxiosError, AxiosResponse} from 'axios';
import {ApiResponse} from "@/types/apis";
import AuthService from "@/api/services/authService.ts";
import client from "@/api/axios/axiosConfig.ts";
import {getAccessToken, getRefreshToken, removeTokens} from "@/helpers";


export const errorHandler = async (error: AxiosError) => {
    if (error.config && error.response && error.response.status === 401) {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
            try {
                await AuthService.refreshToken({refreshToken});
                console.log('refresh token success');
                const accessToken = getAccessToken();

                // Retry failed request
                error.config.headers['Authorization'] = `Bearer ${accessToken}`;
                return await client.request(error.config);
            } catch (e) {
                return Promise.reject(e);
            }
        }

        // clear token and redirect to login page
        AuthService.logout();
        window.location.href = '/login';
    }

    return Promise.reject(error);
};

export const successHandler = (response: AxiosResponse): ApiResponse<any> => {
    return {
        data: response.data,
        status: response.status,
    }
};
