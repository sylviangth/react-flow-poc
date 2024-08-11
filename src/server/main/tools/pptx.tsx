import axios from "axios";
import { env } from "~/env.mjs";

export interface PPTXGenResponse {
  url: string[];
}

export const generatePPTX = async (input: {
  prompt: string,
  presenterName: string,
}) => {

  const apiUrl = `${env.NEXT_PUBLIC_API_ENDPOINT}/api/tool/generate-pptx`;
  const apiUrl2 = `${env.NEXT_PUBLIC_API_ENDPOINT2}/api/tool/generate-pptx`;

  const params = {
    prompt: input.prompt,
    presenter_name: input.presenterName,
  };
  const headers = {
    'accept': 'application/json',
    'Content-Type': 'multipart/form-data',
  }
  try {
    const response = await axios.post(apiUrl, null, { headers, params });
    const responseData = response.data as PPTXGenResponse;
    return ({ url: responseData.url[0] });
  } catch (error) {
    // Fallback
    try {
      const fallbackResponse = await axios.post(apiUrl2, null, { headers, params });
      const responseData = fallbackResponse.data as PPTXGenResponse;
      return ({ url: responseData.url[0] });
    } catch (error) {
      console.error(error);
      throw new Error("Something went wrong while MindPal was generating the PPTX file. Please try again.")
    }
  }

};