import Empty from "@/components/empty";
import Loader from "@/components/loader";
import PdfSection from "@/components/pdf/pdf-section";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import React, { Suspense } from "react";

const ErrorComponent = async () => {
  "use server";
  return <Empty label="Couldn't fetch PDF files. Please try again later." />;
};

const PdfAssistantPage = () => {
  return (
    <div>
      <div className="px-4 lg:px-8 h-fit">
        <ErrorBoundary errorComponent={ErrorComponent}>
          <Suspense
            fallback={
              <Loader label="Getting your desired result... Please wait..." />
            }
          >
            <PdfSection />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default PdfAssistantPage;
