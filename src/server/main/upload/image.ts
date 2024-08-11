import axios from "axios";
import { env } from "~/env.mjs";

export interface ImageUploadProps {
  s3_file_path: string | null;
  url: string;
}

export const uploadMultipleImages = async (fileList: File[]) => {

  const apiUrl = `${env.NEXT_PUBLIC_API_ENDPOINT}/api/document/upload-image`;
  const apiUrl2 = `${env.NEXT_PUBLIC_API_ENDPOINT2}/api/document/upload-image`;

  const formData = new FormData();
  fileList.forEach((file) => {
    formData.append(`document_files`, file);
  });
  const headers = {
    'accept': 'application/json',
    'Content-Type': 'multipart/form-data',
  }
  try {
    const response = await axios.post(apiUrl, formData, { headers });
    const responseData = response.data as { images: ImageUploadProps[] };
    return responseData.images;
  } catch (error) {
    // Fallback
    try {
      const fallbackResponse = await axios.post(apiUrl2, formData, { headers });
      const responseData = fallbackResponse.data as { images: ImageUploadProps[] };
      return responseData.images;
    } catch (error) {
      console.error(error);
      throw new Error("Something went wrong while MindPal was processing the file(s). Please try again.")
    }
  }

};