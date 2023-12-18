import client from "@/api/axios/axiosConfig.ts";
import {
    ApiResponse,
    CreateQuestionParams,
    CreateCategoryParams,
    PaginationParams,
    QuestionAttributes,
    CategoryAttributes
} from "@/types/apis";

const QUESTION_API_URL = '/questions';
const CATEGORY_API_URL = '/categories';

const getQuestions = async (data: PaginationParams): Promise<ApiResponse<QuestionAttributes>> => {
    const response = await client.get(QUESTION_API_URL, {params: data});
    return response.data;
}

const updateQuestion = async (id: string, data: QuestionAttributes) => {
    return await client.put(`${QUESTION_API_URL}/${id}`, data);
}

const deleteQuestion = async (id: string) => {
    return await client.delete(`${QUESTION_API_URL}/${id}`);
}

const createQuestion = async (data: CreateQuestionParams) => {
    return await client.post(QUESTION_API_URL, data);
}

const getCategories = async (data?: PaginationParams): Promise<ApiResponse<CategoryAttributes>> => {
    const response = await client.get(CATEGORY_API_URL, {params: data});
    return response.data;
}

const updateCategory = async (id: string, data: CategoryAttributes) => {
    return await client.put(`${CATEGORY_API_URL}/${id}`, data);
}

const deleteCategory = async (id: string) => {
    return await client.delete(`${CATEGORY_API_URL}/${id}`);
}

const createCategory = async (data: CreateCategoryParams) => {
    return await client.post(CATEGORY_API_URL, data);
}

const QuestionService = {
    getQuestions,
    updateQuestion,
    deleteQuestion,
    createQuestion,
    getCategories,
    updateCategory,
    deleteCategory,
    createCategory
}

export default QuestionService;
