import client from "@/api/axios/axiosConfig.ts";
import {ApiResponse, QueryParams, Resource} from "@/types/apis";
import {CreateGroupParams, GroupAttributes, UpdateGroupParams} from "@/types/apis/groupTypes.ts";

const API_URL = '/groups';

const getGroups = async (data?: QueryParams): Promise<ApiResponse<Resource<GroupAttributes>[]>> => {
    const response = await client.get(API_URL, {params: data});
    return response.data;
}

const updateGroup = async (id: string, data: UpdateGroupParams) => {
    return await client.put(`${API_URL}/${id}`, data);
}

const deleteGroup = async (id: string) => {
    return await client.delete(`${API_URL}/${id}`);
}

const createGroup = async (data: CreateGroupParams) => {
    return await client.post(API_URL, data);
}

const GroupService = {
    getGroups,
    updateGroup,
    deleteGroup,
    createGroup
}

export default GroupService;
