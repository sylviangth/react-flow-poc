export function extractIdsFromText(input: string): { triggerInputIdList: string[], inputNodeIdList: string[] } {
  const triggerRegex = /@\[.*?\]\((.*?)\)/g;
  const inputRegex = /#\[(.*?)\]\((.*?)\)/g;

  const triggerInputIdList: string[] = [];
  const inputNodeIdList: string[] = [];

  let match: RegExpExecArray | null;

  // Extract triggerInputIds
  while ((match = triggerRegex.exec(input)) !== null) {
    if (match[1]) {
      triggerInputIdList.push(match[1]);
    }
  }

  // Extract inputNodeIds
  while ((match = inputRegex.exec(input)) !== null) {
    if (match[2]) {
      inputNodeIdList.push(match[2]);
    }
  }

  return { triggerInputIdList, inputNodeIdList };
}

export function updatePromptWithActualValuesOfVariables(
  prompt: string,
  triggerInputList: { workflowTriggerInputId: string, inputValue: string }[],
  inputNodeList: { inputNodeId: string, inputContent: string }[]
): string {

  let newPrompt = prompt;
  const triggerInputRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
  newPrompt = newPrompt.replace(triggerInputRegex, (_match, _display, id) => {
    const valueData = triggerInputList.find(m => m.workflowTriggerInputId === id);
    if (valueData) {
      return valueData.inputValue;
    } else {
      return 'N/A';
    }
  });
  const inputNodeRegex = /#\[([^\]]+)\]\(([^)]+)\)/g;
  newPrompt = newPrompt.replace(inputNodeRegex, (_match, _display, id) => {
    const valueData = inputNodeList.find(m => m.inputNodeId === id);
    if (valueData) {
      return valueData.inputContent;
    } else {
      return 'N/A';
    }
  });
  return newPrompt;
}

// Get Uint8Array from an image URL
export async function getImageUint8ArrayFromUrl(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  const blob = await response.blob();
  const buffer = await blob.arrayBuffer();
  return new Uint8Array(buffer);
}