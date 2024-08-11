import axios from "axios";
import { env } from "~/env.mjs";

interface TriggerInputContextItemMetadataProps {
  document_title: string;
  url?: string;
}

export interface TriggerInputContextResponse {
  context: { page_content: string, metadata: TriggerInputContextItemMetadataProps }[];
  metadata: TriggerInputContextItemMetadataProps[];
}

export const getTriggerInputContext = async ({
  fileList, urlList,
  queryText, openAiApiKey, chunkLimit,
} : { 
  fileList: File[],
  urlList: string[],
  queryText: string,
  openAiApiKey: string,
  chunkLimit: number,
}) => {

  const apiUrl = `${env.NEXT_PUBLIC_API_ENDPOINT}/api/context/get-context-from-file`;
  const apiUrl2 = `${env.NEXT_PUBLIC_API_ENDPOINT2}/api/context/get-context-from-file`;

  const formData = new FormData();
  fileList.forEach((file) => {
    formData.append(`document_files`, file);
  });
  urlList.forEach((url) => {
    formData.append(`urls`, url);
  });

  const params = {
    query_text: queryText,
    openai_api_key: openAiApiKey,
    chunk_limit: chunkLimit,
  };
  const headers = {
    'accept': 'application/json',
    'Content-Type': 'multipart/form-data',
  }
  try {
    const response = await axios.post(apiUrl, formData, { headers, params });
    const responseData = response.data as TriggerInputContextResponse;
    return responseData;
  } catch (error) {
    // Fallback
    try {
      const fallbackResponse = await axios.post(apiUrl2, formData, { headers, params });
      const responseData = fallbackResponse.data as TriggerInputContextResponse;
      return responseData;
    } catch (error) {
      console.error(error);
      throw new Error ("Something went wrong while MindPal was processing the trigger input. Please try again.")
    }
  }

};