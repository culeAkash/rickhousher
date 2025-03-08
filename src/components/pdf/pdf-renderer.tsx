"use client";
import React from "react";
import { Worker, Viewer, LoadError } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Loader2 } from "lucide-react";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
interface PdfRendererProps {
  fileUrl: string;
}

const renderError = (error: LoadError) => {
  let message = "";
  switch (error.name) {
    case "InvalidPDFException":
      message = "The document is invalid or corrupted";
      break;
    case "MissingPDFException":
      message = "The document is missing";
      break;
    case "UnexpectedResponseException":
      message = "Unexpected server response";
      break;
    default:
      message = "Cannot load the document";
      break;
  }

  return (
    <div className="flex justify-center my-24 h-full">
      <p className="font-medium text-2xl text-zinc-500">{message}</p>
    </div>
  );
};

const PdfRenderer = ({ fileUrl }: PdfRendererProps) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  console.log(fileUrl);

  return (
    <div className="w-full bg-gray-100 rounded-md flex flex-col items-center">
      {/* <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button aria-label="previous page" variant={"ghost"}>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div> */}
      <div className="flex-1 w-full max-h-[90vh] overflow-auto">
        <Worker
          workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js`}
        >
          <div className="h-[1000px]">
            <Viewer
              fileUrl={fileUrl}
              renderLoader={() => (
                <div className="flex justify-center">
                  <Loader2 className="my-24 animate-spin h-10 w-10" />
                </div>
              )}
              renderError={renderError}
              plugins={[defaultLayoutPluginInstance]}
            />
          </div>
        </Worker>
      </div>
    </div>
  );
};

export default PdfRenderer;
