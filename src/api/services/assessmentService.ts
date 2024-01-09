import client from "@/api/axios/axiosConfig.ts";
import {AssessmentAttributes, AssessmentDetailPayload, CreateAssessmentParams} from "@/types/apis/assessmentTypes.ts";
import {ApiResponse, QueryParams, Resource} from "@/types/apis";

const ASSESSMENT_API_URL = '/assessments';


const getAssessments = async (data?: QueryParams): Promise<ApiResponse<Resource<AssessmentAttributes>[]>> => {
    const response = await client.get(ASSESSMENT_API_URL, {params: data});
    return response.data;
}
const deleteAssessment = async (id: string) => {
    return await client.delete(`${ASSESSMENT_API_URL}/${id}`);
}

const createAssessment = async (data: CreateAssessmentParams) => {
    return await client.post(ASSESSMENT_API_URL, data);
}

const updateAssessment = async (id: string, data: CreateAssessmentParams) => {
    return await client.put(`${ASSESSMENT_API_URL}/${id}`, data);
}

const getAssessmentById = async (id: string) : Promise<ApiResponse<Resource<AssessmentDetailPayload>>> => {
    const response = await client.get(`${ASSESSMENT_API_URL}/${id}`);
    return response.data;
}

const AssessmentService = {
    getAssessments,
    deleteAssessment,
    createAssessment,
    updateAssessment,
    getAssessmentById
}

export default AssessmentService;
