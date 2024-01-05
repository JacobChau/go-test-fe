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
  CreateAssessmentAttemptParams,
  CreateAssessmentAttemptPayload,
  SubmitAssessmentAttemptParams,
} from "@/types/apis/assessmentTypes.ts";

const ASSESSMENT_API_URL = "/assessments";

const getAssessments = async (
  data?: QueryParams,
): Promise<ApiResponse<Resource<AssessmentAttributes>[]>> => {
  const response = await client.get(ASSESSMENT_API_URL, { params: data });
  return response.data;
};

const getAssessmentById = async (
  id: number,
): Promise<ApiResponse<Resource<AssessmentDetailPayload>>> => {
  const response = await client.get(`${ASSESSMENT_API_URL}/${id}`);
  return response.data;
};

const getQuestionsByAssessmentId = async (
  id: number,
): Promise<ApiResponse<Resource<QuestionDetailPayload>[]>> => {
  const response = await client.get(`${ASSESSMENT_API_URL}/${id}/questions`);
  return response.data;
};

const createAssessmentAttempt = async (
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
): Promise<ApiResponse<CreateAssessmentAttemptPayload>> => {
  const response = await client.post(
    `${ASSESSMENT_API_URL}/${assessmentId}/submit`,
    data,
  );
  return response.data;
};

const AssessmentService = {
  getAssessments,
  getAssessmentById,
  getQuestionsByAssessmentId,
  createAssessmentAttempt,
  submitAssessmentAttempt,
};

export default AssessmentService;
