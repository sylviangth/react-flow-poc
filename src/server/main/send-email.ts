import axios from "axios";

export const sendPostRunEmailForAgentCrew = async ({
  recipientEmail,
  workflowTitle, workflowInput, workflowResult,
} : {
  recipientEmail: string,
  workflowTitle: string,
  workflowInput: string,
  workflowResult: string,
}) => {

  const apiUrl = `https://mindpal-crm-backend-production.up.railway.app/api/notification/send-email-post-run-for-agentcrew`;

  const headers = {
    'accept': 'application/json',
    'Content-Type': 'multipart/form-data',
  };

  const params = {
    recipient_email: recipientEmail,
    workflow_title: workflowTitle,
    workflow_input: workflowInput,
    workflow_result: workflowResult,
  };

  try {
    const response = await axios.post(apiUrl, null, { headers, params });
    const responseData = response.data as { status: boolean };
    return responseData.status;
  } catch (error) {
    console.error(error);
    throw new Error;
  }
  
};