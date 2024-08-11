import { Input } from "@nextui-org/react";
import { CredentialType } from "@prisma/client";

export interface CredentialInput {
  type: CredentialType,
  value: string,
}

interface CredentialInputListProps {
  credentialList: CredentialInput[];
  setCredentialList: React.Dispatch<React.SetStateAction<CredentialInput[]>>;
}

export default function CredentialInputList({ credentialList, setCredentialList }: CredentialInputListProps) {

  const labelLookup: { [key: string]: string } = {
    [CredentialType.OPENAI_API_KEY]: "OpenAI API Key",
    [CredentialType.ANTHROPIC_API_KEY]: "Anthropic API Key",
    [CredentialType.GOOGLE_GENAI_API_KEY]: "Google Generative AI API Key",
    [CredentialType.GROQ_API_KEY]: "Groq API Key",
    [CredentialType.AWS_ACCESS_KEY_ID]: "AWS Access Key ID",
    [CredentialType.AWS_SECRET_ACCESS_KEY]: "AWS Secret Access Key",
  }

  return (
    <ul className="w-full flex flex-col gap-2">
      <li>
        <p className="text-sm text-default-700">Provide your own LLM API keys  to run this workflow</p>
      </li>
      {credentialList.map((item, index) => (
        <li key={index}>
          <Input
            value={item.value}
            onValueChange={(value) => setCredentialList(credentialList.map((i) => i.type === item.type ? { ...i, value } : i))}
            label={labelLookup[item.type]} placeholder="Enter here..." isRequired
            fullWidth
          />
        </li>
      ))}
    </ul>
  )
}