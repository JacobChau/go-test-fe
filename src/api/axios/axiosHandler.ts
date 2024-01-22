import { AxiosError, AxiosResponse } from "axios";
import { ApiResponse } from "@/types/apis";
import AuthService from "@/api/services/authService.ts";
import client from "@/api/axios/axiosConfig.ts";
import { getRefreshToken, setAccessToken, setRefreshToken } from "@/helpers";

let isAlreadyFetchingAccessToken = false;

export const errorHandler = async (error: AxiosError) => {
  if (error.config && error.response && error.response.status === 401) {
    if (!isAlreadyFetchingAccessToken) {
      isAlreadyFetchingAccessToken = true;
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

          // Retry the failed request with the new access token
          error.config.headers["Authorization"] = `Bearer ${accessToken}`;
          isAlreadyFetchingAccessToken = false; // Reset the flag after refresh
          return client.request(error.config);
        } catch (e) {
          console.log("refresh token failed");
          isAlreadyFetchingAccessToken = false; // Reset the flag after failure
          // Clear token and redirect to login page
          AuthService.logout();
          window.location.href = "/login";
          return Promise.reject(e);
        }
      }

      if (isAlreadyFetchingAccessToken) {
        AuthService.logout();
        window.location.href = "/login";
      }
    }
  }

  return Promise.reject(error);
};

export const successHandler = (response: AxiosResponse): ApiResponse<any> => {
  return {
    data: response.data,
    status: response.status,
  };
};
