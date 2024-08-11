import axios, { type AxiosRequestConfig } from "axios";

export interface ApiActionKeyValueField {
  key: string;
  value: unknown | undefined;
  desc?: string | undefined;
  isExtractedFromQuery?: boolean;
}

export enum ApiActionMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

export type MockApiActionProps = {
  id: string | null;
  name: string;
  desc: string;
  url: string;
  method: ApiActionMethod;
  headers: ApiActionKeyValueField[];
  body: ApiActionKeyValueField[];
  queryParams: ApiActionKeyValueField[];
  isApprovalRequired: boolean;
}

interface CustomApiRequestProps {
  url: string;
  method: ApiActionMethod;
  parsedHeaders: ApiActionKeyValueField[];
  parsedBody: ApiActionKeyValueField[];
  parsedQueryParams: ApiActionKeyValueField[];
  payload: { [key: string]: string };
}

export default async function sendCustomApiRequest({
  url, method, parsedHeaders, parsedBody, parsedQueryParams, payload,
}: CustomApiRequestProps) {

  const inputUrl = new URL(url);
  const inputQueryParams = new URLSearchParams(inputUrl.search);

  parsedQueryParams.forEach((each) => {
    if (each.value) {
      inputQueryParams.set(each.key, each.value as unknown as string);
    } else if (payload?.[each?.key]) {
      inputQueryParams.set(each.key, `${payload?.[each?.key] || ""}`);
    }
  });

  const finalUrl = `${inputUrl.origin}${inputUrl.pathname}?${inputQueryParams.toString()}`;

  const headers: AxiosRequestConfig['headers'] = {
    ...parsedHeaders
      .filter((each) => !each.isExtractedFromQuery && each.value)
      .reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {}),
    ...parsedHeaders
      .filter((each) => each.isExtractedFromQuery)
      .reduce((acc, curr) => ({ ...acc, [curr.key]: payload[curr.key] }), {}),
  };

  const reqData: AxiosRequestConfig['data'] = {
    ...parsedBody
      .filter((each) => !each.isExtractedFromQuery)
      .reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {}),
    ...parsedBody
      .filter((each) => each.isExtractedFromQuery)
      .reduce((acc, curr) => ({ ...acc, [curr.key]: payload[curr.key] }), {}),
  };

  const reqConfig: AxiosRequestConfig = {
    method: method,
    headers: headers ? headers : undefined,
    data: reqData ? reqData as unknown : undefined,
  };

  try {
    const response = await axios(finalUrl, reqConfig);
    return response.data as unknown;
  } catch (err) {
    console.error(err);
    throw new Error("Internal Server Error");
  }

}