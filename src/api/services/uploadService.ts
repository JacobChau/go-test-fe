import client from "@/api/axios/axiosConfig.ts";

const API_URL = '/upload';

const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append("image", image);
    const response = await client.post(API_URL, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

const UploadService = {
    uploadImage
}

export default UploadService;