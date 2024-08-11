import axios from "axios";
import { env } from "~/env.mjs";

export const sendEmail = async (input: {
  recipientEmail: string,
  subject: string,
  htmlBody: string,
}) => {
  const apiUrl = `${env.NEXT_PUBLIC_API_ENDPOINT}/api/email/send-email`;
  const apiUrl2 = `${env.NEXT_PUBLIC_API_ENDPOINT2}/api/email/send-email`;
  const params = {
    recipient_email: input.recipientEmail,
    subject: input.subject,
    html_body: input.htmlBody,
    sender_email: "tuan.mq@mindpal.io",
    sender_name: "Tuan from MindPal",
  }
  const headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
  }
  try {
    await axios.post(apiUrl, null, { headers, params });
    return "Success!";
  } catch (error) {
    console.error(error);
    try {
      await axios.post(apiUrl2, null, { headers, params });
      return "Success!";
    } catch (error2) {
      console.error(error2);
      return "Failed!";
    }
  }
};