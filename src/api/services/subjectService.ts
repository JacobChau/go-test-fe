import client from "@/api/axios/axiosConfig.ts";
import {ApiResponse, CreateSubjectParams, PaginationParams, SubjectAttributes} from "@/types/apis";

const API_URL = '/subjects';

const getSubjects = async (data?: PaginationParams): Promise<ApiResponse<SubjectAttributes>> => {
    const response = await client.get(API_URL, {params: data});
    return response.data;
}

const updateSubject = async (id: string, data: SubjectAttributes) => {
    return await client.put(`${API_URL}/${id}`, data);
}

const deleteSubject = async (id: string) => {
    return await client.delete(`${API_URL}/${id}`);
}

const createSubject = async (data: CreateSubjectParams) => {
    return await client.post(API_URL, data);
}

const SubjectService = {
    getSubjects,
    updateSubject,
    deleteSubject,
    createSubject
}

export default SubjectService;
