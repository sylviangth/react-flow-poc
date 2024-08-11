import axios from "axios";

export const exportPDF = async ({
  apiEndpoint, workflowRunId,
}: {
  apiEndpoint: string,
  workflowRunId: string,
}) => {

  const apiUrl = `${apiEndpoint}/api/document/export-pdf`;

  const headers = {
    'accept': 'application/json',
    'Content-Type': 'multipart/form-data',
  };

  const params = {
    workflow_run_id: workflowRunId,
  };

  try {
    const response = await axios.get(apiUrl, { headers, params });
    const responseData = response.data as { url: string[] };
    return responseData.url[0] as string;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while MindPal was exporting the PDF. Please try again.")
  }

};

export const exportDOCX = async ({
  apiEndpoint, workflowRunId,
}: {
  apiEndpoint: string,
  workflowRunId: string,
}) => {

  const apiUrl = `${apiEndpoint}/api/document/export-docx`;

  const headers = {
    'accept': 'application/json',
    'Content-Type': 'multipart/form-data',
  };

  const params = {
    workflow_run_id: workflowRunId,
  };

  try {
    const response = await axios.get(apiUrl, { headers, params });
    const responseData = response.data as { url: string[] };
    return responseData.url[0] as string;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong while MindPal was exporting the DOCX. Please try again.")
  }

};