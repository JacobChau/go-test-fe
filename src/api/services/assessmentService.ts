import client from "@/api/axios/axiosConfig.ts";
import {
  ApiResponse,
  QueryParams,
  QuestionDetailPayload,
  Resource,
} from "@/types/apis";
import {
  AssessmentAttributes,
  AssessmentDetailPayload,
  AssessmentResultDetailPayload,
  AssessmentResultPayload,
  CreateAssessmentAttemptParams,
  CreateAssessmentAttemptPayload,
  CreateAssessmentParams,
  SubmitAssessmentAttemptParams,
  SubmitAssessmentAttemptPayload,
} from "@/types/apis/assessmentTypes.ts";

const ASSESSMENT_API_URL = "/assessments";

const getAssessments = async (
  data?: QueryParams,
): Promise<ApiResponse<Resource<AssessmentAttributes>[]>> => {
  const response = await client.get(ASSESSMENT_API_URL, { params: data });
  return response.data;
};

const createAssessment = async (data: CreateAssessmentParams) => {
  return await client.post(ASSESSMENT_API_URL, data);
};

const updateAssessment = async (id: string, data: CreateAssessmentParams) => {
  return await client.put(`${ASSESSMENT_API_URL}/${id}`, data);
};

const getAssessmentById = async (
  id: string,
  query?: QueryParams,
): Promise<ApiResponse<Resource<AssessmentDetailPayload>>> => {
  const response = await client.get(`${ASSESSMENT_API_URL}/${id}`, {
    params: query,
  });
  return response.data;
};

const getQuestionsByAssessmentId = async (
  id: number,
): Promise<ApiResponse<Resource<QuestionDetailPayload>[]>> => {
  const response = await client.get(`${ASSESSMENT_API_URL}/${id}/questions`);
  return response.data;
};

const createOrFetchAssessmentAttempt = async (
  data: CreateAssessmentAttemptParams,
): Promise<ApiResponse<CreateAssessmentAttemptPayload>> => {
  const response = await client.post(
    `${ASSESSMENT_API_URL}/${data.assessmentId}/attempt`,
    data,
  );
  return response.data;
};

const submitAssessmentAttempt = async (
  assessmentId: string,
  data: SubmitAssessmentAttemptParams,
): Promise<ApiResponse<SubmitAssessmentAttemptPayload>> => {
  const response = await client.post(
    `${ASSESSMENT_API_URL}/${assessmentId}/submit`,
    data,
  );
  return response.data;
};

const getAssessmentResult = async (
  assessmentId: string,
  attemptId: string,
): Promise<ApiResponse<AssessmentResultDetailPayload>> => {
  const response = await client.get(
    `${ASSESSMENT_API_URL}/${assessmentId}/results/${attemptId}`,
  );
  return response.data;
};

const deleteAssessment = async (id: string) => {
  return await client.delete(`${ASSESSMENT_API_URL}/${id}`);
};

const getAssessmentResults = async (
  data?: QueryParams,
): Promise<ApiResponse<Resource<AssessmentResultPayload>[]>> => {
  const response = await client.get(`${ASSESSMENT_API_URL}/results`, {
    params: data,
  });
  return response.data;
};

const getAssessmentManagement = async (
  data?: QueryParams,
): Promise<ApiResponse<Resource<AssessmentAttributes>[]>> => {
  const response = await client.get(`${ASSESSMENT_API_URL}/management`, {
    params: data,
  });
  return response.data;
};

const AssessmentService = {
  getAssessments,
  getAssessmentById,
  getQuestionsByAssessmentId,
  createOrFetchAssessmentAttempt,
  submitAssessmentAttempt,
  getAssessmentResult,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  getAssessmentResults,
  getAssessmentManagement,
};

export default AssessmentService;
