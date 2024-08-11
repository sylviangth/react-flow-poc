"use client";

import { Card } from "@nextui-org/react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import LoadingScreen from "~/components/utility/LoadingScreen";

const CustomLoadingRenderer = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <LoadingScreen desc="Loading presentation..." />
    </div>
  );
};

type PPTXGenResultProps = {
  url?: string;
};
export function PPTXGenResultCard({ url }: PPTXGenResultProps) {
  const config = {
    header: {
      disableHeader: true,
      disableFileName: true,
      retainURLParams: false,
    },
    csvDelimiter: ",", // "," as default,
    pdfZoom: {
      defaultZoom: 1.1, // 1 as default,
      zoomJump: 0.2, // 0.1 as default,
    },
    pdfVerticalScrollByDefault: true, // false as default
    loadingRenderer: {
      overrideComponent: CustomLoadingRenderer,
    },
  }
  if (!url) {
    return (
      <Card className="p-3 w-full flex items-center justify-center bg-default-50 border border-default-300 shadow-primary/40">
        <p className="text-sm text-default-500">No presentation generated</p>
      </Card>
    )
  }
  return (
    <Card className="p-3 w-full aspect-video flex items-center justify-center bg-default-50 border border-default-300 shadow-primary/40">
      <DocViewer
        prefetchMethod="GET"
        documents={[{ uri: url }]}
        pluginRenderers={DocViewerRenderers}
        config={config}
        className="w-full h-full"
      />
    </Card>
  );
}