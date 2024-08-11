import axios from "axios";
import { env } from "~/env.mjs";

interface DocUrlResponseProps { url: string, audio_transcript: string | null, mime_type: string | null }

export const getDocumentUrl = async (s3FilePath: string) => {
  const apiUrl = `${env.NEXT_PUBLIC_API_ENDPOINT}/api/document/get-url`;
  const apiUrl2 = `${env.NEXT_PUBLIC_API_ENDPOINT2}/api/document/get-url`;
  const params = {
    s3_file_path: s3FilePath
  }
  const headers = {
    'accept': 'application/json',
    'Content-Type': 'multipart/form-data',
  }
  try {
    const response = await axios.get(apiUrl, { headers, params });
    const responseData = response.data as DocUrlResponseProps;
    return responseData;
  } catch (e) {
    // Fallback
    try {
      const fallbackResponse = await axios.get(apiUrl2, { headers, params });
      const fallbackResponseData = fallbackResponse.data as DocUrlResponseProps;
      return fallbackResponseData;
    } catch (error) {
      console.error(error);
      throw new Error("Something went wrong while MindPal was processing the link. Please try again.")
    }
  }
};