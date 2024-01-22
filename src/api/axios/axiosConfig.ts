import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { errorHandler, successHandler } from "./axiosHandler.ts";
import { getAccessToken } from "@/helpers";

const config: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    "content-type": "application/json",
    withCredentials: "true",
  },
};

const client: AxiosInstance = axios.create(config);

client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

client.interceptors.response.use(
  // @ts-ignore
  (response) => {
    return successHandler(response);
  },
  (error) => {
    return errorHandler(error);
  },
);

export default client;
