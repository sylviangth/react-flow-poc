import { Style } from "@prisma/client";

export function getChatSystemMessage({
  systemMessage, hasContext, additionalSystemMessage,
  isLaTeX,
  language, tone, style, format, styleList,
  userName,
}: {
  systemMessage: string, hasContext: boolean, additionalSystemMessage: string,
  isLaTeX?: boolean | null | undefined,
  language?: string | null | undefined, tone?: string | null | undefined, style?: string | null | undefined, format?: string | null | undefined,
  styleList: Style[],
  userName?: string,
}) {

  const RESPONSE_REQUIREMENTS = `
    ${hasContext ? `
    - Only include information found in the results or context. Don't add any additional information. Make sure the answer is correct and don't output false content. Ignore outlier search results or context which has nothing to do with the query.
    - If you use any references in your response, in-line citations with the format [citationIndex](citationUrl) between sentences. IMPORTANT!!! Use the EXACT "citationIndex" and "citationUrl" provided in the context. For example: The capital of Chile is Santiago de Chile [1](/knowledge-source/123456).
    - DON'T include reference list.
    ` : ""}
    ${language !== null ? `- Respond in ${language || "English"}.` : ""}
    ${tone || style || format ? `- Answer ${tone ? ` with a ${tone} tone` : ""}${style ? ` with a ${style} style` : ""}${format ? ` in a ${format} format` : ""}.` : ""}
    ${isLaTeX ? '- IMPORTANT!!! To display Math equations with LaTeX format, REMEMBER REMEMBER REMEMBER to add the symbol "$" before AND after each equation for them to be properly displayed.' : ''}
  `

  const STYLE_LIST = styleList.length > 0 ? `\n\n### YOUR RESPONSE MUST FOLLOW THE FOLLOWING STYLE(S)\n\n ${styleList.map(style => `<Style title={${style.title}}>\n${style.desc}\n</Style>\n`)}` : ""

  const CURRENT_DATE_AND_TIME = `\n\n### CURRENT DATE & TIME FOR YOUR INFORMATION: ${new Date().toLocaleTimeString() + new Date().toLocaleDateString()}`

  const USER_NAME = userName ? `\n\n### CURRENT USER'S NAME: ${userName}` : '';

  return systemMessage + additionalSystemMessage + `\n\n### YOUR RESPONSE NEEDS TO FOLLOW THE FOLLOWING REQUIREMENTS:\n ${RESPONSE_REQUIREMENTS}` + STYLE_LIST + CURRENT_DATE_AND_TIME + USER_NAME
}