import { AxiosError, AxiosResponse } from "axios";
import { ApiResponse } from "@/types/apis";
import AuthService from "@/api/services/authService.ts";
import client from "@/api/axios/axiosConfig.ts";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "@/helpers";

export const errorHandler = async (error: AxiosError) => {
  if (error.config && error.response && error.response.status === 401) {
    const currentRefreshToken = getRefreshToken();
    if (currentRefreshToken) {
      try {
        const { data } = await AuthService.refreshToken({
          refreshToken: currentRefreshToken,
        });
        console.log("refresh token success");
        const { accessToken, refreshToken } = data.data;
        setAccessToken(accessToken);

        if (refreshToken) {
          setRefreshToken(refreshToken);
        }

        // Retry failed request
        error.config.headers["Authorization"] = `Bearer ${accessToken}`;

        console.log(error.config);
        return await client.request(error.config);
      } catch (e) {
        console.log("refresh token failed");

        // clear token and redirect to login page
        AuthService.logout();
        window.location.href = "/login";
        return Promise.reject(e);
      }
    }

    // clear token and redirect to login page
    AuthService.logout();
    window.location.href = "/login";
  }

  return Promise.reject(error);
};

export const successHandler = (response: AxiosResponse): ApiResponse<any> => {
  return {
    data: response.data,
    status: response.status,
  };
};
