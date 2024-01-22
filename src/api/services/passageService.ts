import client from "@/api/axios/axiosConfig.ts";
import {
  ApiResponse,
  CreatePassageParams,
  PassageDetailPayload,
  QueryParams,
  PassageAttributes,
  Resource,
  UpdatePassageParams,
} from "@/types/apis";

const API_URL = "/passages";

const getPassages = async (
  data?: QueryParams,
): Promise<ApiResponse<Resource<PassageAttributes>[]>> => {
  const response = await client.get(API_URL, { params: data });
  return response.data;
};

const updatePassage = async (id: string, data: UpdatePassageParams) => {
  return await client.put(`${API_URL}/${id}`, data);
};

const deletePassage = async (id: string) => {
  return await client.delete(`${API_URL}/${id}`);
};

const createPassage = async (data: CreatePassageParams) => {
  return await client.post(API_URL, data);
};

const getPassageById = async (
  id: string,
): Promise<ApiResponse<Resource<PassageDetailPayload>>> => {
  const response = await client.get(`${API_URL}/${id}`);
  return response.data;
};

const PassageService = {
  getPassages,
  createPassage,
  updatePassage,
  deletePassage,
  getPassageById,
};

export default PassageService;
