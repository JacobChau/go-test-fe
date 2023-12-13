import client from "@/api/axios/axiosConfig.ts";
import {ApiResponse, CreateUserParams, PaginationParams, UserAttributes} from "@/types/apis";

const API_URL = '/users';

const getUsers = async (data: PaginationParams): Promise<ApiResponse<UserAttributes>> => {
    const response = await client.get(API_URL, {params: data});
    return response.data;
}

const updateUser = async (id: string, data: UserAttributes) => {
    return await client.put(`${API_URL}/${id}`, data);
}

const deleteUser = async (id: string) => {
    return await client.delete(`${API_URL}/${id}`);
}

const createUser = async (data: CreateUserParams) => {
    return await client.post(API_URL, data);
}

const UserService = {
    getUsers,
    updateUser,
    deleteUser,
    createUser
}

export default UserService;
