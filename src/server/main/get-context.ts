import { env } from "~/env.mjs";

interface IntSourceMetadata {
  title: string;
  document_id: string;
  chunk_id: string;
  url: string;
}
interface NoteMetadata {
  title: string;
  note_id: string;
  url: string;
}
interface ExtSourceMetadata {
  title: string;
  url: string;
}
type MetadataItem = IntSourceMetadata | NoteMetadata | ExtSourceMetadata;

export interface ContextResponse {
  context: { page_content: string, metadata: MetadataItem }[];
  metadata: MetadataItem[];
}


export const getContextWithNote = async ({
  openAiApiKey, serpApiKey,
  queryText, chunkLimit,
  docIdList, smartNoteIdList,
  google, duckduckgo, wikipedia, youtube,
  pexelsImage, pexelsVideo, arxiv, yahooFinance, semanticScholar
}: {
  openAiApiKey: string, serpApiKey: string | undefined,
  queryText: string, chunkLimit: number,
  docIdList: string[], smartNoteIdList: string[],
  google: boolean, duckduckgo: boolean, wikipedia: boolean, youtube: boolean,
  pexelsImage: boolean, pexelsVideo: boolean, arxiv: boolean, yahooFinance: boolean, semanticScholar: boolean
}): Promise<ContextResponse> => {

  const queryParams = new URLSearchParams({
    query_text: queryText,
    openai_api_key: openAiApiKey,
    chunk_limit: chunkLimit.toString(),
    google: google.toString(),
    duckduckgo: duckduckgo.toString(),
    wikipedia: wikipedia.toString(),
    youtube: youtube.toString(),
    pexel_image: pexelsImage.toString(),
    pexel_video: pexelsVideo.toString(),
    arxiv: arxiv.toString(),
    yahoo_finance: yahooFinance.toString(),
    semantic_scholar: semanticScholar.toString(),
  });

  const apiUrl = `${env.NEXT_PUBLIC_API_ENDPOINT}/api/context/get-context-with-note?${queryParams.toString()}${serpApiKey ? `&SERP_api_key=${serpApiKey}` : ""}`;
  const apiUrl2 = `${env.NEXT_PUBLIC_API_ENDPOINT2}/api/context/get-context-with-note?${queryParams.toString()}${serpApiKey ? `&SERP_api_key=${serpApiKey}` : ""}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify({
        document_ids: docIdList,
        smart_note_ids: smartNoteIdList,
      }),
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const responseData = await response.json() as ContextResponse;
    // const transformedResponseData = mergeContextResponse(responseData);
    // return transformedResponseData;
    return responseData;
  } catch (error) {
    try {
      const fallbackResponse = await fetch(apiUrl2, {
        method: 'POST',
        body: JSON.stringify({
          document_ids: docIdList,
          smart_note_ids: smartNoteIdList,
        }),
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (!fallbackResponse.ok) {
        // Both API requests failed, log and throw an error
        console.log(fallbackResponse.body);
        throw new Error('Failed to fetch data from both APIs.');
      }
      // Fallback request succeeded, process the response
      const responseData = await fallbackResponse.json() as ContextResponse;
      // const transformedResponseData = mergeContextResponse(responseData);
      // return transformedResponseData;
      return responseData;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to fetch context');
    }
  }
};
