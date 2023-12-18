import client from "@/api/axios/axiosConfig.ts";
import {
    ApiResponse,
    CreatePassageParams,
    PassageDetailPayload,
    PassagesPayload,
    PaginationParams,
    PassageAttributes
} from "@/types/apis";

const API_URL = '/passages';

const getPassages = async (data?: PaginationParams): Promise<ApiResponse<PassagesPayload>> => {
    const response = await client.get(API_URL, {params: data});
    return response.data;
}

const updatePassage = async (id: string, data: PassageAttributes) => {
    return await client.put(`${API_URL}/${id}`, data);
}

const deletePassage = async (id: string) => {
    return await client.delete(`${API_URL}/${id}`);
}

const createPassage = async (data: CreatePassageParams) => {
    return await client.post(API_URL, data);
}

const getPassageDetail = async (id: string): Promise<ApiResponse<PassageDetailPayload>> => {
    const response = await client.get(`${API_URL}/${id}`)
    return response.data;
}

const PassageService = {
    getPassages,
    createPassage,
    updatePassage,
    deletePassage,
    getPassageDetail
}

export default PassageService;
