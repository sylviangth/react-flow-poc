import { Image, Card } from "@nextui-org/react";
import * as fal from '@fal-ai/serverless-client';

type FalImageResult = {
  url: string;
};
type FalResult = {
  images: FalImageResult[];
};

export function FalImageResultCard({ url }: FalImageResult) {
  return (
    <Card className="p-3 w-full flex items-center justify-center bg-default-50 border border-default-300 shadow-primary/40">
      <Image src={url} className="w-full aspect-auto" />
    </Card>
  );
}

export async function generateImageWithFal(input: {
  prompt: string,
  agentBackground: string | null,
}) {
  try {
    const result: FalResult = await fal.subscribe('fal-ai/flux/schnell', {
      input: {
        prompt: input.prompt + (input.agentBackground ? `### YOUR IDENTITY\n\n ${input.agentBackground}` : ''),
        num_images: 1,
        image_size: 'square_hd',
      },
      pollInterval: 3000,
    });
    return result.images[0]!;
  } catch (error: any) {
    console.error(error);
    throw new Error("Something went wrong with Fal!")
  }
}