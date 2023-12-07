import {AxiosError, AxiosResponse} from 'axios';
import {ApiResponse} from "@/types/apis";
import Cookies from "js-cookie";
import AuthService from "@/api/services/authService.ts";
import client from "@/api/axios/axiosConfig.ts";
import {getAccessToken} from "@/helpers";


export const errorHandler = async (error: AxiosError) => {
    if (error.config && error.response && error.response.status === 401) {
        const refreshToken = Cookies.get('refresh_token');
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
    }

    return Promise.reject(error);
};

export const successHandler = (response: AxiosResponse): ApiResponse<any> => {
    return {
        data: response.data,
        status: response.status,
    }
};
