import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
 
export const runtime = 'edge';
 
const handler = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
 
    const hasWorkflowTitle = searchParams.has('workflowTitle');
    const workflowTitle = hasWorkflowTitle
      ? searchParams.get('workflowTitle')!
      : 'An AI workflow';

    const fontBold = await fetch(
      new URL("/public/fonts/Inter-Bold.ttf", import.meta.url)
    );
    if (!fontBold.ok) {
      throw new Error("Failed to fetch the fontBold file");
    }
    const fontBoldData = await fontBold.arrayBuffer();

    const fontRegular = await fetch(
      new URL("/public/fonts/Inter-Regular.ttf", import.meta.url)
    );
    if (!fontRegular.ok) {
      throw new Error("Failed to fetch the fontRegular file");
    }
    const fontRegularData = await fontRegular.arrayBuffer();
 
    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: "#4E46DC",
            backgroundSize: '150px 150px',
            height: '100%',
            width: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            fontFamily: '"Inter"',
            padding: 40,
          }}
        >
          <h1
            style={{
              fontSize: 80,
              fontStyle: 'bold',
              letterSpacing: '-0.025em',
              color: 'white',
              marginTop: 24,
              marginBottom: 16,
              padding: '0 120px',
              lineHeight: 1,
              whiteSpace: 'pre-wrap',
              fontFamily: "InterBold",
            }}
          >
            {workflowTitle}
          </h1>
          <p
            style={{
              fontSize: 24,
              fontStyle: 'normal',
              color: 'white',
              marginTop: 0,
              fontFamily: "InterRegular",
            }}
          >
            AI workflow powered by MindPal
          </p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "InterBold",
            data: fontBoldData,
            style: "normal",
          },
          {
            name: "InterRegular",
            data: fontRegularData,
            style: "normal",
          },
        ],
      },
    );
  } catch (e: any) {
    console.log(`${(e as {message: string}).message || "Something went wrong."}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}

export { handler as GET };