import client from "@/api/axios/axiosConfig.ts";
import {
  ApiResponse,
  CreateUserParams,
  QueryParams,
  Resource,
  UserAttributes,
} from "@/types/apis";

const API_URL = "/users";

const getUsers = async (
  data?: QueryParams,
): Promise<ApiResponse<Resource<UserAttributes>[]>> => {
  const response = await client.get(API_URL, { params: data });
  return response.data;
};

const updateUser = async (id: string, data: UserAttributes) => {
  return await client.put(`${API_URL}/${id}`, data);
};

const deleteUser = async (id: string) => {
  return await client.delete(`${API_URL}/${id}`);
};

const createUser = async (data: CreateUserParams) => {
  return await client.post(API_URL, data);
};

const getCurrentUser = async (): Promise<
  ApiResponse<Resource<UserAttributes>>
> => {
  const response = await client.get(`${API_URL}/me`);
  return response.data;
};

const UserService = {
  getUsers,
  updateUser,
  deleteUser,
  createUser,
  getCurrentUser,
};

export default UserService;
